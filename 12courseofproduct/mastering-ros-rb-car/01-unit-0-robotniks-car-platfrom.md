# Mastering ROS: RB-Car — Unit 1: The RB-CAR Platform

This unit introduces the hardware and software you'll be driving for the rest of the course: Robotnik's RB-CAR, an Ackermann-steered outdoor research vehicle. Before writing a single line of navigation or perception code, you need a mental model of what the robot physically is and how its ROS stack exposes that hardware.

## Meet RB-CAR: an Ackermann-steered research platform

Unlike the differential-drive robots common in intro ROS courses (TurtleBot, LIMO), RB-CAR steers like a real car: two front wheels turn to set a heading, while drive torque comes from the rear (or all) wheels. This is called **Ackermann steering**, and it fundamentally changes what "moving around" means for the robot. It cannot rotate in place, it has a minimum turning radius, and its kinematics are those of a bicycle model rather than a unicycle model. Every unit downstream — mapping, planning, control — has to account for this constraint, which is precisely why RB-CAR is a useful platform for learning autonomous *driving* rather than generic mobile robotics.

RB-CAR is built for outdoor use: rugged suspension, weatherproofed electronics, and sensors chosen for range and robustness rather than indoor precision.

## Hardware anatomy

A typical RB-CAR sensor and compute suite includes:

- **3D LIDAR** (e.g. a Velodyne/Ouster-class spinning or solid-state unit) for obstacle detection and SLAM at outdoor ranges.
- **GNSS/GPS receiver** for global positioning, since outdoor environments don't offer the wall geometry that indoor SLAM relies on.
- **IMU** for orientation and short-term motion estimation between GPS fixes.
- **Wheel encoders** feeding an Ackermann odometry model.
- **Stereo or RGB camera(s)** for the perception work you'll do in later units (lane detection, traffic signals, pedestrians).
- An onboard PC running the ROS stack, talking to a low-level motor/steering controller over a serial or CAN bus.

All of this is wrapped by Robotnik's `robotnik_msgs` and platform-specific driver packages, which translate raw hardware into standard ROS topics and services so the rest of the stack doesn't need to know about wire protocols.

## Simulation vs. the real robot

Every exercise in this course should work against a Gazebo (or equivalent) simulation of RB-CAR before you touch a real vehicle. The simulated robot publishes the same topics, respects the same Ackermann kinematics, and lets you crash into things for free. Bring up the simulation with something like:

```bash
ros2 launch rbcar_sim_bringup rbcar_sim.launch.py world:=outdoor_track.world
```

(the exact package/launch file names depend on the ROS distro and Robotnik's current release — check `docs.ros.org` and Robotnik's own package documentation for the version you have installed).

Once it's up, get oriented with the standard introspection tools:

```bash
ros2 topic list
ros2 topic echo /rbcar/odom
ros2 run rqt_graph rqt_graph
```

`rqt_graph` in particular is worth running now and returning to after every future unit — watching new nodes and topics appear as you add navigation and perception is the fastest way to build intuition for how the stack fits together.

## How this course is organized

The remaining units build up in layers: basic driving and sensing (Unit 2), building a map and moving through it (Unit 3), a car-aware local planner (Unit 4), fusing GPS into localization (Unit 5), a perception stack for road scenes (Unit 6), and a final project that integrates all of it (Unit 7). Each layer depends on the one before it, so resist the urge to skip ahead — an autonomous car with a bad local planner will fight a perfect map, and a perfect planner is useless without accurate localization.

## Try it yourself

Bring up the RB-CAR simulation, run `ros2 topic list` (or `rostopic list` on ROS 1), and write down every topic whose name suggests it belongs to the LIDAR, the GPS, the IMU, or the drive/steering command interface. You'll be using exactly these topics by name throughout the rest of the course, so knowing where they live now will save you time later.
