ROS2 Navigation
Learn how make robots autonomously navigate using Nav2
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (142)
Course Overview
This course teaches how to use the Nav2 package of ROS2 to make a robot autonomously navigate. You will understand how all the parts work together so you can adapt it to your own robot
What You Will Learn

    How to build a map of the environment Localizing a robot in a map of the environment Path Planning from an initial position to a desired goal Obstacle avoidance using costmaps Navigation Lifecycle Manager How behavior trees influence Nav2 How to do multiple robot navigation

Course Summary
1. Introduction to ROS 2 Navigation
(0%)

This unit introduces you to the essential components of Nav2 and the contents of this course.
1.1
Introduction

A brief explanation of what to expect from this course.
1.2
How robots navigate

Introduction to the key components that enable robots to navigate autonomously.
1.3
A Hands-on Experience

Try a demo where you'll be able to send navigation goals to a mobile robot!
1.4
What You Will Learn in this Course

Outline of all the Nav2 skills you will learn in this course.
1.5
Robots Used in this Course

Learn about the robot you will be using during the course.
1.6
Real Robot Project

Apply what you've learned in the course to a project based on a real robot.
1.7
Get a Certificate

Earn a certificate that validates your knowledge of ROS 2Navigation!
1.8
Requirements for the Course

What are the minimum requirements before starting this course?
1.9
Acknowledgements

Special thanks to all the parties involved in making this course possible.
2. How to Build a Map
(0%)

Learn how to build a map for autonomous navigation.
2.1
Introduction

What will you learn in this unit?
Play
2.2
What is a Map in ROS?

Learn about the concept of Maps in ROS.
2.3
What is Required to Build a Map?

Learn about the requirements to build a map in ROS.
2.4
SLAM

Learn about the concept of SLAM (Simultaneous Localization and Mapping).
2.5
cartographer_ros

What is the cartographer_ros package?
2.6
Launching cartographer for your robot

Learn how to launch Cartographer for your robot in order to perform SLAM.
2.7
How to configure cartographer for different robots

Learn about the main configuration options for the cartographer_ros package.
2.8
Saving the map for later use

Learn how to save a map to your computer.
2.9
Providing the map to other nodes

Learn how to provide the generated map to other nodes in your ROS 2 system.
2.10
Lifecycle Nodes Overview

Get an overview of Lifecycle Nodes and their role in managing node states in ROS 2.
2.11
Nav2 Lifecycle Manager

Learn about the Nav2 Lifecycle Manager and how it controls the state transitions of navigation-related nodes.
2.12
Real Robot Project

Complete the Real Robot Project section associated with Mapping
2.13
Conclusions

What did you learn in this unit?
Play
3. How to localize the robot in the environment
(0%)

Learn how to localize a robot within its environment using ROS 2 navigation tools and techniques.
3.1
Introduction

What will you learn in this unit?
Play
3.2
AMCL

Introduction to the AMCL (Adaptive Monte-Carlo Localization) algorithm.
3.3
Launching AMCL for your robot

Learn how to launch AMCL for your robot in order to perform localization.
3.4
About robot localization

Learn more about robot localization and the AMCL technique.
3.5
Configuration parameters for AMCL

Learn about the main configuration options for the AMCL ROS package.
3.6
Set the initial location of the robot from a config file

Learn how to set the initial location of the robot from a configuration file.
3.7
Set the initial location of the robot from the command line

Learn how to set the initial location of the robot using the command line tools.
3.8
Set the initial location of the robot programmatically

Learn how to set the initial location of the robot from a ROS 2 program.
3.9
Global localization

Understand the concept of global localization and how it helps a robot determine its position in an unknown environment.
3.10
Real Robot Project

Complete the Real Robot Project section associated with Localization.
3.11
Conclusions

What did you learn in this unit?
Play
4. How to do Path Planning in ROS 2
(0%)

Learn how to perform path planning in ROS 2 to navigate a robot efficiently in its environment.
4.1
Introduction

What will you lear in this unit?
Play
4.2
Launching Path Planning for your robot

Learn how to launch the Path Planning system for your robot.
4.3
Planner Parameters

Explore the key parameters used to configure path planners in Nav2.
4.4
Controller Parameters

Learn about the key parameters for configuring the controller server in Nav2.
4.5
Behavior Parameters

Learn about the key parameters for configuring the different behaviors of your robot while navigating.
4.6
Play with the parameters!

Complete an exercise and experiment with some parameters to better understand how they affect the robot’s behavior.
4.7
Sending a navigation goal through the command line

Learn how to send a navigation goal to your robot using the command line.
4.8
Sending a navigation goal programmatically

Learn how to send a navigation goal to your robot from a ROS 2 prorgam.
4.9
Real Robot Project

Complete the Real Robot Project section associated with Path Planning.
4.10
Conclusions

What did you learn in this unit?
Play
5. How Obstacle Avoidance happens in ROS2
(0%)

Learn how obstacle avoidance is implemented and managed in ROS2.
5.1
Introduction

What will you learn in this unit?
Play
5.2
Costmaps

Understand how costmaps are used for navigation and obstacle avoidance in ROS2.
5.3
Global & Local Costmaps

Learn the difference between global and local costmaps and how they are used in ROS2 navigation.
5.4
Add a global costmap to your navigation system

Learn how to integrate a global costmap into your ROS2 navigation system.
5.5
Global Costmap obstacle layers

Learn how to configure and manage obstacle layers in the global costmap for ROS2 navigation.
5.6
Configuring the global costmap parameters

Learn how to configure the parameters of the global costmap to optimize robot navigation in ROS2.
5.7
Add a local costmap to your navigation system

Learn how to integrate a local costmap into your ROS2 navigation system.
5.8
The role of the shape of the robot in the Costmaps

Understand how the shape of the robot affects the costmaps in ROS2 navigation.
5.9
Creating a single navigation launch file

Learn how to create a single launch file to launch your entire navigation system in ROS2.
5.10
Real Robot Project

Complete the Real Robot Project section associated with Obstacle Avoidance.
5.11
Conclusions

