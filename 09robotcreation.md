Build Your First ROS2 Based Robot
Learn to build, program, and simulate your own ROS2 robot from scratch.
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
4.8 (12)
Course Overview
In this hands-on course, you'll go step by step through building your very first ROS2-based robot. You'll learn how to design the physical structure, wire up motors and batteries, set up the onboard computer, and bring everything together using the ROS2 framework. You'll also explore LiDAR, camera integration, URDF modeling, simulation, and even create custom 3D-printed upgrades to enhance your robot.
What You Will Learn

    ・Motor types, control, and integration ・Power systems and battery management ・Setting up your robot's onboard computer ・Installing and using the ROS2 framework ・Designing and assembling the robot structure ・Creating a URDF model of your robot ・Integrating LiDAR for mapping and navigation ・Adding camera support for perception ・Simulating your robot in a virtual environment ・Enhancing with custom 3D-printed parts

Course Summary
1. Introduction
(0%)

Introduction to the course. Learn what you will build and all of the components required.
1.1
Course Introduction

Introduction summary
1.2
FastBot Introduction

First look at the FastBot
1.3
Introduction Demo

Introduction Demonstration. Check what you'll be able to do with your FastBot
1.4
Course Outline

The course outline shows all of the course units, and the requirements you need to take this course
1.5
FastBot Components

List of all the components you need to buy in order to build the FastBot.
1.6
Thanks

Acknowledgements to everyone who helped make this course possible.
2. Motors
(0%)

Understanding motor types, control, and integration.
2.1
Motors Unit Summary

Summary for the motors unit. Check out what you will learn and how long you need for it.
2.2
Motor Specifications

The details of the motors to be selected for the robot. They need to fit the overall design.
2.3
Motor Control Hardware

Learn how you will actually make the motors spin with control and feedback.
2.4
Motor Wiring

Connect the motors to the rest of the system.
2.5
Serial Communication

Learn how to communicate with the motors with a micro-controller through serial communication.
2.6
Conclusion

Motors unit conclusion.
3. Battery
(0%)

Power systems, voltage regulation, and battery management.
3.1
Battery Unit Summary

Summary of what you will learn in this unit.
3.2
Power Consumption Calculation

To ensure the battery can sustain the robot’s power requirements, we must calculate total power consumption, including the motors and sensors.
3.3
Battery Selection

Now that the power requirements are known, we can look for a battery that fits our needs.
3.4
Connect Battery to Robot

With the battery selected, we can now integrate it into the FastBot.
3.5
Conclusion

Battery unit takeaways.
4. Computer
(0%)

Setting up onboard computer for your robot.
4.1
Computer Unit Summary

Computer Unit Summary
4.2
Install Ubuntu Server

The first step is to flash the Raspberry Pi SD Card with Ubuntu.
4.3
Install ROS 2

Install ROS 2 on the Raspberry Pi
4.4
Connect Raspberry Pi to DF Power Module

Connect Raspberry Pi to DF Power Module
4.5
Conclusion

Computer unit conclusion
5. ROS Framework
(0%)

Essential packages, and setting up your environment.
5.1
ROS Framework Summary

Summary of ROS Framework unit
5.2
ROS 2 Workspace

Create a ROS 2 workspace to start creating the framework
5.3
ROS 2 Motor Driver Package

Create a ROS 2 package containing a ROS 2 node that controls a differential drive robot
5.4
Serial Motor Driver Node

Create a ROS 2 node that can process velocity commands from the /cmd_vel topic and convert them into individual wheel speeds
5.5
Bringup Package

In order to easily launch all of the software the robot needs to run, let's create a new package exclusively dedicated to its bringup.
5.6
Conclusion

ROS Framework unit conclusion
6. Physical Structure Design
(0%)

Designing and assembling the robot's chassis.
6.1
Physical Structure Design Unit Summary

Summary of Physical Structure Design Unit
6.2
Part Creation

Learn how to create FastBot parts with CAD tools.
Play
6.3
Assembly Creation

Create an assembly with designed and imported parts
Play
6.4
Mate Parts in Assembly

Learn how to stick parts together in an assembly through mates
Play
6.5
Conclusion

Unit takeaways
7. URDF (Unified Robot Description Format)
(0%)

Creating a digital model of your robot.
7.1
URDF Unit Summary

Summary of what you will learn in this unit
7.2
Basic Structure of a URDF File

Learn how to create your robot's description file
7.3
Robot State Publisher

Publish the state of a robot to tf2
7.4
Conclusion

URDF unit takeaways
8. LiDAR
(0%)

Sensor integration for mapping and obstacle avoidance
8.1
LiDAR Unit Summary

A summary of what you will learn in this unit
8.2
LSLiDAR N-10

LSLiDAR N-10 and its specifications
8.3
Udev Rules

Learn how to set udev rules so that you don't have to specify the port in which the LiDAR is connected to
8.4
ROS 2 Driver

Use the ROS 2 driver available in GitHub to obtain ROS 2 LaserScan messages
8.5
Conclusion

