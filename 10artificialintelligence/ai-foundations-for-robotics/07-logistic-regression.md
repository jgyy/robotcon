# AI Foundations for Robotics — Unit 7: Logistic Regression

Every idea from Units 2–6 — probability, MLE, decision theory, cross-entropy — converges here into the first genuinely trainable model in the course. Logistic regression is small enough to derive by hand but structurally identical to the output layer of every deep classifier you'll meet in later courses, which makes it the ideal bridge from theory to practice.

The sequence diagram below shows the repeating forward/backward/update cycle that trains the logistic regression model.

```mermaid
sequenceDiagram
    participant Data as Training Data
    participant Model as LogisticRegression
    participant Loss as BCELoss
    participant Opt as Optimizer

    loop each epoch
        Data->>Model: forward(x)
        Model-->>Loss: predicted probability
        Loss-->>Opt: loss value
        Opt->>Model: backward + step (update w, b)
    end
```

## From linear scores to probabilities: the sigmoid
A linear model `w·x + b` produces an unbounded real number — not a valid probability. The **sigmoid function** squashes it into (0, 1):

```
σ(z) = 1 / (1 + e^(-z))
```

It's monotonic (higher score → higher probability), and σ(0) = 0.5, so the decision boundary sits exactly where the linear score crosses zero. This is the missing piece that turns a linear model into a probabilistic classifier.

## Binary logistic regression and maximum likelihood
The full model: `P(y=1 | x) = σ(w·x + b)`. Training means choosing w and b — this is where Unit 4's MLE and Unit 6's cross-entropy meet: maximizing the likelihood of the observed labels under this model is *exactly* equivalent to minimizing the cross-entropy (log-loss) between the true labels and predicted probabilities. There is no separate "logistic regression loss" to memorize — it's cross-entropy, applied to a sigmoid-squashed linear model.

## Training with gradient descent: a PyTorch walkthrough
Because the cross-entropy loss has no closed-form minimizer for logistic regression (unlike, say, the Gaussian MLE from Unit 4), it's trained iteratively with **gradient descent**: nudge w and b in the direction that reduces loss, scaled by a learning rate, repeated until convergence.

```python
import torch
import torch.nn as nn

class LogisticRegression(nn.Module):
    def __init__(self, n_features):
        super().__init__()
        self.linear = nn.Linear(n_features, 1)

    def forward(self, x):
        return torch.sigmoid(self.linear(x))

model = LogisticRegression(n_features=2)      # e.g. durometer + densimeter readings
criterion = nn.BCELoss()                       # binary cross-entropy
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)

for epoch in range(200):
    optimizer.zero_grad()
    y_pred = model(X_train).squeeze()
    loss = criterion(y_pred, y_train)
    loss.backward()                            # autograd computes ∂loss/∂(w, b)
    optimizer.step()
```

PyTorch's `loss.backward()` is doing calculus you could in principle do by hand for this simple model — that's exactly why it's a good first model to train with a framework: you can sanity-check the framework against the math you already know.

## Evaluating a classifier
After training, evaluate on a held-out test set the model never saw, applying the standard 0.5 probability threshold (or a decision-theoretic one from Unit 5) to get hard predictions:

```python
model.eval()
with torch.no_grad():
    y_prob = model(X_test).squeeze()
    y_pred = (y_prob >= 0.5).float()
    accuracy = (y_pred == y_test).float().mean()
    test_loss = criterion(y_prob, y_test)
```

Report both loss and accuracy — accuracy is intuitive, but loss reflects *how confidently* wrong or right the model was, which matters when you'll later wrap predictions in a decision policy (Unit 5) rather than trusting a raw label.

## Multinomial logistic regression and MNIST
Real classification problems usually have more than two classes. **Multinomial (softmax) logistic regression** generalizes the sigmoid to K classes via the **softmax function**, which turns K linear scores into a probability distribution over K classes that sums to 1. The canonical benchmark dataset is **MNIST** — 60,000 training and 10,000 test images of handwritten digits (0–9), each 28×28 pixels:

```python
model = nn.Linear(784, 10)              # flatten 28x28 -> 784, one score per digit
criterion = nn.CrossEntropyLoss()       # combines softmax + negative log-likelihood internally
```

The training loop is identical in structure to the binary case — dataset, model, optimizer, loss, trainer — just scaled from 2 classes and 2 features to 10 classes and 784 features. That structural reuse is deliberate: the final project reuses this exact pipeline again for a robot's object classifier.

## Try it yourself
Generate a small synthetic 2D dataset with two separable clusters (e.g. `torch.randn(50, 2) + torch.tensor([2., 2.])` for class 1 and `torch.randn(50, 2) - torch.tensor([2., 2.])` for class 0), train the `LogisticRegression` model above on it, and check that `model.linear.weight` points roughly along the line separating the two clusters. Then verify test accuracy is near 100% — an easy sanity check that your training loop is correct before trusting it on MNIST-scale data.
