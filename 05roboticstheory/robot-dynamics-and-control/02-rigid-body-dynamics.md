# Robot Dynamics and Control — Unit 2: Rigid Body Dynamics

Every robot link, no matter how it's connected to its neighbors, is (to a good approximation) a rigid body. This unit works through Newton's and Euler's laws for a single rigid body in 3D space — the physics vocabulary that Unit 3 assembles into full manipulator dynamics.

The flowchart below shows the two-pass recursive Newton-Euler algorithm this unit builds toward, used to compute joint torques for a chain of rigid links.

```mermaid
flowchart LR
    Q["Known: q, q_dot, q_ddot<br/>for each joint"] --> OUT["Outward recursion<br/>base -> tip: propagate velocities & accelerations"]
    OUT --> NE["Apply Newton-Euler per link<br/>F = m*a, tau = I*alpha + omega x (I*omega)"]
    NE --> IN["Inward recursion<br/>tip -> base: propagate forces & torques"]
    IN --> TAU["Joint torques tau"]
```

## Newton's second law for translation
For a rigid body's center of mass, Newton's second law is exactly what you remember from introductory physics:

```
F = m * a          (F, a are 3D vectors; m is scalar mass)
```

The subtlety in robotics is that `F` is usually the *net* of several forces acting at different points — gravity at the center of mass, a contact force at a fingertip, a joint reaction force at the connection to the previous link — and you have to resolve all of them into a common reference frame before summing. Getting reference frames consistent (which frame is a vector expressed in, and how do you rotate a vector from one frame to another) is the single most common source of bugs in dynamics code, more than any conceptual error.

## Rotational motion: torque and angular momentum
The rotational analog of `F = m*a` is:

```
tau = I * alpha + omega x (I * omega)
```

where `I` is the body's 3x3 inertia tensor (about its center of mass, expressed in a body-fixed frame), `omega` is angular velocity, `alpha` is angular acceleration, and `tau` is net torque. The cross-product term `omega x (I*omega)` is the gyroscopic/Coriolis-like coupling between rotation axes — it's zero for rotation about a principal axis of a symmetric body, and it's exactly why a spinning body that isn't perfectly symmetric wobbles even with no applied torque. For most robot links you'll either look up or compute `I` from the link's mass distribution (CAD tools and URDF files typically provide it directly as an `<inertial>` block).

## Newton-Euler equations for a rigid body
Putting translation and rotation together gives the Newton-Euler equations, the standard pair used to describe any free rigid body:

```
F   = m * a_com
tau = I * alpha + omega x (I * omega)
```

For a chain of links (a manipulator), you apply these equations link by link: an *outward* recursion propagates velocities and accelerations from the base to the tip (each link inherits its neighbor's motion plus its own joint motion), then an *inward* recursion propagates forces and torques from the tip back to the base (each link's joint torque depends on what it has to support beyond itself). This recursive Newton-Euler algorithm is how libraries like Pinocchio and the dynamics engines inside Gazebo/MuJoCo compute `tau` for a given `q, q_dot, q_ddot` efficiently, without ever forming the full `M(q)` matrix explicitly.

## Worked example: a single rotating link
Take a uniform rod of mass `m` and length `l`, pinned at one end, rotating in a horizontal plane (no gravity torque) with the pin providing the only external force. Its moment of inertia about the pivot is `I_pivot = (1/3) * m * l^2` (parallel axis theorem applied to the rod's centroidal inertia `(1/12)*m*l^2`). If a motor at the pivot applies torque `tau`, the rod's angular acceleration is simply:

```python
def angular_acceleration(tau, m, l):
    I_pivot = (1.0 / 3.0) * m * l**2
    return tau / I_pivot
```

Try it with `m=1.0, l=0.5, tau=2.0` — you should get roughly `24 rad/s^2`. This is the simplest possible instance of `tau = I * alpha`; Unit 3 generalizes it to a link that also has gravity acting on it and is connected to other moving links.

## Try it yourself
Extend the worked example: add a point mass `m_load = 0.5 kg` rigidly attached at the free end of the same rod (length `l = 0.5 m`). Using the parallel axis theorem (`I_point = m_load * l^2` for a point mass at distance `l` from the pivot), compute the new total `I_pivot` and re-run `angular_acceleration` with the same `tau = 2.0`. Confirm the angular acceleration drops noticeably — this is the same effect you'll see later as payload-dependent dynamics on a real arm.