What did you learn in this unit?
Play
6. Multi-robot Navigation
(0%)

Learn how to configure navigation for multirobot environments.
6.1
Introduction

What will you learn in this unit?
6.2
Multi-robot Setup

Learn how ROS 2 systems are set up to work with multiple robots.
6.3
Mapping

Learn how Mapping works when managing multiple robots.
6.4
Localization

Learn how Localization works when managing multiple robots.
6.5
Path Planning

Learn how path planning works when managing multiple robots.
6.6
Single Launch

Create a single launch file to launch your entire multirobot navigation system in ROS2.
6.7
Conclusions

What did you learn in this unit?
User Ratings

Behavior Trees for ROS2
Learn to use Behavior Trees in ROS2.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.2 (30)
Course Overview
Understand the concept of the Behavior Trees framework. Learn how to use the Behavior Trees framework in practice and how to apply them with ROS2.
What You Will Learn

    The course is dedicated to robot enthusiasts and all the others who would like to stay abreast of current robotics development. During the course, you are going to learn about: 1. Behaviour Trees as a new abstraction layer in the software robotics stack. 2. Learn about the mechanisms and design principles of the Behavior Trees framework. 3. You will receive practical skills to use BehaviorTree.CPP framework together with ROS2 (architect the robot behavior). 4. You will learn the advanced mechanisms of BehaviorTree.CPP framework (stochastic behavior) and automated planning.

Course Summary
1. Introduction to the Course

This unit is an introduction to the Behavior Trees in ROS2 course. You will have a quick preview of the contents to be covered in the course and a practical demo.
2. Introduction to Behavior Trees

In this unit of the course, you are going to understand the Behavior Tree concept and simplified software architecture which can be accommodated into the ROS2 framework. You are going also to discuss the fundamental mechanisms of BTs.
3. Design principles of Behavior Trees

This unit will provide you a deep understanding of BT architecture and the mechanisms that allow architecting the logical connections of robot behaviors.
4. Integration of Behavior Trees with ROS2

In this unit, we are going to dive into the BehaviorTree.CPP library as a framework that allows the integration of Behavior Trees with ROS2.
5. Stochastic behavior trees and automated planning

This unit introduces the probabilistic behavior of nodes and gives you a general overview of how to incorporate automated planning (architecture changes) into Behavior Trees.
6. Final Project

Final challenge of the course, that will test everything you've learned during the course.
User Ratings

Distributing ROS Apps with Snaps
Distribute robotics applications like a global software vendor
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (2)
Course Overview
While developing is usually handled well by robotics developers, deploying a robotics application can be confusing. One might compile the code on robots, copy/paste compiled packages, and end up with unknown versions of software Snap offers a solution to build and distribute robotics applications and, more generally, any software. You will learn how to use snaps to automatize robot applications distribution
What You Will Learn

    We will cover the basics of snap creation for ROS and ROS 2 applications. Then, by introducing the main concepts of snap, learn how to confine your robotics application and make it installable on dozens of Linux distributions.

Course Summary
1. Snaps - Part 1

The basics of snap creation for ROS and ROS 2 applications.
User Ratings

Intermediate ROS2
Take your ROS2 knowledge to the next level.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (40)
Course Overview
In this course, take a deep dive into more advanced ROS2 learning topics.
What You Will Learn

    How to create different types of launch files in ROS2
    How to work with parameters in ROS2
    Threading in ROS2
    How to manage callbacks in ROS2
    Understand Quality of Service (QoS) in ROS2
    Understand DDS in ROS2
    Work with Managed Nodes in ROS2

Course Summary
1. Introduction

A brief introduction to the contents of the course. It contains a practical demo.
2. ROS2 Build System

ROS2 has introduced a new build system, with many changes with respect to ROS1. In this unit, you will learn about the Python build system and how to use it optimally.
3. Advanced Launch Files

Understand launch files in ROS2 and explore different methods of creating launch files
4. XML and YAML Launch Files

How to create XML and YAML ROS2 launch files
5. Node Parameters

Learn how to work with parameters in ROS2
6. Managing Complex Nodes

Learn about multithreading with ROS2 and callback management
7. Quality of Service

Understand how QoS is used in ROS2 with simple examples
8. Understanding DDS

Understand DDS in ROS2 , how to modify it, and how to work with QoS
9. Lifecycle Nodes

Learn about managed nodes and how they work
10. Course Project

Create a ROS2 node to detect circular shapes using the laser scan data
User Ratings

Advanced ROS2 Navigation
Take a deeper look at Navigation for ROS2
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (58)
Course Overview
Do you want a more advanced understanding of ROS2 Navigation? This course covers advanced topics that are not part of the basic Nav2 course.
What You Will Learn

    How to use the Simple Commander API
    How to use Costmap Filters
    An explanation of the BT Navigator
    How to create a custom behavior
    How to use Groot for visualizing behaviors
    How plugins are used in Nav2
    How to create custom plugins for Nav2
    The three main plugins of the controller server

Course Summary
1. New Nav2 Features
(0%)

Learn about the Simple Commander API and how to create and use Costmap Filters
1.1
Introduction

What will you learn in this unit?
Play
1.2
Setup Nav2

Set up the Nav2 system for the unit.
1.3
The Simple Commander API

Introduction to the Simple Commander API.
1.4
Navigate To Pose

Discover how to use the Navigate To Pose action in Nav2 to send your robot to a specific location efficiently.
1.5
Navigate Through Poses

Learn how to use the Navigate Through Poses action in Nav2 to guide your robot through multiple waypoints seamlessly.
1.6
Waypoint Following

Discover how to use the FollowWaypoints action in Nav2 to navigate a sequence of predefined waypoints efficiently.
1.7
Costmap Filters

Brief introduction to Costmap Filters.
1.8
Keepout Mask

Learn how to implement and use a Keepout Mask in Nav2 to prevent the robot from entering specific areas of the map.
1.9
Speed Limits

Learn how to set and apply speed limits in Nav2 to control the robot's speed in different areas of the map.
1.10
Conclusions

What did you learn in this unit?
Play
2. Behavior Trees
(0%)

