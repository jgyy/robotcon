# Programming Drones with ROS

This course walks through the basics of programming an autonomous quadrotor with ROS, using a Parrot AR Drone as the reference platform. You'll start with the fundamentals of commanding and reading telemetry from a flying robot, then layer on a real mapping pipeline (RTABMap), and finish by repurposing MoveIt! — normally a robot-arm motion planner — to plan collision-free paths through full 3D space. By the end you'll have taken a drone from manual velocity control all the way to autonomous 3D navigation around obstacles.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Course roadmap, the Parrot AR Drone platform, and setting up your ROS workspace and simulator.
2. [Basic Control of a Drone](02-basic-control-of-a-drone.md) — Takeoff/land/reset, velocity commands over `cmd_vel`, and reading odometry, IMU, and battery telemetry.
3. [2D Navigation with RTABMap](03-2d-navigation-with-rtabmap.md) — Building a 3D map with loop closure from the drone's camera, then navigating a flattened 2D occupancy grid with the ROS navigation stack.
4. [3D Navigation with MoveIt!](04-3d-navigation-with-moveit.md) — Modeling the drone as a floating-joint planning group, planning collision-free 3D paths with OMPL, and executing them as closed-loop velocity commands.
