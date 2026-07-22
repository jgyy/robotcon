# URDF for Robot Modeling in ROS2

Every ROS2 tool that needs to reason about a robot's physical body — RViz2, `tf2`, MoveIt, `ros2_control`, and any simulator — relies on a single machine-readable description of that body: the Unified Robot Description Format (URDF). This course builds that skill from the ground up, starting with the core vocabulary of links and joints, through a hands-on two-wheeled-robot project, into bringing that model to life in Gazebo Sim with physics, movement plugins, and simulated sensors, then wrapping up with Xacro (for keeping large URDF files maintainable) and exporting a robot description straight from CAD software instead of hand-typing every dimension.

1. [Introduction](01-introduction.md) — Why URDFs exist, how the course is structured, and what you need before starting.
2. [Building a Robot Model with URDF](02-building-a-robot-model-with-urdf.md) — Links, joints, joint types, materials, meshes, TF frames, and visualizing a live model in RViz2.
3. [MicroProject: Create URDF file for two wheeled robot](03-microproject-create-urdf-file-for-two-wheeled-robot.md) — Hands-on project: model a differential-drive robot with wheels and a caster from scratch.
4. [Using URDF for Gazebo Sim](04-using-urdf-for-gazebo-sim.md) — Adapting a URDF for physics: collisions, inertias, Gazebo-specific tags, and spawning a robot into a simulated world.
5. [Moving the Robot](05-moving-the-robot.md) — Joint state publishers, the Differential Drive plugin, and driving joints for real with `ros2_control`.
6. [Sensing](06-sensing.md) — Adding lidar, camera, point-cloud, and IMU sensor plugins to a robot model.
7. [Xacro Basics](07-xacro-basics.md) — Properties, macros, conditionals, and splitting files to keep large URDF descriptions maintainable.
8. [Robot Assembly Exporting](08-robot-assembly-exporting.md) — Exporting a CAD assembly from Onshape into a working, ROS2-launchable URDF.
