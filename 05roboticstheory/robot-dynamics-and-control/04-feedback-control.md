# Robot Dynamics and Control — Unit 4: Feedback Control

With a dynamic model in hand (Unit 3), this unit builds a full-state feedback controller — the technique behind balancing robots, from simple inverted pendulums to segway-style mobile bases and walking robots recovering from a push.

## Why balancing is different from tracking
Units in a typical PID-control course (see the Robot Control Basics course) deal with tracking a commanded setpoint on an inherently stable joint — let go of the joint and it just stays put (or droops under gravity, but doesn't run away). A balancing system is different: it's an *unstable* equilibrium. An inverted pendulum standing straight up, or a two-wheeled robot balancing on its wheels, will fall over faster and faster if left uncontrolled — small errors grow rather than decay. Full state feedback is the standard way to stabilize this kind of system: instead of reacting to just one error signal (position), you feed back the *entire* state (every position and velocity that matters) to compute a control action that actively counteracts the instability.

## Linearizing the dynamics around the balance point
`M(q)*q_ddot + C(q,q_dot)*q_dot + G(q) = tau` from Unit 3 is nonlinear, but near a specific operating point (e.g., the pendulum exactly upright, `q = pi`, `q_dot = 0`) you can approximate it with a linear state-space model:

```
x_dot = A*x + B*u
```

where `x = [q - q_eq, q_dot]` (deviation of state from the equilibrium) and `u = tau`. You get `A` and `B` by taking partial derivatives of the nonlinear dynamics with respect to state and input, evaluated at the equilibrium — for a 1-link inverted pendulum this is a small enough system to do by hand; for anything bigger, symbolic tools (SymPy) or automatic differentiation handle it. This linear model is only valid *near* the equilibrium — it's why balancing controllers work well for small disturbances and fail if the system tips too far.

## Full state feedback and pole placement
A full-state feedback control law is simply:

```
u = -K @ x
```

where `K` is a gain matrix (row vector, for a single-input system) you choose. Substituting into the linear model gives `x_dot = (A - B@K) * x` — the closed-loop system. Choosing `K` well means choosing where the eigenvalues ("poles") of `A - B@K` land: negative real parts mean the deviation `x` decays back to zero (stable balance), and how far negative controls how fast. For a system that's both *controllable* (checkable with `numpy.linalg.matrix_rank` on the controllability matrix `[B, A@B, A@A@B, ...]`) you can place the closed-loop poles anywhere you like, e.g. with `scipy.signal.place_poles`.

## LQR as a principled alternative to hand-picked poles
Picking poles by hand works for a 1-2 state system but gets unwieldy fast. The Linear Quadratic Regulator (LQR) instead asks you to specify *costs* — how much you care about state error (`Q` matrix) versus control effort (`R` matrix) — and solves for the `K` that minimizes total cost over time, via the algebraic Riccati equation:

```python
import numpy as np
from scipy.linalg import solve_continuous_are

def lqr_gain(A, B, Q, R):
    P = solve_continuous_are(A, B, Q, R)
    K = np.linalg.inv(R) @ B.T @ P
    return K
```

Larger entries in `Q` relative to `R` produce a more aggressive controller (bigger, faster corrections, more control effort); larger `R` relative to `Q` produces a gentler one. LQR is the most common way full-state feedback gains are actually chosen in practice, precisely because "how much do I weight error vs. effort" is a much more intuitive design knob than "where do I want my poles."

## Try it yourself
Linearize the 1-link pendulum from Unit 3's worked example around the *upright* equilibrium (`q = pi`, i.e. `sin(q) ≈ -(q - pi)` for small deviations) to get `A` and `B` for `x = [q - pi, q_dot]`. Use `lqr_gain` with `Q = np.diag([10, 1])` and `R = np.array([[1]])` to compute `K`, then simulate the closed-loop system (`tau = -K @ x`) starting from a small deviation like `q = pi + 0.2`. Confirm the pendulum returns to upright instead of falling — then try starting from `q = pi + 1.5` (well outside the small-angle regime) and observe where the linear approximation starts to break down.
