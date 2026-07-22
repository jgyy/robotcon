# AI Foundations for Robotics — Unit 8: Final Project

This capstone strings together every unit into one working pipeline: a robot that collects its own training images, trains a classifier on them (Unit 7), and wraps the classifier's raw predictions in a decision policy (Unit 5) before acting. Nothing here introduces new theory — the goal is proving to yourself that the pieces genuinely compose.

## Problem framing: an image classifier from scratch
The task: build a complete image classification system that lets a robot recognize four known objects — e.g. a lamp, a ball, a plant, and a compacted debris cube — from camera images, and safely decline to guess when an image doesn't clearly match any of them (the reject option from Units 1 and 5). Framing it end-to-end up front matters: you'll touch data collection, preprocessing, training, and decision-making, and each stage's design choices constrain the next.

## Data collection and preprocessing
Rather than sourcing images from the internet, collect your own in a controlled simulated environment: place each object on a central platform in an otherwise plain scene, and have the robot orbit it at randomized distances and angles, capturing a frame at each stop. Randomizing viewpoint and distance is deliberate — a classifier trained only on head-on, fixed-distance shots will fail the moment the robot sees the object from an unfamiliar angle in normal operation.

Preprocessing turns raw captures into model-ready tensors:

```python
from PIL import Image
import numpy as np

def preprocess(image_path, size=(64, 64)):
    img = Image.open(image_path).convert("L").resize(size)   # grayscale, fixed size
    arr = np.asarray(img, dtype=np.float32) / 255.0            # normalize to [0, 1]
    return arr.flatten()                                        # match Unit 7's flat-vector input
```

Split the collected images into train/validation/test sets, and check class balance — if the robot orbited the debris cube twice as many times as the plant, an unbalanced dataset will bias the classifier toward predicting "debris" by default.

## Model selection and training
Reuse the exact softmax regression pipeline from Unit 7 — the same `nn.Linear` + `nn.CrossEntropyLoss` + SGD training loop — applied to this four-class problem instead of MNIST's ten digits. That the Unit 7 code needs only minimal adaptation (change the output dimension from 10 to 4, swap the input source) is the point: a linear softmax classifier generalizes across problems with essentially no structural change.

```python
model = nn.Linear(64 * 64, 4)           # 4 object classes instead of 10 digits
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
# same training loop as Unit 7
```

Be honest about this model's ceiling: a linear classifier on raw flattened pixels is a solid baseline but a weak vision model — it has no notion of spatial structure. If accuracy plateaus below what you need, that's the expected motivation for convolutional networks, covered in the Deep Learning Basics course.

## Wrapping the model in a decision policy
A trained softmax model outputs a probability distribution over the four classes — but Unit 5 showed that naively taking the argmax ignores asymmetric costs. Wrap the model's output in an `AI_bot`-style decision layer: define a loss matrix (as in Unit 5's waste-sorting example) reflecting real consequences — e.g. misclassifying debris as "plant" and leaving it in place is worse than the reverse — and pick the action that minimizes expected risk under the model's posterior, including a reject action when the risk of every real class is too high.

```python
def decide(posterior, loss_matrix):
    risks = loss_matrix.T @ posterior
    return int(np.argmin(risks))
```

## Final evaluation
Freeze the trained model and the decision policy, then run both unchanged on the held-out test set — data the robot never trained on or tuned thresholds against. Report a full confusion matrix and per-class accuracy, and specifically check how often the reject action fires and whether it's firing on genuinely ambiguous images rather than confidently-wrong ones. A classifier that never rejects anything, or one that rejects everything, both indicate a miscalibrated loss matrix rather than a good decision policy.

## Try it yourself
Take the loss matrix you'd design for this problem and deliberately make misclassifying "debris" as anything else 3x more costly than other mistakes (since incorrect disposal matters more than a missed lamp). Re-run `decide()` over a batch of saved posterior probabilities from your trained model and compare how often the reject action fires versus your original, more neutral loss matrix.
