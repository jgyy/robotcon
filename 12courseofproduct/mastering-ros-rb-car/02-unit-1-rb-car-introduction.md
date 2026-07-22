# Mastering ROS: RB-Car — Unit 2: RB-Car Introduction

Where Unit 1 was about *what* RB-CAR is, this unit is about *how to talk to it*: the topic/TF graph, the Ackermann command interface, and the basic loop of sending commands and reading state back. By the end you should be able to drive the robot around by hand and understand every message flowing past.

## The topic and TF graph

RB-CAR's software, like any ROS robot, is a graph of nodes communicating over topics, services, and TF frames. The frames you'll rely on constantly are:

- `map` — a fixed world frame (introduced properly once you have a map, Unit 3).
- `odom` — a locally-continuous frame that drifts over time but never jumps.
- `base_link` (or `base_footprint`) — the robot's own frame, at the vehicle's reference point.
- Sensor frames (`velodyne_link`, `imu_link`, `gps_link`, ...) — fixed offsets from `base_link` describing where each sensor physically sits.

Inspect the tree with:

```bash
ros2 run tf2_tools view_frames
# or, interactively:
ros2 run tf2_ros tf2_echo odom base_link
```

If a frame you expect is missing, the fault is almost always a `robot_state_publisher` that hasn't received a URDF, or a static transform publisher that never launched — both are common first debugging exercises.

## Ackermann steering and the command interface

Because RB-CAR can't spin in place, it doesn't take a plain `geometry_msgs/Twist` the way a differential-drive robot does — or rather, it does accept `Twist` for convenience on some drivers, but internally decomposes `linear.x` (speed) and `angular.z` (turn rate) into a **steering angle** and a **drive velocity** using the bicycle model:

```
steering_angle = atan(wheelbase * angular_z / linear_x)
```

Robotnik platforms typically also expose the native `ackermann_msgs/AckermannDriveStamped` message, which is more honest about the underlying constraints:

```bash
ros2 topic pub /rbcar/command ackermann_msgs/msg/AckermannDriveStamped \
  "{drive: {steering_angle: 0.2, speed: 0.5}}" --once
```

Prefer publishing `AckermannDriveStamped` directly once you move past manual teleop — it makes the vehicle's actual constraints (max steering angle, max speed) explicit in your code instead of hidden inside a Twist-to-Ackermann converter.

## Driving RB-CAR with teleoperation

The fastest way to build intuition for how steering angle and speed translate into motion is manual teleop:

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r cmd_vel:=/rbcar/cmd_vel
```

Drive it in a figure-eight and watch `/rbcar/odom` in `rqt_plot` at the same time — you'll notice the turning radius has a hard floor no matter how hard you push the steering, which is the Ackermann constraint made visible.

## Reading the robot's proprioceptive state

Before you can debug navigation later, get comfortable with the state topics on their own:

```bash
ros2 topic echo /rbcar/odom          # position/velocity estimate from wheel encoders
ros2 topic echo /rbcar/imu/data      # orientation, angular velocity, linear acceleration
ros2 topic hz /rbcar/scan            # LIDAR publish rate — sanity-check sensor health
```

`ros2 topic hz` is worth running on every sensor topic whenever something seems wrong later in the course — a silently-dead sensor is one of the most common causes of a navigation stack that "just doesn't work."

## Try it yourself

Write a small script (Python or C++) that subscribes to `/rbcar/odom` and publishes an `AckermannDriveStamped` command that drives RB-CAR in a slow, constant-radius circle — pick a steering angle, hold a fixed speed, and log the odometry-reported turning radius once it stabilizes. Compare it to what you'd expect from the bicycle-model formula above.
