# Robotics Introduction For High Schoolers Part 3 — Unit 2: Sensors

A robot is only as good as what it can perceive. This unit surveys the sensors you'll meet most often on wheeled and arm robots — lidars, point clouds, cameras, encoders, and IMUs — and shows how their data reaches your code through ROS messages.

## Proprioceptive vs. exteroceptive sensors

It helps to sort sensors into two families:

- **Proprioceptive sensors** measure the robot's own internal state: wheel encoders (how far has this wheel turned?), an IMU (how is the robot's body accelerating and rotating?), joint position sensors on an arm.
- **Exteroceptive sensors** measure the outside world: cameras, lidars, ultrasonic rangefinders.

Most robot behaviors need both. Odometry (covered later in this course) is computed almost entirely from proprioceptive data, while obstacle avoidance leans on exteroceptive data.

## Range and vision sensors: lidar, point clouds, cameras

**Lidar** spins (or scans) a laser and measures time-of-flight to build a set of distance readings around the robot. A 2D lidar returns a single sweep of distances at a fixed height — great for a wheeled robot navigating a flat floor. In ROS this typically arrives as a `sensor_msgs/LaserScan`: an array of ranges plus the angle each range was measured at.

**3D sensors** (depth cameras, 3D lidars) return a **point cloud**: a set of (x, y, z) points describing surfaces in 3D space, published as `sensor_msgs/PointCloud2`. Point clouds are heavier to process than a 2D scan but let you detect things like table height or a box's shape, not just "there's something 1.2 m ahead."

**Cameras** publish images (`sensor_msgs/Image`, often alongside `sensor_msgs/CameraInfo` for calibration data) that feed into computer vision — line following, object detection, marker tracking.

```bash
# Inspect what a lidar topic is publishing, live, on a running robot
ros2 topic echo /scan --once
ros2 topic hz /scan          # how fast is it actually publishing?
ros2 interface show sensor_msgs/msg/LaserScan
```

## Encoders and IMUs: sensing motion

**Wheel encoders** count how much a wheel (or motor shaft) has rotated, usually by counting slots or magnetic ticks per revolution. Combined with the wheel's known radius, tick counts convert into distance traveled — the raw ingredient for odometry.

**IMUs** (Inertial Measurement Units) combine an accelerometer (linear acceleration on 3 axes) and a gyroscope (angular velocity on 3 axes), often with a magnetometer for heading. IMUs are published as `sensor_msgs/Imu` and are essential for knowing which way "up" is and how fast the robot is turning — information wheel encoders alone can't give you (e.g., wheel slip fools encoders but not the gyroscope).

A simple encoder-reading snippet illustrates the core idea, independent of any specific hardware library:

```python
ticks_per_revolution = 360
wheel_radius_m = 0.033

def ticks_to_distance(ticks: int) -> float:
    revolutions = ticks / ticks_per_revolution
    return revolutions * 2 * 3.14159 * wheel_radius_m

# 90 ticks on a wheel with a 33 mm radius
print(ticks_to_distance(90))  # meters traveled by that wheel
```

## Sensor data in ROS: messages and topics

ROS gives every sensor type a standard message definition in `sensor_msgs`, so any node can consume a lidar or camera from any vendor the same way. The pattern is always: a driver node publishes on a topic, and any number of other nodes subscribe.

```bash
ros2 topic list                    # see every active topic
ros2 topic info /imu/data          # message type + publisher/subscriber count
ros2 topic echo /imu/data --once   # peek at one message
```

Knowing the message type is half the battle — `ros2 interface show <type>` tells you every field inside it, which is how you discover, for example, that `LaserScan` carries `angle_min`, `angle_max`, `angle_increment`, and a `ranges` array together, so a raw distance reading is meaningless without also knowing the angle it was taken at.

## Try it yourself

Using a simulated robot (Limo or any ROS-enabled simulation you have running), run `ros2 topic list` and identify at least three sensor topics. For one of them, run `ros2 interface show` on its message type and write down, in your own words, what each field represents and which "sense" stage of the sense-think-act loop it feeds.
