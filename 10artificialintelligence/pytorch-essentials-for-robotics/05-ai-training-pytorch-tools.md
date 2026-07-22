# PyTorch Essentials for Robotics — Unit 5: AI training PyTorch tools

This is where everything from Units 2-4 comes together: tensors, a dataset, and a model architecture get combined into an actual training loop that improves the model's weights from data. By the end you will have trained the mini keyboard detector for real.

## PyTorch training basics
Training a model is an iterative loop repeated many times:

1. Get a batch of `(inputs, labels)` from the `DataLoader`.
2. Run `inputs` through the model to get predictions (the forward pass).
3. Compare predictions to `labels` with a **loss function** — a single number measuring how wrong the model currently is.
4. Call `.backward()` on the loss to compute gradients of every parameter with respect to that loss (backpropagation, handled automatically by `autograd`).
5. Use an **optimizer** to nudge every parameter slightly in the direction that reduces the loss.
6. Clear old gradients and repeat.

In code, for a classification problem:

```python
import torch
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = KeyboardDetector().to(device)

criterion = nn.CrossEntropyLoss()                       # expects logits + int64 class labels
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(5):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()          # step 6: clear old gradients
        outputs = model(images)        # step 2: forward pass
        loss = criterion(outputs, labels)  # step 3: measure error
        loss.backward()                # step 4: compute gradients
        optimizer.step()               # step 5: update weights

        running_loss += loss.item()
    print(f"epoch {epoch}: loss = {running_loss / len(train_loader):.4f}")
```

`CrossEntropyLoss` is the standard choice for multi-class classification and internally applies softmax to the logits, which is why the model in Unit 4 returns raw logits rather than probabilities. `Adam` is a solid default optimizer — it adapts its own step size per parameter, which usually trains faster and more reliably than plain SGD without hand-tuning the learning rate.

Watch `running_loss` across epochs: a steadily decreasing number means the model is learning; a flat or exploding number means something's wrong (learning rate too high/low, a labeling bug, or a shape mismatch upstream).

## Training the mini keyboard detector project
A complete run needs one more piece: checking performance on the held-out validation split from Unit 3, so you can tell if the model is actually generalizing rather than memorizing:

```python
def evaluate(model, loader, device):
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():           # no gradients needed for evaluation -- saves memory and time
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            predictions = model(images).argmax(dim=1)   # Unit 2's argmax, back in action
            correct += (predictions == labels).sum().item()
            total += labels.size(0)
    return correct / total

for epoch in range(5):
    # ... training loop from above ...
    val_accuracy = evaluate(model, val_loader, device)
    print(f"epoch {epoch}: val accuracy = {val_accuracy:.2%}")
```

`model.train()` and `model.eval()` matter beyond bookkeeping: they toggle the behavior of layers like `Dropout` and `BatchNorm` that behave differently during training and inference. Forgetting `model.eval()` before evaluation is a classic, quietly-wrong-numbers bug.

Once you're satisfied with validation accuracy, save the trained weights so you can reload the model later — for inference in a ROS node, for instance — without retraining:

```python
torch.save(model.state_dict(), "keyboard_detector.pt")

# later, in a different script/process:
model = KeyboardDetector()
model.load_state_dict(torch.load("keyboard_detector.pt", map_location=device, weights_only=True))
model.eval()
```

Note the `weights_only=True` flag: by default `torch.load` can unpickle arbitrary Python objects, which is a real code-execution risk if you ever load a checkpoint file you didn't create yourself. Passing `weights_only=True` restricts loading to tensors and simple data structures, which is all a `state_dict` needs and is the safer default for loading files from outside your own training run.

## Try it yourself
Take the training loop above and deliberately set the learning rate to something too large (`lr=1.0`) and run two epochs. Observe what happens to `running_loss` (it should get worse, not better, or become `nan`). Then set it back to something like `1e-3` and confirm the loss decreases normally again — this is the fastest way to build intuition for why learning rate is the first hyperparameter worth tuning when training misbehaves.
