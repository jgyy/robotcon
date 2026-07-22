# ROS2 Control Framework

`ros2_control` is the standard framework for closing the loop between ROS 2 and real actuators: it defines a common way to describe hardware, load pluggable hardware interfaces, and run controllers against them at real-time rates. This course takes you from configuring an existing pipeline through writing your own hardware interface and controller in C++, then applies all of it to a torque-controlled quadruped in a final project — by the end you should be able to design, wire, and debug a `ros2_control` pipeline for a robot you've never seen before.

1. [Course Introduction](01-course-introduction.md) — What "control" means in robotics, the ros2_control architecture, and what this course expects from you.
2. [ROS2 Control Basics](02-ros2-control-basics.md) — Configure a complete ros2_control pipeline: URDF hardware declaration, controller YAML, launch file, and testing.
3. [The Controller Manager](03-the-controller-manager.md) — How the controller manager works internally, and how to drive it via CLI, services, and the spawner script.
4. [Hardware Interface Implementation Template](04-hardware-interface-implementation-template.md) — Write a minimal custom hardware interface plugin from scratch in C++.
5. [Hardware Interface Implementation for Dynamixel Servos](05-hardware-interface-implementation-for-dynamixel-servos.md) — Apply the template to a real actuator family using the Dynamixel SDK.
6. [The ros2_controllers Repository](06-the-ros2-controllers-repository.md) — Survey the built-in controllers (position, effort, velocity, trajectory, diff-drive) and how to pick the right one.
7. [Create a Custom Controller](07-create-a-custom-controller.md) — Write your own controller plugin when no stock controller fits your control law.
8. [Final Project: Quadruped Robot Solo 8](08-final-project-quadruped-robot-solo-8.md) — Apply the full pipeline to a torque-controlled legged robot, from standing to a stable gait foundation.
