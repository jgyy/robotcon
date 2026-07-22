# Mastering with ROS: Jackal — Unit 4: Unit 3: Detect and localise a person

Navigation gets Jackal from A to B; this unit gives it eyes for what's around it. You'll detect people with two independent sensors — the laser and the stereo camera — and turn either detection into a 3D position the rest of the robot can act on.

## Detecting People with the Laser Scanner

A 2D laser scan doesn't "see" a person, but a person's legs produce a very recognizable pattern in the range data: two small, roughly circular clusters of similar range, spaced 10-50 cm apart, moving together. A minimal leg detector clusters the scan into contiguous blobs and filters by width:

```python
import numpy as np

def cluster_scan(ranges, angle_min, angle_increment, max_gap=0.15):
    clusters, current, prev_point = [], [], None
    for i, r in enumerate(ranges):
        if r == float('inf'):
            continue
        angle = angle_min + i * angle_increment
        point = (r * np.cos(angle), r * np.sin(angle))
        if prev_point and np.hypot(point[0] - prev_point[0], point[1] - prev_point[1]) > max_gap:
            clusters.append(current)
            current = []
        current.append(point)
        prev_point = point
    if current:
        clusters.append(current)
    return [c for c in clusters if is_leg_width(c)]
```

Pair up clusters that fall within typical leg-spacing distance of each other and you have a candidate person position — cheap, fast, and works in the dark, but easy to confuse with table legs or bollards on its own.

## Detecting People with the Stereo Camera

The camera trades that ambiguity for richer appearance information. A classic, dependency-light approach uses OpenCV's HOG (Histogram of Oriented Gradients) pedestrian detector against the rectified left image, delivered over `cv_bridge`:

```python
import cv2
from cv_bridge import CvBridge

bridge = CvBridge()
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

def image_callback(msg):
    frame = bridge.imgmsg_to_cv2(msg, 'bgr8')
    boxes, weights = hog.detectMultiScale(frame, winStride=(8, 8))
    for (x, y, w, h) in boxes:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
```

HOG is a solid starting point and needs no training, but a DNN-based detector will give you noticeably better accuracy and fewer false positives once you're comfortable with the pipeline — see docs.opencv.org for the `dnn` module's pretrained detection samples when you're ready to upgrade.

## From Stereo Images to Point Clouds

A single camera gives you a 2D bounding box; a *stereo* pair gives you depth. Feed the rectified left/right image pair into a stereo processing pipeline to get a disparity image and a dense `PointCloud2`:

```bash
ros2 launch stereo_image_proc stereo_image_proc.launch.py
ros2 topic echo /stereo/points2 --once
```

To get a person's 3D position rather than just their 2D box, crop the point cloud to the pixels inside the HOG bounding box and take the centroid of the valid (non-NaN) points in that region — that centroid, still in the camera's optical frame, is your camera-based 3D person estimate.

## Estimating a Person's Position in the World

Both detectors so far report a position relative to a sensor frame (`laser` or `camera_link`). To act on either one — to patrol toward or away from a person, or to log where they were seen — transform the point into a common frame, typically `map`:

```python
from tf2_ros import Buffer, TransformListener
from tf2_geometry_msgs import do_transform_point

transform = tf_buffer.lookup_transform('map', 'camera_link', rclpy.time.Time())
point_in_map = do_transform_point(point_in_camera, transform)
```

With both detections expressed in the same frame, you can compare them directly, average them for a better estimate, or prefer one over the other depending on range and lighting — exactly the fusion logic the patrol project in the next unit relies on.

## Try it yourself

With a person (or a simulated actor) walking in front of Jackal, log both the laser-cluster detection and the camera bounding-box detection for the same moment, transform both into the `map` frame, and compare how far apart the two position estimates land — that gap is exactly what a real fusion filter has to account for.
