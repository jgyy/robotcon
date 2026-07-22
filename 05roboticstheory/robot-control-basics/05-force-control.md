# Robot Control Basics — Unit 5: Force Control

Every controller so far has controlled *position* — where is the end-effector, and how do we get it to a target pose. Many real tasks (assembly, polishing, deburring, human interaction) actually need to control *force* — how hard the end-effector pushes against something — often while accepting whatever position results from that contact. This unit introduces the geometric tool (the Jacobian) needed to relate joint torques to end-effector force, then builds a basic force controller.

## Jacobian of the manipulator
The manipulator Jacobian `J(q)` is the matrix that relates joint velocities to end-effector velocity: `x_dot = J(q) @ q_dot`, where `x_dot` is the end-effector's linear (and angular, if included) velocity. It's the same matrix that shows up in differential/inverse kinematics, but here we use its other key property: by the principle of virtual work, the *transpose* of the Jacobian relates end-effector force to the equivalent joint torques:

```
tau = J(q).T @ F
```

where `F` is the desired force (and torque, if 6D) the end-effector should apply to the environment. Intuitively: whatever generalized joint torque vector `tau` would be needed to move the end-effector infinitesimally in the direction of `F` is exactly the torque vector that produces `F` at the end-effector when the end-effector is in contact and not moving. For a 2-link planar arm with link lengths `l1`, `l2`, the (linear-velocity) Jacobian is:

```python
import numpy as np

def jacobian_2link(q1, q2, l1, l2):
    return np.array([
        [-l1*np.sin(q1) - l2*np.sin(q1+q2), -l2*np.sin(q1+q2)],
        [ l1*np.cos(q1) + l2*np.cos(q1+q2),  l2*np.cos(q1+q2)],
    ])
```

## Force control
A basic explicit force controller measures the actual contact force `F_measured` (typically from a wrist-mounted force/torque sensor) and drives it toward a desired force `F_desired` using feedback, then maps that force command through `J.T` into joint torques:

```python
def force_pid_torque(J, F_desired, F_measured, integral_state, Kp_f, Ki_f, dt):
    error = F_desired - F_measured
    integral_state += error * dt
    F_command = Kp_f * error + Ki_f * integral_state
    tau = J.T @ (F_desired + F_command)   # feedforward desired force + feedback correction
    return tau, integral_state
```

This is structurally identical to the PID loops from Unit 2 — proportional-integral feedback on an error signal — just applied to force instead of position, and mapped through `J.T` instead of applied directly as joint torque. A subtlety worth knowing about even if you don't implement it here: pure explicit force control like this works along the direction of desired contact, but real tasks often need force control in some directions (e.g., pushing into a surface) and position control in others (e.g., sliding along it) simultaneously — this is called hybrid position/force control, and impedance control is a related alternative that controls the relationship between position error and force rather than commanding either purely.

## Exercise: the 5000 Newtons
Consider a scenario used to make the saturation/safety issue concrete: you naively command a `F_desired` of 5000 N against a rigid, immovable wall. Because the wall doesn't move, position-based reasoning breaks down (the arm "wants" to keep pushing to close a position error that can never close), and if your torque or current limits aren't enforced, this is exactly the situation that breaks hardware or hurts people. Working through this scenario numerically — command a large `F_desired`, compute `tau = J.T @ F_desired`, and compare against your actuators' rated torque limits — is the fastest way to internalize why every real force controller needs explicit torque/force saturation and, ideally, a compliant (not perfectly rigid) response near the limits.

## Conclusions
Force control reuses the same feedback-control building blocks (PID, from Unit 2) but changes the controlled variable from joint position to end-effector force, using the Jacobian transpose to convert between the two. The core danger unique to force control is the lack of a natural "stop" the way position control has — an immovable obstacle doesn't clip a runaway force command the way a joint limit clips a runaway position command, so torque/force saturation is not optional.

## Try it yourself
Using `jacobian_2link` above, pick a pose (`q1 = 30 deg`, `q2 = 45 deg`) and compute the joint torques needed to apply a horizontal force of `F = [10, 0]` N at the end-effector via `tau = J.T @ F`. Then add a hard clamp — `tau = np.clip(tau, -tau_max, tau_max)` — with a realistic `tau_max`, and find the largest force you can actually command at that pose before saturating. This is a miniature version of the "5000 Newtons" exercise.
