# ROS Perception in 5 Days — Unit 4: Surface and Object Recognition

This unit moves perception from 2D pixels into 3D space using point clouds — the data type that lets a robot know not just what something looks like, but where it physically is, which is essential before an arm can pick anything up.

## From image to point cloud
A depth-capable camera (e.g. RGB-D) publishes `sensor_msgs/PointCloud2` on a topic such as `/camera/depth/points`. Each point carries `x, y, z` (in meters, relative to the camera frame) and often `rgb`. In Python, the PCL-backed tooling that ships alongside ROS 1 (`python-pcl`, or `pcl_ros` nodelets) lets you filter, segment, and cluster this data:
```python
import rospy
from sensor_msgs.msg import PointCloud2
import sensor_msgs.point_cloud2 as pc2

def on_cloud(msg):
    points = list(pc2.read_points(msg, field_names=("x", "y", "z"), skip_nans=True))
```
Raw clouds are large (hundreds of thousands of points); the first step in almost every pipeline is downsampling with a voxel grid filter to keep processing tractable.

## Finding flat surfaces with RANSAC plane segmentation
A table, floor, or shelf appears in a point cloud as a large flat cluster of points. RANSAC (Random Sample Consensus) plane fitting repeatedly picks random point triples, fits a plane, and keeps the plane with the most inlier points within a distance tolerance — a robust way to find the dominant surface even with noisy sensor data:
```python
import pcl

cloud = pcl.PointCloud()
cloud.from_list(points)

seg = cloud.make_segmenter()
seg.set_model_type(pcl.SACMODEL_PLANE)
seg.set_method_type(pcl.SAC_RANSAC)
seg.set_distance_threshold(0.01)
inliers, coefficients = seg.segment()

table_cloud = cloud.extract(inliers, negative=False)
objects_cloud = cloud.extract(inliers, negative=True)
```
`table_cloud` is the surface itself; `objects_cloud` is everything left over — which is exactly where the objects sitting on that surface live.

## Clustering the remaining points into objects
Once the dominant plane is removed, Euclidean clustering groups the remaining points by proximity, separating individual objects from each other:
```python
tree = objects_cloud.make_kdtree()
ec = objects_cloud.make_EuclideanClusterExtraction()
ec.set_ClusterTolerance(0.02)
ec.set_MinClusterSize(50)
ec.set_MaxClusterSize(25000)
ec.set_SearchMethod(tree)
cluster_indices = ec.Extract()
```
Each entry in `cluster_indices` is one candidate object — you can compute its centroid and bounding box the same way you'd wrap up a 2D contour, just in 3D.

## Try it yourself
Using a depth camera (real or simulated) pointed at a table with two or three objects on it, write a node that segments the table plane, clusters the remaining points, and publishes the centroid of each cluster as a `geometry_msgs/PointStamped`. Verify in RViz that you get one marker per object and that adding or removing an object changes the cluster count.
