# Basics of Robotics with LIMO — Unit 2: Sensors

Sensors are how your code finds out anything about the world at all — everything downstream (mapping, navigation, manipulation) is only as good as the sensor data feeding it. This unit walks through the sensor types LIMO carries and, critically, the message types that carry their data on the ROS graph.

## Lidar and point clouds

A 2D lidar spins (physically or via solid-state scanning) and measures distance to the nearest obstacle at each angle, producing a `sensor_msgs/msg/LaserScan`: an array of ranges, an angle range, and an angle increment. To get the actual (x, y) obstacle positions you convert polar to Cartesian:

```python
import math

def scan_to_points(scan):
    points = []
    angle = scan.angle_min
    for r in scan.ranges:
        if scan.range_min <= r <= scan.range_max:
            x = r * math.cos(angle)
            y = r * math.sin(angle)
            points.append((x, y))
        angle += scan.angle_increment
    return points
```

3D sensors (depth cameras, 3D lidars) instead publish `sensor_msgs/msg/PointCloud2` — a more general, densely packed binary format representing a cloud of 3D points, optionally with color or intensity per point. It's more expensive to process than a `LaserScan` but necessary once you need to reason about height, not just a flat obstacle ring.

## Encoders

Wheel encoders count motor shaft rotation, usually as quadrature pulses, and the motor controller converts those pulse counts into a velocity or a cumulative tick count. You rarely read raw encoder ticks in application code — instead you consume them already fused into odometry (Unit 5) via `nav_msgs/msg/Odometry`, or, on some platforms, as raw `sensor_msgs/msg/JointState` for individual wheel joints. Encoders are the primary source of *dead reckoning*: the robot's ability to estimate how far it has moved without any external reference, which drifts over time and distance.

## Cameras

An RGB camera publishes `sensor_msgs/msg/Image` (a raw pixel buffer) alongside a `sensor_msgs/msg/CameraInfo` message carrying the intrinsic calibration (focal length, principal point, distortion coefficients) needed to turn pixels into rays in 3D space. A depth camera additionally publishes a registered depth image, so pixel (u, v) has both a color and a distance — the basis for the object-detection-to-3D-pose pipelines used later in manipulation. In practice you rarely handle raw `Image` bytes by hand:

```python
from cv_bridge import CvBridge
bridge = CvBridge()

def image_callback(msg):
    frame = bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
    # frame is now a standard OpenCV/numpy array
```

`cv_bridge` converts between ROS `Image` messages and OpenCV `numpy` arrays, letting you drop straight into the OpenCV ecosystem (see docs.opencv.org) for anything downstream.

## IMUs

An Inertial Measurement Unit reports angular velocity and linear acceleration (and often a fused orientation estimate) via `sensor_msgs/msg/Imu`, at a much higher rate than any other sensor on the robot — commonly 100-200 Hz. It's noisy and drifts on its own, but it's fast and doesn't depend on wheel contact with the ground, which makes it the standard partner for encoder-based odometry in a fusion filter (more in Unit 5).

## Try it yourself

Subscribe to LIMO's `/scan` topic and write a Python callback that prints the single closest obstacle distance and its angle on every message (`ros2 topic echo /scan --once` first, to see the raw field layout). Then do the same for `/imu` and compare the publish rates with `ros2 topic hz` — explain in a sentence why they differ the way they do.
