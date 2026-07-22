# Mastering with ROS: TIAGo - Melodic — Unit 1: Introduction to the Course

This unit orients you on the TIAGo platform itself before you touch a single line of control code: what the hardware looks like, how that hardware is exposed to ROS, and how to get a simulated TIAGo running so the rest of the course has something to talk to.

## What TIAGo is

TIAGo ("Take It And Go") is a mobile manipulator from PAL Robotics built around four physical subsystems that you'll treat as separate-but-coordinated ROS actors for the rest of the course:

- **Base** — an omnidirectional/differential mobile base (PMB2) that gets the robot around a room.
- **Torso** — a linear lift joint that raises and lowers the whole upper body, effectively extending the arm's reach envelope.
- **Arm** — a 7-degree-of-freedom arm (TIAGo also ships in arm-less "Steel" configurations), ending in an end effector — commonly a parallel gripper or a 5-finger hand.
- **Head** — a pan-tilt unit carrying an RGB-D camera, TIAGo's primary perception sensor.

Every one of these is independently addressable over ROS, and nearly every unit after this one focuses on exactly one of them.

## How the hardware becomes ROS

TIAGo's physical structure is described by a URDF (built from xacro macros), which gives you the robot's link/joint tree and, critically, its TF frames — `base_footprint`, `torso_lift_link`, `arm_7_link`, `xtion_rgb_optical_frame`, and so on. Every sensor reading and every command you send is expressed relative to one of these frames, so getting comfortable with `tf2` tools early pays off for the whole course.

```bash
# once a simulation or real robot is running:
rosrun rqt_tf_tree rqt_tf_tree          # visualize the whole TF tree
rosrun tf tf_echo base_footprint arm_7_link   # print the live transform between two frames
```

Underneath, each subsystem is driven by a `ros_control` controller (a joint trajectory controller for the arm and torso, a diff-drive/mobile-base controller for the wheels), and controllers can be listed and inspected like any other ROS 1 node:

```bash
rosservice call /controller_manager/list_controllers
```

## Getting a simulated TIAGo running

You don't need physical hardware to follow this course — PAL Robotics ships a Gazebo simulation stack alongside the real-robot drivers, and the two expose the same topics and actions. A typical simulation bring-up looks like:

```bash
roslaunch tiago_gazebo tiago_gazebo.launch public_sim:=true
```

Once it's up, treat `rostopic list`, `rostopic echo`, and `rosnode list` as your default reconnaissance tools before writing any code — you should always know what a robot is publishing and subscribing to before you try to command it.

```bash
rostopic list | grep -E "cmd_vel|joint_states|scan|xtion"
rosnode info /gazebo
```

## Try it yourself

Bring up (or imagine, if you don't yet have the simulation installed) a TIAGo session and write down, from `rostopic list`, which topic you'd publish to move the base, which topic reports joint positions, and which topic carries the head camera's raw image. You'll use exactly these three in the next few units.
