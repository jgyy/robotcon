# Robot Control Basics

This course covers the fundamentals of modern robot control: how to turn a desired joint position, trajectory, or contact force into the actual torque commands that make a manipulator behave correctly despite gravity, inertia, and coupling between joints. Starting from single-joint PID feedback, the course builds up through trajectory generation, coupled multivariable (inverse dynamics) control, and end-effector force control, before combining inverse dynamics with inverse kinematics in a guided final project on a 2DOF planar arm.

1. [Course Introduction](01-course-introduction.md) — An introduction to the contents of this course.
2. [PID Control](02-pid-control.md) — Get familiar with Proportional-Integral-Derivative PID control basics.
3. [Independent Joint Control](03-independent-joint-control.md) — Focus on controlling only one joint at a time, independent of the rest.
4. [Multivariable Control](04-multivariable-control.md) — Construct and analyse a multivariable dynamic system and design an appropriate controller for it.
5. [Force Control](05-force-control.md) — Apply a desired end-effector force based on feedback from the force sensor.
6. [Final Project](06-final-project.md) — Apply your knowledge with a guided project that makes use of inverse dynamics and inverse kinematics.
