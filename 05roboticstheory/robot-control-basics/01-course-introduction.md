# Robot Control Basics — Unit 1: Course Introduction

This unit sets the stage for the whole course: what "control" means for a robot, what hardware/software context you'll be reasoning about, and what you need in place before diving into PID, trajectory generation, multivariable control, and force control in later units.

## What is this course about?
Robot control is the layer that sits between "I know where I want the robot to go" (planning/kinematics) and "the motors actually move there correctly" (actuation/dynamics). This course is about the second half of that pipeline: given a desired joint position, velocity, or force, how do you compute the commands that make the real (or simulated) hardware track it despite gravity, friction, inertia, and sensor noise. You'll build up from single-joint feedback control (PID) to controlling several joints at once (multivariable control) to controlling contact forces instead of positions (force control).

## Robots used in this course
The running example throughout this course is a simple planar 2-degree-of-freedom (2DOF) robotic arm — two revolute joints, two links, moving in a vertical plane so gravity matters. This is deliberately minimal: a 2DOF arm is complex enough to have coupled dynamics and a nontrivial Jacobian, but simple enough that you can derive and check the equations of motion by hand. The same control techniques scale to 6-7DOF industrial and collaborative arms; only the size of the matrices changes. In simulation you can prototype this with any physics engine (Gazebo, PyBullet, MuJoCo) or even a pure Python/NumPy model that integrates the equations of motion yourself — the latter is often faster for building intuition about a controller before touching a simulator.

## Outline of the course
- Unit 2 (PID Control): single-joint feedback control — P, I, D terms individually and combined, tuned against a 2DOF arm's dynamics.
- Unit 3 (Independent Joint Control): treating each joint as its own SISO control loop, plus trajectory generation (LSPB) so the setpoint itself moves smoothly.
- Unit 4 (Multivariable Control): controlling all joints together as a coupled system, and canceling nonlinear dynamics with inverse dynamics (computed torque) control.
- Unit 5 (Force Control): switching the controlled variable from position to end-effector force, using the manipulator Jacobian.
- Unit 6 (Final Project): a guided project combining inverse dynamics and inverse kinematics on the 2DOF arm.

## Demo
Before writing any control code, it's worth seeing the problem you're solving. Take any 2-link arm model (simulated or an actual formula) and simply command a constant torque of 0 at both joints starting from a horizontal pose. Because of gravity, the arm collapses instead of holding position — this is the "why do we even need a controller" demo. Then apply a torque that exactly cancels the gravitational term at that pose (gravity compensation) and watch it hold still. That single demo — open-loop torque vs. gravity-compensated torque — previews the entire idea of feedback and feedforward control that the rest of the course builds on.

## Requirements for the course
- Comfortable programming in Python or C++, including basic linear algebra with arrays/matrices (NumPy, Eigen, or similar).
- Familiarity with derivatives and integrals (you don't need to re-derive them, just recognize them in a control law).
- A way to simulate or visualize a simple arm: a Python/NumPy script that integrates equations of motion is enough; a physics simulator (Gazebo, PyBullet) is a nice-to-have, not a requirement.
- No prior control theory background assumed — every control concept (P, I, D, Jacobian, inverse dynamics) is introduced from scratch in its unit.

## Acknowledgements
This course draws on standard robotics control theory as taught in most robotics/mechatronics curricula and documented in general references such as Spong, Hutchinson & Vidyasagar's *Robot Modeling and Control* and Craig's *Introduction to Robotics: Mechanics and Control*. No specific proprietary material is reproduced here — all derivations and examples are written fresh for this course.

## Try it yourself
Write (or sketch on paper) the equations of motion for a 1-link pendulum of mass `m`, length `l`, with gravity `g`: `I*theta_ddot + m*g*(l/2)*cos(theta) = tau`. Pick a starting angle away from vertical, set `tau = 0`, and simulate a few seconds with simple Euler integration. Confirm the pendulum swings/falls under gravity — this is your baseline "uncontrolled" system that every later unit's controller will need to fight against.