Explore how Behavior Trees (bt_navigator) are used in Nav2 to control the robot's decision-making process during navigation.
2.1
Introduction

What will you learn in this unit?
Play
2.2
What is the BT Navigator

Learn about the BT Navigator, a Nav2 component that uses Behavior Trees to manage navigation tasks.
2.3
How to create a behavior

Learn how to create a behavior in Behavior Trees to control robot actions within the BT Navigator.
2.4
Analyzing the behavior of the XML file

Understand how to analyze and interpret the behavior defined in the XML file for Behavior Trees in the BT Navigator.
2.5
How to provide the behavior to the bt_navigator

Learn how to provide a behavior to the bt_navigator and integrate it into your robot's navigation system.
2.6
Hands-on Practice!

Create your own behavior XML file for the bt_navigator.
2.7
Recovery Behaviors

Understand how recovery behaviors work in ROS 2 navigation.
2.8
Conclusions

What did you learn in this unit?
Play
3. Nav2 Plugins and Custom Plugin Creation
(0%)

Learn about the core Nav2 plugins and how to create custom plugins for costmaps, planners, and controllers to tailor navigation functionality to your needs.
3.1
Introduction

What will you learn in this unit?
Play
3.2
Plugins in Nav2

Explore the role of plugins in Nav2.
3.3
Default Plugins

Explore the default plugins in Nav2, including those for costmaps, planners, and controllers, and understand how they contribute to the navigation system.
3.4
Custom Nav2 Plugins Creation

Introduction and set up for creating a custom plugin.
3.5
Costmap Plugin

Introduction to the Costmap plugin in Nav2 for effective obstacle detection and path planning.
3.6
Step 1: Create a new ROS 2 package

Start by creating a new ROS 2 package for your costmap custom plugin.
3.7
Step 2: Create the source and header files

Create the header and source files for your costmap custom plugin.
3.8
Step 3: Create the Plugin Information XML File

Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
3.9
Step 4: Setup the CMakelists.txt and the package.xml for compilation

Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
3.10
Step 5: Configure, Compile and Test

Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
3.11
Hands-on Practice!

Practice by creating your own custom costmap plugin.
3.12
Planner Plugin

Introduction to the Planner plugin in Nav2 to generate paths for robot navigation based on the environment.
3.13
Step 1: Create a new ROS 2 package

Start by creating a new ROS 2 package for your planner custom plugin.
3.14
Step 2: Create the source and header files

Create the header and source files for your planner custom plugin.
3.15
Step 3: Create the Plugin Information XML File

Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
3.16
Step 4: Setup the CMakelists.txt and the package.xml for compilation

Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
3.17
Step 5: Configure, Compile and Test

Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
3.18
Hands-on Practice!

Practice by creating your own custom planner plugin.
3.19
Controller Plugin

Introduction to the Controller plugin in Nav2, which drives the robot along the planned path, ensuring smooth and efficient movement.
3.20
Step 1: Create a new ROS 2 package

Start by creating a new ROS 2 package for your controller custom plugin.
3.21
Step 2: Create the source and header files

Create the header and source files for your controller custom plugin.
3.22
Step 3: Create the Plugin Information XML File

Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
3.23
Step 4: Setup the CMakelists.txt and the package.xml for compilation

Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
3.24
Step 5: Configure, Compile and Test

Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
3.25
Conclusions

What did you learn in this unit?
Play
4. Controller Server In Depth
(0%)

Explore the various plugin options and configurations available for the controller server.
4.1
Introduction

What will you learn in this unit?
Play
4.2
Controller Server Config

Explore the configuration options for the controller server.
4.3
Controller Server Plugins

Explore the available plugins for the controller server and how to configure them.
4.4
Hands-on Practice!

Explore a few critical behaviors, helping you better understand how to work with them.
4.5
Conclusions

What did you learn in this unit?
Play
User Ratings

ROS2 Security
Learn to enable and manage security with ROS2
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.4 (8)
Course Overview
How ROS2 can be executed in a trustee area without letting other people access to the same network? The answer is here, ROS2 has been released with security tools that allow it to secure the robotics systems. They are disabled by default, but they can be enabled in order to make robots safer. This course will endow you with the knowledge to work with the ROS2 security layer. You are going to learn how to enable security, how to work with specific security packages, and also how to make a turtlebot3 environment work in a safe layout.
What You Will Learn

    Basic ROS2 security concepts: Authentication, Cryptography, Access Control, etc.
    How to create security in a turtlebot3 simulation.
    How to launch a turtlebot3 simulation and move it around with teleop with security enabled.
    What does a keystore contain?
    How the enclaves are generated?
    How to access a certificate?
    How to validate a certificate?
    How to add a new custom node in the turtlebot_keystore?

Course Summary
1. Introduction to the Course

A brief introduction to the contents that will be covered during the course.
2. Activating security in ROS2

Learn how to enable security for your ROS2 system.
3. Key Materials Explanation

Take a deep look at the different elements involved in security, such as the keystore, the enclaves, etc...
User Ratings

URDF for Robot Modeling in ROS2
Understanding robot modeling using URDF in ROS 2
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (136)
Course Overview
As human beings, we learn from a very young age about our body’s structure: which bones and muscles are part of it, how they are connected between them, how we can move each articulation, etc. For a robot, though, how can we know all this information? Well, this is exactly what URDF files are going to tell us. URDF files define the structure of a robot, the connection between all the different parts, etc. In this course, you will understand how URDF files work and how to create them for any robot.
What You Will Learn

    How to build a visual robot model with URDF.
    How to add physical properties to a URDF Model (Collision, Frictions…).
    How to use XACRO to clean up URDF files.
    How to use URDF in Gazebo Sim - ROS 2 ecosystem.
    How to use URDF-XACRO in ROS 2 systems.

Course Summary
1. Introduction
(0%)

Brief introduction to the contents of the course.
1.1
Introduction

What will you learn in this unit?
1.3
Why do You need URDFs?

Understand why URDFs are essential for robot description in ROS.
1.4
Course Outline

Get an overview of the course structure and topics.
1.5
Requirements

