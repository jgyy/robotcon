# ROS 2 Perception in 5 Days — Unit 6: AI Perception Techniques

Everything up to this unit used classical, hand-designed algorithms (color thresholds, Haar cascades, RANSAC). This unit switches to a learned deep-learning detector — YOLO — and shows how the same "detect, then act" pattern from earlier units extends naturally to a much more capable model.

## How YOLO works
YOLO ("You Only Look Once") reframes object detection as a single regression problem instead of the classical "propose regions, then classify each one" pipeline: the whole image passes through one convolutional network exactly once, and the network directly outputs a set of bounding boxes with class labels and confidence scores in one forward pass. That's the source of its main advantage — speed — which is what makes it practical to run on a live robot camera feed rather than only on static images.

## Features of YOLO
- **Speed**: a single forward pass per frame makes real-time inference (well above typical camera frame rates on a GPU, and usable rates on CPU for smaller model variants) achievable, unlike older multi-stage detectors.
- **Multi-object, multi-class in one pass**: a single inference call returns every detected object in the frame, not just one.
- **A model family, not one model**: successive YOLO versions and size variants (nano through extra-large) trade accuracy for speed/memory, so you can pick a variant that fits your robot's compute budget.
- **Task versatility**: beyond plain bounding-box detection, the same family of architectures supports pose estimation and instance segmentation, covered later in this unit.

## YOLO pre-trained models
Training a detector from scratch needs a large labeled dataset and significant compute — almost never worthwhile for a course exercise or even most real projects. Pretrained weights (commonly trained on the COCO dataset, which covers 80 common object classes including "person") let you get a working detector immediately, and are the right default unless your robot needs to recognize an object class that genuinely isn't in any general-purpose dataset — in which case fine-tuning a pretrained model on your own small labeled set is far cheaper than training from scratch.

## From pretrained weights to a ROS 2 detection node
The integration pattern mirrors every earlier unit: subscribe to an image topic, convert with `cv_bridge`, run inference, publish the results.

```python
from ultralytics import YOLO
from cv_bridge import CvBridge

class YoloDetector(Node):
    def __init__(self):
        super().__init__('yolo_detector')
        self.model = YOLO('yolov8n.pt')   # nano variant: fast, modest accuracy — good for a first pass
        self.bridge = CvBridge()
        self.create_subscription(Image, '/camera/image_raw', self.on_image, 10)
        self.pub = self.create_publisher(Detection2DArray, '/detections', 10)

    def on_image(self, msg):
        frame = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
        results = self.model(frame, verbose=False)[0]
        # results.boxes gives xyxy coordinates, confidence, and class id per detection
```

### Launch and test YOLO Object Detection
Run the node against a live or recorded camera feed and confirm detections appear for objects your model's training classes cover (COCO includes common items like "person", "chair", "bottle", "cell phone"). Check both accuracy and frame rate — this is where model size choice (nano vs. larger variants) becomes a real trade-off on robot-class hardware.

### Create and test a YOLO Human Tracker node
Filter detections to the "person" class only, pick the highest-confidence (or largest, or closest-to-center) detection as the tracked target, and drive `cmd_vel` toward keeping that box centered — the same proportional-steering pattern used in Units 3 and 5, just fed from a stronger detector.

## Beyond boxes: pose estimation and instance segmentation
**Pose estimation** extends detection from a bounding box to a skeleton of keypoints (shoulders, elbows, wrists, hips, knees, etc.) per detected person, useful for gesture recognition or estimating a person's orientation, not just their location.

**Instance segmentation** goes further still, producing a pixel-precise mask per detected object rather than a rectangular box — useful whenever the exact shape matters, e.g. computing a grasp point on an irregularly shaped object rather than just its bounding rectangle.

```python
pose_model = YOLO('yolov8n-pose.pt')
seg_model = YOLO('yolov8n-seg.pt')

pose_results = pose_model(frame)[0]   # .keypoints holds per-person joint coordinates
seg_results = seg_model(frame)[0]     # .masks holds a per-instance pixel mask
```

### Create and test YOLO Pose Estimation and Segmentation nodes
Build one node per task following the same subscribe → infer → publish pattern as the detection node, and verify visually (overlay keypoints as dots/lines, overlay masks as translucent color) that the outputs track a moving person or object correctly.

## Conclusions
YOLO does not replace the earlier units' techniques so much as generalize them: where a color threshold only finds objects of one known color and a Haar cascade only finds faces, a single YOLO model finds and classifies many object types at once — at the cost of needing more compute and, if you go beyond COCO's classes, labeled training data.

## Try it yourself
Compare your Unit 5 Haar-cascade face detector against YOLO's person detection on the same live feed: log detection latency and note qualitatively how each handles a partially turned or partially occluded person.
