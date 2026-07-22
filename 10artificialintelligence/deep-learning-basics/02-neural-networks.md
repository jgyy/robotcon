# Deep Learning Basics — Unit 2: Neural Networks

This unit builds the fundamental unit of every deep learning model — the artificial neuron — and shows how connecting many of them into layers produces a function powerful enough to approximate essentially any input-output relationship.

## The perceptron
The perceptron, introduced by Frank Rosenblatt in 1958, is a loose model of a biological neuron: dendrites receive inputs, the cell body combines them, and the axon fires an output. Mathematically, a perceptron takes an input vector `x`, computes a weighted sum plus a bias, and passes the result through an activation function:

```
z = w1*x1 + w2*x2 + ... + wn*xn + b
a = activation(z)
```

`w` (weights) and `b` (bias) are the learnable parameters. `activation` is a nonlinear function — historically a step function or sigmoid, in modern networks usually ReLU (covered in Unit 3). Without that nonlinearity, stacking layers would collapse algebraically into a single linear transform, no matter how many layers you add — nonlinearity is what makes depth meaningful at all.

## Connecting artificial neurons: a worked regression example
Consider a robot learning how long to mix cake batter to reach a target batter height, from empirical (mixing_time, final_height) data pairs. A single neuron with a linear activation can only fit a straight line through that data. If the true relationship is curved, one neuron underfits no matter how you tune its two parameters.

The fix is to combine several neurons, each contributing a differently-shaped "bump" or "step" to the output, and sum their contributions:

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def shallow_net(x, W1, b1, w2, b2):
    # x: scalar input (mixing time)
    h = relu(W1 * x + b1)      # hidden layer: several neurons
    y = np.dot(w2, h) + b2     # output layer: linear combination
    return y
```

Each hidden neuron activates over a different range of `x` (controlled by `W1`, `b1`), and the output layer (`w2`, `b2`) blends their contributions into a curve that can bend and flatten wherever the data requires it.

## Universal Approximation Theorem
The Universal Approximation Theorem states that a network with a single hidden layer, given enough hidden neurons, can approximate any continuous function on a bounded input domain to arbitrary precision. Intuitively: each ReLU hidden neuron contributes one "kink" (a piecewise-linear segment), and enough kinks stitched together can trace out any curve, the same way enough short straight segments can approximate a smooth curve.

This is a real theoretical guarantee, but it comes with a catch you should hold onto for Unit 3: "enough hidden neurons" can be an impractically large number for anything but low-dimensional, well-behaved functions. The theorem tells you shallow networks are *capable* in principle, not that they're the *efficient* way to get there.

## Worked example: character recognition as neuron composition
A recurring example in this course is a robot ("the Gatekeeper") that needs to read text from a cookbook photo. Reading breaks into three neuron-network-friendly steps: scanning the image into a sequence of character-sized patches, segmenting those patches from each other, and classifying each patch as a specific character. The classification step is exactly the shallow-network pattern above, generalized: input is now a flattened image patch (a vector of pixel intensities) instead of a single scalar, and the output is a probability distribution over possible characters instead of a single number.

## Shallow neural networks, formalized
Putting it together, a shallow (one-hidden-layer) feedforward network computes:

```
h = activation(W1 @ x + b1)   # hidden layer, W1: (hidden_dim, input_dim)
y = W2 @ h + b2               # output layer, W2: (output_dim, hidden_dim)
```

`x` is the input vector, `h` the hidden activations, `y` the output. This is the building block Unit 3 stacks to build genuinely deep networks — each additional hidden layer is just another `activation(W @ prev_layer + b)` step feeding into the next.

## Try it yourself
Using the `shallow_net` function above, hand-pick `W1`, `b1`, `w2`, `b2` (3-4 hidden neurons) so the network approximates a simple curve of your choosing — e.g., a parabola sampled over `x in [-2, 2]`. Plot your network's output against the true curve and adjust parameters by hand until the fit is reasonable. This is tedious by design: it's the "by hand" version of what gradient descent (Unit 4) will do automatically.
