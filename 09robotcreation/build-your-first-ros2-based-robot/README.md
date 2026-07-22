# Build Your First ROS2 Based Robot

This course walks you through building a complete ROS 2-powered mobile robot from scratch — the "FastBot" — as one continuous project rather than a set of disconnected exercises. Starting from motor and battery selection, you'll bring up a single-board computer, install ROS 2, write the ROS 2 packages that actually drive the robot, design and fabricate a physical chassis, model that chassis in URDF, add LiDAR and camera perception, get it all running in simulation, and finally extend it with your own 3D-printed enclosure — so that by the end you have both a working physical robot and every skill needed to design your next one from a blank sheet.

1. [Introduction](01-introduction.md) — What you'll build, how the units connect, and what hardware and skills you need before starting.
2. [Motors](02-motors.md) — Choosing motor specs, driving them with motor control hardware, wiring, and talking to them over serial.
3. [Battery](03-battery.md) — Calculating power consumption, selecting a battery, and safely connecting it to the robot.
4. [Computer](04-computer.md) — Flashing Ubuntu Server, installing ROS 2, and powering the onboard computer cleanly.
5. [ROS Framework](05-ros-framework.md) — Building a ROS 2 workspace, a motor driver package and node, and a bringup package to launch it all.
6. [Physical Structure Design](06-physical-structure-design.md) — Creating chassis parts in CAD, assembling them, and mating them together.
7. [URDF (Unified Robot Description Format)](07-urdf-unified-robot-description-format.md) — Writing a URDF that matches your chassis and publishing it with robot_state_publisher.
8. [LiDAR](08-lidar.md) — Selecting a LiDAR, giving it a stable device name with udev rules, and integrating its ROS 2 driver.
9. [Camera](09-camera.md) — Selecting a camera, integrating its ROS 2 driver, and handling raspicam-specific driver quirks.
10. [Robot Simulation](10-robot-simulation.md) — Adapting your URDF for Gazebo, adding simulation plugins, and writing simulation launch files.
11. [3D Printed Mods: Enhancing Your Robot With Custom 3D-Printed Parts](11-3d-printed-mods-enhancing-your-robot-with-custom-3d-printed-parts.md) — Designing and 3D-printing a fitted cover for your robot.
