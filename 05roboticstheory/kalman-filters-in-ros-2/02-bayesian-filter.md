# Kalman Filters in ROS 2 — Unit 2: Bayesian Filter

Before Kalman filters, you need the Bayes filter — the general recursive framework that every filter in this course (Kalman, EKF, UKF, particle) is a special case of. This unit builds it from scratch over a simple 1D grid world so you see the mechanics without any Gaussian math getting in the way yet.

The diagram below traces one cycle of the predict/correct loop that this unit implements over a discrete belief array.

```mermaid
flowchart TD
    B[bel(x): current belief array] --> P[Predict: convolve with motion_kernel]
    P --> B2[Spread-out belief]
    B2 --> C[Correct: multiply by likelihood, renormalize]
    C --> B3[Sharpened belief]
    B3 -->|next motion + reading| P
```

## What is a Bayes Filter?

A Bayes filter maintains a **belief**: a full probability distribution over where the robot might be, `bel(x)`, instead of a single point estimate. Every time step, it does exactly two things, in order:

1. **Predict** — the robot moves, so smear the belief forward through the motion model. Motion always *adds* uncertainty.
2. **Correct** — a sensor reports something, so reweight the belief by how consistent each possible state is with that reading. Measurements always *remove* uncertainty (assuming the sensor isn't lying).

Represented as a discrete grid over possible positions, a belief is just an array of probabilities that sums to 1:

```python
import numpy as np

# 10 possible positions along a hallway, uniform prior: robot could be anywhere
belief = np.ones(10) / 10
```

## The correct step: updating belief from a sensor reading

Suppose a door sensor fires and you know doors exist at positions 2 and 7. The sensor is imperfect — it's right 80% of the time. The correct step multiplies each entry of the belief by how likely that reading is *given* the robot were at that position, then renormalizes:

```python
def correct(belief, likelihood):
    posterior = belief * likelihood
    return posterior / posterior.sum()

# sensor says "at a door"; positions 2 and 7 are far more consistent with that reading
likelihood = np.array([0.2, 0.2, 0.8, 0.2, 0.2, 0.2, 0.2, 0.8, 0.2, 0.2])
belief = correct(belief, likelihood)
```

This is Bayes' rule applied directly: `posterior ∝ likelihood × prior`. Real sensor noise is what makes `likelihood` a soft distribution instead of a hard 0/1 mask — a perfect sensor would collapse belief to a single spike in one update, but real sensors never let you do that safely.

## The predict step: propagating belief through motion

If the robot then commands "move one step right," you can't just shift the belief array by one index — real motion is noisy (wheel slip, timing jitter), so the belief also spreads out. This is a convolution of the current belief with the motion's own probability distribution (e.g. 80% chance you moved exactly one step, 10% chance zero steps, 10% chance two steps):

```python
def predict(belief, motion_kernel):
    n = len(belief)
    new_belief = np.zeros(n)
    for i, p in enumerate(belief):
        for offset, prob in motion_kernel.items():
            new_belief[(i + offset) % n] += p * prob
    return new_belief

motion_kernel = {0: 0.1, 1: 0.8, 2: 0.1}
belief = predict(belief, motion_kernel)
```

Notice this predict step is mathematically the *sum* of shifted, scaled copies of the belief — one copy per possible motion outcome. That "predict = sum of probability density functions" framing is exactly what generalizes to continuous Gaussians in Unit 3.

## Putting it together: the predict/correct loop

A Bayes filter is just this pair of steps applied over and over as the robot moves and senses:

```python
for motion, sensor_reading in zip(commanded_motions, sensor_readings):
    belief = predict(belief, motion_kernel)
    belief = correct(belief, sensor_model(sensor_reading))
```

The real strength shows up over many iterations, not one: a single noisy reading barely moves the belief, but a sequence of consistent motion + measurement pairs sharpens it into a confident spike, even though every individual odometry step and every individual sensor reading was noisy on its own. This is the same loop you'll later see running continuously inside a ROS 2 node subscribed to `/odom` and `/scan`.

## Try it yourself

Extend the loop above to run for 5 iterations on a 10-cell hallway, alternating `predict` and `correct` with the `motion_kernel` and `likelihood` arrays given. Print `belief.round(2)` after each correct step. Confirm the peak sharpens over time even though no single measurement is perfectly reliable — that's the recursive gain a Bayes filter gives you for free.
