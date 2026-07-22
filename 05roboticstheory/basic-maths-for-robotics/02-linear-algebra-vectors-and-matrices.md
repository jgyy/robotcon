# Basic Maths for Robotics — Unit 2: Linear Algebra (vectors and matrices)

Linear algebra is the language robots use to describe "where" and "which way": every position, velocity, orientation, and sensor reading eventually becomes a vector or a matrix. This unit builds that language from the ground up.

## Vectors — declaration and properties
A vector is an ordered tuple of numbers representing a point, a direction, or a rate of change, depending on context. In robotics you'll constantly use vectors for positions `(x, y, z)`, velocities `(vx, vy, vz)`, and forces/torques. The operations that matter:

- **Magnitude (norm)**: `||v|| = sqrt(v . v)` — how long the vector is (e.g. distance to a target).
- **Dot product**: `a . b = sum(a_i * b_i) = ||a|| ||b|| cos(theta)` — measures alignment; used to project one vector onto another or compute the angle between two directions (e.g. is the robot facing its goal?).
- **Cross product** (3D only): `a x b` gives a vector perpendicular to both, with magnitude `||a|| ||b|| sin(theta)` — used for angular velocity, torque, and surface normals.

```python
import numpy as np

a = np.array([1.0, 0.0, 0.0])   # robot's forward heading
b = np.array([0.0, 1.0, 1.0])   # direction to a landmark

angle = np.arccos(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
normal = np.cross(a, b)
print(f"angle between headings: {np.degrees(angle):.1f} deg")
print(f"perpendicular vector: {normal}")
```

## Matrices — declaration and properties
A matrix is a rectangular array of numbers; in robotics, the two you'll meet most are **rotation matrices** (encoding orientation) and **Jacobians** (encoding how one set of variables changes with respect to another, covered in Unit 3). Key properties: a matrix `A` is **square** if rows = columns; it's **invertible** if `A^-1` exists such that `A A^-1 = I`; it's **orthogonal** if `A^T = A^-1` (rotation matrices are always orthogonal, which is why they never distort lengths or angles).

```python
R = np.array([
    [0.0, -1.0, 0.0],   # 90-degree rotation about z
    [1.0,  0.0, 0.0],
    [0.0,  0.0, 1.0],
])
print("R @ R.T == I:", np.allclose(R @ R.T, np.eye(3)))   # orthogonality check
print("det(R):", np.linalg.det(R))                        # 1.0 for a proper rotation
```

## Linear maps
A linear map is a function `f(v) = A v` that transforms vectors while preserving vector addition and scalar multiplication (`f(v1 + v2) = f(v1) + f(v2)`). Every matrix *is* a linear map, and every linear map can be written as a matrix — this is the bridge that lets you treat "rotate this sensor reading into the world frame" or "scale a velocity vector" as ordinary matrix multiplication. Composing two transformations (rotate, then translate) is done by multiplying their matrices together, which is exactly why homogeneous transformation matrices (4x4 matrices bundling rotation + translation) are the standard way to chain robot frames.

```python
def rotate_z(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

point_in_sensor_frame = np.array([1.0, 0.0, 0.0])
point_in_world_frame = rotate_z(np.pi / 4) @ point_in_sensor_frame
print(point_in_world_frame)   # sensor's "forward" expressed in the world frame
```

## Useful identities
A handful of identities save you from re-deriving algebra mid-project:
- `(A B)^T = B^T A^T` — transpose of a product reverses the order.
- `(A B)^-1 = B^-1 A^-1` — same reversal rule for inverses.
- For rotation matrices specifically: `R^-1 = R^T` (much cheaper than a general matrix inverse).
- Distributivity: `A(u + v) = Au + Av`, and scalar factoring: `A(c v) = c(A v)`.

These are why, when you chase down a bug in a chain of coordinate transforms, checking `R.T @ R == I` and undoing multiplications in reverse order are usually your first two debugging moves.

## Try it yourself
Build two 3x3 rotation matrices, `R1` for a 30-degree rotation about `z` and `R2` for a 45-degree rotation about `z`, using the `rotate_z` function above. Verify numerically that `R1 @ R2` equals `rotate_z(75 degrees)` (within floating-point tolerance), and that `(R1 @ R2).T` equals `(R1 @ R2)` inverted via `np.linalg.inv`. This confirms both the composition rule and the orthogonal-inverse identity in one exercise.
