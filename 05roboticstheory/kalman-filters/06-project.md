# Kalman Filters — Unit 6: Project

This unit is deliberately hands-on: you'll build a small but complete localization pipeline that exercises everything from Units 1-5, on a simulated robot where you control the ground truth and can verify correctness directly.

## What you're building

A 2D differential-drive robot moving through an environment with a few known landmarks. You will:

1. Simulate ground-truth motion and *noisy* odometry (your only continuous input).
2. Simulate *noisy* landmark range measurements, arriving less frequently than odometry.
3. Fuse them with an Extended Kalman Filter tracking `[x, y, theta]`.
4. Compare the EKF's estimate against both raw dead-reckoning and ground truth.

This mirrors the real structure of the `robot_localization` configuration from Unit 4, just written by hand so you see every matrix.

## Step 1 — simulate the world

```python
import numpy as np

np.random.seed(0)
dt = 0.1
landmarks = np.array([[5.0, 5.0], [10.0, 0.0], [0.0, 10.0]])

true_state = np.array([0.0, 0.0, 0.0])   # [x, y, theta]
odom_noise_std = np.array([0.05, 0.05, 0.02])
range_noise_std = 0.3

def step_truth(state, v, omega, dt):
    x, y, theta = state
    return np.array([x + v * np.cos(theta) * dt,
                      y + v * np.sin(theta) * dt,
                      theta + omega * dt])

def noisy_odom(prev_true, new_true):
    delta = new_true - prev_true
    return delta + np.random.normal(0, odom_noise_std)

def noisy_ranges(state):
    x, y, _ = state
    return np.linalg.norm(landmarks - np.array([x, y]), axis=1) + \
           np.random.normal(0, range_noise_std, size=len(landmarks))
```

## Step 2 — track with dead reckoning (the baseline)

Before adding the filter, integrate the noisy odometry directly — this is what you'd get *without* Kalman filtering, and it's the drift you're trying to fix:

```python
dead_reckoned = np.array([0.0, 0.0, 0.0])
```

Accumulate `dead_reckoned += odom_reading` each step and keep it around for comparison — no correction, just integration.

## Step 3 — implement the EKF

Reuse the unicycle Jacobian pattern from Unit 4. The measurement model here is nonlinear (Euclidean distance to each landmark), so you need its Jacobian too:

```python
def h(state, landmark):
    x, y, _ = state
    return np.linalg.norm(landmark - np.array([x, y]))

def jacobian_H(state, landmark):
    x, y, _ = state
    dx, dy = landmark[0] - x, landmark[1] - y
    r = np.hypot(dx, dy)
    return np.array([-dx / r, -dy / r, 0.0])
```

Wire `f`, `jacobian_F` (from Unit 4), `h`, and `jacobian_H` into a predict/update loop: predict once per odometry reading, update once per batch of range readings (looping the scalar update over each landmark, or stacking them into one vector update — either is a valid design choice, and worth trying both).

## Step 4 — run and compare

Drive the simulated robot in a gentle arc (`v=0.5`, `omega=0.15` for 100 steps), feeding odometry to *both* the dead-reckoning accumulator and the EKF predict step, and feeding range readings to the EKF update step every 5 steps. Track three trajectories: `true_state`, `dead_reckoned`, and the EKF's `x`. At the end, compute the final position error for each against ground truth:

```python
error_dead_reckoning = np.linalg.norm(true_state[:2] - dead_reckoned[:2])
error_ekf = np.linalg.norm(true_state[:2] - x[:2])
print(f"dead reckoning error: {error_dead_reckoning:.3f} m")
print(f"EKF error:            {error_ekf:.3f} m")
```

## Success criteria

- The EKF's final position error should be substantially smaller than dead reckoning's — usually several times smaller, since dead reckoning has no mechanism to correct accumulated drift.
- The EKF's covariance `P` should shrink after each update and grow after each predict, matching the qualitative behavior from every earlier unit.
- If you reduce the landmark-update frequency (update every 20 steps instead of 5), the EKF error should get noticeably worse — direct evidence that measurement updates, not just the motion model, are what keeps the estimate anchored to reality.

## Stretch goals

- Swap the EKF for a particle filter (Unit 5) tracking the same `[x, y, theta]` state and range measurements, and compare accuracy and runtime.
- Introduce a single bad odometry reading (a large spike) partway through and observe how the EKF partially absorbs it versus how badly dead reckoning is thrown off.
- Port the simulation loop into a real ROS 2 node publishing `nav_msgs/Odometry`, and cross-check your hand-rolled EKF's output against `robot_localization`'s `ekf_node` configured with equivalent noise parameters.

## Try it yourself

Complete Steps 1-4 end to end and print the two final error numbers. Then answer, in your own words in a comment: under what conditions would you expect dead reckoning to actually *beat* the EKF? (Hint: think about what happens if your range-noise assumption in `R` is wrong — too small relative to the sensor's real noise.)