What are the minimum requirements before starting this course?
1.6
Special Thanks

Special thanks to all the parties involved in making this course possible.
2. Building a Robot Model with URDF
(0%)

Learn the use of URDF files and the tools to help you create your first PixarLike robot.
2.1
Introduction

What will you learn in this unit?
2.2
What is a URDF File

Understand what a URDF file is and its role in robot description.
2.3
Initial Setup

Setup the packages and folders required to create the Robot Model.
2.4
What is a LINK

Understand what a LINK is and its role in the URDF robot description.
2.5
Visualise URDF Files in RVIZ2

Learn how to visualize URDF files in RViz2 for robot model representation.
2.6
What Is A JOINT

Understand what a JOINT is and its role in the URDF robot description.
2.7
TF Frames and LINKS

Understand the relationship between TF frames and LINKS in robot kinematics.
2.8
Joint Types

Learn about different joint types and their roles in robot motion.
2.9
Move the Joints Through a Joint State Publisher

Learn how to move joints using the Joint State Publisher in ROS.
2.10
URDF Materials

Understand how to define and apply materials in URDF files.
2.11
URDF Meshes

Learn how to use and integrate meshes in URDF files for robot visualization.
2.12
Joint Special Elements

Learn about some special elements (tags) in joint definition and their function in robot kinematics.
2.13
Launch RViz2 through a Launch File

Learn how to launch RViz2 using a ROS 2 launch file.
2.14
Conclusions

What did you learn in this unit?
3. MicroProject: Create URDF file for two wheeled robot
(0%)

Practice how to create a visual representation of a robot in URDF by completing a small project.
3.1
Introduction

Review the main properties of the robot you have to build for the Micro Project.
3.2
Main Ojective

Description of the tasks required to complete the Micro Project.
4. Using URDF for Gazebo Sim
(0%)

Learn how to spawn a robot URDF in Gazebo Sim.
4.1
Introduction

What will you learn in this unit?
4.2
Start Gazebo Sim

Follow the steps to launch a Gazebo Sim world for the my_box_bot robot.
4.3
Create a Gazebo Sim world

Follow the steps to create a Gazebo Sim world to spawn the robot.
4.4
Adapting a Robot Model for Gazebo Sim

Learn how to adapt a robot model for use in a Gazebo Sim simulation.
4.5
Complete the Robot!

Define the collisions and inertias for your robot.
4.6
Spawning the Robot Model in Gazebo Sim

Learn how to create a Launch File to spawn a Robot Model into the Gazebo Sim simulator.
4.7
Physical Properties

Learn how to define and apply physical properties to robot models.
4.8
Real Robot Project

Complete Part 1 of the Real Robot Project.
4.9
Conclusions

What did you learn in this unit?
5. Moving the robot
(0%)

Learn how to enable joint movement for a robot model.
5.1
Introduction

What will you learn in this unit?
5.2
Possible Approaches

An overview of possible approaches to enable joint movement for the robot.
5.3
Joint State Publisher Plugin

Learn how to use the Joint State Publisher plugin to control robot joints.
5.4
Differential Drive Plugin

Learn how to use the Differential Drive plugin for robot movement control.
5.5
Gazebo Sim ROS2 Control Plugin

Introduction to the Gazebo Sim ROS2 Control plugin for integrating hardware interfaces.
5.6
Move a laser up and down by position

Learn how to move a laser up and down by position using ros2_control.
5.7
Move a Joint programmatically

Learn how to move a joint programmatically using Python.
5.8
Rotate the laser model by velocity around the Z-axis

Learn how to rotate the laser model around its Z-axis using a velocity controller.
5.9
Conclusions

What did you learn in this unit?
6. Sensing
(0%)

Learn how to add sensors to your robot model.
6.1
Introduction

What will you learn in this unit?
6.2
Lidar Plugin

Learn how to use the Lidar plugin to add lidar sensors to your robot.
6.3
Hands-on Practice!

Practice further by adding two more sensors to the robot: an RGB camera and a PointCloud camera.
6.4
Camera Sensor Plugin

Review how to use the Camera Sensor plugin to add cameras to your robot.
6.5
IMU Plugin

Learn how to use the IMU plugin to add an inertial measurement unit to your robot.
6.6
Real Robot Project

Complete Part 2 of the Real Robot Project.
6.7
Conclusions

What did you learn in this unit?
7. Xacro Basics
(0%)

Learn the basics of Xacro and how to use it to generate and simplify URDF files.
7.1
Introduction

What will you learn in this unit?
7.2
Basics on Using XACRO

Learn the basics of Xacro and how to use it to generate and simplify URDF files.
7.3
Manually Generating URDF Files from XACRO Files

Learn how to manually generate URDF files from XACRO files.
7.4
Process XACRO Files inside Launch Files

Learn how to process XACRO files within ROS 2 launch files.
7.5
Xacro Properties

Learn how to define and use properties in XACRO files.
7.6
Xacro Macros

Learn how to create and use macros in XACRO files.
7.7
Xacro Conditional Blocks

Learn how to use conditional blocks in XACRO files to control robot configuration.
7.8
Splitting Files

Learn how to split XACRO files for better organization and management.
7.9
Spawning Multiple XACRO Robot Models into Gazebo Sim

Learn how to spawn multiple XACRO robot models into Gazebo for simulation.
7.10
Real Robot Project

Complete Part 3 of the Real Robot Project.
7.11
Conclusions

What did you learn in this unit?
8. Robot Assembly Exporting
(0%)

Learn how to export a CAD assembly from Onshape to a URDF file
8.1
Introduction

What will you learn in this unit?
8.2
Onshape Export

Introduction to Onshape software.
8.3
Step 1: Create an Onshape account

Create an Onshape account.
8.4
Step 2: Step 2: Install Onshape in your local system

How to Install Onshape in your local system (not required or this course).
8.5
Step 3: Get your Onshape API keys

Learn how to get your Onshape API keys.
8.6
Step 4: Preconfig

Complete some required preconfiguration steps before exporting the model.
8.7
Step 5: Export

Export the model from OnShape.
8.8
Step 6: Post corrections

