# MicroROS and Electronics for Robotics — Unit 6: PEDRITO is no longer blind

This unit adds vision. An ESP32-CAM module gives PEDRITO a camera, and because a camera stream is a fundamentally different kind of data than the small, frequent messages you've published so far, you'll also build a small dashboard that brings image, distance, and motor state together into one view.

## Why the camera doesn't go through micro-ROS the same way

A single 320x240 JPEG frame is already tens of kilobytes — far larger than the payloads micro-ROS's XRCE-DDS transport (especially over serial) is designed for, and well beyond what fits comfortably in an MCU's limited RAM as a ROS 2 message. Two practical patterns exist:
1. **Separate transport for video**: the ESP32-CAM runs its own lightweight HTTP/MJPEG server, and a small bridge node on the host (a plain ROS 2 node, not micro-ROS) pulls frames from it and republishes them as `sensor_msgs/msg/Image` for the rest of the graph.
2. **Second board dedicated to the camera**: if your ESP32-CAM is a separate module from PEDRITO's main control MCU, it can run independently and simply be treated as another network device the bridge node talks to, keeping your main micro-ROS firmware untouched.

Either way, the lesson is architectural: not every sensor belongs on the same transport, and knowing where to draw that line is as much a part of embedded robotics as writing the firmware itself.

## The camera-to-ROS 2 bridge node

A minimal bridge, running as a normal `rclpy` node on your PC, might poll the ESP32-CAM's stream endpoint and republish:

```python
import cv2
from cv_bridge import CvBridge
from sensor_msgs.msg import Image

class CamBridge(Node):
    def __init__(self):
        super().__init__('pedrito_cam_bridge')
        self.pub = self.create_publisher(Image, '/pedrito/image_raw', 10)
        self.cap = cv2.VideoCapture('http://<esp32-cam-ip>:81/stream')
        self.bridge = CvBridge()
        self.create_timer(1.0 / 15.0, self.tick)  # ~15 fps

    def tick(self):
        ok, frame = self.cap.read()
        if ok:
            self.pub.publish(self.bridge.cv2_to_imgmsg(frame, encoding='bgr8'))
```

This keeps the camera concern entirely in ordinary ROS 2/Python territory, separate from the real-time embedded code you've been writing for motors and sensors.

## Building an integrated view

With `/pedrito/image_raw` (camera), `/pedrito/range` (distance sensor, from Unit 5), and your motor command topic all live at once, use `rviz2` or `rqt` to build a single monitoring layout: an Image display for the camera, a plot for the range reading over time, and a topic monitor for the last commanded velocity. Saving this as an rviz config file means you get the same integrated view back with one command every time you work on PEDRITO afterward:

```bash
rviz2 -d pedrito_dashboard.rviz
```

## Try it yourself

Extend the bridge node so that it also overlays the latest `/pedrito/range` reading as text on the image frame before republishing (subscribe to the range topic, keep the latest value in an instance variable, draw it with `cv2.putText` in `tick`). This is a small taste of sensor fusion: combining two independent data sources into one more useful stream.
