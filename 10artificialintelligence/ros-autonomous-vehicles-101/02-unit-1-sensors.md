# ROS Autonomous Vehicles 101 — Unit 1: Sensors

Every decision the car makes downstream depends on what its sensors report right now. This unit covers the standard sensor suite for an autonomous car, the ROS message types each one uses, and how to actually look at the data in RViz instead of trusting it blindly.

## The sensor suite
A conditionally-automated car typically carries some combination of:

- **Camera(s)** — lane markings, traffic signs, other vehicles. Cheap, information-dense, but sensitive to lighting.
- **LiDAR / laser scanner** — accurate range and shape data around the vehicle, the backbone of the obstacle work in Unit 3.
- **GPS receiver** — global position, the backbone of Unit 2.
- **IMU** — orientation and acceleration, used to fill in gaps between GPS fixes and to detect sudden motion.
- **Wheel odometry** — relative motion derived from wheel encoders, cheap and always available but drifts over time.

No single sensor is trustworthy alone: cameras fail in the dark, GPS drops under overpasses, wheel odometry drifts on slip. Later units (and real AV stacks) fuse several of these together — for now, focus on reading each one correctly in isolation.

## ROS message types per sensor
ROS 2 ships standard message definitions in `sensor_msgs` and `nav_msgs` specifically so drivers from different vendors are interchangeable:

| Sensor | Typical topic | Message type |
|---|---|---|
| Camera | `/camera/image_raw` | `sensor_msgs/msg/Image` |
| LiDAR / laser | `/scan` | `sensor_msgs/msg/LaserScan` (2D) or `PointCloud2` (3D) |
| GPS | `/gps/fix` | `sensor_msgs/msg/NavSatFix` |
| IMU | `/imu` | `sensor_msgs/msg/Imu` |
| Wheel odometry | `/odom` | `nav_msgs/msg/Odometry` |

Inspect any of these without writing code:

```bash
ros2 topic echo /scan --once
ros2 interface show sensor_msgs/msg/LaserScan
```

`ros2 interface show` is worth memorizing — it prints the exact field layout of any message type, which beats guessing from documentation.

## Visualizing sensor data in RViz
Raw numbers scrolling past in a terminal are hard to reason about; RViz renders them spatially instead:

```bash
rviz2
```

In RViz: set the **Fixed Frame** (top left, Global Options) to your vehicle's base frame (commonly `base_link` or `odom`), then **Add** a display matching each topic — a `LaserScan` display for `/scan`, a `PointCloud2` display for 3D LiDAR, a `Camera` display for `/camera/image_raw`, and an `Odometry` display for `/odom`. If a display stays empty, the fix is almost always the Fixed Frame not matching the frame the message header declares.

## Sensor frames and TF
Every sensor message carries a `header.frame_id` naming the coordinate frame the data is expressed in — a LiDAR scan is relative to the LiDAR's mounting point, not the car's center. ROS's `tf2` library tracks the transforms between all these frames so you can, for example, ask "where is this obstacle relative to the car's rear axle?" regardless of where the sensor is bolted on.

```bash
ros2 run tf2_tools view_frames
ros2 run tf2_ros tf2_echo base_link laser_frame
```

If RViz shows a sensor's data in the wrong place, check the TF tree before suspecting the sensor driver — a missing or wrong static transform is the most common cause.

## Try it yourself
Pick two sensors from your simulated car (e.g. `/scan` and `/gps/fix`), run `ros2 interface show` on each message type, then add both to RViz. Note in a scratch file what each field means and confirm the display updates when you drive the car around with the teleop tool from Unit 0.