Fix some small errors in the final exported file.
8.9
Step 7: ROS 2 Launch

Lear how to start the exported model using a ROS 2 launch file.
8.10
Conclusions

What did you learn in this unit?
User Ratings

ROS2 Control Framework
Understand ROS 2 Control to add feedback control to your robot.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.5 (101)
Course Overview
Understand ROS2 Control to add feedback control to your robot
What You Will Learn

    How to configure a ros2_control pipeline
    How to write a minimal custom interface for a hardware device
    Real-life implementation of a custom hardware interface
    Different controller types included with ros2_control
    Application of the course content to solve a robotics project based on a quadruped robot

Course Summary
1. Course Introduction
(0%)

First practical exercises and courses learning goals.
1.1
Introduction

What will you learn in this course?
1.2
What does 'control' mean?

What does control mean and why is it important in robotics?
1.3
A foretaste of what you will learn

Test the controllers already configured in a simulation, so you can have a practical look at what you will learn by completing this course.
1.4
What will you learn

Outline of all the ROS 2 Control skills you will learn in this course.
1.5
Minimum requirements

What are the minimum requirements before starting this course?
1.6
Acknowledgments

Special thanks to all the parties involved in making this course possible.
2. ROS2 Control Basics
(0%)

Guided steps on configuring a ros2_control pipeline.
2.1
Introduction

What will you learn in this unit?
2.2
Simulation Setup

Download the required files and setup the simulation for this unit.
2.3
Add ROS2_control to a simulated robot

Learn the required steps to add ROS2 Control to a simulated robot.
2.4
Create a new package

Create a new package to host the ros2_control configuration and launch files.
2.5
Create a configuration file

Create a configuration file
2.6
Update the robot description file

Learn how to enable ros2_control by adding some new elements to the XACRO file that describes the robot.
2.7
Create a launch file for loading the controllers

Learn to create a ROS 2 launch file for loading the robot controllers.
2.8
Test your ros2_control pipeline

Launch and test your ros2_control pipeline to ensure proper functionality and performance.
2.9
Hands-on Practice!

Apply everything you've learned so far in a hands-on exercise.
2.10
Conclusions

What did you learn in this unit?
3. The Controller Manager
(0%)

Learn about the Controller Manager in ROS 2, its role in managing controllers, and how to interact with it using command-line tools and service calls.
3.1
Introduction

What will you learn in this unit?
3.2
The controller manager explained

Understand how the controller manager works at an internal level.
3.3
Interact with ros2_control using the command line

Learn how to interact with ros2_control from the command line to manage controllers and hardware interfaces efficiently.
3.4
Using service calls to interact with ros2_control

Learn how to use service calls to interact with ros2_control, enabling dynamic control and management of hardware interfaces.
3.5
The spawner script

Discover how to use the spawner script to load and manage controllers in ros2_control efficiently.
3.6
What else can the controller manager do?

Review all the main functionalities of the controller manager.
3.7
Conclusions

What did you learn in this unit?
4. Hardware Interface Implementation Template
(0%)

Write a minimal custom interface for a hardware device.
4.1
Introduction

What will you learn in this unit?
4.2
Hardware interfaces explained

Learn about hardware interfaces in ros2_control, their role, and how they facilitate communication between controllers and hardware.
4.3
Your hardware interface in 5 steps

Learn the 5 steps required to create a hardware interface for your robot.
4.4
Create a package for your hardware interface

Start by creating a new ROS 2 package for your hardware-specific interface.
4.5
Add a header file

Learn how to create a header file (.hpp) for your hardware interface.
4.6
Add a source file

Learn how to create a .cpp source file for your hardware interface.
4.7
Write the on_init() method

Learn how to implement the on_init() method to properly initialize your custom hardware interface.
4.8
Add the on_configure() method

Learn how to implement the on_configure() method to set up your hardware interface for operation.
4.9
Add the export_state_interfaces() method

Learn how to implement the export_state_interfaces() method to define the interfaces that your hardware offers.
4.10
Create the export_command_interfaces() method

Learn how to implement the export_command_interfaces() method to define the commands that control the robot's hardware.
4.11
Implement the on_activate() method

Learn how to implement the on_activate() method to initialize and activate the hardware interface.
4.12
Write the on_deactivate() method

Learn how to write the on_deactivate() method to properly deactivate the hardware interface and release any resources when the system is no longer in use.
4.13
Implement the read() method

Learn how to implement the read() method to retrieve and update the hardware state.
4.14
Implement the write() method

Learn how to implement the write() method to send control commands to the hardware.
4.15
Add the PLUGINLIB_EXPORT_CLASS macro

Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register your hardware interface as a plugin.
4.16
Writing Export Definition for pluginlib

Learn how to write the export definition for pluginlib to ensure your hardware interface is correctly registered and usable.
4.17
Prepare the CMakeLists.txt and package.xml Files

Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure your hardware interface.
4.18
Switching the Hardware Plugin

Learn how to switch the hardware plugin in ros2_control to modify or update the robot's hardware interface.
4.19
Create a New Launch File for Real Hardware

Learn how to create a new launch file in ROS2 to interface with real hardware.
4.20
Create a Configuration File for the Controller Manager and Controllers

Learn how to create a configuration file for the controller manager and controllers to customize and manage the hardware interface.
4.21
Compiling and Testing the Hardware Interface

Compile and test the hardware interface to ensure proper functionality and integration with the ROS2 control system.
4.22
Conclusions

What did you learn in this unit?
5. Hardware Interface Implementation for Dynamixel Servos
(0%)

A real-life implementation of a custom hardware interface based on Dynamixel Servos.
5.1
Introduction

What will you learn in this unit?
5.2
The ROBOTIS Dynamixel SDK

Learn about the ROBOTIS Dynamixel SDK and how to use it to interface with Dynamixel servos for robot control in ROS 2.
5.3
SDK Installation

Follow some simple steps in order to install the Dynamizel SDK.
5.4
Create a Package for Your Dynamixel Hardware Interface

Start by creating a new ROS 2 package for your Dynamixel hardware interface.
5.5
Add a header file

