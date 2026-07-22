# ROS Control — Unit 1: Introduction to the Course

This unit sets up the vocabulary and mental model you'll need for the rest of the course: what `ros_control` (ROS 1) / `ros2_control` (ROS 2) actually is, why it exists as a separate layer instead of just publishing motor commands directly, and how the six units ahead fit together.

## The gap ros_control fills
Everything before this course — TF, URDF, sensor pipelines — is about *knowing* the state of a robot. ROS Control is about *changing* it. Without it you're left hand-rolling a node that reads a target position, computes some ad-hoc PID, and writes raw values to a motor driver — for every joint, on every robot, over and over. `ros_control`/`ros2_control` standardizes that pattern into three swappable pieces:

- **Controllers** — the algorithm that decides what command to send (e.g. "hold this joint at 1.2 rad", "track this velocity", "follow this trajectory").
- **Hardware interfaces** — the adapter that talks to the actual actuators/sensors (real motor drivers, or a simulator standing in for them).
- **The controller manager** — the broker that loads controllers, binds them to hardware interfaces, and runs the whole update loop at a fixed rate.

Because controllers and hardware interfaces are decoupled, the *same* controller (say, a joint trajectory controller) can drive a simulated arm in Gazebo today and the real arm tomorrow, with no code changes — only a different hardware interface underneath it.

## The demo you'll build toward
By the end of this course you will have: written a minimal custom controller from scratch, configured stock controllers (position, velocity, joint trajectory) for both a simple robot and a 6-DOF manipulator, written a hardware interface skeleton, and — as a capstone — wired `ros2_control` onto a UR5 manipulator model end to end.

```
        ┌────────────────────┐
        │  Controller Manager │  <- runs the update loop
        └─────────┬───────────┘
         reads/writes command & state interfaces
        ┌─────────▼───────────┐
        │  Hardware Interface  │  <- talks to real or simulated actuators
        └──────────────────────┘
```

## Checking your environment
Before unit 2, confirm the control stack is actually installed and discoverable. On a ROS 2 system:

```bash
ros2 pkg list | grep controller
ros2 pkg list | grep hardware_interface
ros2 control list_hardware_interfaces   # only works once something is running
```

On ROS 1, the equivalent packages are `ros_control`, `ros_controllers`, and `controller_manager`, installable via your distro's package manager (e.g. `apt install ros-<distro>-ros-control ros-<distro>-ros-controllers`).

## Try it yourself
Install (or confirm already installed) the control meta-packages for whichever ROS generation you're using, then run the package-list command above and note down which controller plugins (position, velocity, effort, joint trajectory, diff drive, etc.) are already available on your machine. You'll use several of them starting in Unit 3.
