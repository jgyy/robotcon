# Robot Fleet Management in ROS2 v2 — Unit 7: RMF Map Transforms

RMF reasons about the world in its own coordinate frame (the navigation graph you'll build in Unit 15), but your robot's own localization stack reasons in its own map frame. This unit covers the transform math and configuration needed to reconcile the two.

## Why two coordinate frames exist at all

RMF's navigation graph is typically authored once, for the whole building, independent of any particular robot's SLAM map. A robot's own map — produced by its own SLAM run, at its own origin, possibly at a different scale if the map was hand-edited or rescaled — will almost never share an origin, orientation, or even scale with RMF's graph. Rather than force every robot onto one global map (impractical across vendors), RMF expects each fleet adapter to convert between "RMF world coordinates" and "this robot's native map coordinates" itself.

## The transform: translation, rotation, and scale

The general transform from a robot's native frame to RMF's frame is a 2D similarity transform: scale, then rotate, then translate.

```
x_rmf = s * (x_robot * cos(theta) - y_robot * sin(theta)) + tx
y_rmf = s * (x_robot * sin(theta) + y_robot * cos(theta)) + ty
```

Where `s` is a uniform scale factor, `theta` is the rotation offset between the two frames, and `(tx, ty)` is the translation. You need the inverse of this transform too, since RMF sends waypoint goals in its own frame and you must convert them back into the robot's frame before calling `navigate()`.

## Computing the transform from correspondence points

In practice you compute `s`, `theta`, `tx`, `ty` by picking at least two, ideally three or more, points that are identifiable in both frames (e.g., two corners of a room) and solving a least-squares fit. `rmf_demos` and related tooling provide helper scripts for this, but the underlying method is a standard 2D point-set alignment (essentially Umeyama's algorithm without reflection):

```python
import numpy as np

def compute_transform(robot_pts, rmf_pts):
    robot_pts = np.array(robot_pts)
    rmf_pts = np.array(rmf_pts)
    robot_centroid = robot_pts.mean(axis=0)
    rmf_centroid = rmf_pts.mean(axis=0)
    robot_centered = robot_pts - robot_centroid
    rmf_centered = rmf_pts - rmf_centroid
    H = robot_centered.T @ rmf_centered
    U, S, Vt = np.linalg.svd(H)
    R = Vt.T @ U.T
    scale = S.sum() / (robot_centered ** 2).sum()
    t = rmf_centroid - scale * R @ robot_centroid
    return scale, R, t
```

## Where the transform lives in your adapter config

Most fleet adapter configs expose `scale`, `rotation`, and `translation` fields directly under a `reference_coordinates` or `transformation` section, so you plug in the computed values rather than hand-deriving matrices at runtime:

```yaml
reference_coordinates:
  L1:
    rmf: [[0.0, 0.0], [10.0, 0.0], [10.0, 5.0]]
    robot: [[1.2, -0.4], [11.5, -0.6], [11.3, 4.3]]
```

Many adapter implementations compute the transform automatically from these matched point pairs at startup, so you supply correspondences rather than the raw transform coefficients.

## Try it yourself

Pick three landmark points visible in both your robot's SLAM map and your RMF navigation graph (e.g., in RViz, hover over the same physical corner in each). Record both sets of coordinates, run them through the least-squares fit above, and verify the resulting transform by applying it to a fourth, held-out point — the transformed robot coordinate should land close to the corresponding RMF coordinate.
