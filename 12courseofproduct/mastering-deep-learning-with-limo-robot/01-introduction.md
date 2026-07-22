# Mastering Deep Learning with LIMO-Robot — Unit 1: Introduction

This unit sets the frame for the whole course: what deep learning actually is, how it differs from the classical robotics you may already know, and what the seven units ahead will build toward — a LIMO robot that can detect objects and avoid obstacles using trained neural networks instead of hand-tuned rules.

## Deep learning versus classical robotics programming

Most of the robotics code you've written so far is explicit: you read a sensor value, apply a formula or a state machine, and produce a control output. Deep learning inverts this — instead of writing the mapping from input to output by hand, you show the system many examples of inputs paired with correct outputs, and an optimization process (gradient descent) adjusts a large number of numerical parameters until the model approximates that mapping on its own. "Deep" refers to stacking many layers of these parameterized transformations, each layer learning to represent the input at a different level of abstraction — raw pixels, then edges, then shapes, then objects, for example.

This matters for robotics specifically because some perception problems (recognize an arbitrary object in a cluttered scene, decide "how much do I need to turn to avoid this obstacle" from a raw camera image) are extremely hard to write explicit rules for, but are comparatively easy to learn from labeled examples.

## Where this course is going

The seven units build on each other in a deliberate order:

1. **Deep Learning Basics** — the math of a single neuron and a small network, applied to robotics-flavored regression/classification problems.
2. **L-layer networks in Python** — programming a configurable, multi-layer network with Keras instead of toy single-layer examples.
3. **Hyperparameter Tuning** — the practical skill of getting a network to actually train well, not just compile.
4. **Convolutional Neural Networks** — the architecture family that makes image-based perception tractable.
5. **Object and People Recognition (YOLO)** — using a modern CNN-based detector for real-time perception.
6. **Obstacle avoidance training** — closing the loop: collecting data on LIMO, training a model, and deploying it for control.

Each later unit assumes you're comfortable with the previous one's vocabulary (layer, weight, activation, loss, gradient), so if a term feels unfamiliar later, it was likely defined a unit or two back.

## Tooling you'll use

The exercises use Python with **TensorFlow/Keras** as the primary deep learning framework, because its high-level API keeps the focus on architecture and data rather than boilerplate. The concepts (layers, loss functions, optimizers, training loops) transfer directly to other frameworks like PyTorch if you prefer one later — this course is not trying to make you a Keras specialist, it's using Keras as a vehicle to teach the underlying ideas.

For the robotics side, you'll need a working ROS 2 (or ROS 1, if that's what your LIMO setup uses) environment with the LIMO robot — real hardware or its simulator — publishing sensor topics (camera, LiDAR) and accepting velocity commands. If you haven't set that up yet, confirm it now:

```bash
# ROS 2 example — list active topics on a running LIMO (real or simulated)
ros2 topic list
ros2 topic echo /scan --once
ros2 topic echo /camera/image_raw --once
```

```bash
python3 -c "import tensorflow as tf; print(tf.__version__); print(tf.config.list_physical_devices())"
```

The second command confirms TensorFlow is installed and shows whether it can see a GPU — training will work on CPU for the small examples in this course, but a GPU makes the CNN and YOLO units far more pleasant.

## Try it yourself

Before moving on, verify your environment end to end: write a five-line Python script that imports `tensorflow`, builds a `keras.Sequential` model with a single `Dense(1)` layer, calls `.compile(optimizer="sgd", loss="mse")`, and fits it on a tiny synthetic array like `x = [1,2,3,4]`, `y = [2,4,6,8]`. If it trains without error and the loss decreases, your toolchain is ready for Unit 2.
