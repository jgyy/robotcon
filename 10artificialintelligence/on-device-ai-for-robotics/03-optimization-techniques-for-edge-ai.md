# On device AI for Robotics — Unit 3: Optimization Techniques for Edge AI

Unit 2 got a model running on the Pi; this unit is about making it *good* on the Pi — small, fast, and power-efficient without giving up more accuracy than you have to. You'll work through the four standard compression techniques (quantization, pruning, clustering, distillation) on the same flower classifier so you can compare them apples-to-apples.

## Overview of edge model optimization techniques
All four techniques attack the same underlying problem — a trained FP32 model is bigger and slower than it needs to be — from different angles:

| Technique | What it changes | Typical win |
|---|---|---|
| Post-training quantization | Numeric precision of weights/activations (FP32 → INT8) | ~4x smaller, 2-3x faster |
| Quantization-aware training | Same as above, but simulated during training | Recovers most accuracy lost to PTQ |
| Pruning | Removes near-zero-importance weights/connections | Higher compression at similar accuracy |
| Clustering | Groups weights into a small set of shared centroids | Better compression when combined with quantization |
| Knowledge distillation | Trains a small "student" to mimic a large "teacher" | Largest size reduction, needs retraining |

They are not mutually exclusive — production edge models frequently stack pruning + clustering + quantization, or use distillation to get a small architecture and then quantize it.

## Post-training quantization (FP32 to INT8)
The idea: map the continuous range of FP32 weight/activation values onto 256 discrete INT8 levels, using a scale and zero-point per tensor (or per channel):

```
real_value ≈ scale * (int8_value - zero_point)
```

Because INT8 arithmetic is what the Coral Edge TPU (and most CPU SIMD paths) actually execute natively, this conversion is what unlocks the accelerator, not just a storage optimization. Full integer quantization needs a representative dataset so the converter can calibrate activation ranges:

```python
def representative_dataset():
    for image_batch, _ in val_ds.take(100):
        yield [image_batch]

converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8
tflite_quant_model = converter.convert()
```

On the flower classifier this typically yields roughly a 4x size reduction and 2x faster inference on CPU, with the Edge TPU delivering a further large speedup because it can *only* run this INT8 graph (it can't run the original FP32 one at all). Benchmark CPU vs TPU explicitly:

```bash
python3 benchmark.py --model model_int8.tflite --device cpu
python3 benchmark.py --model model_int8_edgetpu.tflite --device tpu
```

## Quantization-aware training (QAT)
PTQ sometimes costs too much accuracy, especially on models with wide activation ranges. QAT fixes this by simulating quantization *during* training, inserting fake-quant nodes that round-trip through INT8 precision on the forward pass while gradients still flow in FP32:

```python
import tensorflow_model_optimization as tfmot

quantize_model = tfmot.quantization.keras.quantize_model
q_aware_model = quantize_model(model)
q_aware_model.compile(optimizer="adam",
                       loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                       metrics=["accuracy"])
q_aware_model.fit(train_ds, validation_data=val_ds, epochs=5)
```

The model "sees" quantization noise while it's still learning, so it converges to weights that are robust to being rounded later. Expect QAT to close most of the accuracy gap PTQ left behind, at the cost of extra training time.

## Weight pruning for efficient models
Pruning zeroes out the least-important weights (typically by magnitude) and, ideally, does so following a structure the compiler/hardware can exploit for a real speedup rather than just a smaller file:

```python
import tensorflow_model_optimization as tfmot

pruning_params = {
    "pruning_schedule": tfmot.sparsity.keras.PolynomialDecay(
        initial_sparsity=0.0, final_sparsity=0.5,
        begin_step=0, end_step=end_step)
}
model_for_pruning = tfmot.sparsity.keras.prune_low_magnitude(model, **pruning_params)
model_for_pruning.fit(train_ds, epochs=10, callbacks=[tfmot.sparsity.keras.UpdatePruningStep()])
pruned_model = tfmot.sparsity.keras.strip_pruning(model_for_pruning)
```

`final_sparsity=0.5` means half the prunable weights end up at exactly zero. Gradual pruning (ramping sparsity up over training rather than pruning all at once) preserves accuracy far better than a single hard cutoff. On the Pi, verify the compressed model actually runs faster, not just smaller on disk — sparsity only pays off if the runtime/hardware can skip the zeroed computation.

## Weight clustering with K-means
Clustering replaces each weight with the nearest of a small number of shared centroid values, found via K-means over the weight distribution — e.g. reducing millions of unique FP32 values down to 16 or 32 centroids per layer:

```python
import tensorflow_model_optimization as tfmot

clustering_params = {
    "number_of_clusters": 16,
    "cluster_centroids_init": tfmot.clustering.keras.CentroidInitialization.KMEANS_PLUS_PLUS,
}
clustered_model = tfmot.clustering.keras.cluster_weights(model, **clustering_params)
clustered_model.fit(train_ds, epochs=3)
final_model = tfmot.clustering.keras.strip_clustering(clustered_model)
```

The win here is mostly about compressibility: a weight tensor with only 16 distinct values compresses far better with standard file compression (and, combined with quantization, indexes into a tiny lookup table) than one with millions of unique FP32 values. Clustering alone doesn't necessarily speed up inference — it shines when paired with quantization afterward.

## Knowledge distillation: teacher-student learning
Distillation trains a small "student" network to match the output distribution of a larger, already-accurate "teacher," rather than training the student from raw labels alone. The student learns from the teacher's soft probabilities (which encode "how confident, and confused with what"), not just the hard label:

```python
def distillation_loss(y_true, teacher_probs, student_logits, temperature=3.0, alpha=0.1):
    student_soft = tf.nn.softmax(student_logits / temperature)
    teacher_soft = tf.nn.softmax(teacher_probs / temperature)
    soft_loss = tf.keras.losses.categorical_crossentropy(teacher_soft, student_soft)
    hard_loss = tf.keras.losses.sparse_categorical_crossentropy(y_true, student_logits, from_logits=True)
    return alpha * hard_loss + (1 - alpha) * soft_loss * (temperature ** 2)
```

On the flower classifier, a well-distilled student can land around 15x smaller and 7x faster than the teacher while retaining most of its accuracy — by far the largest compression ratio of the four techniques, because you're changing the architecture itself, not just the representation of an existing one. The cost is that it requires a full retraining run and a working teacher model, unlike PTQ or pruning which can be applied post hoc.

## Try it yourself
Take the flower classifier (or any small CNN you have) and produce three variants: PTQ INT8, 50% magnitude-pruned, and 16-cluster weight-clustered. Tabulate file size, top-1 accuracy, and inference latency for all three plus the original FP32 baseline. Which technique gives the best accuracy-per-KB tradeoff for this model, and does that match what the theory above predicted?
