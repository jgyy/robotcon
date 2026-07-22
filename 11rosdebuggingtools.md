# 11 ROS Debugging Tools

## Unit Testing with ROS
*Learn how to perform Unit Tests with ROS on the 3 main levels of testing: Python tests, ROS tests and Integration tests.*
**Rating:** 4.3 (17 reviews)

📂 **Detailed lessons:** [`11rosdebuggingtools/unit-testing-with-ros/`](11rosdebuggingtools/unit-testing-with-ros/README.md)

### Overview
Learn how to perform Unit Tests with ROS on the 3 main levels of testing: Python tests, ROS tests and Integration tests.

### What you'll learn
- How to create Python Unit Tests
- How to create ROS Unit Tests
- How to create ROS Integration Tests

### Course outline
1. **Introduction to the Course** — Unit for previewing the contents of the Course.
2. **Basic Concepts** — Learn some basic concepts related to ROS Unit Testing, and you are going to get introduced to a Python script that you are going to use during the course to perform some tests.
3. **Library Unit Tests** — Learn how to create unit tests at a Python-code level. This means without involving ROS, for the moment.
4. **ROS-Node Level Tests** — Learn how to create unit tests at a ROS-node level.
5. **ROS Integration Tests** — Learn how to create unit tests at a ROS-node (multiple nodes) level.
6. **MicroProject**

## ROS RViz Advanced Markers
*Learn how to use RViz Advanced Markers for debugging and visualization*
**Rating:** 4.8 (9 reviews)

📂 **Detailed lessons:** [`11rosdebuggingtools/ros-rviz-advanced-markers/`](11rosdebuggingtools/ros-rviz-advanced-markers/README.md)

### Overview
Visualizing data in the correct way is vital to extract meaningful conclusions. This is specially true in Robotics. One of the problems you always tend to have in robotics is to know what the robot is actually seeing, what is the virtual representation of the world in his mind. Its also very important to represent visually complex data in one place only. That's why `RViz` and all its markers and plugins have made robotics much user friendly and powerful than ever before!

### What you'll learn
- How to use Basic `RViz Markers`.
- How to Create BoundingBoxes Arrays that change dynamically.
- How to add Overlay text, graphs and menus in RViz.
- Draw TFTRajectories, RobotFootsteps and occupancy grids that change based on real robot data.
- Draw pictograms from FontAwsome to represent detections and real object in the world
- Represent TwistStamped commands issued to the robot
- Create Interactive displays in RViz that allow to execute programs from RViz with custom icons.
- Record videos of RViz

### Course outline
1. **RvizMarkers Unit 0: Presentation in ROS**
2. **RvizMarkers Unit 1: Basic Markers**
3. **RvizMarkers Unit 2: BoundingBoxes, RobotFootsteps, PolygonArray ,Ocupancy grids, Pictograms**
4. **RvizMarkers Unit3: Add Overlays**
5. **RvizMarkers Unit 4: Add Custom Panels to RVIZ and Extras**

## Debug Cases
*This Course contains several ROS-related problems that need to be solved by you.*
**Rating:** 4.5 (6 reviews)

📂 **Detailed lessons:** [`11rosdebuggingtools/debug-cases/`](11rosdebuggingtools/debug-cases/README.md)

### Overview
Within this Course, you will find several ROS-related typical problems, distributed in different Cases, that need to be solved by you. You will find a step-by-step guide on how to find and solve the different issues.

### What you'll learn
- How to detect ROS related issues
- How to debug ROS related issues
- How to solve typical ROS issues
- How to get and analyze data from the topics

### Course outline
1. **Case 1 Part 1. ROS Topics and Messages** — How to get data from topics, how to get data from messages, how to debug basic ROS programs and how to analyze Laser message particularities.
2. **Case 1 Part 2. ROS Topics and Messages** — How to get data from topics, how to get data from messages, how to debug basic ROS programs and how to analyze Laser message particularities.
3. **Case 2: ROS Services and Messages** — Compilation of a custom service message, particularities of the messages used by Services and how to Debug basic ROS programs.
4. **Case 3: ROS TF's** — How to get data about the transforms of the robot, how to get data about the frames of the robot and how to generate the transforms of a robot.
5. **Case 4: ROS Actions and Messages** — How to get data from topics, how to get data from messages, how to debug intermediate ROS programs and Action messages particularities.
6. **Case 5: ROS Navigation** — How to analyze ROS Navigation parameters, the importance of frame names and common ROS Navigation Issues.

## GTest Framework for ROS2
*Understand the GTest (Google Test) framework and how to integrate it with ROS2*
**Rating:** 4.9 (8 reviews)

📂 **Detailed lessons:** [`11rosdebuggingtools/gtest-framework-for-ros2/`](11rosdebuggingtools/gtest-framework-for-ros2/README.md)

### Overview
In this course, we will talk about GTest basics and how you can use GTest to test robotics applications built on ROS2

### What you'll learn
- First, learn the basics of CMake as a build system focusing on making shared libraries and how to link a library to an executable.
- Then, GTest is introduced in a step-by-step way that can be easily transferred for use with other packages or software projects. You will dive into test assertions and what assertion types are available.
- Continue with ROS2 node unit testing. You will write a publisher and subscriber node in C++ and learn how to test its interfaces using GTest.
- Next, you will learn a general method for creating system tests. You will explore how to set up a test environment inside a ROS2 workspace, write a system test with ROS2, and convert and adapt it to suit your system test needs.
- Finally, you will practice by applying the knowledge and skills you have learned in this course in a final project. Your goal will be to validate that the software code provided performs as expected.

### Course outline
1. **Course Introduction** — Before we address what GTest is and how it works, we will clarify what software testing is and why it is essential in robotics.
2. **Unit Testing with Google Test** — Learn to set up your environment for Unit Testing and how to use the basic assertions of GTest.
3. **Test Subscribers and Publishers using GTest** — Learn to create basic tests for ROS2 nodes using Publisher and Subscriber nodes.
4. **Full-System and Sub-System Tests** — System tests verify the overall functionality of a complete system composed of multiple nodes to ensure that they all work together as expected on a high level. In this unit, you will learn how to create a comprehensive Navigation2 (Nav2) system test that utilizes Gazebo.
5. **Course Project** — In this last unit, you will write tests that cover a ROS2 package. Get ready to apply the approach from the previous units, only this time, push yourself and fight to get it done on your own.