LiDAR unit takeaways
9. Camera
(0%)

Camera integration
9.1
Camera Unit Summary

Learn what you will do in this unit.
9.2
Raspicam

Raspicam specifications and reasons for selection
9.3
ROS 2 Driver

Use an open source package as the ROS 2 driver for the raspicam in order to get ROS 2 image messages
9.4
ros2_v4l2_camera Raspberry Pi Support

Modifications needed in order to use ros2_v4l2_camera as the raspicam ROS 2 driver
9.5
Conclusion

Camera unit takeaways
10. Robot Simulation
(0%)

Learn how to create a simulation of your robot
10.1
Robot Simulation Summary

A summary of what you will learn in this unit
10.2
Adapt URDF for Gazebo

The first step is to adapt the URDF created from the Onshape model in order to be accepted by Gazebo
10.3
Gazebo Plugins

Add Gazebo Plugins, which give URDF models greater functionality and tie in ROS messages
10.4
Simulation Launch Files

Create the launch files needed to start the simulation
10.5
Conclusion

Robot simulation unit takeaways
11. 3D Printed Mods: Enhancing your robot with custom 3D-printed parts
(0%)

3D Printed Mods: Enhancing your robot with custom 3D-printed parts
11.1
3D Printed Mods Unit Summary

Summary of what you will learn in this unit
11.2
Designing the Cover

Design a cover for the FastBot
Play
11.3
3D Printing Considerations

Learn what you need to keep in mind while you are designing for 3D printing
11.4
Conclusion

3D printed mods unit takeaways
User Ratings

MicroROS and Electronics for Robotics
Build a fully functional micro-ROS robot from scratch while learning to bridge embedded hardware with ROS 2 for real-time robotic intelligence.
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
5 (1)
Course Overview
In this hands-on course, you’ll explore the foundations of embedded systems and robotics by building your own micro-ROS robot from the ground up. You’ll assemble the physical structure, wire up motors, sensors, and microcontrollers, and gradually progress to programming real-time behavior using the micro-ROS framework. You’ll learn how micro-ROS brings ROS 2 capabilities to the embedded world, enabling seamless communication between low-level hardware and high-level robotic intelligence. By the end of the course, you'll have a fully functioning robot that senses, moves, and communicates — all from a microcontroller. From setting up your development environment to deploying real-time code on microcontrollers, this course bridges the gap between electronics and modern robotic software design.
What You Will Learn

    ・Assembling the physical structure of your robot ・Wiring motors, sensors, and power systems ・Understanding the role of microcontrollers in robotics ・Setting up your embedded development environment ・Installing and using micro-ROS on supported microcontrollers ・Programming real-time control logic for actuators and sensors ・Communicating with ROS 2 nodes via micro-ROS ・Using publish/subscribe and service mechanisms in embedded systems ・Micro-ROS timers and executors ・Deploying and debugging code on microcontrollers

Course Summary
1. Introduction

This unit is a brief introduction to the contents of the course.
2. A first contact with Micro-ROS

In this unit you will learn how to program your first microROS nodes. You will set up the environment on your host machine to be able to locally run ROS2, you will learn how to develop a microROS application and flash the firmware in your board.
3. Robot Assembly

In this unit you will learn how to assemble PEDRITO, the robot we will use through the course to teach you MicroROS.
4. Controlling the actuators

In this unit you will learn how to remotely control PEDRITO´s actuators: its DC motors and external LEDs. Furthermore, you will dive deeper in topics like ROS2 topics, timers and excecutors.
5. Accessing sensor data

In this unit you will learn how to access PEDRITO´s sensors data using the microROS framework. You will also learn about ROS services in microROS.
6. PEDRITO is no longer blind

In this unit, you will learn how to connect PEDRITO’s ESP32-CAM module to the ROS 2 network. You will also develop and deploy a visualization interface that allows you to monitor all of the robot’s sensor data together in a single, integrated display.
7. Don´t get too close

This final project unit challenges you to apply everything you've learnt throughout the course. You will implement an autonomous behavior in PEDRITO, triggered through a micro-ROS service
User Ratings

TF ROS
To finally understand TF and Robot State Publisher in ROS
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
4.5 (61)
Course Overview
Course Overview --- Imagine the following scenario: you have a robot with a laser mounted on it. In order to be able to use the laser data (ej. to detect an obstacle), the robot needs to know WHERE that laser is mounted in the robot. If you don't provide this information to the robot, when the laser detects that obstacle, how can the robot know where the object is? Is it in front of the robot? Or is it behind it? Well, this relation between the different parts (frames) of a robot is what is handled by `ROS TFs`. In this TF ROS 101 course, you will be able to understand how TF work by practicing in several hands-on exercises
What You Will Learn

    What You Will Learn ---
    How to Visualize `TFs`
    How Publish & Subscribe to TF data
    Understanding Transformations & Frames
    Understanding `Robot State Publisher` & `Joint State Publisher`
    Be comfortable with common TF Command-line Tools (`tf_echo`, `view_frames`…)
    Understanding Static Transform Publisher

