# Deep Learning with Domain Randomization — Unit 2: Step By Step Simple Guide

This is the core workflow of the whole course, built once end to end at its simplest: capture labeled images from simulation, turn them into a Keras-ready dataset, fine-tune a pretrained network to regress 3D position, and check that it actually learned something. Every later unit is a variation on this same loop.

## Generating training data from simulation
You cannot hand-label thousands of images with 3D coordinates — instead, you let the simulator tell you the ground truth. Gazebo (or any simulator that exposes model poses, e.g. via a `/gazebo/get_entity_state`-style service or topic) knows the exact XYZ of every object in the world, so a data-collection node just needs to pair each camera frame with the object's simulated pose at that instant:

```python
import rclpy, csv, cv2
from rclpy.node import Node
from sensor_msgs.msg import Image
from gazebo_msgs.msg import ModelStates
from cv_bridge import CvBridge

class DatasetCollector(Node):
    def __init__(self):
        super().__init__('dataset_collector')
        self.bridge = CvBridge()
        self.latest_pose = None
        self.count = 0
        self.create_subscription(ModelStates, '/gazebo/model_states', self.on_states, 10)
        self.create_subscription(Image, '/camera/image_raw', self.on_image, 10)
        self.log = open('dataset/labels.csv', 'w', newline='')
        self.writer = csv.writer(self.log)

    def on_states(self, msg: ModelStates):
        idx = msg.name.index('spam_can')
        p = msg.pose[idx].position
        self.latest_pose = (p.x, p.y, p.z)

    def on_image(self, msg: Image):
        if self.latest_pose is None:
            return
        frame = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
        fname = f'dataset/img_{self.count:05d}.png'
        cv2.imwrite(fname, frame)
        self.writer.writerow([fname, *self.latest_pose])
        self.count += 1
```

Run this while nudging the object (or the camera) around the scene between saves — a `for` loop that teleports the model to random poses via a service call and sleeps briefly is the simplest data-generation strategy, and it's the one you'll extend with actual randomization in Unit 5.

## From raw images to a Keras-ready dataset
Once you have a folder of PNGs and a CSV of labels, loading them is standard `tf.data` work — no robotics-specific step remains:

```python
import pandas as pd, tensorflow as tf

df = pd.read_csv('dataset/labels.csv', names=['path', 'x', 'y', 'z'])
paths = df['path'].values
labels = df[['x', 'y', 'z']].values.astype('float32')

def load(path, label):
    img = tf.io.read_file(path)
    img = tf.image.decode_png(img, channels=3)
    img = tf.image.resize(img, (224, 224)) / 255.0
    return img, label

ds = tf.data.Dataset.from_tensor_slices((paths, labels)).map(load).shuffle(500).batch(32)
train_ds = ds.take(int(0.8 * len(paths) / 32))
val_ds = ds.skip(int(0.8 * len(paths) / 32))
```

224x224 is the input resolution MobileNetV2 expects — matching it now saves you a resize headache later.

## Transfer learning with MobileNetV2
Training a CNN from scratch needs far more data than a few hundred simulated images. Instead, start from MobileNetV2 pretrained on ImageNet — it already knows general-purpose visual features (edges, textures, shapes) — and replace only its classification head with a small regression head:

```python
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2

base = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base.trainable = False  # freeze the pretrained backbone for now

x = layers.GlobalAveragePooling2D()(base.output)
x = layers.Dense(64, activation='relu')(x)
out = layers.Dense(3, activation='linear')(x)  # x, y, z
model = Model(base.input, out)
model.compile(optimizer='adam', loss='mse', metrics=['mae'])
```

Freezing the backbone means only the ~20K new parameters in the head get trained initially, which is fast and hard to overfit even with a small dataset.

## Training and quick evaluation
```python
history = model.fit(train_ds, validation_data=val_ds, epochs=15)
model.save('models/spam_locator_v1.h5')
```

Plot `history.history['val_mae']` — a mean absolute error that keeps dropping and levels off well below the object's physical size (a few centimeters) means the model has learned the mapping from pixels to position, not just memorized the training set.

## Try it yourself
Collect at least 300 image/pose pairs with the object at varied but non-random positions (a grid sweep is fine), train the model above, and report the final validation MAE in meters. This model and dataset are your baseline for Unit 3, where you'll retrain it rather than starting over.