Create a header file (.hpp) for your Dynamixel hardware interface.
5.6
Add a source File

Create a .cpp source file for your Dynamixel hardware interface.
5.7
Write the on_init() method

Learn how to implement the on_init() method to properly initialize the Dynamixel hardware interface.
5.8
Add the export_state_interfaces() method

Learn how to implement the export_state_interfaces() method for the Dynamixel hardware interface.
5.9
Create the export_command_interfaces() method

Learn how to implement the export_command_interfaces() method to define the commands that control the Dynamixel hardware.
5.10
Implement the on_activate() method

Learn how to implement the on_activate() method to initialize and activate the Dynamixel hardware interface.
5.11
Write the on_deactivate() method

Learn how to write the on_deactivate() method to properly deactivate the Dynamixel hardware interface.
5.12
Implement the read() method

Learn how to implement the read() method to retrieve and update the Dynamixel hardware state.
5.13
Implement the write() method

Learn how to implement the write() method to send control commands to the Dynamixel hardware.
5.14
Implement the enable_torque() method

Learn how to implement the enable_torque() method to enable/disable the Dynamixel servo's torque.
5.15
Implement the set_control_mode() method

Learn how to implement the set_control_mode() method to manage the servo's operating mode.
5.16
Implement the reset_command() method

Learn how to implement the reset_command() method to reset the joint's current position.
5.17
Add the PLUGINLIB_EXPORT_CLASS macro

Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register the Dynamixel hardware interface as a plugin.
5.18
Writing Export Definition for pluginlib

Learn how to write the export definition for pluginlib to ensure the Dynamixel hardware interface is correctly registered and usable.
5.19
Prepare your CMakeLists.txt and package.xml files

Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure the Dynamixel hardware interface.
5.20
Switching the Hardware Plugin

Learn how to switch the hardware plugin in ros2_control to modify or update the robot's hardware interface.
5.21
Create a new launch file

Learn how to create a new launch file in ROS2 to start the Dynamixel hardware interface.
5.22
Create a Configuration File for the Controller Manager and Controllers

Learn how to create a configuration file for the controller manager and controllers to customize and manage the Dynamixel hardware interface.
5.23
Compiling and Testing the Hardware Component

Compile and test the Dynamixel hardware interface to ensure proper functionality and integration with the ROS2 control system.
5.24
Conclusions

What did you learn in this unit?
6. The ros2_controllers repository
(0%)

Explore the different controller types included by ros2_control
6.1
Introduction

What will you learn in this unit?
6.2
Available Controllers

Learn about the different built-in controllers provided by the ros2_controllers repository.
6.3
The position_controllers

Learn how the position_controllers in ros2_control manage joint position control, allowing you to command specific positions for robotic actuators.
6.4
The effort_controllers

Learn how the effort_controllers in ros2_control manage effort-based control, enabling you to command forces or torques to robotic actuators.
6.5
The velocity_controllers

Learn how the velocity_controllers in ros2_control allow you to command velocity commands to control the motion of robotic joints.
6.6
The forward_command_controller

Understand how the forward_command_controller in ros2_control is used to send commands for a robot's forward motion.
6.7
The joint_trajectory_controller

Learn how the joint_trajectory_controller in ros2_control enables precise control of robotic joints by following a predefined trajectory.
6.8
The diff_drive_controller

Learn how the diff_drive_controller in ros2_control allows for controlling differential drive robots.
6.9
Conclusions

What did you learn in this unit?
7. Create a custom controller
(0%)

Learn how to create a custom controller in ros2_control to meet the specific needs of your robotic application, extending the functionality of existing controllers.
7.1
Introduction

What will you learn in this unit?
7.2
Your custom controller in 5 steps

Learn the 5 steps required to create a custom controller for your robot.
7.3
Create a package for your custom controller

Start by creating a new ROS 2 package for your custom controller.
7.4
Add a header file

Learn how to create a header file (.hpp) for your custom controller.
7.5
Add a source file

Learn how to create a .cpp source file for your custom controller.
7.6
Write the on_init() method

Learn how to implement the on_init() method to properly initialize your custom controller.
7.7
Add the on_configure() method

Learn how to implement the on_configure() method to set up your custom controller for operation.
7.8
Add the command_interface_configuration() method

Learn how to implement the command_interface_configuration() method to define what command interfaces are required by the controller.
7.9
Create the state_interface_configuration() method

Learn how to implement the state_interface_configuration() method to define what hardware sensor interfaces are required by the controller.
7.10
Implement the get_ordered_interfaces() template function

Learn how to implement the get_ordered_interfaces() method to properly order the available interfaces.
7.11
Write the on_activate() method

Learn how to implement the on_activate() method to initialize and activate the custom controller.
7.12
Write the on_deactivate() method

Learn how to write the on_deactivate() method to properly deactivate the custom controller.
7.13
Implement the update() method

Learn how to implement the update() method in a custom controller to update control commands and ensure the robot's actuators are driven correctly.
7.14
Add the PLUGINLIB_EXPORT_CLASS macro

Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register your custom controller as a plugin.
7.15
Write a plugin description file

Learn how to write the export definition for pluginlib to ensure your custom controller is correctly registered and usable.
7.16
Prepare the CMakeLists.txt and package.xml files

Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure your custom controller.
7.17
Create a Configuration File for the Controller Manager and Controllers

Learn how to create a configuration file for the controller manager and custom controller.
7.18
Update the Gazebo plugin configuration parameters

Update the Gazebo plugin configuration parameters to load the new YAML configuration file for the custom controller.
7.19
Create a new launch file to spawn the robot and run the new controller

Learn how to create a new launch file to spawn the robot in Gazebo and load the new custom controller.
7.20
Recompiling and testing

Compile and test your custom controller to ensure proper functionality and integration with the ROS2 control system.
7.21
Conclusions

What did you learn in this unit?
8. Final Project: Quadruped Robot Solo 8
(0%)

Apply everything learned during the course to solve the Final Course Project based on a Quadruped robot!
8.1
Introduction

What is this project about?
8.2
Simulation Setup

