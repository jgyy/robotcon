# PyTorch Essentials for Robotics — Unit 2: Tensors and PyTorch basics

Tensors are the single data structure every other part of PyTorch is built on — datasets, model weights, activations, gradients, and outputs are all tensors. This unit gets you fluent with creating, inspecting, and manipulating them before Units 3-5 put them to work on real data.

## Why PyTorch, and what this unit covers
PyTorch exists because NumPy-style array code alone can't train neural networks efficiently: you need automatic differentiation (computing gradients for you) and transparent GPU acceleration, without changing how you write code. A PyTorch tensor looks and behaves almost exactly like a NumPy array, but it optionally tracks the operations applied to it (for `autograd`) and can live on a GPU. The mission of this unit is narrow and mechanical on purpose: get comfortable creating tensors, reading their shape and dtype, reshaping them, and reducing them with operations like `min`/`max` — because every bug you'll debug later ("shape mismatch", "wrong dtype", "tensor on wrong device") traces back to these fundamentals.

## What is a tensor
A tensor is an n-dimensional array with a fixed `dtype` (element type) and `shape`. A scalar is a 0-d tensor, a vector is 1-d, a matrix is 2-d, a batch of RGB images is 4-d (`batch, channels, height, width`).

```python
import torch

scalar = torch.tensor(3.14)
vector = torch.tensor([1.0, 2.0, 3.0])
matrix = torch.tensor([[1, 2], [3, 4]])
zeros  = torch.zeros(2, 3)
ones   = torch.ones(3)
rand   = torch.rand(2, 2)          # uniform [0, 1)
arange = torch.arange(0, 10, 2)    # like Python range

print(matrix.shape, matrix.dtype, matrix.ndim)
```

## Basic operations with tensors
Elementwise arithmetic, matrix multiplication, and broadcasting all work much like NumPy:

```python
a = torch.tensor([1.0, 2.0, 3.0])
b = torch.tensor([4.0, 5.0, 6.0])

a + b            # elementwise add -> [5., 7., 9.]
a * b            # elementwise multiply -> [4., 10., 18.]
a.dot(b)         # dot product -> 32.0
torch.matmul(torch.rand(2, 3), torch.rand(3, 4))  # matrix multiply -> shape (2, 4)

a + 10           # broadcasting: adds 10 to every element
```

Broadcasting rules match NumPy: trailing dimensions are compared, and a dimension of size 1 stretches to match. This matters a lot once you're adding a bias vector to a batch of outputs in Unit 4.

## Tensor data types
Every tensor has a `dtype` — `torch.float32` (the default for most training), `torch.int64` (typical for class labels), `torch.bool`, etc. Mismatched dtypes are a very common source of runtime errors:

```python
x = torch.tensor([1, 2, 3])          # dtype: int64 by default for integers
y = torch.tensor([1.0, 2.0, 3.0])    # dtype: float32 by default for floats

x.float()                            # cast to float32
y.to(torch.int32)                    # cast to int32
x.dtype, y.dtype
```

As a rule of thumb: model inputs and weights are `float32`, classification labels passed to `CrossEntropyLoss` are `int64`. Get this wrong and PyTorch will raise a clear (if occasionally cryptic) dtype error — read it, it usually names the exact mismatch.

## Manipulating tensors
Reshaping, indexing, and combining tensors are operations you'll use constantly when preparing sensor data for a model:

```python
t = torch.arange(12)          # shape (12,)
t.reshape(3, 4)                # shape (3, 4), same underlying data
t.view(3, 4)                   # like reshape, requires contiguous memory

img_batch = torch.rand(4, 3, 64, 64)   # 4 images, 3 channels, 64x64
img_batch[0]                    # first image, shape (3, 64, 64)
img_batch[:, 0, :, :]            # the red channel of every image, shape (4, 64, 64)

torch.cat([a, b], dim=0)        # concatenate along an existing dimension
torch.stack([a, b], dim=0)      # stack into a new dimension
```

`squeeze()`/`unsqueeze(dim)` add or remove size-1 dimensions — useful for turning a single sample into a batch of size 1: `x.unsqueeze(0)`.

## Min, max, and reduction operations
Reduction operations collapse a tensor along one or more dimensions — this is how you'll later find the predicted class (the `argmax` of a model's output) or track the worst-case value in a batch of sensor readings:

```python
scores = torch.tensor([0.1, 0.7, 0.2])
scores.max()          # value: 0.7
scores.argmax()        # index of the max: 1
scores.min(), scores.sum(), scores.mean()

batch_scores = torch.rand(4, 3)   # 4 samples, 3 classes each
batch_scores.argmax(dim=1)         # predicted class per sample, shape (4,)
```

`argmax` is exactly how you'll convert raw model outputs into a predicted class label starting in Unit 4.

## CPU or GPU
Tensors live on a device (`cpu` or `cuda`), and operations between two tensors require them to be on the *same* device. Moving a tensor is explicit:

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
x = torch.rand(3, 3).to(device)
```

Writing `device = ...` once at the top of a script and calling `.to(device)` on every tensor and model is the idiomatic pattern — it means the exact same code runs on a laptop CPU or a GPU-equipped workstation without edits, which matters when you move from prototyping on a dev machine to training on a beefier one.

## Try it yourself
Create a `(2, 3, 4)` tensor of random values, find its `argmax` along the last dimension, and confirm the resulting shape is `(2, 3)`. Then move the whole computation onto whatever device `torch.cuda.is_available()` reports on your machine, and confirm the result is identical.
