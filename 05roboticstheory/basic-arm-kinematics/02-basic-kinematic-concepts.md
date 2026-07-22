# Basic Arm Kinematics — Unit 2: Basic Kinematic Concepts

Before you can describe how a robot arm moves, you need a precise language for describing *where things are*. This unit builds that language — rigid bodies, position and orientation, and the homogeneous matrix that packages both into a single object you can chain and invert.

## What will you learn in this unit?
You'll learn to represent the pose (position + orientation) of a rigid body relative to a reference frame, and to combine rotation and translation into one 4x4 homogeneous transformation matrix. This is the single most reused building block in the rest of the course: forward kinematics in Unit 4 is nothing more than multiplying a chain of these matrices together.

## Rigid Body
A **rigid body** is an idealized object whose points never change distance relative to each other — it can move and rotate, but it can't bend, stretch, or deform. Every link of a robot arm is modeled as a rigid body connected to its neighbors by joints. This idealization is what lets you describe a link's motion with just six numbers (three for position, three for orientation) instead of tracking every point on it individually. It breaks down for things like cables, soft grippers, or a flexible-link arm, but for a standard rigid manipulator it's an excellent and standard model.

## Rigid Body Position and Orientation
**Position** is just a 3D vector locating the body's reference point (usually its origin) relative to some fixed world/base frame:

```
p = [x, y, z]^T
```

**Orientation** is harder — it describes how the body's own axes are rotated relative to the reference frame's axes. The most common representation for orientation is a **rotation matrix** R, a 3x3 matrix whose columns are the body's x, y, z axes expressed in the reference frame. A rotation matrix is always orthonormal (R^T R = I) and has determinant +1, which is what makes it a "pure rotation" rather than a reflection or scale. Other representations exist (Euler angles, quaternions) and you'll meet them elsewhere in the "Basic Maths for Robotics" course — for kinematics derivations, the rotation matrix is the workhorse because it composes and inverts via ordinary matrix operations.

## Rotation and Translation with Homogeneous Matrix
Separately tracking a 3x3 rotation matrix R and a 3x1 translation vector p works, but chaining several transforms together (link 1 relative to base, link 2 relative to link 1, ...) gets clumsy with two separate operations at every step. The **homogeneous transformation matrix** solves this by packing both into one 4x4 matrix:

```
T = [ R  p ]
    [ 0  1 ]
```

To transform a point, you append a 1 to its coordinates (making it a 4-vector) and multiply by T:

```python
import numpy as np

def homogeneous_transform(R, p):
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = p
    return T

def rot_z(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s, 0],
                      [s,  c, 0],
                      [0,  0, 1]])

T = homogeneous_transform(rot_z(np.radians(90)), np.array([1.0, 0.0, 0.0]))
point = np.array([1.0, 0.0, 0.0, 1.0])   # homogeneous point
print(T @ point)   # rotate then translate, in one matrix multiply
```

The payoff: composing two transforms is just matrix multiplication (`T_total = T1 @ T2`), and inverting a transform is a closed-form operation on R and p — no separate bookkeeping for rotation vs. translation. This is exactly the structure the Denavit-Hartenberg method in Unit 3 exploits to chain an entire arm.

## Hands-on Practice!
Compute the rotation matrix for a robot (call it "Daruma") that rotates 90 degrees about its z-axis, and validate it against the expected behavior: a point 1 meter along the x-axis should land 1 meter along the y-axis after the rotation.

```python
import numpy as np

R = rot_z(np.radians(90))
p_before = np.array([1.0, 0.0, 0.0])
p_after = R @ p_before
assert np.allclose(p_after, [0.0, 1.0, 0.0], atol=1e-9)
print("Rotation validated:", p_after)
```

## Conclusions
You now have the two core objects of manipulator kinematics: the rotation matrix (orientation) and the homogeneous transformation matrix (position + orientation, composable by multiplication). Every subsequent unit is really about *which* homogeneous matrices to build and how to chain them for a real robot arm.

## Try it yourself
Write a `rot_x(theta)` and `rot_y(theta)` alongside the given `rot_z(theta)`, then build a homogeneous transform that first rotates 45 degrees about x and then translates by `[0, 0, 2]`. Apply it to the point `[0, 1, 0]` and predict the result by hand before running the code to check yourself.
