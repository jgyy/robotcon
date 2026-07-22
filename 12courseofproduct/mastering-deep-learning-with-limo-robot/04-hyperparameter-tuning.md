# Mastering Deep Learning with LIMO-Robot — Unit 4: Hyperparameter Tuning

A network that compiles and runs `.fit()` without errors is not the same as a network that has actually learned something useful. This unit covers the hyperparameters that control training, how to organize your data so you can honestly measure performance, and the techniques that turn a mediocre model into a good one.

## Hyperparameters versus parameters

**Parameters** (weights, biases) are learned automatically by gradient descent. **Hyperparameters** are everything you choose before training starts and that gradient descent cannot optimize for you: the learning rate, batch size, number of epochs, number and width of layers, choice of activation function, choice of optimizer, and regularization strength. Getting these right is mostly empirical — you train, measure, and adjust.

- **Learning rate** — too high and training diverges or oscillates; too low and training crawls or gets stuck. `adam` with its default (0.001) is a reasonable starting point; if loss is jumpy, lower it.
- **Batch size** — how many examples are averaged before one gradient update. Small batches (16-32) give noisier but more frequent updates; large batches are smoother but need more memory and sometimes generalize slightly worse.
- **Epochs** — one full pass over the training set. More isn't automatically better — see overfitting below.

## Organizing data: train, validation, test

Never train and evaluate on the same data — a model can memorize its training set and still fail completely on new inputs. The standard split:

- **Train** — what the optimizer sees and adjusts weights against.
- **Validation** — held out during training, checked after every epoch to monitor generalization and to make tuning decisions (which architecture, which learning rate).
- **Test** — touched exactly once, at the very end, to report final performance. If you tune based on test results, it silently becomes a second validation set and stops being a fair measure.

```python
from sklearn.model_selection import train_test_split

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
```

Also normalize your features (e.g., scale sensor readings to roughly [0, 1] or zero mean/unit variance) before training — unnormalized inputs with wildly different scales slow convergence and can destabilize it.

## Reading the loss curve: underfitting vs overfitting

```python
history = model.fit(X_train, y_train, epochs=50, batch_size=32,
                     validation_data=(X_val, y_val), verbose=0)

import matplotlib.pyplot as plt
plt.plot(history.history["loss"], label="train")
plt.plot(history.history["val_loss"], label="val")
plt.legend(); plt.xlabel("epoch"); plt.ylabel("loss")
```

Three patterns to recognize: both curves still falling at the end → **underfit**, train more or use a bigger model. Train loss keeps falling while validation loss rises → **overfitting**, the model is memorizing. Both curves flat and high → the model, learning rate, or data itself has a problem worth investigating before tuning further.

## Techniques to fight overfitting

- **Dropout** — randomly zeroes a fraction of activations each training step, forcing the network not to rely on any single neuron.
- **L2 regularization** — penalizes large weights, added via `kernel_regularizer=keras.regularizers.l2(0.001)` on a `Dense` layer.
- **Early stopping** — stop training automatically when validation loss stops improving, restoring the best weights seen:

```python
early_stop = keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=5, restore_best_weights=True)
model.fit(X_train, y_train, epochs=200, validation_data=(X_val, y_val),
          callbacks=[early_stop], verbose=0)
```

- **Learning rate schedules** — reduce the learning rate when progress stalls, via `keras.callbacks.ReduceLROnPlateau`.

## Try it yourself

Take the regression model from Unit 2 (or 3) and deliberately overfit it: use a small training set (~100 examples), a large network (e.g. `[256, 256, 256]`), no dropout, and 300 epochs. Plot the loss curves and confirm you see the overfitting pattern. Then add `Dropout(0.3)` after each hidden layer and an `EarlyStopping` callback with `patience=10`, retrain, and confirm the gap between train and validation loss shrinks.
