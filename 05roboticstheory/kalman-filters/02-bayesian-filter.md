# Kalman Filters — Unit 2: Bayesian Filter

The Bayes Filter is the general recursive estimation framework that every filter in this course — Kalman, EKF, UKF, particle — is a special case of. This unit builds it from first principles over a discrete grid, so the predict/update logic is visible before it gets buried in Gaussian algebra in Unit 3.

## The building blocks

A Bayes Filter maintains a **belief** `bel(x)` — a probability distribution over possible states `x` (e.g. "which grid cell is the robot in"). It has two models:

- A **motion model** `p(x_t | x_{t-1}, u_t)`: given the previous state and a control/action `u_t`, how likely is each next state? This model is inherently uncertain — commanding "move forward 1m" doesn't guarantee you end up exactly 1m forward.
- A **sensor model** `p(z_t | x_t)`: given a true state, how likely was the sensor to produce the observed reading `z_t`? This captures sensor noise and ambiguity.

Every cycle alternates two steps:

1. **Prediction** (apply the motion model): spread the belief out according to how the robot moved, which *increases* uncertainty.
2. **Correction / update** (apply the sensor model via Bayes' rule): reweight the belief by how consistent each hypothesis is with the new measurement, which *decreases* uncertainty (assuming the measurement is informative).

## How sensor noise affects predictions

If a sensor were perfect, the update step would collapse the belief onto a single state instantly. Real sensors have a likelihood spread — a lidar range reading of "2.0m" doesn't rule out the true range being 1.9m or 2.1m, just makes them less likely. A narrow, peaked sensor model corrects the belief aggressively; a flat, noisy sensor model barely changes it. This is why sensor calibration (knowing your actual noise characteristics, not assumed ones) matters as much as the filter algorithm itself — an overconfident sensor model makes the filter trust bad data.

## Robot motion under uncertainty

Symmetrically, the motion model should never claim perfect execution. If you command a robot to move 1m forward, model the outcome as a distribution centered near 1m with some spread (wider for slippery floors, tighter for a robot on rails). This is why the prediction step always increases uncertainty (entropy) in the belief — you're less sure where you are right after moving than you were before, until a measurement pulls that uncertainty back down.

## The recursive nature of Bayesian filtering

Critically, the Bayes Filter never needs the full history of controls and measurements — only the previous belief `bel(x_{t-1})`, the latest control `u_t`, and the latest measurement `z_t`. This Markov assumption (the state summarizes everything relevant about the past) is what makes the filter run in constant time per step regardless of how long the robot has been running, instead of growing with history length.

## Implementing a 1D discrete Bayes Filter

Here's a minimal implementation over a 1D grid of positions, with a robot that can only "stay" or "move right":

```python
import numpy as np

N = 20
belief = np.ones(N) / N  # uniform prior: robot could be anywhere

def predict(belief, move, p_correct=0.8):
    """Convolve belief with motion uncertainty (move=+1 shifts right)."""
    new_belief = np.zeros_like(belief)
    for i in range(N):
        new_belief[(i + move) % N] += belief[i] * p_correct
        new_belief[i] += belief[i] * (1 - p_correct)  # didn't fully move
    return new_belief / new_belief.sum()

def update(belief, measurement, landmark_positions, p_hit=0.7, p_miss=0.05):
    """Reweight belief: higher likelihood near cells matching the measurement."""
    likelihood = np.full(N, p_miss)
    for pos in landmark_positions:
        if 0 <= pos < N:
            likelihood[pos] = p_hit
    posterior = belief * likelihood
    return posterior / posterior.sum()

belief = predict(belief, move=1)
belief = update(belief, measurement="near_landmark", landmark_positions=[5, 6])
print(np.round(belief, 3))
```

Run predict/update in a loop and you'll see the flat prior sharpen into peaks near the sensed landmarks — the same qualitative behavior a full Kalman filter produces with Gaussians instead of histograms.

## Try it yourself

Extend the snippet above to run 5 cycles of `predict` (with `move=1` each time) followed by `update` against landmarks at positions `[10, 11]`. Print the belief after each cycle and note how it starts spread out, sharpens near the landmarks once you're close, and then re-spreads slightly with each `predict` before the next `update` pulls it back in — the rhythm every filter in this course follows.
