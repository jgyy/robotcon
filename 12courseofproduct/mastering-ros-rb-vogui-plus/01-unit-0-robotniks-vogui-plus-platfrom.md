# Mastering ROS : RB-Vogui+ — Unit 0: Robotniks Vogui PLUS platform

Before writing a single line of navigation or manipulation code you need a mental model of what the RB-Vogui+ actually is: what hardware it carries, how that hardware shows up in ROS, and how to safely get it moving. This unit is the platform tour and first teleop demo that every later unit builds on.

## What the RB-Vogui+ is

RB-Vogui+ is Robotnik's mid-size mobile platform designed to work both indoors and outdoors, which is the defining trait that shapes the whole course: it needs a localization and navigation strategy that works without walls to bounce a lidar off of, and it needs enough payload and a flat mounting deck to carry a manipulator arm and perception sensors. Key things worth knowing before you touch the robot:

- **Locomotion**: four powered wheels giving it strong traction and a defined payload capacity, controlled through velocity commands rather than raw motor commands.
- **Sensing suite**: typically a 2D/3D lidar (or two, front and rear, for full coverage), an IMU, wheel encoders, and often an RGB-D camera and GNSS/GPS receiver for outdoor work — you'll meet each of these again in later units.
- **Compute**: an onboard PC running the ROS stack, reachable over the network from your development machine rather than something you SSH into and develop directly on.
- **Payload deck**: a mounting surface that can carry a manipulator (this is what Unit 2 will use for grasping).

Robotnik ships a set of ROS packages (`robotnik_base_hw`, navigation configs, robot description/URDF, simulation launch files) that wrap all of this into standard ROS interfaces — you drive the robot through topics and actions, not vendor-specific APIs.

## How the platform maps onto ROS

Everything downstream in this course assumes the robot exposes itself the standard ROS way. After bringing up the robot (or its simulation), inspect what's actually there instead of taking it on faith:

```bash
ros2 node list
ros2 topic list
ros2 topic info /robot/robotnik_base_control/cmd_vel
ros2 topic echo /robot/robotnik_base_control/odom --once
```

Expect to find, at minimum: a velocity command topic (`cmd_vel` or a namespaced equivalent) accepting `geometry_msgs/Twist` (or `TwistStamped`), an odometry topic publishing `nav_msgs/Odometry`, raw sensor topics for each lidar/camera/IMU, and a `robot_state_publisher` node broadcasting the robot's TF tree from its URDF. Check that tree early — it's the backbone every navigation and manipulation computation later in the course depends on:

```bash
ros2 run tf2_tools view_frames
# or, interactively:
ros2 run rqt_tf_tree rqt_tf_tree
```

If `base_link -> odom -> map` and the sensor frames aren't there and sane, nothing downstream (costmaps, MoveIt, GPS fusion) will work correctly, so it's worth confirming this before debugging anything more complex.

## Powering up and connecting safely

Real hardware adds two concerns simulation doesn't: physical safety and network setup. The robot has a physical emergency stop — know where it is and test it once, at low speed, before doing anything else. On the networking side, the onboard PC and your workstation need to be on the same ROS domain: for ROS 2, that means matching `ROS_DOMAIN_ID` (and, if you're bridging across networks, a consistent DDS discovery configuration); for ROS 1 setups, matching `ROS_MASTER_URI`/`ROS_IP`. Confirm connectivity with a simple round trip before assuming a launch failure is a code problem:

```bash
export ROS_DOMAIN_ID=42          # must match the robot's onboard PC
ros2 topic list                  # if this is empty, you have a network/DDS problem, not a code problem
```

Most of this course is equally usable against a simulated RB-Vogui+ (Gazebo/Ignition-based, using the same launch files and topic names as the real robot) — start there if you don't have hardware access, since the ROS interface is designed to be identical either way.

## First demo: teleoperating the robot

With the topics confirmed, the smallest meaningful "it works" checkpoint is driving the robot by hand:

```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r cmd_vel:=/robot/robotnik_base_control/cmd_vel
```

Watch `/odom` update as you drive, and watch the robot (real or simulated) move in RViz alongside it. This single loop — command goes out on `cmd_vel`, state comes back on `odom` and TF — is the same loop every navigation and manipulation node you write later will use, just issuing commands programmatically instead of from a keyboard.

## Try it yourself

Bring up the RB-Vogui+ (simulated or real), use `ros2 topic list` and `rqt_tf_tree` to sketch the robot's topic and TF layout from scratch without looking at vendor docs, then drive it in a small square using `teleop_twist_keyboard` while watching `/odom` values in a second terminal to confirm the reported pose roughly matches the motion you commanded.
