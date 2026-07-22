# PyTorch Essentials for Robotics — Unit 1: Course presentation

This unit is a short orientation before you touch any code: it shows you the finished shape of what you'll build, and gets your environment ready so every later unit is "add one more piece" rather than "start from scratch."

## What this course builds toward
By the end of Unit 5 you will have trained a small image classifier — a "mini keyboard detector" — end to end: generating a labelled dataset, wrapping it in a PyTorch `Dataset`/`DataLoader`, defining a neural network with `torch.nn`, and running a real training loop that drives the loss down. Every unit after this one adds one concrete piece of that pipeline. Tensors and device placement (Unit 2) are the data structure everything else operates on. Datasets (Unit 3) are how you feed real-world examples in. Model creation (Unit 4) is how you define what the network computes. Training tools (Unit 5) are how you make the network learn from data instead of just running it once.

This mirrors how you'll actually build perception and control components for a robot: collect or simulate data, define a model architecture, train it, then swap it into a ROS node or control loop.

## Setting up your environment
You need Python 3 and PyTorch installed. A virtual environment keeps this isolated from your system packages:

```bash
python3 -m venv ~/pytorch-robotics-env
source ~/pytorch-robotics-env/bin/activate
pip install torch torchvision
```

Verify the install and check whether a GPU is visible to PyTorch (it's fine if not — everything in this course also runs on CPU, just slower):

```bash
python3 -c "import torch; print(torch.__version__); print('CUDA available:', torch.cuda.is_available())"
```

If you're working inside a ROS 2 workspace, keep this virtual environment separate from your ROS Python interpreter for now — mixing them is a later-course concern (deployment), not a learning-PyTorch concern.

## Demo: a 60-second smoke test
This is not something you need to understand yet — it's a preview so you recognize the pieces when Units 2-5 explain them properly.

```python
import torch
import torch.nn as nn

# a tensor: PyTorch's core data structure (Unit 2)
x = torch.rand(1, 4)

# a tiny neural network: two linear layers (Unit 4)
model = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 2),
)

# a forward pass: run data through the model
output = model(x)
print("input:", x)
print("output:", output)
```

Run it. You should see two tensors printed — a random 4-value input and a 2-value output. Nothing here is trained yet; the network's weights are random. Training that network to produce *useful* output, on real data, is exactly what the rest of the course teaches.

## How this fits robotics workflows
In a robotics context, the "input" above is rarely a random tensor — it's a camera frame, a LIDAR scan, a joint-state vector, or a window of sensor readings. The "output" is a classification (what object is this?), a regression (what torque should I apply?), or a policy decision. PyTorch is the tool that sits between "I have sensor data" and "I have a trained model I can call from a control loop," and this course walks that path once, thoroughly, with a small enough problem that you can run every step locally.

## Try it yourself
Run the smoke-test script above twice in a row without changing anything. Confirm the output tensor changes between runs — then explain in one sentence *why* it changes even though the code is identical. (Hint: look at what `torch.rand` and freshly-initialized `nn.Linear` layers have in common.)
