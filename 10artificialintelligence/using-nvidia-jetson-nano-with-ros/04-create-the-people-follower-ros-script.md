# Using NVIDIA Jetson Nano with ROS — Unit 4: Create the People Follower ROS Script

This unit takes a standalone person detector — the kind of script you'd normally run in a notebook and eyeball the output of — and "rosifies" it: turning it into a proper node that publishes structured detections any other node in the system can consume, then building a follower behavior on top of that data.

## Choosing a detector that fits the Nano's budget

Full-size detectors (large YOLO variants, Faster R-CNN) will run too slowly on the Nano's GPU for a live control loop. Two practical options: NVIDIA's `jetson-inference` library, which ships pre-optimized TensorRT detection models (`detectNet`) tuned for Jetson hardware, or a lightweight model (e.g. a small YOLO variant or MobileNet-SSD) you convert with TensorRT yourself, as in Unit 3. Either way, filter detections down to the `person` class and measure the actual achieved rate on-device with `tegrastats` running alongside — don't trust a desktop benchmark.

## Designing the detection message

Rather than stuffing raw pixel coordinates into a generic message, define what a "person detection" means for this robot: bounding box, a normalized horizontal offset from image center (what the follower actually needs), and a confidence score. A custom message keeps this self-describing:

```
# msg/PersonDetection.msg
float32 center_x_normalized   # -1.0 (far left) .. 1.0 (far right)
float32 bbox_area_normalized  # 0.0 (tiny/far) .. 1.0 (fills frame/close)
float32 confidence
bool detected
```

## The detector node

```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from your_package.msg import PersonDetection

class PersonDetectorNode(Node):
    def __init__(self):
        super().__init__('person_detector')
        self.net = load_person_detector()  # your jetson-inference / TensorRT model
        self.create_subscription(Image, 'camera/image_raw', self.on_image, 10)
        self.pub = self.create_publisher(PersonDetection, 'person_detection', 10)

    def on_image(self, msg: Image):
        frame = ros_image_to_array(msg)
        detections = self.net.detect(frame)
        best = pick_largest_person(detections)  # None if no person found

        out = PersonDetection()
        if best is not None:
            out.detected = True
            out.center_x_normalized = normalize_x(best.center_x, frame.shape[1])
            out.bbox_area_normalized = best.area / (frame.shape[0] * frame.shape[1])
            out.confidence = best.confidence
        self.pub.publish(out)
```

## The follower behavior node

A separate node subscribes to `person_detection` and produces `cmd_vel` — a simple proportional controller: turn toward the person based on horizontal offset, and move forward/backward to hold a target apparent size (a rough stand-in for distance without needing a depth sensor):

```python
from geometry_msgs.msg import Twist

class PersonFollower(Node):
    def __init__(self):
        super().__init__('person_follower')
        self.create_subscription(PersonDetection, 'person_detection', self.on_detection, 10)
        self.pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self.target_area = 0.15  # desired bbox size ~ desired following distance

    def on_detection(self, msg: PersonDetection):
        cmd = Twist()
        if msg.detected:
            cmd.angular.z = -1.0 * msg.center_x_normalized   # turn toward the person
            cmd.linear.x = 0.4 * (self.target_area - msg.bbox_area_normalized)
        self.pub.publish(cmd)
```

Splitting perception (`PersonDetectorNode`) from behavior (`PersonFollower`) mirrors what you did with collision avoidance in Unit 3, and for the same reason: either half can be tested, tuned, or swapped independently, and Unit 5 will need to arbitrate between multiple behaviors publishing intent, which is far easier when each behavior is a clean, separate node.

## Try it yourself

Implement `PersonDetection.msg`, the detector node, and the follower node, then verify with `ros2 topic echo person_detection` (or `rostopic echo`) that the values update sensibly as a person walks across the frame — `center_x_normalized` should track left/right position and `bbox_area_normalized` should grow as they approach the camera.
