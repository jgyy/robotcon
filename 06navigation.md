# 06 Navigation

## ROS Navigation in 5 Days
*Learn how to make your robot navigate autonomously by using the ROS Navigation Stack.*
**Rating:** 4.6 (321 reviews)

📂 **Detailed lessons:** [`06navigation/ros-navigation-in-5-days/`](06navigation/ros-navigation-in-5-days/README.md)

### Overview
Navigation is one of the most essential tools in ROS. It allows mobile robots to move around autonomously. This is used in many robotics fields: logistic robots for warehouses, domestic robots that perform certain household tasks, entertainment robots, etc. In ROS NAVIGATION IN 5 DAYS course, You will learn the key concepts involved in ROS Navigation, and how to use it in real robot projects.

### What you'll learn
- Setup ROS Navigation Stack on a Robot
- Building a map of the environment from zero
- Perform Robot Localization
- Autonomous Path Planning
- Understanding Simultaneous Localization and Mapping (SLAM)
- Obstacle Avoidance

### Course outline
1. **ROS Navigation Deconstruction** — Gives you the basic tools and knowledge to be able to understand and create any basic ROS Navigation related project.
2. **Basic Concepts** — What is the ROS Navigation Stack, What do I need to work with the Navigation Stack, what is the move_base node and why it is so important and which parts take place in the move_base node.
3. **Map Creation** — What means Mapping in ROS Navigation, how does ROS Mapping work, how to configure ROS to make mapping work with almost any robot and different ways to build a Map.
4. **Robot Localization** — What means Localization in ROS Navigation, how does Localization work and how do we perform Localization in ROS.
5. **Path Planning I** — What means Path Planning in ROS Navigation, how does Path Planning work, how does the move_base node work and what is a Costmap.
6. **Path Planning II** — What means Path Planning in ROS Navigation, how does Path Planning work, how does the move_base node work and what is a Costmap.

## Fuse Sensor Data to Improve Localization
*Learn how to fuse GPS, IMU, odometry and other sources of localization.*
**Rating:** 4.5 (40 reviews)

📂 **Detailed lessons:** [`06navigation/fuse-sensor-data-to-improve-localization/`](06navigation/fuse-sensor-data-to-improve-localization/README.md)

### Overview
How can you improve the localization of your robot, when you have multiple localization sensors? We will solve that localization problem by using the robot localization package. On this course, you are going to work on the following scenarios: * Use robot_localization to merge different sensor inputs (IMU, Encoders, etc...). * Use robot_localization alongside with an external localization system (AMCL). * Use robot_localization alongside with GPS data.

### What you'll learn
- Merge multiples sensor data using the robot_localization package
- Using the robot_localization package with an AMCL Localization system
- Adding GPS data to the robot_localization package.

### Course outline
1. **Introduction to the Course** — Unit for previewing the contents of the Course.
2. **Merging sensor data** — Learn how to use the robot_localization package to merge data from different sensors in order to improve the pose estimation for localizing your robot.
3. **Using an external Localization system** — Learn how to use the robot_localization package in combination with an AMCL system external to it.
4. **GPS Navigation** — Learn how to combine robot_localization with an external GPS source.
5. **Mini Project** — Final project, where you will have to combine everything you've learned during the course.

## RTAB-Map in ROS 101
*Learn how to use the rtabmap_ros package for performing RGB-D SLAM*
**Rating:** 4.1 (47 reviews)

📂 **Detailed lessons:** [`06navigation/rtab-map-in-ros-101/`](06navigation/rtab-map-in-ros-101/README.md)

### Overview
RTAB-Map (Real-Time Appearance-Based Mapping) is a RGB-D SLAM approach based on a loop closure detector. The loop closure detector uses a bag-of-words approach in order to determinate if a new image detected by an RGB-D sensor it is from a new location or from a location that it has been already visited. Of course, this is a very summarized explanation, you will get more details on how this loop closure detector works inside this Course.

### What you'll learn
- During this Course you will address the following topics: 1. Basics of RTAB-Map. 2. How to use the `rtabmap_ros` package. 3. How does loop closure detection work internally. 4. How to create a 3D Map of an environment. 5. Autonomous Navigation using RGB-D SLAM.

### Course outline
1. **Introduction to the Course** — A brief Introduction to the contents of the Course
2. **Basic Concepts** — Some Basic Concepts RTAB-Map and the rtabmap_ros package
3. **Autonomous Navigation with rtabmap_ros** — Create a Map, Localize your robot and perform Autonomous Navigation with the rtabmap_ros package

## TEB Local Planner
*Learn how to set up the TEB Local Planner for your Navigation system, including set up for car-like robots.*
**Rating:** 4.5 (18 reviews)

📂 **Detailed lessons:** [`06navigation/teb-local-planner/`](06navigation/teb-local-planner/README.md)

### Overview
In this small Course you are going to learn how to set up the TEB Local Planner for your ROS Navigation system, including set up for car-like robots, and customization and optimization of the parameters for a better performance.

### What you'll learn
- How to set up the TEB Local Planner for the Navigation Stack
- How to configure and optimize the TEB Local Planner
- How to set up the TEB Local Planner for Cars

### Course outline
1. **Introduction to the Course** — A brief introduction to the contents of the course. It contains a practical demo.
2. **Set up the Navigation Stack** — Set up the Navigation Stack.
3. **Customize parameters and Optimization** — Learn how to launch the Optimization node, how to customize the planner parameters, and how to visualize the trajectories in RVIZ.
4. **Set up for car-like robots** — How to set up your environment for navigating with car-like robots.
5. **Mini Project** — Final project, where you will put into practice everything you learned during the course.
