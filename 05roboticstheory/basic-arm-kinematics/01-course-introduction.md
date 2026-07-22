# Basic Arm Kinematics — Unit 1: Course Introduction

This unit orients you before the math starts: what "kinematics" actually buys you as a robotics engineer, what you'll be able to do by the end of the course, and what background you need to bring with you. It also gives you a taste of the payoff — moving an end effector to a target pose — so the notation in later units has somewhere to land.

## What is this course about?
Kinematics is the study of motion without worrying about the forces that cause it — for a robot arm, that means answering two mirror-image questions: "given these joint angles, where is the end effector?" (forward kinematics) and "to reach this position and orientation, what should the joint angles be?" (inverse kinematics). Every pick-and-place task, every trajectory a manipulator follows, and every motion-planning stack (including MoveIt) sits on top of a kinematic model of the arm. Without it, you can command individual joints, but you have no way to reason about the arm in terms a task cares about — "put the gripper at this point in space" — which is how humans and higher-level planners actually want to talk to a robot.

## A hands-on preview
Concretely, by the end of this course you will write code that takes a target (x, y) for a planar 3-link arm and computes the three joint angles that achieve it, then drives the arm through that pose. As a preview, here's the shape of the forward kinematics function you'll build toward — a chain of link lengths and joint angles turned into an end-effector position:

```python
import numpy as np

def forward_kinematics_2link(l1, l2, theta1, theta2):
    x = l1 * np.cos(theta1) + l2 * np.cos(theta1 + theta2)
    y = l1 * np.sin(theta1) + l2 * np.sin(theta1 + theta2)
    return x, y

print(forward_kinematics_2link(1.0, 1.0, np.radians(30), np.radians(45)))
```

Run this now if you like — you don't need to understand every term yet. The point is to see that "joint angles in, end-effector position out" is a small, computable function, not a black box, and that by Unit 4 you'll be inverting it.

## Outline of the course
The course builds in a strict dependency order:
- **Unit 2 — Basic Kinematic Concepts**: rigid bodies, position/orientation, and homogeneous transformation matrices — the vocabulary everything else is written in.
- **Unit 3 — Denavit-Hartenberg**: a systematic convention for assigning frames to each joint/link so you don't have to derive transforms from scratch for every new robot.
- **Unit 4 — Forward and Inverse Kinematics**: chaining DH transforms into forward kinematics, then solving the harder inverse problem analytically for a simple arm.

Each unit ends with a small hands-on exercise; the Unit 4 exercise ends with a Python IK solver driving a simulated arm through a trajectory.

## Requirements for the course
You should be comfortable with:
- Python (NumPy in particular — arrays, matrix multiplication, trig functions)
- High-school-to-early-university trigonometry and matrix algebra (matrix multiplication, what a rotation "does" to a vector — no prior linear algebra course required, it's covered as needed)
- Basic familiarity with a ROS 2 workspace is helpful for later courses but is **not** required here — this course is deliberately simulator- and framework-agnostic so the math stands on its own

If matrix multiplication or sin/cos identities feel rusty, a quick refresher before Unit 2 will pay off more than rushing ahead.

## Acknowledgments
This course structure mirrors the standard treatment of manipulator kinematics found across robotics curricula (Craig's *Introduction to Robotics*, Spong's *Robot Modeling and Control*, and the DH-convention material underlying ROS tooling such as MoveIt). No specific external content is reproduced here — all explanations and code in this course are written fresh for this repo.

## Try it yourself
Before moving to Unit 2, run the `forward_kinematics_2link` snippet above for three different `(theta1, theta2)` pairs and sketch (on paper or with `matplotlib`) where the elbow joint and the end effector land for each. This builds the geometric intuition — "each joint angle rotates everything downstream of it" — that the rest of the course formalizes.
