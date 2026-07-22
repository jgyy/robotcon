# Mastering Deep Learning with LIMO-Robot — Unit 7: Obstacle Avoidance Deep Learning Training

This closing unit brings everything together into one end-to-end pipeline: collect real driving data from LIMO, turn it into a labeled training set, train an AlexNet-style CNN to predict a safe driving action from a camera image, and deploy the trained model back onto the robot as a controller.

## The task: learned obstacle avoidance

Instead of hand-tuning a reactive obstacle-avoidance controller from LiDAR ranges, this approach learns a mapping directly from **camera image → driving action** (e.g. turn left, go straight, turn right, or a continuous steering value), trained on examples of a human (or a scripted safe policy) driving the robot around obstacles. This is a classic instance of **behavior cloning** — the model is only ever as good as the driving behavior it was trained to imitate, so the quality and diversity of your collected data matters more than almost any architectural choice.

## Collecting training data

While driving LIMO (via teleop or an existing safe controller), record synchronized pairs of camera frames and the command that was issued at that moment. In ROS terms, subscribe to the camera topic and the velocity command topic, and on each image, save the frame to disk labeled with the most recent commanded action:

```python
import cv2

def image_callback(self, img_msg):
    frame = self.bridge.imgmsg_to_cv2(img_msg, desired_encoding="bgr8")
    label = self.action_from_twist(self.last_cmd_vel)  # e.g. "left"/"straight"/"right"
    filename = f"data/train/{label}/{self.frame_count:06d}.jpg"
    cv2.imwrite(filename, frame)
    self.frame_count += 1

def action_from_twist(self, twist):
    if twist.angular.z > 0.1:
        return "left"
    if twist.angular.z < -0.1:
        return "right"
    return "straight"
```

Drive deliberately varied routes — near walls, around corners, past obstacles at different distances and angles — a model trained only on wide-open straight corridors will fail the first time it sees something it hasn't encountered. Aim for a reasonably balanced number of examples per class; a dataset that's 90% "straight" will train a model that learns to mostly predict "straight" regardless of input, since that alone minimizes training loss.

## An AlexNet-based architecture

AlexNet was one of the architectures that established the now-standard CNN pattern — stacked convolution+pooling blocks followed by dense layers — at a larger scale than earlier networks. A simplified, LIMO-appropriately-sized version:

```python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Input(shape=(128, 128, 3)),
    keras.layers.Rescaling(1.0 / 255),

    keras.layers.Conv2D(32, 11, strides=4, activation="relu", padding="same"),
    keras.layers.MaxPooling2D(3, strides=2),

    keras.layers.Conv2D(64, 5, activation="relu", padding="same"),
    keras.layers.MaxPooling2D(3, strides=2),

    keras.layers.Conv2D(96, 3, activation="relu", padding="same"),
    keras.layers.Conv2D(96, 3, activation="relu", padding="same"),
    keras.layers.Conv2D(64, 3, activation="relu", padding="same"),
    keras.layers.MaxPooling2D(3, strides=2),

    keras.layers.Flatten(),
    keras.layers.Dense(256, activation="relu"),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(3, activation="softmax"),  # left / straight / right
])
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
```

The large early kernel (11x11, stride 4) and progressively smaller ones is AlexNet's signature — it aggressively downsamples first, trading fine spatial detail for the ability to process bigger images without an explosion in early-layer computation. For a small robot camera feed, you can shrink the kernels and strides further if 128x128 input already loses too much detail for your obstacles.

## Training and evaluating

Reuse the data-organization and overfitting-control lessons from Unit 4 directly here — this is exactly where they matter most, since collected robot data is noisy and often imbalanced:

```python
train_ds = keras.utils.image_dataset_from_directory(
    "data/train", image_size=(128, 128), batch_size=32)
val_ds = keras.utils.image_dataset_from_directory(
    "data/val", image_size=(128, 128), batch_size=32)

early_stop = keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=8, restore_best_weights=True)
model.fit(train_ds, validation_data=val_ds, epochs=60, callbacks=[early_stop])
model.save("obstacle_avoidance_alexnet.keras")
```

Check the confusion matrix on the validation set, not just overall accuracy — for a 3-class action model, accuracy alone can hide a model that's systematically confusing "left" with "straight," which is exactly the kind of mistake that matters on the real robot.

## Deploying the trained model on LIMO

At inference time, load the saved model once at node startup, and on every camera frame, preprocess it identically to training (same resize, same rescaling) and publish the corresponding `Twist` command:

```python
def image_callback(self, img_msg):
    frame = self.bridge.imgmsg_to_cv2(img_msg, desired_encoding="bgr8")
    resized = cv2.resize(frame, (128, 128))
    pred = self.model.predict(resized[None, ...], verbose=0)
    action = ["left", "straight", "right"][pred.argmax()]
    self.publish_twist(action)
```

Run this first at low speed with a human ready to take over — a learned controller can fail in ways a hand-written one never would, and the only way to find those failure modes is to watch it drive.

## Try it yourself

Collect a small dataset (a few hundred frames per class is enough to start) by teleoperating LIMO around a simple obstacle course, train the AlexNet-style model above, and evaluate it by driving the trained policy in inference mode over the same course. Note every case where it picks the wrong action, then check whether those frames' true labels in your training set were themselves ambiguous or mislabeled — a large fraction of "model mistakes" in behavior cloning turn out to be data problems.
