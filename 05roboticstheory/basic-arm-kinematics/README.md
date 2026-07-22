# Basic Arm Kinematics

Robot kinematics is what lets you translate between "these joint angles" and "the end effector is here, facing this way" — the foundation every manipulation task, trajectory, and motion planner (including tools like MoveIt) is built on. This course develops that translation from first principles: starting with how to represent a rigid body's position and orientation, moving through the Denavit-Hartenberg convention for systematically framing an arbitrary robot arm, and finishing by deriving both forward kinematics (joint angles to pose) and inverse kinematics (pose to joint angles) for a simple planar arm, complete with a working Python solver driving a simulated trajectory.

1. [Course Introduction](01-course-introduction.md) — A brief introduction to the course contents, with a practical FK demo and the course's requirements.
2. [Basic Kinematic Concepts](02-basic-kinematic-concepts.md) — Rigid bodies, position and orientation, and rotation/translation via homogeneous matrices.
3. [Denavit Hartenberg](03-denavit-hartenberg.md) — The DH convention for systematically framing and parameterizing a robot's joints and links.
4. [Forward and Inverse Kinematics](04-forward-and-inverse-kinematics.md) — Chaining DH transforms into forward kinematics, then deriving and coding an analytical IK solver for a planar arm.
