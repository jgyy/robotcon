# Kalman Filters in ROS 2 — Unit 4: Extended Kalman Filter and Unscented Kalman Filter

The Kalman filter from Unit 3 assumes motion and measurement models are *linear* (`x = F x`, `z = H x`). Almost no real mobile robot satisfies that: a differential-drive robot's heading turns its linear velocity into nonlinear x/y motion. This unit covers the two standard fixes — EKF and UKF — and the ROS 2 package that implements both for you in practice.

## Why linear Kalman filters aren't enough

For a unicycle/diff-drive robot, the motion model is `x' = x + v cos(θ) dt`, `y' = y + v sin(θ) dt`, `θ' = θ + ω dt`. The `cos`/`sin` terms make this nonlinear in `θ`. Feed a nonlinear model through the linear Kalman equations and the Gaussian-stays-Gaussian guarantee breaks — the true posterior can become a curved, non-Gaussian shape that a single mean/covariance pair fits poorly. EKF and UKF are two different strategies for coping with exactly this.

## The Extended Kalman Filter: linearize locally

The EKF's trick: at each timestep, replace the nonlinear function with its best *local* linear approximation — the Jacobian, i.e. the matrix of partial derivatives evaluated at the current estimate — and then run the ordinary linear Kalman equations with that Jacobian standing in for `F` (or `H`).

For the unicycle model above, the motion Jacobian with respect to state `(x, y, θ)` is:

```
F = [ 1  0  -v sin(θ) dt ]
    [ 0  1   v cos(θ) dt ]
    [ 0  0        1      ]
```

Similarly, if your measurement model is nonlinear (e.g. a range-bearing sensor reporting distance and angle to a landmark instead of raw x/y), you compute a separate Jacobian `H` for the measurement function. With both Jacobians in hand, predict and correct are the *same* matrix equations from Unit 3 — the only change is `F` and `H` are recomputed every step from the current state estimate rather than staying constant:

```python
def ekf_predict(x, P, motion_fn, jacobian_F, u, dt, Q):
    F = jacobian_F(x, u, dt)
    x_new = motion_fn(x, u, dt)     # nonlinear model applied exactly, not linearized
    P_new = F @ P @ F.T + Q         # covariance still propagated via the linear approximation
    return x_new, P_new

def ekf_correct(x, P, z, measurement_fn, jacobian_H, R):
    H = jacobian_H(x)
    y = z - measurement_fn(x)       # innovation, using the true nonlinear measurement model
    S = H @ P @ H.T + R
    K = P @ H.T @ np.linalg.inv(S)
    x_new = x + K @ y
    P_new = (np.eye(len(x)) - K @ H) @ P
    return x_new, P_new
```

The EKF is the workhorse of real robot localization because it's cheap and "good enough" when the robot doesn't turn too sharply between updates. Run this loop in simulation and watch it localize a diff-drive robot fusing odometry (motion model) with a landmark or lidar-scan-match measurement.

## The Unscented Kalman Filter: sample instead of linearize

The UKF takes a different approach: instead of computing a Jacobian analytically, it picks a small, deterministic set of representative points around the current estimate (**sigma points**), pushes each one through the *exact* nonlinear function, then reconstructs a Gaussian from the resulting spread. No derivatives required, and it captures curvature that a first-order Jacobian approximation misses. Predict and correct both work the same way: generate sigma points from the current `(x, P)`, propagate each through the nonlinear model or measurement function, then recombine (weighted mean and covariance) into the new `(x, P)`. In practice, UKF tends to outperform EKF for strongly nonlinear models at a modest extra computational cost, and it avoids the error-prone step of hand-deriving Jacobians.

## Using the robot_localization package

You rarely hand-roll EKF/UKF for production ROS 2 code — `robot_localization` provides tuned, tested `ekf_node` and `ukf_node` implementations that subscribe to any number of odometry, IMU, and pose sources and publish one fused estimate. Configuration lives in a YAML file, not code:

```yaml
ekf_filter_node:
  ros__parameters:
    frequency: 30.0
    odom0: /wheel_odom
    odom0_config: [true, true, false, false, false, true,   # x, y, z, roll, pitch, yaw
                   false, false, false, false, false, true,  # vx, vy, vz, vroll, vpitch, vyaw
                   false, false, false]
    imu0: /imu/data
    imu0_config: [false, false, false, false, false, false,
                  false, false, false, false, false, true,
                  true, false, false]
```

Each `*_config` array is a boolean mask telling the filter which state variables that sensor actually informs — this is `H` for that sensor, expressed declaratively instead of as a matrix. Launch it with `ros2 launch robot_localization ekf.launch.py` (or your own launch file wrapping the node) and watch the fused output on `/odometry/filtered`.

## Try it yourself

Take the diff-drive motion Jacobian above and implement `ekf_predict`/`ekf_correct` for a robot with state `(x, y, θ)`, fusing constant-velocity motion commands with occasional noisy `(x, y)` position measurements. Compare the trajectory against running the *linear* Kalman filter from Unit 3 on the same data (pretending motion were linear) — the EKF should track a curved path noticeably better once the robot turns.
