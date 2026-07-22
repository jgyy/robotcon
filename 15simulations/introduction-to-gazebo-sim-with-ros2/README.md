# Introduction to Gazebo Sim with ROS2

This course brings you up to speed on Gazebo Sim, the current generation of Open Robotics' simulator, and its integration with ROS 2. It starts by clearing up the Gazebo Classic / Ignition Gazebo / Gazebo Sim naming confusion and giving you a working tour of the modern GUI, then walks through describing a robot in URDF and spawning it into a simulated world, bridging its topics and services to ROS 2 with `ros_gz_bridge`, attaching sensor and actuator plugins through Gazebo's `<gazebo>` URDF extensions, and finally authoring your own SDF worlds — physics, lighting, models, actors, and plugins — for that robot to operate in.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Gazebo Classic vs. Ignition Gazebo vs. Gazebo Sim, a tour of the GUI, and the server/client architecture underneath it.
2. [Build a Robot](02-build-a-robot.md) — Writing a robot in URDF (links, joints, meshes) and spawning it via service call or ROS 2 launch file.
3. [Connect to ROS 2](03-connect-to-ros-2.md) — Bridging topics and services with `ros_gz_bridge`, configuring sensor/actuator plugins via `<gazebo>` tags, and simplifying URDF with xacro.
4. [Build a World](04-build-a-world.md) — SDF world structure, physics and environmental settings, populating a scene with models and actors, and extending worlds with plugins.
