# Deep Learning Basics — Unit 4: The Training Process

Units 2 and 3 built network architectures with random weights. This unit covers the full pipeline that turns those random weights into a model that actually predicts something useful: collecting and preparing data, defining a loss function, optimizing it, and honestly measuring whether the result generalizes.

## Defining the model and the task
Take a concrete supervised classification problem: predicting a sauce's category (pure tomato, carrot-tomato, or tomato-cream) from a vector of chemical property measurements. This is supervised learning because training relies on labeled pairs `(x, y)` — a measurement vector and its known correct category. The network architecture (from Unit 3) determines the *hypothesis space* — the set of functions the model could learn — but the architecture alone predicts nothing useful until it's fit to data.

## Collecting and preprocessing data
Data quality and quantity bound what any model can learn, no matter how good the architecture or optimizer — this is the single most common failure point in real projects, robotics included. Practical preprocessing steps that recur constantly:
- **Normalization/standardization**: scale each input feature to have roughly zero mean and unit variance, so no single feature dominates the loss purely because of its raw magnitude.
- **Train/test split**: hold out a portion of the labeled data (commonly 70-90%/10-30%) that the model never sees during training, reserved purely for evaluating generalization.
- **Label encoding**: map categorical labels (`"pure tomato"`, `"carrot-tomato"`, `"tomato-cream"`) to integer class indices the loss function can consume.

```python
import numpy as np

def standardize(X, mean=None, std=None):
    if mean is None:
        mean, std = X.mean(axis=0), X.std(axis=0) + 1e-8
    return (X - mean) / std, mean, std

X_train_std, mean, std = standardize(X_train)
X_test_std, _, _ = standardize(X_test, mean, std)  # reuse train statistics, never refit on test
```

## A comparison criterion: loss functions
A loss function quantifies how wrong a prediction is, giving the optimizer something concrete to minimize. For the sauce classification task, categorical cross-entropy is standard:

```python
def cross_entropy(probs, true_class_idx):
    # probs: predicted probability distribution over classes (from a softmax output)
    return -np.log(probs[true_class_idx] + 1e-12)
```

Cross-entropy penalizes confident wrong predictions much more heavily than uncertain ones, which is exactly the incentive you want: it pushes the model toward being both correct and appropriately confident.

## Adjusting the model's parameters
Training minimizes the average loss over the training set by adjusting weights and biases via gradient-based updates — computing how the loss changes with respect to each parameter, then nudging that parameter in the direction that reduces loss:

```
w = w - learning_rate * dL/dw
```

This is gradient descent, previewed here and covered in full mechanical detail (including backpropagation, the algorithm that computes `dL/dw` efficiently for every parameter in a deep network) in Unit 6.

## Measuring performance honestly
High accuracy on the training set does not imply the model will perform well on new data — it might have simply memorized the training examples. Three sources of error explain the gap between a model and the true underlying function:
- **Noise**: irreducible randomness/measurement error in the data itself — no model can eliminate this.
- **Bias**: error from a model too simple to capture the true relationship (underfitting).
- **Variance**: error from a model too sensitive to the specific finite training set it saw (overfitting) — it would produce a meaningfully different model if trained on a different sample of the same underlying data.

This is why the test set from the preprocessing step matters: comparing training loss to test loss is how you diagnose which of these three is hurting you. Training loss high and test loss high -> likely bias/underfitting. Training loss low but test loss much higher -> likely variance/overfitting.

## Try it yourself
Using the `cross_entropy` function above, compute the loss for a 3-class prediction `probs = [0.7, 0.2, 0.1]` against each of the three possible true classes. Notice how much the loss changes when the true class is the confident (0.7) prediction versus one of the unlikely ones — that gap, magnified across a whole dataset, is what gradient descent is working to close.
