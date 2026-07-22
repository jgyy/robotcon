# Deep Learning with Domain Randomization — Unit 3: Exercises For XY motion Spam

Unit 2 gave you a model trained on a static, grid-sampled dataset. Here you push it further: the target now moves continuously in the XY plane while you collect data, and instead of training from scratch you retrain — fine-tune — the model you already have.

## Why retrain rather than train from scratch
Throwing away a working model every time you get new data is wasteful and, worse, throws away everything the network already learned about what the object looks like. Fine-tuning starts from your saved weights and adjusts them with new data, which is both faster to converge and more data-efficient — exactly the property you want as your dataset grows incrementally across this course's units. The tradeoff to manage is catastrophic forgetting: train too aggressively on the new data alone and the model can regress on cases it used to handle well, so new data should usually be mixed with a sample of the old.

## Freezing vs. fine-tuning layers
In Unit 2 the entire MobileNetV2 backbone was frozen. Now that you have more data, unfreezing the top few blocks lets the backbone adapt its highest-level features (which encode fairly abstract, task-specific shape information) to your specific object and scene, while the lower blocks — which encode generic edges and textures — stay frozen because that knowledge transfers regardless of task:

```python
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam

model = load_model('models/spam_locator_v1.h5')
base = model.layers[1]  # the MobileNetV2 sub-model
base.trainable = True
for layer in base.layers[:-30]:  # keep everything except the last 30 layers frozen
    layer.trainable = False

model.compile(optimizer=Adam(learning_rate=1e-5), loss='mse', metrics=['mae'])
```

The learning rate drops by roughly two orders of magnitude versus initial training (1e-5 vs. the Adam default of 1e-3). Fine-tuning pretrained weights with a large learning rate destroys them almost immediately — this is the single most common mistake in transfer learning.

## Continuous data collection while the target moves
Reuse the `DatasetCollector` node from Unit 2 unchanged — it already pairs each frame with the object's live pose, so a continuously moving object is just a denser, more varied version of the same data. Drive the motion with a small script that publishes velocity commands or repeatedly calls a "set model pose" service in a sweeping XY pattern (e.g. a Lissajous curve) so the dataset covers the plane more evenly than a person nudging it by hand would:

```python
import math

for t in range(0, 2000):
    x = 0.3 * math.sin(0.05 * t)
    y = 0.3 * math.sin(0.03 * t + 1.0)
    set_model_pose('spam_can', x, y, z=0.1)
    time.sleep(0.05)
```

## Fine-tuning code
```python
new_train_ds, new_val_ds = load_dataset('dataset/xy_motion/')  # same loader from Unit 2

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint('models/spam_locator_v2.h5', save_best_only=True),
]
model.fit(new_train_ds, validation_data=new_val_ds, epochs=20, callbacks=callbacks)
```
`EarlyStopping` protects you from the forgetting problem described above by halting as soon as validation performance stops improving, and `restore_best_weights` guarantees you keep the checkpoint that generalized best rather than whatever the last epoch happened to produce.

## Try it yourself
Fine-tune `spam_locator_v1.h5` on a freshly collected moving-target dataset, and compare validation MAE against the frozen-backbone baseline from Unit 2 on the *same* held-out validation set (not the new one) — a model that improved on moving-target data but got worse on the old static-object set is showing you catastrophic forgetting firsthand.
