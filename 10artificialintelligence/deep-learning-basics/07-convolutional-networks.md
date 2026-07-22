# Deep Learning Basics — Unit 7: Convolutional Networks

The feedforward networks from Units 2-6 treat every input as a flat vector, throwing away any notion of spatial structure. This closing unit introduces Convolutional Neural Networks (CNNs), the architecture family built specifically for grid-structured data like images — the dominant tool for robot vision.

## Invariance and equivariance: why fully-connected networks struggle with images
A fully-connected layer applied to a 224x224 RGB image needs a separate weight for every one of its ~150,000 input pixels per output neuron, which is both a huge number of parameters and blind to spatial relationships — shifting an object one pixel to the right presents the network with an entirely different input vector, and it has to relearn the same pattern at every possible location. CNNs fix this with two properties:
- **Equivariance**: if the input shifts, the feature map shifts correspondingly — the same filter finds the same feature wherever it appears.
- **Invariance**: pooling layers (below) then discard the exact position of a detected feature, keeping only whether/how strongly it was present — useful because "there is an edge in this region" often matters more than its exact pixel offset.

## A convolutional operation for 1D inputs
The core operation is easiest to see in one dimension: a small kernel of shared weights slides across the input, computing a local weighted sum plus bias at each position:

```python
import numpy as np

def conv1d(x, kernel, bias):
    k = len(kernel)
    out = np.zeros(len(x) - k + 1)
    for i in range(len(out)):
        out[i] = np.dot(x[i:i+k], kernel) + bias
    return out

x = np.array([1, 2, 3, 4, 5, 4, 3, 2, 1], dtype=float)
edge_kernel = np.array([-1, 0, 1], dtype=float)  # crude edge/slope detector
print(conv1d(x, edge_kernel, bias=0))
```

The critical difference from a fully-connected layer: the same 3-value kernel is reused at every position, so the parameter count doesn't scale with input length at all — only with kernel size.

## Convolutional networks for 2D inputs
Images extend the same idea to two dimensions, and stack multiple kernels per layer (each producing its own output "channel"). A minimal PyTorch CNN for MNIST-style digit classification:

```python
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 28x28 -> 14x14
            nn.Conv2d(16, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 14x14 -> 7x7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 64), nn.ReLU(),
            nn.Linear(64, num_classes),
        )

    def forward(self, x):
        return self.classifier(self.features(x))
```

Notice the pattern: each `Conv2d` layer increases channel depth (1 -> 16 -> 32), building progressively more abstract features, while `MaxPool2d` shrinks the spatial dimensions. By the time the data reaches `classifier`, it's a compact, spatially-invariant summary rather than raw pixels.

## Upsampling / downsampling
`MaxPool2d` above is one form of downsampling (subsampling): reducing spatial resolution while keeping the strongest signal in each region. A simple illustration on a 4x4 patch reduced to 2x2 by taking every other pixel:

```python
patch = np.array([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
])
downsampled = patch[::2, ::2]  # keep every other row/column -> 2x2
```

Real pooling layers use max or average over small windows rather than plain striding, but the effect is the same: half the spatial dimensions, key structure preserved. Upsampling (used in architectures that need to reconstruct full-resolution output, like segmentation networks) reverses this, using techniques like nearest-neighbor repeats or transposed convolutions.

## Applications in robotics
CNNs are the standard tool wherever a robot needs to interpret camera frames: classifying whether a detected person is a known family member or an intruder, localizing objects for grasping (Unit topics in the manipulation-focused courses build on this), or segmenting a scene into navigable floor versus obstacles. In practice, robotics projects rarely train a CNN from scratch — pretrained backbones (via `torchvision.models` or similar) are fine-tuned on a smaller task-specific dataset, since collecting millions of robot-camera-labeled images from scratch is rarely practical.

## Summary
A convolutional layer applies a small set of shared-weight filters across an entire image, detecting local features like edges and textures with far fewer parameters than a fully-connected layer would need. Pooling layers downsample the resulting feature maps, trading spatial precision for invariance and computational efficiency. Stacking several convolution-pool blocks increases channel depth — moving from low-level features (edges) in early layers to high-level, task-relevant features (object parts) in later layers — before a final fully-connected classifier turns that feature summary into predictions. This convolution-then-classify pattern, combined with everything from Units 2-6 (training, optimization, regularization), is the foundation for the vision-heavy robotics work in later courses.

## Try it yourself
Extend `conv1d` above to accept a `stride` parameter (step size between kernel applications, default 1) and a simple zero-padding option. Run it with `stride=2` on the example `x` and `edge_kernel` and compare the output length to the `stride=1` case — this is the same stride/padding trade-off `nn.Conv2d`'s `stride` and `padding` arguments control, just without the framework hiding the loop from you.
