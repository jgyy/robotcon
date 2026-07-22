# ROS 2 Perception in 5 Days — Unit 4: Point Cloud Processing

Cameras and 2D masks tell you *where in the image* something is; point clouds tell you *where in the world* it is. This unit introduces PCL and two workflows built on it: finding flat surfaces, and finding discrete objects sitting on them.

## What is PCL?
The Point Cloud Library (`pointclouds.org`) is to 3D point data roughly what OpenCV is to images: a large collection of algorithms for filtering, segmenting, and matching point clouds. In ROS 2, a `sensor_msgs/PointCloud2` message is converted to and from PCL's native cloud types using `pcl_conversions`, mirroring how `cv_bridge` bridges `Image` messages to OpenCV. In Python, many workflows skip a full PCL binding and instead work with clouds as plain NumPy arrays of `(x, y, z)` points via `sensor_msgs_py.point_cloud2`, applying the same conceptual algorithms (plane fitting, clustering) using libraries like `open3d` or hand-rolled NumPy/`scikit-learn` — the underlying technique matters more than which library implements it.

## Surface detection: RANSAC plane segmentation
The dominant technique for finding a flat surface (a table, a shelf, the floor) in a noisy point cloud is RANSAC (Random Sample Consensus): repeatedly pick a small random set of points, fit a plane to them, count how many other points in the cloud lie close to that plane (the "inliers"), and keep the best-scoring plane found after many trials. Points that fit the plane are the surface; everything else is a candidate object.

```python
import numpy as np

def fit_plane_ransac(points, n_iters=200, dist_thresh=0.01):
    best_inliers = None
    for _ in range(n_iters):
        sample = points[np.random.choice(len(points), 3, replace=False)]
        v1, v2 = sample[1] - sample[0], sample[2] - sample[0]
        normal = np.cross(v1, v2)
        normal /= np.linalg.norm(normal) + 1e-9
        d = -normal.dot(sample[0])
        dist = np.abs(points.dot(normal) + d)
        inliers = np.where(dist < dist_thresh)[0]
        if best_inliers is None or len(inliers) > len(best_inliers):
            best_inliers = inliers
    return best_inliers
```

This is exactly the algorithm behind PCL's `SACSegmentation` — reading it in plain NumPy first makes the PCL/`open3d` equivalents far less opaque.

### Create and test a Surface Detection node
Wrap plane segmentation into a node that subscribes to a point cloud topic, runs RANSAC, and republishes the inlier points on a `/surface` topic (and, separately, the outliers on `/objects`). Visualize both in RViz with two differently-colored `PointCloud2` displays and confirm the surface points line up with a real flat region in the scene (e.g. a table top or the floor).

## Object detection: clustering above the surface
Once the surface is removed, what remains is "everything sitting on it" — but as one undifferentiated cloud of points, not yet separate objects. Euclidean clustering solves this: group points into clusters where every point in a cluster is within some distance of another point in the same cluster (in PCL, `EuclideanClusterExtraction`; in `scikit-learn`, `DBSCAN` does an equivalent job). Each resulting cluster's centroid and bounding box become one candidate object.

```python
from sklearn.cluster import DBSCAN

def cluster_objects(points, eps=0.03, min_samples=15):
    labels = DBSCAN(eps=eps, min_samples=min_samples).fit_predict(points)
    return {
        label: points[labels == label]
        for label in set(labels) if label != -1  # -1 is DBSCAN's "noise" label
    }
```

### Create and test an Object Detection node
Feed the surface node's `/objects` output into a clustering node, publish one marker (e.g. a `visualization_msgs/Marker` sphere) per cluster centroid, and confirm in RViz that each real object on the surface gets exactly one marker as you add and remove objects from the scene.

## Conclusions
Surface segmentation and object clustering together form a general "find what's on this table" pipeline: plane-fit to remove the known flat surface, then cluster what remains. This exact two-stage pattern reappears, largely unchanged, inside far more sophisticated perception stacks.

## Try it yourself
Run the surface + clustering pipeline against a scene with two or three objects at different heights above the same surface. Log the number of clusters found and each cluster's centroid, then physically move one object and confirm the centroid count and positions update correctly.
