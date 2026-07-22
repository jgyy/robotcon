# Using NVIDIA Jetson Nano with ROS — Unit 3: Basics - Collision Avoidance with DeepLearning

With Ignisbot able to move, this unit teaches it not to crash — using a small trained classifier rather than geometric obstacle detection (no lidar, no depth camera required, just a single RGB camera and a neural net). It's the first unit where the Jetson Nano's GPU actually earns its keep.

## Framing collision avoidance as classification

Instead of detecting and localizing every possible obstacle, the classic JetBot approach reframes the problem as a binary classification: given the current camera frame, is the path ahead `free` or `blocked`? This sidesteps the need for depth sensing or object detectors and trains in minutes on a small dataset, at the cost of being reactive rather than predictive — it tells you "stop now," not "there's a chair two meters ahead."

## Collecting a labeled dataset

Drive (or manually place) the robot into a spread of situations, saving a frame into `free/` or `blocked/` for each:

```python
import os, uuid
from jetbot import Camera, bgr8_to_jpeg

camera = Camera.instance(width=224, height=224)
os.makedirs('dataset/free', exist_ok=True)
os.makedirs('dataset/blocked', exist_ok=True)

def save_snapshot(label: str):
    path = f'dataset/{label}/{uuid.uuid1()}.jpg'
    with open(path, 'wb') as f:
        f.write(bgr8_to_jpeg(camera.value))
```

Aim for a few hundred images per class covering varied lighting, distances to obstacles, and obstacle types — a model trained only on one hallway won't generalize to your kitchen.

## Training with transfer learning

Training from scratch on a few hundred images would badly overfit; instead fine-tune a small pretrained CNN (ResNet18 is the standard choice here — small enough to run fast on the Nano's GPU, and pretrained on ImageNet so it already has useful low-level features):

```python
import torch, torchvision

model = torchvision.models.resnet18(weights='IMAGENET1K_V1')
model.fc = torch.nn.Linear(model.fc.in_features, 2)  # free vs blocked
model = model.to('cuda')

optimizer = torch.optim.Adam(model.parameters())
criterion = torch.nn.CrossEntropyLoss()

for epoch in range(10):
    for images, labels in train_loader:
        images, labels = images.to('cuda'), labels.to('cuda')
        optimizer.zero_grad()
        loss = criterion(model(images), labels)
        loss.backward()
        optimizer.step()

torch.save(model.state_dict(), 'collision_model.pth')
```

## Optimizing inference with TensorRT

A raw PyTorch model is fine for training but often too slow for a tight control loop on the Nano's limited GPU. TensorRT compiles the model into an optimized inference engine (fusing layers, using lower precision where safe), which is what actually makes real-time inference practical on this hardware:

```python
import torch2trt

model.eval()
sample = torch.zeros((1, 3, 224, 224)).cuda()
model_trt = torch2trt.torch2trt(model, [sample], fp16_mode=True)
torch.save(model_trt.state_dict(), 'collision_model_trt.pth')
```

Benchmark before and after — it's common to see several times the throughput, which is the difference between a controller that reacts in time and one that doesn't.

## Closing the loop

Run inference at a fixed rate, and instead of publishing directly to `cmd_vel`, publish a `blocked: bool` (or a probability) on its own topic and let a small behavior node decide what to do — stop, back up, or turn — while still respecting the driver node from Unit 2. Keeping "is it blocked" and "what to do about it" as separate nodes/topics makes it much easier to reuse the classifier in Unit 4 and Unit 5.

## Try it yourself

Collect your own free/blocked dataset (100+ images per class), train the classifier, convert it with TensorRT, and measure the inference rate before and after conversion using `ros2 topic hz` (or `rostopic hz`) on the topic your collision node publishes to.
