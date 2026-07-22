# Kalman Filters — Unit 4: Extended Kalman Filter and Unscented Kalman Filter

The standard Kalman filter from Unit 3 requires linear motion and measurement models. Real robots almost never satisfy that — a differential-drive robot's heading turns `cos`/`sin` into the motion model, and range-bearing sensors involve `atan2` and square roots. This unit covers the two standard ways to keep using Kalman-style filtering anyway.

## Why nonlinearity breaks the Kalman filter

The Kalman filter's exactness relies on a Gaussian passed through a *linear* function staying Gaussian. Push a Gaussian through a nonlinear function (like a rotation by an uncertain angle) and the result is generally *not* Gaussian — it can skew, curve, or develop multiple lobes. If you naively apply the linear KF equations anyway, the mean and covariance estimates become biased and can diverge, especially under large uncertainty or strong nonlinearity (sharp turns, close-range bearing measurements).

## Extended Kalman Filter (EKF): linearize around the estimate

The EKF's fix is to locally approximate the nonlinear function with its **first-order Taylor expansion** (its Jacobian) evaluated at the current state estimate, then run the ordinary linear KF equations using that Jacobian in place of `F` or `H`.

- Motion model `x' = f(x, u)` → Jacobian `F = ∂f/∂x` evaluated at the current estimate.
- Measurement model `z = h(x)` → Jacobian `H = ∂h/∂x` evaluated at the predicted state.

```python
import numpy as np

def f(x, u, dt):
    # unicycle model: x = [px, py, theta]; u = [v, omega]
    px, py, theta = x
    v, omega = u
    return np.array([px + v * np.cos(theta) * dt,
                      py + v * np.sin(theta) * dt,
                      theta + omega * dt])

def jacobian_F(x, u, dt):
    _, _, theta = x
    v, _ = u
    return np.array([[1, 0, -v * np.sin(theta) * dt],
                      [0, 1,  v * np.cos(theta) * dt],
                      [0, 0, 1]])

x = np.array([0.0, 0.0, 0.0])
P = np.eye(3) * 0.1
u = np.array([0.5, 0.2])   # v=0.5 m/s, omega=0.2 rad/s
dt = 0.1
Q = np.diag([0.01, 0.01, 0.005])

x_pred = f(x, u, dt)
F = jacobian_F(x, u, dt)
P_pred = F @ P @ F.T + Q
```

The update step follows the same pattern with `H = ∂h/∂x`. The EKF is cheap and works well when the state estimate is already reasonably accurate (so the linearization point is close to the truth) — but the approximation degrades under large uncertainty or highly nonlinear dynamics, and computing Jacobians by hand is error-prone for complex models.

## Unscented Kalman Filter (UKF): sample instead of linearize

The UKF avoids computing Jacobians entirely. Instead, it deterministically picks a small set of representative points around the current estimate — **sigma points** — spaced according to the current covariance, pushes each one through the *actual* nonlinear function `f` or `h` (no linear approximation), and then reconstructs a Gaussian (mean and covariance) from the transformed points via weighted statistics. This captures the mean and covariance of a nonlinearly-transformed Gaussian to (at least) second order — more accurate than the EKF's first-order approximation — while sidestepping the need to derive and code Jacobians by hand. The tradeoff is more function evaluations per step (typically `2n+1` sigma points for an `n`-dimensional state).

Rule of thumb: reach for the UKF when your model is highly nonlinear, when Jacobians are painful to derive/maintain, or when you've observed the EKF diverging; reach for the EKF when the model is mildly nonlinear, Jacobians are easy, and you want the cheaper computation.

## Using the `robot_localization` package

Rather than hand-writing EKF/UKF math for every robot, ROS provides the [`robot_localization`](https://docs.ros.org/en/rolling/p/robot_localization/) package, which implements both an `ekf_node` and a `ukf_node`. You configure it via YAML to fuse an arbitrary number of odometry, IMU, and pose sources, declaring per-sensor which state variables (x, y, z, roll, pitch, yaw, and their velocities/accelerations) each sensor contributes:

```yaml
ekf_filter_node:
  ros__parameters:
    frequency: 30.0
    two_d_mode: true
    odom0: /wheel/odometry
    odom0_config: [true,  true,  false,
                   false, false, true,
                   true,  false, false,
                   false, false, true,
                   false, false, false]
    imu0: /imu/data
    imu0_config: [false, false, false,
                  true,  true,  true,
                  false, false, false,
                  true,  true,  true,
                  true,  true,  false]
```

Run it, then inspect the fused estimate like any other topic:

```bash
ros2 run robot_localization ekf_node --ros-args --params-file ekf.yaml
ros2 topic echo /odometry/filtered
```

This is the practical payoff of everything above: you rarely hand-roll EKF matrix code for a full robot state in production — you configure `robot_localization` and let it apply exactly the predict/update cycle you just learned.

## Try it yourself

Take the unicycle `f`/`jacobian_F` code above and run 10 prediction steps with a fixed `u = [0.5, 0.3]` and `dt = 0.1`, printing `x_pred` and the diagonal of `P_pred` each step (no updates — just repeated predicts). Confirm that positional uncertainty grows faster along the direction of travel than perpendicular to it once `theta` has rotated away from zero — a direct consequence of the Jacobian depending on the current heading.