Setup the Quadruped simulation for the final project.
8.3
Introducing the open source Solo quadruped robot

Introduction to the open source Solo 8 quadruped robot used for this project.
8.4
The course project starter code

Introduction to some starting files and code for the final project.
8.5
Spawn and delete from Gazebo

Learn how to spawn and delete the robot using the Gazebo simulator.
8.6
Steps to complete the project

List of all the tasks required to complete this project.
8.7
Test that ros2_control works

Once the project has been completed, properly test that the control systems of the robot work properly.
8.8
Expected Outcome

What is the expected final result of the project?
8.9
Project Solution

Solutions for the final project.
User Ratings

TF ROS2
To finally understand TF in ROS 2
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
4.6 (61)
Course Overview
Imagine this scenario: you have a drone equipped with a camera that needs to follow a subject to capture footage correctly. How do you instruct the robot where to point the camera? How should it follow the subject and maintain the right distance—all dynamically? What is the exact distance between the camera and the subject? Is the orientation correct? ROS 2 TFs manage the relationships between different parts (frames) of a robot, providing the necessary transformations to track positions and orientations. In this ROS 2 TF course, you will learn how TF works through hands-on exercises designed to help you practice and apply these concepts effectively.
What You Will Learn

    How to Visualize `TFs` in ROS2
    How to Publish & Subscribe to TF data
    Understanding Transformations & Frames
    Common TF Command-line Tools (`tf_echo`, `view_frames`…)
    Understanding Static Transform Publisher

Course Summary
1. Introduction to TF
(0%)

Understand the foundations of TF2 and the importance of coordinate frames in robotics.
1.1
Introduction

What is this course about?
1.2
A Typical Robot Problem

Presentation of a typical robotics problem to introduce the concept of coordinate frames.
1.3
Coordinate Systems, Reference Frames, and Coordinate Frames

Understand the concept of a coordinate frame and why it is essential in robotics.
1.4
Conventions

Introduction to the right-hand rule, a key concept in robotics for defining coordinate frames.
1.5
Create a Coordinate Frame

Learn how to create a coordinate in ROS 2 using the command-line tools.
1.6
Visualize Transformations and Coordinate Frames in RVIZ

Learn how to visualize transformations and coordinate frames in RViz.
1.7
The Many Coordinate Frames of a Robot

Learn the importance of coordinate frames in robotics to track the position of the robot's links in space.
1.8
What Is This Course About?

Overview of all the concepts you will learn during this course.
1.9
Special Thanks

Special thanks to all the parties involved in making this course possible.
2. TF Tools and Visualization
(0%)

Get introduced to Transforms (TF) and learn how to use the proper tools to visualize them.
2.1
Introduction

What will you learn in this unit?
2.2
Scene Intro

Introduction to the simulation you will use during this unit.
2.3
Where Is The Turtle?

Presentation of the robotics problem to be solved in this unit.
2.4
View TF Frames in PDF Format

Learn how to use the view_frames ROS 2 tool to visualize the TF frames of a robot in PDF format.
2.5
View TF Frames using rqt_tf_tree

Learn how to use the rqt_tf_tree tool to visualize TF frames and see changes in real-time.
2.6
View TF Frames in the Terminal using tf_echo

Learn how to use the tf_echo ROS 2 node to visualize TF frames in the terminal.
2.7
View TF Frames using RVIZ2

Learn how to use RViz2 to visualize TF rames in 3D space.
2.8
Real Robot Project

Complete Part 1 of the Real Robot Project.
2.9
Conclusions

What did you learn in this unit?
3. Broadcast & Listen to TF data
(0%)

Learn how to broadcast and listen to transformations. Understanding how TFs are published and received is crucial for many robotic tasks.
3.1
Introduction

What will you learn in this unit?
3.2
Scene Intro

Introduction to the simulation you will use during this unit.
3.3
TF Broadcaster

The Turtle model cannot be visualized in RViz2! Solve the problem while learning how to create a TF Broadcaster.
3.4
TF2 Monitor

Learn how to use the tf2_monitor tool to monitor the status of TF data in ROS 2.
3.5
Static Broadcaster

Overview of the different methods to broadcast static transforms.
3.6
Static Broadcaster using the Command Line

Learn how to use the command line to broadcast static transforms in ROS 2.
3.7
Static Broadcaster through a launch file

Learn how to broadcast static transforms using a launch file in ROS 2.
3.8
Static Broadcaster via Python script

Learn how to broadcast static transforms using a Python script in ROS 2.
3.9
TF Listener

Learn how to use the TF Listener to receive and process transform data in ROS 2.
3.10
Real Robot Project

Complete Part 2 of the Real Robot Project.
3.11
Conclusions

What did you learn in this unit?
4. Robot State Publisher
(0%)

Learn how to use the Robot State Publisher to publish the TF data of complex robots.
4.1
Introduction

What will you learn in this unit?
4.2
Spawn a Robot into Gazebo

Spawn a new robot into a Gazebo simulation to comprehend the importance of the Robot State Publisher.
4.3
Robot State Publisher

Learn how to use the Robot State Publisher to broadcast joint states and transforms for a robot in ROS 2.
4.4
Real Robot Project

Complete part 2 of the Real Robot Project.
4.5
Conclusions

What did you learn in this unit?
User Ratings

Intermediate ROS2 (C++)
Take your ROS 2 knowledge to the next level.
Rating 0 of 5
Rating 0.5 of 5
Rating 1 of 5
Rating 1.5 of 5
Rating 2 of 5
Rating 2.5 of 5
Rating 3 of 5
Rating 3.5 of 5
Rating 4 of 5
Rating 4.5 of 5
Rating 5 of 5
0 (0)
Course Overview
In this course, take a deep dive into more advanced ROS 2 learning topics.
What You Will Learn

    How to create different types of launch files in ROS2
    How to work with parameters in ROS2
    Threading in ROS2
    How to manage callbacks in ROS2
    Understand Quality of Service (QoS) in ROS2
    Understand DDS in ROS2
    Work with Managed Nodes in ROS2

Course Summary
1. Course Introduction
(0%)

