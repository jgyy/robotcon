# Robot Control Basics — Unit 6: Final Project

This unit ties together everything from the course — dynamics-aware control (Unit 4's inverse dynamics) and kinematics (inverse kinematics, introduced here) — into a single guided project: making the 2DOF arm's end-effector follow a path defined in Cartesian space rather than joint space.

## Introduction to the final project
So far, every trajectory and setpoint you've worked with has been specified directly in joint angles (`q_desired`). Real tasks are almost always specified in the world/task frame instead — "move the end-effector along this line," "trace this circle" — which means you need to convert a Cartesian-space target into joint angles before any of the joint-space controllers from earlier units can track it. That conversion is inverse kinematics (IK), and combining it with inverse dynamics control (Unit 4) is exactly the standard architecture used in real manipulator controllers: an outer IK layer converts task-space goals into joint-space setpoints, and an inner inverse-dynamics-plus-PD loop tracks those setpoints against the real (nonlinear, coupled) dynamics.

## Inverse kinematics
For the 2-link planar arm, forward kinematics gives the end-effector position from joint angles:

```
x = l1*cos(q1) + l2*cos(q1+q2)
y = l1*sin(q1) + l2*sin(q1+q2)
```

Inverse kinematics solves the reverse problem — given a desired `(x, y)`, find `(q1, q2)`. For this 2-link case there's a closed-form solution using the law of cosines:

```python
import numpy as np

def ik_2link(x, y, l1, l2, elbow_up=True):
    d = (x**2 + y**2 - l1**2 - l2**2) / (2 * l1 * l2)
    d = np.clip(d, -1.0, 1.0)               # guard against unreachable targets
    q2 = np.arccos(d) if elbow_up else -np.arccos(d)
    q1 = np.arctan2(y, x) - np.arctan2(l2 * np.sin(q2), l1 + l2 * np.cos(q2))
    return q1, q2
```

Two solutions exist for most reachable `(x, y)` points ("elbow up" and "elbow down") because two different arm configurations can place the end-effector at the same spot — the sign of `q2` picks between them. Points outside the reachable annulus (too far, or inside the minimum reach) make the `arccos` argument fall outside `[-1, 1]`, which is why the clip guard is there; in a real controller you'd reject or clamp such targets before commanding the arm rather than silently clipping the math.

## Project: closing the loop
Put the full pipeline together:
1. Define a Cartesian path — e.g., a straight line or small circle for the end-effector to trace — as a sequence of `(x(t), y(t))` waypoints, generated smoothly over time the way Unit 3 generated joint-space LSPB trajectories (you can reuse LSPB per Cartesian axis, or a simple `cos`/`sin` parameterization for a circle).
2. At each timestep, convert `(x(t), y(t))` to `(q1(t), q2(t))` via `ik_2link`.
3. Differentiate (numerically or analytically) to get `q_dot_desired(t)` and `q_ddot_desired(t)` as feedforward references — or approximate by finite-differencing consecutive IK solutions if an analytical derivative is inconvenient.
4. Feed `(q_desired, q_dot_desired, q_ddot_desired)` into the `inverse_dynamics_torque` controller from Unit 4 at every control cycle.
5. Simulate (or run against real hardware) and plot the actual end-effector path against the commanded path to check tracking accuracy.

This is the complete controls stack of the course in miniature: task-space target -> IK -> joint-space trajectory -> model-based torque control -> real (simulated) dynamics -> measured joint state fed back into the next control cycle.

## Conclusions
The final project connects a task specified the way a human would naturally give it (a path in space) to the low-level torque commands a real actuator needs, using every major idea from the course: PID feedback (Unit 2), trajectory smoothing (Unit 3), model-based multivariable control (Unit 4), and — if you extend the project — force-based contact behavior at the end of the path (Unit 5). This is genuinely representative of how a real robot arm controller is structured, just at a scale (2 links, planar) you can fully derive and verify by hand.

## Try it yourself
Implement the full pipeline above for a circular path of radius 0.1 m centered at a reachable point, traced over 4 seconds. Run it once with plain PD control (no dynamics compensation) and once with the inverse-dynamics controller from Unit 4, both against the same simulated 2-link arm dynamics. Compare the tracking error (distance between commanded and actual end-effector position over time) between the two — the gap you see is the practical payoff of everything this course covered.
