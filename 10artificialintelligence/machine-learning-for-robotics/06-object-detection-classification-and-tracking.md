# Machine Learning for Robotics — Unit 6: Object Detection, Classification and Tracking

The final unit switches sensing modality entirely: instead of LiDAR and odometry, you'll use TurtleBot4's RGB camera to run real-time object detection with YOLOv5, tune its confidence threshold, and add multi-object tracking with SORT so detections stay consistent across frames.

## From LiDAR to camera perception
Everything in Units 3-5 operated on TurtleBot4's LiDAR and odometry — one-dimensional range arrays and pose estimates. The camera introduces a fundamentally different data shape (dense 2D pixel grids) and a fundamentally different tool family: convolutional object detectors instead of regression/clustering on tabular features. The ROS 2 plumbing pattern is familiar, though — subscribe to a sensor topic, run inference, publish a result — which is why this unit reuses the node structure from Unit 4's regression driver.

## Baseline object detection with YOLOv5
YOLOv5 ("You Only Look Once") is a single-pass convolutional detector: one forward pass through the network produces bounding boxes, class labels, and confidence scores for every detected object, which is what makes it fast enough for real-time robotics use. A baseline ROS 2 node that subscribes to the camera topic, runs a pretrained `yolov5s` model, and republishes annotated frames:

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import torch

class ObjectDetector(Node):
    def __init__(self):
        super().__init__("object_detector")
        self.bridge = CvBridge()
        self.model = torch.hub.load("ultralytics/yolov5", "yolov5s", pretrained=True)
        self.sub = self.create_subscription(Image, "/camera/image_raw", self.on_image, 10)
        self.pub = self.create_publisher(Image, "/detections/image", 10)

    def on_image(self, msg):
        frame = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
        results = self.model(frame)
        annotated = results.render()[0]
        out_msg = self.bridge.cv2_to_imgmsg(annotated, encoding="bgr8")
        self.pub.publish(out_msg)
```

`results` from YOLOv5 carries, per detection, a bounding box, a class label, and a confidence score — the raw material for everything that follows in this unit.

## Tuning the confidence threshold
YOLO discards detections below a confidence threshold before returning results. That threshold is a precision/recall trade-off you control directly:

```python
self.model.conf = 0.4  # default is usually 0.25
```

Raise it and you get fewer false positives (phantom detections on shadows or reflections) at the cost of missing genuine but low-confidence detections; lower it and the reverse. For a robot that reacts to detections — say, slowing down near a detected person — err toward a lower threshold for safety-critical classes and validate empirically: run the same test footage through several threshold values and log precision/recall per value rather than picking one number by feel.

```python
for conf in [0.2, 0.3, 0.4, 0.5, 0.6]:
    self.model.conf = conf
    results = self.model(test_frame)
    # tally true/false positives against ground-truth boxes for this frame
```

## Object tracking with SORT
A detector alone re-identifies objects from scratch on every single frame — it has no notion that "the person in this frame" is the same person as one frame ago. **SORT** (Simple Online and Realtime Tracking) closes that gap: it associates detections across frames (typically via IoU overlap and a Kalman filter for motion prediction) and assigns each tracked object a persistent ID.

```python
from sort import Sort  # a common lightweight SORT implementation
import numpy as np

tracker = Sort()

def track_frame(detections):
    # detections: array of [x1, y1, x2, y2, confidence]
    dets = np.array([[d.x1, d.y1, d.x2, d.y2, d.conf] for d in detections])
    tracks = tracker.update(dets)  # returns [x1, y1, x2, y2, track_id] per object
    return tracks
```

Filtering to "living beings" (people, dogs, cats) before tracking keeps the ID-assignment problem focused on the objects most relevant to a robot's safety and interaction logic — a stack of boxes doesn't need a persistent identity, but a moving pedestrian does. Visualize tracked IDs either by publishing annotated images (drawing the box and ID as text) for viewing in RViz, or directly with OpenCV's `cv2.imshow` during development.

## Putting it together: detection to tracking pipeline
The full pipeline chains three stages per frame: YOLO detection -> confidence filtering -> SORT association. Structuring it as one ROS 2 node keeps latency predictable (no extra topic round-trips between stages), while still publishing intermediate results (raw detections, tracked IDs) on separate topics so you can debug each stage independently with `ros2 topic echo`.

```bash
ros2 topic echo /detections/image
ros2 run rqt_image_view rqt_image_view  # visually inspect annotated frames live
```

## Try it yourself
Record a short rosbag of TurtleBot4's camera feed with at least one person walking through frame and briefly leaving and re-entering view. Run it through your detection+tracking pipeline and check: does SORT assign the same track ID when the person re-enters, or a new one? If it's a new ID, that's expected default SORT behavior (it has no long-term re-identification) — note in a sentence or two what you'd need to add (e.g., appearance-based re-identification) to fix it, without necessarily implementing it.
