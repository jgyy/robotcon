# Deep Learning Basics — Unit 5: Global Exercise

This unit is a capstone: instead of a new concept per subsection, it walks the entire pipeline from Units 2-4 end to end on a real task — training a feedforward network to recognize alphanumeric characters, so the Gatekeeper robot can read a cake recipe from a photographed cookbook page.

## The problem
The goal: given a dataset of labeled character images (single letters and digits, each a small grayscale image), train a classifier that maps an image to the character it depicts, then chain that classifier into a pipeline that reads a whole photographed line of recipe text. This mirrors a genuinely common robotics sub-task — turning pixels into structured, usable information — and forces you to exercise every piece from the previous three units in one place.

## Collecting the data
Rather than gathering new data, this exercise uses a pre-labeled dataset of alphanumeric character images (conceptually similar in spirit to MNIST, but character-based rather than digit-only). Using a pre-built dataset here is deliberate: it isolates the modeling problem from the (very real, but separate) problem of building a labeled dataset from scratch, which Unit 4 already covered at the conceptual level.

## Data preprocessing
Each grayscale character image is flattened from a 2D grid (e.g., 28x28 pixels) into a 784-element input vector, then standardized using the same train-set-statistics approach from Unit 4:

```python
import numpy as np

class CustomDataset:
    def __init__(self, images, labels, mean=None, std=None):
        flat = images.reshape(len(images), -1).astype(np.float32)  # (N, 784)
        if mean is None:
            mean, std = flat.mean(axis=0), flat.std(axis=0) + 1e-8
        self.X = (flat - mean) / std
        self.y = labels
        self.mean, self.std = mean, std

    def __len__(self):
        return len(self.y)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# split indices before building datasets so train stats never leak into test
n = len(all_images)
split = int(0.8 * n)
train_ds = CustomDataset(all_images[:split], all_labels[:split])
test_ds = CustomDataset(all_images[split:], all_labels[split:], train_ds.mean, train_ds.std)
```

## The model
A feedforward network for this task follows the exact shallow/deep pattern from Units 2-3: an input layer sized to the flattened image (784 units), one or two hidden layers with ReLU activations, and an output layer with one unit per possible character, using softmax so the outputs form a valid probability distribution:

```python
import torch.nn as nn

class CharacterNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784, 128), nn.ReLU(),
            nn.Linear(128, 64), nn.ReLU(),
            nn.Linear(64, num_classes),  # raw logits; softmax applied by the loss
        )

    def forward(self, x):
        return self.net(x)
```

## A comparison criterion
Multiclass cross-entropy, introduced in Unit 4, is the loss here too — derived formally from Maximum Likelihood Estimation: minimizing cross-entropy is equivalent to maximizing the likelihood the model assigns to the correct labels across the whole dataset. In PyTorch, `nn.CrossEntropyLoss` takes raw logits directly and applies the softmax internally, which is why `CharacterNet.forward` above returns unnormalized logits rather than probabilities.

## Training the model
Mini-batch gradient descent (previewed in Unit 4, mechanics covered in full in Unit 6) processes the training set in small batches rather than one example or the whole dataset at a time — a practical middle ground between noisy-but-fast (single example) and stable-but-slow (full dataset) updates:

```python
import torch
from torch.utils.data import DataLoader

model = CharacterNet(num_classes=36)  # 26 letters + 10 digits
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = torch.nn.CrossEntropyLoss()
loader = DataLoader(train_ds, batch_size=64, shuffle=True)

for epoch in range(10):
    for X_batch, y_batch in loader:
        optimizer.zero_grad()
        logits = model(torch.tensor(X_batch))
        loss = criterion(logits, torch.tensor(y_batch))
        loss.backward()
        optimizer.step()
```

Track training loss/accuracy against test loss/accuracy across epochs — a widening gap between the two is the overfitting signal from Unit 4's bias/variance discussion, and is your cue to stop training or add regularization (Unit 6).

## Read the recipe
The final step chains inference across three levels: a `Character` class runs the trained model on one segmented glyph image; a `Word` class segments a text region into characters and concatenates their predictions; a `Text_Image` class segments a whole image into words. This mirrors the scanning-segmenting-classifying breakdown from Unit 1 — the character classifier you trained is the "classifying" piece, and the surrounding classes handle the "scanning" and "segmenting" that make it usable on a real photographed page.

## Try it yourself
Take the `CharacterNet` above and reduce the hidden layers to a single `nn.Linear(784, num_classes)` (no hidden layer at all — pure logistic regression). Train both versions on the same data for the same number of epochs and compare test accuracy. The gap you measure is a direct, hands-on demonstration of why Unit 3 argued deep networks earn their keep on real tasks.