Course Summary
1. Intro to TF

You will have a basic idea of what is in the course and what will you learn about TFs
2. TF Basics

Have a first contact with TFs and learn to use the tools to visualise them.
3. Publish & Subscribe to TF data

Learn how to Publish and subscribe to TF topics with a 3d version of turtlesim
4. Understanding Robot State Publisher & Joint State Publisher

Learn how to use the RobotStatePublisher to publish TF data of complex robots.
5. Understanding Static Transforms

Learn how to publish static transforms from a launch file and command line when the situation requires it.
6. PROJECT - Create your own robot with TF from scratch

Project where you will have to create your own robot that publishes its TF
User Ratings

URDF for Robot Modeling
Understanding robot modeling using URDF
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
4.4 (69)
Course Overview
As human beings, we learn from a very young age about our body’s structure: which bones and muscles are part of it, how they are connected between them, how we can move each articulation, etc. For a robot, though, how can we know all this information? Well, this is exactly what URDF files are going to tell us. URDF files define the structure of a robot, the connection between all the different parts, etc. In this course, you will understand how URDF files work, and how to create them for any robot.
What You Will Learn

    How to build a visual robot model with URDF
    How to add physical properties to a URDF Model (Collision, Frictions…)
    How to use XACRO to clean up URDF files.
    How to use URDF in Gazebo-ROS ecosystem.

Course Summary
1. URDF Introduction

Know which robots you will create
2. Building the Visual Robot Model with URDF

Learn the use of URDF files and the tools to help you create your first PixarLike robot.
3. Using URDF for Gazebo

Learn what to add to your URDF for being able to use it in Gazebo Simulator to spawn a robot.
4. Create the URDF files for a Gurdy Robot from scratch

Practice what you have learned to create a completely different three legged robot.
5. XACRO Basics

Learn the basics of XACRO files
6. Project: Advanced XACRO and Create your own Boxing Robot

Learn some advanced XACRO elements and apply all you learn in a project.
User Ratings

Create Your First Robot with ROS (Deprecated)
Creating your first ROS based Robot from Scratch.
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
4.5 (10)
Course Overview
Have you ever dreamed of creating a robot, a robot that truly belongs to you. Within this course, you are going to make your dream come true. You will go through the whole process of mounting the robot, creating a simulation for the robot so that you can test your ROS programs there, building all the controllers for the robot, and finally, getting it to autonomously navigate using ROS tools.
What You Will Learn

    From idea to real robot
    How to mount a real robot
    How to create a simulation for the robot
    How to control your robot with ROS
    Advanced Utilities: Autonomous Navigation, Deep Learning …

Course Summary
1. Introduction

Unit for previewing the contents of the Course.
2. Building the Physical Robot

Steps to mount the 2 wheeled robot, using all the materials you have previously ordered.
3. Creating a Simulation of the Robot

How to create a simulation of your RIAbot robot, so you can test everything you want in the simulated environment, without worrying about damaging anything on the real robot.
4. Connecting to the Physical Robot

How to connect to your RIAbot real robot, both using an Ethernet wire and setting up the WIFI.
5. Creating the Motor Drivers

How to create the motor drivers that will interact with the real ROSbots robot, in order to be able to drive it.
6. Autonomous Navigation I

How to create a Python script that detects and makes the robot follow a line in the ground.
7. Autonomous Navigation II

How to use the ORB-SLAM2 approach, which will allow you to perform SLAM (Simultaneous Localization and Mapping) on your robot by just using an RGB camera.
8. Robot Deep Learning

Full workflow of training your ROSbots robot into following lanes, including all the environments and scripts involved in that training.
User Ratings

ROS Control
To finally understand ROS_Control and how to use it on your robot.
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
4.6 (46)
Course Overview
`ROS_Control` allows you to send commands to the actuators of a robot, in order to control it. For instance, you need ROS Control to move the wheels of a mobile robot, or to move the different joints of a robotic arm in an industrial plant. If you don't master ROS Control, you won't be able to make your robots take actions.
What You Will Learn

    Essential concepts of ROS Control
    How to configure ROS Control on a robot simulation
    How to create a custom controller
    How to create a hardware interface for your robot

Course Summary
1. Introduction to the Course

A brief introduction to the course, containing a demo.
2. ROS_Controls Essentials

Some Basic Concepts regarding the ros_control packages.
3. Configuring the Controllers

How to configure the ROS controllers to work with your simulation.
4. Create a Controller

How to create a very basic ROS controller.
5. Configuring the Controllers (Clarkson Manipulator)

An extra example of how to configure the ROS controllers to work with a 6DOF manipulator robot.
6. Hardware Abstraction Layer

Learn about the Hardware Abstraction Layer, which is in charge of connecting ros_control with the hardware of the robot.
7. QUIZ: Add ros_control to a UR5 manipulator robot

A small project to put everything you've learned together.
User Ratings
