# On device AI for Robotics — Unit 2: Foundations and Deployment

This unit takes you through a full, minimal Edge AI pipeline end to end: train a classifier, feel the pain of relying on the cloud for inference, convert the model with TensorFlow Lite, and get it running on real Raspberry Pi hardware. It's the "hello world" of this course — small enough to complete in one sitting, but it exercises every stage you'll revisit in more depth later.

## Edge AI for embedded systems
Embedded devices differ from your development workstation in three ways that dictate everything downstream: limited RAM (hundreds of MB to a few GB, not tens of GB), no or minimal GPU (inference must be efficient on CPU or a small accelerator), and a power budget (often battery-powered, so every watt of sustained draw matters). A model trained without these constraints in mind — a full-precision ResNet-50, say — will typically not even load on a Raspberry Pi 4, let alone run in real time.

The working example for this unit is a flower classifier: a small CNN that takes a camera image and predicts a species from a handful of classes. It's a deliberately modest task — the point is the deployment pipeline, not the model's sophistication.

## Training the flower classifier and hitting cloud limitations
Start with an ordinary training loop on your workstation, using whatever framework you're comfortable with (the course uses TensorFlow/Keras since the deployment target is TensorFlow Lite):

```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Rescaling(1./255, input_shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(16, 3, activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(32, 3, activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64, 3, activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.Dense(num_classes),
])
model.compile(optimizer="adam",
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=["accuracy"])
model.fit(train_ds, validation_data=val_ds, epochs=15)
```

Before converting anything, deliberately wire up a *cloud* inference path: save the model behind a small Flask/FastAPI endpoint, have the rover capture a frame, upload it, wait for a JSON response, then act. Time the whole loop. On a home network you'll typically see 200-800ms per classification once you account for image encoding, upload, server-side load, and the return trip — and on a flaky or absent connection, the robot simply stalls. This exercise is meant to be felt, not just read about: it's the concrete motivation for everything that follows.

## Understanding Edge AI architecture and challenges
On-device inference removes the network hop entirely, but it reintroduces constraints the cloud path let you ignore:
- **Memory footprint** — the full Keras model (weights in FP32, plus the framework runtime) may not fit in available RAM alongside your OS and camera pipeline.
- **Operator support** — not every TensorFlow op has an efficient (or any) implementation on a given accelerator; you're constrained to a supported subset.
- **Numerical precision** — accelerators like the Coral Edge TPU only execute INT8 operations, so the model must be converted and quantized, not just copied over.

This is the architectural shift: cloud AI optimizes for accuracy at near-unlimited compute; edge AI optimizes for the best accuracy achievable *inside* a hard resource ceiling.

## Deploying with TensorFlow Lite and quantization
Convert the trained Keras model to TensorFlow Lite (LiteRT), the runtime format designed for constrained devices:

```python
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # enables post-training quantization
tflite_model = converter.convert()

with open("flower_classifier.tflite", "wb") as f:
    f.write(tflite_model)
```

On the Pi, run inference with the lightweight `tflite-runtime` interpreter rather than pulling in the full TensorFlow package:

```python
from tflite_runtime.interpreter import Interpreter
import numpy as np

interpreter = Interpreter(model_path="flower_classifier.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

interpreter.set_tensor(input_details[0]["index"], input_image)
interpreter.invoke()
prediction = interpreter.get_tensor(output_details[0]["index"])
```

You'll cover the *why* of quantization in depth in Unit 3 — for now, treat `Optimize.DEFAULT` as "shrink the model and speed it up automatically, with a small, usually acceptable accuracy cost."

## Setting up the Raspberry Pi edge system
A minimal, repeatable setup sequence:

```bash
# 1. Flash Raspberry Pi OS (64-bit, Lite or Desktop) with rpi-imager, enable SSH + camera in the imager settings

# 2. On the Pi, install the runtime dependencies
sudo apt update && sudo apt install -y python3-pip libatlas-base-dev
pip3 install tflite-runtime pillow numpy

# 3. Install the Coral Edge TPU runtime (from Coral's apt repo, per coral.ai/software)
sudo apt install libedgetpu1-std

# 4. Verify the camera and run a first inference
libcamera-hello -t 2000
python3 classify_flower.py --model flower_classifier.tflite --image test.jpg
```

Once this loop works — capture, classify, print a label — you have a complete, if unoptimized, Edge AI pipeline.

## Try it yourself
Take any small image classifier you've trained before (or the flower classifier above), convert it to `.tflite` with default optimizations, and measure three numbers on whatever machine you're using as a stand-in for the Pi: model file size before/after conversion, and average inference latency over 20 runs. You'll use these same three numbers as your baseline in Unit 3 when you start applying quantization, pruning, and distillation on top.
