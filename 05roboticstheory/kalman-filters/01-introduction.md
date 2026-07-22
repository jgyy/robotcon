# Kalman Filters — Unit 1: Introduction

This unit sets up the problem this whole course exists to solve — knowing where a robot actually is — and gives you a first taste of the machinery (Bayesian reasoning, Gaussians, recursive estimation) before the math gets formal in later units.

## The localization problem

A robot never has direct access to its own position. It only has proprioceptive sensors (wheel encoders, IMUs) that tell it roughly how it has moved, and exteroceptive sensors (lidar, cameras, GPS) that tell it roughly what it sees. Both are noisy. Wheel odometry drifts because of wheel slip and quantization error; a lidar scan match can be ambiguous in a symmetric corridor; GPS can jump meters between fixes. If you simply integrate wheel velocities over time (dead reckoning), the position estimate's error grows without bound.

The core idea this course builds toward: instead of trusting any single sensor, treat the robot's position as a **probability distribution** — a belief — and update that belief every time you get new information, whether that information comes from motion (which increases uncertainty) or from a measurement (which decreases it, if it agrees with what you expected). A Kalman filter is a specific, closed-form, computationally cheap way to carry that belief forward when it can be approximated as a Gaussian.

## Why not just trust the sensors directly?

Consider a robot with only wheel odometry: after a few minutes of driving, its estimated position can be off by meters. Add a lidar or GPS fix and you could snap to that instead, but sensor readings arrive at different rates, have different noise characteristics, and sometimes glitch (a GPS multipath reflection, a lidar seeing through a glass door). Fusing sources properly — weighting each by how much you currently trust it — consistently outperforms trusting any one source alone. That fusion problem, formalized, is what Bayesian and Kalman filtering give you a rigorous answer to.

## A first taste: fusing two noisy estimates

Before any formal derivation, here's the intuition in code. Suppose you have two independent noisy estimates of the same 1D position, each with a known variance — this is the same weighted-averaging idea a Kalman filter update performs internally:

```python
def fuse(mean1, var1, mean2, var2):
    """Combine two Gaussian estimates into one, weighted by confidence (inverse variance)."""
    new_var = 1.0 / (1.0 / var1 + 1.0 / var2)
    new_mean = new_var * (mean1 / var1 + mean2 / var2)
    return new_mean, new_var

# odometry says x=2.0m (uncertain, var=0.5); lidar says x=2.3m (more confident, var=0.1)
mean, var = fuse(2.0, 0.5, 2.3, 0.1)
print(f"fused estimate: x={mean:.3f} m, var={var:.3f}")
```

Notice the fused variance is *smaller* than either input variance — combining two independent, imperfect measurements always increases confidence. That single fact is the seed the rest of this course grows from.

## Course roadmap

- **Unit 2 — Bayesian Filter**: the general recursive predict/update framework, expressed first over discrete probability grids (histograms), so you see the mechanics without Gaussian math getting in the way.
- **Unit 3 — Kalman Filters**: the closed-form Gaussian special case — first in 1D, then generalized to vectors and matrices for real robot state (position, velocity, heading).
- **Unit 4 — EKF and UKF**: what happens when your motion or sensor model isn't linear (almost always true for real robots), and the two standard fixes.
- **Unit 5 — Particle Filter**: dropping the Gaussian assumption entirely for cases where the belief is multimodal (e.g. "I might be in this hallway or that one").
- **Unit 6 — Project**: put it together into a working localization pipeline.

## Try it yourself

Extend the `fuse` function above into a small loop: start with a prior estimate `(mean=0.0, var=1.0)`, then fuse in three more noisy "measurements" of your choosing (pick different means and variances) one at a time, printing the running estimate after each. Watch the variance shrink monotonically — you've just built the update half of a Kalman filter by hand.
