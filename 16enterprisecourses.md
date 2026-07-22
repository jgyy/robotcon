# 16 Enterprise & Fleet Robotics

## Robot Fleet Management in ROS2 v2
*Learn how to set up a robot fleet and manage it with the RMF infrastructure.*
**Rating:** 5 (5 reviews)

📂 **Detailed lessons:** [`16enterprisecourses/robot-fleet-management-in-ros2-v2/`](16enterprisecourses/robot-fleet-management-in-ros2-v2/README.md)

### Overview
Managing fleets of robots is tough work. That's why having a high-level API for managing fleets of different robots and systems is key. RMF allows you to do that. It gives you the tools to: * Manage different fleets of robots * Assign tasks to the robot best suited for the job based on criteria like the type of robot and the time spent doing that task or battery level. * Integrate already existing robot systems through API calls and ROS2 topics. * Integrate non-robot systems like doors, lifts, and humans.

### What you'll learn
- RMF basic structure
- How to create a compliant RMF simulation
- How to set up Free Fleet for autonomous mobile robots
- How to set up basic tasks like deliver, clean, patrol, and charge
- How to create your own custom fleet adapter to integrate API and ROS2 systems of your robot into RMF.
- How to dock in RMF
- How to clean with RMF
- How to create a GUI for humans to interact with RMF

### Course outline
1. **Introduction to fleet management** — Understand what fleet management entails and why it is required.
2. **Simple RMF Setup - Part 1** — Learn how to set up a basic RMF-enabled system.
3. **Simple RMF Setup - Part 2** — Learn how to set up a basic RMF setup with two robots in the same fleet.
4. **Simple RMF Setup - Part 3** — Learn how to setup a basic RMF system with two different fleets
5. **Custom Adapter step by step - Part 1** — Learn how to create an RMF adapter for your own robot.
6. **Custom Adapter step by step - Part 2** — Learn how to create an RMF adapter for your own robot that uses ROS2 navigation stack.
7. **RMF Map Transforms** — Learn how to adjust your RMF setup for translations between the RMF coordinates and the robot's location coordinates.
8. **Custom Task** — Learn one method to create custom tasks for your robots triggered when arriving to certain locations.
9. **Multifleet with custom adapters** — Learn how to set up your custom adapters to have different robot fleets in the same systems.
10. **Default Tasks** — Learn about the default tasks defined in RMF.
11. **Battery Management** — Learn how RMF manages the battery levels of your robot fleet.
12. **Human Interaction with RMF** — Learn how to integrate human-operated systems in RMF.
13. **Interaction With Other Systems** — Learn how to integrate non-robot fleet systems in RMF, like robot arms.
14. **Custom rmf-panel-js** — Learn how to create your own web interface for asking tasks to RMF.
15. **RMF Traffic Editor** — Learn about the RMF tool for map creation, create gazebo simulations based on that and add RMF-ready robots to the simulation.
16. **Doors** — Learn how to add RMF-enabled doors with the traffic editor tool.
17. **Multilevel Environments** — Learn how to create maps with multiple floors compatible with RMF with the traffic editor tool.

## DDS for Robotics
*Learn how DDS works for ROS2-based robots.*
**Rating:** 5 (1 reviews)

📂 **Detailed lessons:** [`16enterprisecourses/dds-for-robotics/`](16enterprisecourses/dds-for-robotics/README.md)

### Overview
Learn how DDS works for ROS2-based robots and solve DDS-related problems when your robotics system is not working.

### What you'll learn
- Learn how DDS works for ROS2-based robots and solve DDS-related problems when your robotics system is not working.

### Course outline
1. **Introduction** — Introduction to DDS for Robotics course.
2. **Linux Networking** — Introduction to basics of Linux networking.
3. **Network Analysis with Wireshark** — Use wireshark to analyze a network and understand how RTPS packets are travelling.
4. **DDS as ROS 2 Middleware** — Introduction to DDS as the middleware of ROS 2.
5. **DDS Use Case: TurtleBot 4** — This unit studies the practical case of the DDS network in a popular open source robot: the TurtleBot 4.
6. **DDS Discovery** — Introduction of discovery traffic and the limitations it imposes on wireless DDS networks.
7. **DDS XML Configuration Files** — Learn how to configure DDS settings in both CycloneDDS and Fast DDS using an XML configuration file.
8. **Zenoh** — Introduction to Zenoh. Learn how to fix DDS issues with Zenoh.
9. **Vulcanexus** — A look into Vulcanexus and the tools it provides to alleviate DDS issues.
10. **Project - Section 1** — Project - Section 1
11. **Project - Section 2** — Project - Section 2
12. **Project - Section 3** — Project - Section 3

## Mastering Mobile Manipulators
*Master how to create ROS applications for autonomous mobile manipulators*
**Rating:** 5 (2 reviews)

📂 **Detailed lessons:** [`16enterprisecourses/mastering-mobile-manipulators/`](16enterprisecourses/mastering-mobile-manipulators/README.md)

### Overview
Robot manipulators are mobile robots equipped with mobility, one or several robotics arms, and a gripper. They have the ability to autonomously move within an environment, detect objects to grasp, and grasp them to bring them to the proper location. They are widely used in warehouses to locate and bring stuff, in malls and airports to clean, in nuclear areas to access dangerous zones, and even underwater to reach difficult locations. Robot manipulators will be used even more in the near future as their skills improve. In this course, you will learn how to build a complete ROS application to make a mobile manipulator fill a box with the proper objects obtained from another location.

### What you'll learn
- How to do robot navigation in known environments.
- How to use perception to detect the objects to grasp in the background.
- How to move a robotic arm with a gripper to grasp an object.
- How to create a complete application that integrates all these behaviors into a single ROS app based on State Machines.
- How to create a web interface that allows people without ROS knowledge to control the robot's operation.

### Course outline
1. **Setting Up the Navigation System for a Mobile Manipulator** — Learn how to set up a Navigation System (using the ROS Navigation Stack) for a Mobile Manipulator robot.
2. **Setting Up Manipulation (Part 1)** — Learn how to create a MoveIt Package for your mobile manipulator robot. By completing this unit, you will be able to create a package that allows your robotic arm to perform motion planning.
3. **Setting Up Manipulation (Part 2)** — Learn how to perform motion planning with Python scripts. By completing this unit, you will be able to create a Python program that performs motion planning on your robotic arm.
4. **Setting Up Grasping** — Learn how to create a program that performs a full pick and place task, paying special attention to the grasping process.
5. **Creating the behavior of the robot** — Learn how to create and manage state machines, using FlexBe, in order to generate different behaviors for your robot.
6. **Creating the Web interface** — Learn how to create a Web Interface for the robot. You will be able to see the navigation map, the robot camera, control the robot through a web-joystick, and start/stop the pick and place algorithm.
