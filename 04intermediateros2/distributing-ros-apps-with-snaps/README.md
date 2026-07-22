# Distributing ROS Apps with Snaps

Robotics projects are usually developed carefully but deployed sloppily — code gets compiled on the robot itself, packages get copied over SSH by hand, and every unit in a fleet quietly drifts toward a different set of installed versions. This course tackles that gap using snaps: self-contained, confined application packages that install and update consistently across dozens of Linux distributions, including Ubuntu Core, the OS commonly used on robots. You'll learn what a snap actually is, how to describe a ROS or ROS 2 application in `snapcraft.yaml`, and how to build, install, and iterate on a snap so an entire robot fleet can be updated with one predictable artifact.

1. [Snaps - Part 1](01-snaps-part-1.md) — The basics of snap creation for ROS and ROS 2 applications.
