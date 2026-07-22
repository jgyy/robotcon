# PyTorch Essentials for Robotics — Unit 3: Datasets

A model is only as good as the data it learns from, and PyTorch gives you a small, consistent set of abstractions — `Dataset` and `DataLoader` — for turning raw files or arrays into batches a training loop can consume. This unit builds the dataset you'll feed into the model you create in Unit 4.

The diagram below shows how a training loop pulls one batch through the `DataLoader` and `Dataset` abstractions:

```mermaid
sequenceDiagram
    participant Loop as Training Loop
    participant DL as DataLoader
    participant DS as Dataset
    Loop->>DL: request next batch
    DL->>DS: __getitem__(idx) for each index
    DS->>DS: load image, apply transform
    DS-->>DL: (image, label)
    DL-->>Loop: batched (images, labels) tensors
```

## Generating the training dataset
Before you can train anything you need labelled examples: pairs of `(input, label)`. For this course's running example — a mini keyboard detector — that means a folder of images, each labelled with whether it shows the mini keyboard or not. In a real robotics project this step is often the most time-consuming part of the whole pipeline: driving a robot around to collect camera frames, logging sensor readings during teleoperation, or rendering synthetic images in simulation.

A minimal, reproducible way to organize this is one subfolder per class:

```
dataset/
  keyboard/
    img_001.png
    img_002.png
  no_keyboard/
    img_001.png
    img_002.png
```

Keep a held-out split you never train on — commonly 80% train / 20% validation — so you can tell later whether the model generalizes or has just memorized the training images:

```python
import random

files = ["img_%03d.png" % i for i in range(100)]
random.shuffle(files)
split = int(0.8 * len(files))
train_files, val_files = files[:split], files[split:]
```

## Datasets in Python
PyTorch's `torch.utils.data.Dataset` is an interface: implement `__len__` and `__getitem__`, and every other PyTorch data tool (loaders, samplers, transforms) works with it automatically.

```python
from torch.utils.data import Dataset
from PIL import Image
import torchvision.transforms as T

class KeyboardDataset(Dataset):
    def __init__(self, file_paths, labels, transform=None):
        self.file_paths = file_paths
        self.labels = labels
        self.transform = transform or T.Compose([
            T.Resize((64, 64)),
            T.ToTensor(),   # converts PIL image -> float32 tensor, scales to [0, 1]
        ])

    def __len__(self):
        return len(self.file_paths)

    def __getitem__(self, idx):
        image = Image.open(self.file_paths[idx]).convert("RGB")
        image = self.transform(image)
        label = self.labels[idx]
        return image, label
```

Wrap it in a `DataLoader` to get automatic batching, shuffling, and (optionally) parallel loading — this is what your training loop actually iterates over:

```python
from torch.utils.data import DataLoader

train_ds = KeyboardDataset(train_files, train_labels)
train_loader = DataLoader(train_ds, batch_size=16, shuffle=True, num_workers=2)

for images, labels in train_loader:
    print(images.shape, labels.shape)   # e.g. (16, 3, 64, 64), (16,)
    break
```

`shuffle=True` matters for training data (it prevents the model from learning the order of examples instead of their content); leave it `False` for validation, where order doesn't matter and reproducibility does.

## Extra datasets: pre-built and larger-scale
You won't always build a `Dataset` by hand. `torchvision.datasets` ships ready-to-use datasets (MNIST, CIFAR-10, ImageFolder, and others) that are useful for quickly sanity-checking a model architecture before pointing it at your own robot data:

```python
from torchvision.datasets import ImageFolder

# expects the same class-per-subfolder layout used above
dataset = ImageFolder("dataset/", transform=T.Compose([T.Resize((64, 64)), T.ToTensor()]))
print(dataset.classes)          # ['keyboard', 'no_keyboard']
```

For datasets too large to fit in memory — long rosbag-derived image sequences, for example — the same `Dataset.__getitem__` pattern still works: load each item from disk lazily inside `__getitem__` rather than pre-loading everything in `__init__`. The `DataLoader`'s `num_workers` argument then parallelizes that disk I/O across worker processes so it doesn't bottleneck training.

## Try it yourself
Write a `Dataset` subclass that wraps a list of Python floats and their squares (`(x, x**2)` pairs) instead of images — no files needed. Wrap it in a `DataLoader` with `batch_size=4`, iterate one batch, and print the shapes of both the input and label tensors.