A brief introduction to the contents of the course. It contains a practical demo.
1.1
Introduction

What is this course about?
1.2
Demo Time!

Get a glimpse of what you'll learn in this course by controlling a robot's speed using ROS 2 parameters!
1.3
What will you learn with this course?

Outline of all the ROS 2 skills you will learn during this course.
1.4
Minimum requirements

What are the minimum requirements before starting this course?
2. Advanced Launch Files
(0%)

Understand launch files in ROS2 and explore different methods of creating launch files
2.1
Introduction

What will you learn in this unit?
2.2
Nested and Modular Launch Files in ROS 2

Learn how to create nested and modular launch files for better organization and reusability in ROS 2.
2.3
Passing Parameters in ROS 2 Launch Files

Learn how to pass parameters in ROS 2 launch files to configure nodes dynamically.
2.4
Conclusions

What did you learn in this unit?
3. XML and YAML Launch Files
(0%)

Learn how to create XML and YAML ROS2 launch files
3.1
Introduction

What will you learn in this unit?
3.2
Languages supported by launch files

Learn about the different languages supported for creating ROS 2 launch files.
3.3
Python Launch Version

Explore the Python-based approach to creating ROS 2 launch files.
3.4
XML Launch Version

Explore the XML-based approach to creating ROS 2 launch files.
3.5
YAML Launch Version

Explore the YAML-based approach to creating ROS 2 launch files.
3.6
Conclusions

What did you learn in this unit?
4. Node Parameters
(0%)

Learn how to work with parameters in ROS2
4.1
Introduction

What will you learn in this unit?
4.2
How do Parameters work in ROS 2?

Learn how parameters work in ROS 2 and the main differences with respect to ROS 1.
4.3
Create a demo code

Create an initial program to practice working with parameters.
4.4
Interact with parameters from the command line tools

Learn how to manage ROS 2 node parameters using command line tools.
4.5
Loading and Dumping Parameters from YAML Files

Learn how to load and save ROS 2 parameters using YAML files.
4.6
Set Parameters via Command Line on Node Startup

Learn how to set parameters from the Command Line when starting a ROS 2 node.
4.7
Recap

Quick recap of the most relevant commands learned so far.
4.8
Examine the code

Analyze the code to gain a deeper understanding of what happens behind the scenes.
4.9
Loading Parameters in Launch Files

Learn how to load parameters into ROS 2 launch files for better node configuration.
4.10
Parameter Callbacks

Learn how to use parameter callbacks in ROS 2 to dynamically manage and update parameters during runtime.
4.11
Examine the code

Analyze the code to gain a deeper understanding of what happens behind the scenes.
4.12
Conclusions

What did you learn in this unit?
5. Lifecycle Nodes
(0%)

Learn about managed nodes and how they work
5.1
Introduction

What will you learn in this unit?
5.2
Why do you need managed nodes?

Learn the importance of managed nodes in ROS 2 and how they improve node lifecycle management.
5.3
What is a Managed Node?

Understand the concept of managed nodes in ROS 2 and their role in simplifying node lifecycle management.
5.4
Simple managed node example

Learn how to create and implement a simple managed node in ROS 2 with an example.
5.5
Managed Nodes command-line interface

Explore the command-line interface for managing nodes in ROS 2, and learn how to interact with managed nodes.
5.6
Life Cycle Manager

Understand the role of the Life Cycle Manager in ROS 2 and how it manages node lifecycle transitions.
5.7
Hands-on Practice!

Practice working with managed nodes with a practical exercise!
5.8
Managed Nodes in Nav2

Learn how managed nodes are utilized in the Nav2 stack to enhance robot navigation and lifecycle management.
5.9
Conclusions

What did you learn in this unit?
6. Quality of Service
(0%)

Understand how QoS is used in ROS 2 with simple examples
6.1
Introduction

What will you learn in this unit?
6.2
What is QoS?

Learn the basics of Quality of Service (QoS) in ROS 2 and its impact on communication.
6.3
Understanding QoS Compatibility

Learn how QoS settings affect compatibility between ROS 2 nodes.
6.4
Hands-on Practice!

Practice the concept of QoS compatibilities with a practical exercise!
6.5
Default QoS Policies

Explore the standard QoS policies used in ROS 2 and their impact on communication.
6.6
Durability

Learn how the Durability QoS policy affects message persistence in ROS 2.
6.7
Deadline

Understand how the Deadline QoS policy ensures timely message delivery in ROS 2.
6.8
Hands-on Practice!

Experiment with different deadline settings to observe their impact on communication.
6.9
Lifespan

Learn how the lifespan QoS policy controls how long messages remain valid.
6.10
Liveliness and LeaseDuration

Explore how liveliness and lease duration ensure reliable communication in ROS 2.
6.11
QoS in ROS 2 Bags

Learn how to handle QoS settings when working with ROS 2 bags for data recording and playback.
6.12
Conclusions

What did you learn in this unit?
7. Understanding DDS
(0%)

Understand DDS in ROS 2, how to modify it, and how to work with QoS.
7.1
Introduction

What will you learn in this unit?
7.2
What is DDS?

Learn the basics of DDS (Data Distribution Service) and its role in ROS 2 communication.
7.3
Foundations of DDS

Explore the core principles of DDS and how it enables efficient communication in ROS 2.
7.4
Check the current Middleware

Learn how to evaluate and inspect the current middleware configuration in ROS 2.
7.5
DDS Implementations Supported in Humble

Explore the DDS implementations supported in ROS 2 Humble and how they impact communication and system performance.
7.6
How to change the DDS implementation

Learn how to switch between different DDS implementations in ROS 2 to optimize performance and compatibility.
7.7
Hands-on Practice!

Experiment with how DDS impacts communication through several practical examples.
7.8
What is the ROS 2 Daemon?

Understand the role of the ROS 2 Daemon and how it facilitates communication between nodes in the ROS 2 ecosystem.
7.9
Sources and Further Readings

Explore additional resources and readings to deepen your understanding of ROS 2 DDS.
7.10
Conclusions

What did you learn in this unit?
User Ratings
