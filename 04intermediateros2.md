# 04 Intermediate ROS 2

## ROS2 Navigation
*Learn how make robots autonomously navigate using Nav2*
**Rating:** 4.5 (142 reviews)
📂 **Detailed lessons:** [`04intermediateros2/ros2-navigation/`](04intermediateros2/ros2-navigation/README.md)

### Overview
This course teaches how to use the Nav2 package of ROS2 to make a robot autonomously navigate. You will understand how all the parts work together so you can adapt it to your own robot

### What you'll learn
- How to build a map of the environment
- Localizing a robot in a map of the environment
- Path Planning from an initial position to a desired goal
- Obstacle avoidance using costmaps
- Navigation Lifecycle Manager
- How behavior trees influence Nav2
- How to do multiple robot navigation

### Course outline
1. **Introduction to ROS 2 Navigation** — This unit introduces you to the essential components of Nav2 and the contents of this course.
   - Introduction: A brief explanation of what to expect from this course.
   - How robots navigate: Introduction to the key components that enable robots to navigate autonomously.
   - A Hands-on Experience: Try a demo where you'll be able to send navigation goals to a mobile robot!
   - What You Will Learn in this Course: Outline of all the Nav2 skills you will learn in this course.
   - Robots Used in this Course: Learn about the robot you will be using during the course.
   - Real Robot Project: Apply what you've learned in the course to a project based on a real robot.
   - Get a Certificate: Earn a certificate that validates your knowledge of ROS 2Navigation!
   - Requirements for the Course: What are the minimum requirements before starting this course?
   - Acknowledgements: Special thanks to all the parties involved in making this course possible.
2. **How to Build a Map** — Learn how to build a map for autonomous navigation.
   - Introduction: What will you learn in this unit?
   - What is a Map in ROS?: Learn about the concept of Maps in ROS.
   - What is Required to Build a Map?: Learn about the requirements to build a map in ROS.
   - SLAM: Learn about the concept of SLAM (Simultaneous Localization and Mapping).
   - cartographer_ros: What is the cartographer_ros package?
   - Launching cartographer for your robot: Learn how to launch Cartographer for your robot in order to perform SLAM.
   - How to configure cartographer for different robots: Learn about the main configuration options for the cartographer_ros package.
   - Saving the map for later use: Learn how to save a map to your computer.
   - Providing the map to other nodes: Learn how to provide the generated map to other nodes in your ROS 2 system.
   - Lifecycle Nodes Overview: Get an overview of Lifecycle Nodes and their role in managing node states in ROS 2.
   - Nav2 Lifecycle Manager: Learn about the Nav2 Lifecycle Manager and how it controls the state transitions of navigation-related nodes.
   - Real Robot Project: Complete the Real Robot Project section associated with Mapping
   - Conclusions: What did you learn in this unit?
3. **How to localize the robot in the environment** — Learn how to localize a robot within its environment using ROS 2 navigation tools and techniques.
   - Introduction: What will you learn in this unit?
   - AMCL: Introduction to the AMCL (Adaptive Monte-Carlo Localization) algorithm.
   - Launching AMCL for your robot: Learn how to launch AMCL for your robot in order to perform localization.
   - About robot localization: Learn more about robot localization and the AMCL technique.
   - Configuration parameters for AMCL: Learn about the main configuration options for the AMCL ROS package.
   - Set the initial location of the robot from a config file: Learn how to set the initial location of the robot from a configuration file.
   - Set the initial location of the robot from the command line: Learn how to set the initial location of the robot using the command line tools.
   - Set the initial location of the robot programmatically: Learn how to set the initial location of the robot from a ROS 2 program.
   - Global localization: Understand the concept of global localization and how it helps a robot determine its position in an unknown environment.
   - Real Robot Project: Complete the Real Robot Project section associated with Localization.
   - Conclusions: What did you learn in this unit?
4. **How to do Path Planning in ROS 2** — Learn how to perform path planning in ROS 2 to navigate a robot efficiently in its environment.
   - Introduction: What will you lear in this unit?
   - Launching Path Planning for your robot: Learn how to launch the Path Planning system for your robot.
   - Planner Parameters: Explore the key parameters used to configure path planners in Nav2.
   - Controller Parameters: Learn about the key parameters for configuring the controller server in Nav2.
   - Behavior Parameters: Learn about the key parameters for configuring the different behaviors of your robot while navigating.
   - Play with the parameters!: Complete an exercise and experiment with some parameters to better understand how they affect the robot's behavior.
   - Sending a navigation goal through the command line: Learn how to send a navigation goal to your robot using the command line.
   - Sending a navigation goal programmatically: Learn how to send a navigation goal to your robot from a ROS 2 prorgam.
   - Real Robot Project: Complete the Real Robot Project section associated with Path Planning.
   - Conclusions: What did you learn in this unit?
5. **How Obstacle Avoidance happens in ROS2** — Learn how obstacle avoidance is implemented and managed in ROS2.
   - Introduction: What will you learn in this unit?
   - Costmaps: Understand how costmaps are used for navigation and obstacle avoidance in ROS2.
   - Global & Local Costmaps: Learn the difference between global and local costmaps and how they are used in ROS2 navigation.
   - Add a global costmap to your navigation system: Learn how to integrate a global costmap into your ROS2 navigation system.
   - Global Costmap obstacle layers: Learn how to configure and manage obstacle layers in the global costmap for ROS2 navigation.
   - Configuring the global costmap parameters: Learn how to configure the parameters of the global costmap to optimize robot navigation in ROS2.
   - Add a local costmap to your navigation system: Learn how to integrate a local costmap into your ROS2 navigation system.
   - The role of the shape of the robot in the Costmaps: Understand how the shape of the robot affects the costmaps in ROS2 navigation.
   - Creating a single navigation launch file: Learn how to create a single launch file to launch your entire navigation system in ROS2.
   - Real Robot Project: Complete the Real Robot Project section associated with Obstacle Avoidance.
   - Conclusions: What did you learn in this unit?
6. **Multi-robot Navigation** — Learn how to configure navigation for multirobot environments.
   - Introduction: What will you learn in this unit?
   - Multi-robot Setup: Learn how ROS 2 systems are set up to work with multiple robots.
   - Mapping: Learn how Mapping works when managing multiple robots.
   - Localization: Learn how Localization works when managing multiple robots.
   - Path Planning: Learn how path planning works when managing multiple robots.
   - Single Launch: Create a single launch file to launch your entire multirobot navigation system in ROS2.
   - Conclusions: What did you learn in this unit?

## Behavior Trees for ROS2
*Learn to use Behavior Trees in ROS2.*
**Rating:** 4.2 (30 reviews)
📂 **Detailed lessons:** [`04intermediateros2/behavior-trees-for-ros2/`](04intermediateros2/behavior-trees-for-ros2/README.md)

### Overview
Understand the concept of the Behavior Trees framework. Learn how to use the Behavior Trees framework in practice and how to apply them with ROS2.

### What you'll learn
- The course is dedicated to robot enthusiasts and all the others who would like to stay abreast of current robotics development. During the course, you are going to learn about:
- Behaviour Trees as a new abstraction layer in the software robotics stack.
- Learn about the mechanisms and design principles of the Behavior Trees framework.
- You will receive practical skills to use BehaviorTree.CPP framework together with ROS2 (architect the robot behavior).
- You will learn the advanced mechanisms of BehaviorTree.CPP framework (stochastic behavior) and automated planning.

### Course outline
1. **Introduction to the Course** — This unit is an introduction to the Behavior Trees in ROS2 course. You will have a quick preview of the contents to be covered in the course and a practical demo.
2. **Introduction to Behavior Trees** — In this unit of the course, you are going to understand the Behavior Tree concept and simplified software architecture which can be accommodated into the ROS2 framework. You are going also to discuss the fundamental mechanisms of BTs.
3. **Design principles of Behavior Trees** — This unit will provide you a deep understanding of BT architecture and the mechanisms that allow architecting the logical connections of robot behaviors.
4. **Integration of Behavior Trees with ROS2** — In this unit, we are going to dive into the BehaviorTree.CPP library as a framework that allows the integration of Behavior Trees with ROS2.
5. **Stochastic behavior trees and automated planning** — This unit introduces the probabilistic behavior of nodes and gives you a general overview of how to incorporate automated planning (architecture changes) into Behavior Trees.
6. **Final Project** — Final challenge of the course, that will test everything you've learned during the course.

## Distributing ROS Apps with Snaps
*Distribute robotics applications like a global software vendor*
**Rating:** 4.5 (2 reviews)
📂 **Detailed lessons:** [`04intermediateros2/distributing-ros-apps-with-snaps/`](04intermediateros2/distributing-ros-apps-with-snaps/README.md)

### Overview
While developing is usually handled well by robotics developers, deploying a robotics application can be confusing. One might compile the code on robots, copy/paste compiled packages, and end up with unknown versions of software Snap offers a solution to build and distribute robotics applications and, more generally, any software. You will learn how to use snaps to automatize robot applications distribution

### What you'll learn
- We will cover the basics of snap creation for ROS and ROS 2 applications. Then, by introducing the main concepts of snap, learn how to confine your robotics application and make it installable on dozens of Linux distributions.

### Course outline
1. **Snaps - Part 1** — The basics of snap creation for ROS and ROS 2 applications.

## Intermediate ROS2
*Take your ROS2 knowledge to the next level.*
**Rating:** 4.5 (40 reviews)
📂 **Detailed lessons:** [`04intermediateros2/intermediate-ros2/`](04intermediateros2/intermediate-ros2/README.md)

### Overview
In this course, take a deep dive into more advanced ROS2 learning topics.

### What you'll learn
- How to create different types of launch files in ROS2
- How to work with parameters in ROS2
- Threading in ROS2
- How to manage callbacks in ROS2
- Understand Quality of Service (QoS) in ROS2
- Understand DDS in ROS2
- Work with Managed Nodes in ROS2

### Course outline
1. **Introduction** — A brief introduction to the contents of the course. It contains a practical demo.
2. **ROS2 Build System** — ROS2 has introduced a new build system, with many changes with respect to ROS1. In this unit, you will learn about the Python build system and how to use it optimally.
3. **Advanced Launch Files** — Understand launch files in ROS2 and explore different methods of creating launch files
4. **XML and YAML Launch Files** — How to create XML and YAML ROS2 launch files
5. **Node Parameters** — Learn how to work with parameters in ROS2
6. **Managing Complex Nodes** — Learn about multithreading with ROS2 and callback management
7. **Quality of Service** — Understand how QoS is used in ROS2 with simple examples
8. **Understanding DDS** — Understand DDS in ROS2 , how to modify it, and how to work with QoS
9. **Lifecycle Nodes** — Learn about managed nodes and how they work
10. **Course Project** — Create a ROS2 node to detect circular shapes using the laser scan data

## Advanced ROS2 Navigation
*Take a deeper look at Navigation for ROS2*
**Rating:** 4.5 (58 reviews)
📂 **Detailed lessons:** [`04intermediateros2/advanced-ros2-navigation/`](04intermediateros2/advanced-ros2-navigation/README.md)

### Overview
Do you want a more advanced understanding of ROS2 Navigation? This course covers advanced topics that are not part of the basic Nav2 course.

### What you'll learn
- How to use the Simple Commander API
- How to use Costmap Filters
- An explanation of the BT Navigator
- How to create a custom behavior
- How to use Groot for visualizing behaviors
- How plugins are used in Nav2
- How to create custom plugins for Nav2
- The three main plugins of the controller server

### Course outline
1. **New Nav2 Features** — Learn about the Simple Commander API and how to create and use Costmap Filters
   - Introduction: What will you learn in this unit?
   - Setup Nav2: Set up the Nav2 system for the unit.
   - The Simple Commander API: Introduction to the Simple Commander API.
   - Navigate To Pose: Discover how to use the Navigate To Pose action in Nav2 to send your robot to a specific location efficiently.
   - Navigate Through Poses: Learn how to use the Navigate Through Poses action in Nav2 to guide your robot through multiple waypoints seamlessly.
   - Waypoint Following: Discover how to use the FollowWaypoints action in Nav2 to navigate a sequence of predefined waypoints efficiently.
   - Costmap Filters: Brief introduction to Costmap Filters.
   - Keepout Mask: Learn how to implement and use a Keepout Mask in Nav2 to prevent the robot from entering specific areas of the map.
   - Speed Limits: Learn how to set and apply speed limits in Nav2 to control the robot's speed in different areas of the map.
   - Conclusions: What did you learn in this unit?
2. **Behavior Trees** — Explore how Behavior Trees (bt_navigator) are used in Nav2 to control the robot's decision-making process during navigation.
   - Introduction: What will you learn in this unit?
   - What is the BT Navigator: Learn about the BT Navigator, a Nav2 component that uses Behavior Trees to manage navigation tasks.
   - How to create a behavior: Learn how to create a behavior in Behavior Trees to control robot actions within the BT Navigator.
   - Analyzing the behavior of the XML file: Understand how to analyze and interpret the behavior defined in the XML file for Behavior Trees in the BT Navigator.
   - How to provide the behavior to the bt_navigator: Learn how to provide a behavior to the bt_navigator and integrate it into your robot's navigation system.
   - Hands-on Practice!: Create your own behavior XML file for the bt_navigator.
   - Recovery Behaviors: Understand how recovery behaviors work in ROS 2 navigation.
   - Conclusions: What did you learn in this unit?
3. **Nav2 Plugins and Custom Plugin Creation** — Learn about the core Nav2 plugins and how to create custom plugins for costmaps, planners, and controllers to tailor navigation functionality to your needs.
   - Introduction: What will you learn in this unit?
   - Plugins in Nav2: Explore the role of plugins in Nav2.
   - Default Plugins: Explore the default plugins in Nav2, including those for costmaps, planners, and controllers, and understand how they contribute to the navigation system.
   - Custom Nav2 Plugins Creation: Introduction and set up for creating a custom plugin.
   - Costmap Plugin: Introduction to the Costmap plugin in Nav2 for effective obstacle detection and path planning.
   - Step 1: Create a new ROS 2 package: Start by creating a new ROS 2 package for your costmap custom plugin.
   - Step 2: Create the source and header files: Create the header and source files for your costmap custom plugin.
   - Step 3: Create the Plugin Information XML File: Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
   - Step 4: Setup the CMakelists.txt and the package.xml for compilation: Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
   - Step 5: Configure, Compile and Test: Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
   - Hands-on Practice!: Practice by creating your own custom costmap plugin.
   - Planner Plugin: Introduction to the Planner plugin in Nav2 to generate paths for robot navigation based on the environment.
   - Step 1: Create a new ROS 2 package: Start by creating a new ROS 2 package for your planner custom plugin.
   - Step 2: Create the source and header files: Create the header and source files for your planner custom plugin.
   - Step 3: Create the Plugin Information XML File: Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
   - Step 4: Setup the CMakelists.txt and the package.xml for compilation: Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
   - Step 5: Configure, Compile and Test: Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
   - Hands-on Practice!: Practice by creating your own custom planner plugin.
   - Controller Plugin: Introduction to the Controller plugin in Nav2, which drives the robot along the planned path, ensuring smooth and efficient movement.
   - Step 1: Create a new ROS 2 package: Start by creating a new ROS 2 package for your controller custom plugin.
   - Step 2: Create the source and header files: Create the header and source files for your controller custom plugin.
   - Step 3: Create the Plugin Information XML File: Create the Plugin Information XML File to ensure your plugin is correctly registered and usable.
   - Step 4: Setup the CMakelists.txt and the package.xml for compilation: Prepare the CMakeLists.txt and package.xml files to properly compile your plugin.
   - Step 5: Configure, Compile and Test: Configure, compile, and test the plugin to ensure proper functionality and integration with the ROS2 navigation system.
   - Conclusions: What did you learn in this unit?
4. **Controller Server In Depth** — Explore the various plugin options and configurations available for the controller server.
   - Introduction: What will you learn in this unit?
   - Controller Server Config: Explore the configuration options for the controller server.
   - Controller Server Plugins: Explore the available plugins for the controller server and how to configure them.
   - Hands-on Practice!: Explore a few critical behaviors, helping you better understand how to work with them.
   - Conclusions: What did you learn in this unit?

## ROS2 Security
*Learn to enable and manage security with ROS2*
**Rating:** 4.4 (8 reviews)
📂 **Detailed lessons:** [`04intermediateros2/ros2-security/`](04intermediateros2/ros2-security/README.md)

### Overview
How ROS2 can be executed in a trustee area without letting other people access to the same network? The answer is here, ROS2 has been released with security tools that allow it to secure the robotics systems. They are disabled by default, but they can be enabled in order to make robots safer. This course will endow you with the knowledge to work with the ROS2 security layer. You are going to learn how to enable security, how to work with specific security packages, and also how to make a turtlebot3 environment work in a safe layout.

### What you'll learn
- Basic ROS2 security concepts: Authentication, Cryptography, Access Control, etc.
- How to create security in a turtlebot3 simulation.
- How to launch a turtlebot3 simulation and move it around with teleop with security enabled.
- What does a keystore contain?
- How the enclaves are generated?
- How to access a certificate?
- How to validate a certificate?
- How to add a new custom node in the turtlebot_keystore?

### Course outline
1. **Introduction to the Course** — A brief introduction to the contents that will be covered during the course.
2. **Activating security in ROS2** — Learn how to enable security for your ROS2 system.
3. **Key Materials Explanation** — Take a deep look at the different elements involved in security, such as the keystore, the enclaves, etc...

## URDF for Robot Modeling in ROS2
*Understanding robot modeling using URDF in ROS 2*
**Rating:** 4.5 (136 reviews)
📂 **Detailed lessons:** [`04intermediateros2/urdf-for-robot-modeling-in-ros2/`](04intermediateros2/urdf-for-robot-modeling-in-ros2/README.md)

### Overview
As human beings, we learn from a very young age about our body's structure: which bones and muscles are part of it, how they are connected between them, how we can move each articulation, etc. For a robot, though, how can we know all this information? Well, this is exactly what URDF files are going to tell us. URDF files define the structure of a robot, the connection between all the different parts, etc. In this course, you will understand how URDF files work and how to create them for any robot.

### What you'll learn
- How to build a visual robot model with URDF.
- How to add physical properties to a URDF Model (Collision, Frictions…).
- How to use XACRO to clean up URDF files.
- How to use URDF in Gazebo Sim - ROS 2 ecosystem.
- How to use URDF-XACRO in ROS 2 systems.

### Course outline
1. **Introduction** — Brief introduction to the contents of the course.
   - Introduction: What will you learn in this unit?
   - Why do You need URDFs?: Understand why URDFs are essential for robot description in ROS.
   - Course Outline: Get an overview of the course structure and topics.
   - Requirements: What are the minimum requirements before starting this course?
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **Building a Robot Model with URDF** — Learn the use of URDF files and the tools to help you create your first PixarLike robot.
   - Introduction: What will you learn in this unit?
   - What is a URDF File: Understand what a URDF file is and its role in robot description.
   - Initial Setup: Setup the packages and folders required to create the Robot Model.
   - What is a LINK: Understand what a LINK is and its role in the URDF robot description.
   - Visualise URDF Files in RVIZ2: Learn how to visualize URDF files in RViz2 for robot model representation.
   - What Is A JOINT: Understand what a JOINT is and its role in the URDF robot description.
   - TF Frames and LINKS: Understand the relationship between TF frames and LINKS in robot kinematics.
   - Joint Types: Learn about different joint types and their roles in robot motion.
   - Move the Joints Through a Joint State Publisher: Learn how to move joints using the Joint State Publisher in ROS.
   - URDF Materials: Understand how to define and apply materials in URDF files.
   - URDF Meshes: Learn how to use and integrate meshes in URDF files for robot visualization.
   - Joint Special Elements: Learn about some special elements (tags) in joint definition and their function in robot kinematics.
   - Launch RViz2 through a Launch File: Learn how to launch RViz2 using a ROS 2 launch file.
   - Conclusions: What did you learn in this unit?
3. **MicroProject: Create URDF file for two wheeled robot** — Practice how to create a visual representation of a robot in URDF by completing a small project.
   - Introduction: Review the main properties of the robot you have to build for the Micro Project.
   - Main Ojective: Description of the tasks required to complete the Micro Project.
4. **Using URDF for Gazebo Sim** — Learn how to spawn a robot URDF in Gazebo Sim.
   - Introduction: What will you learn in this unit?
   - Start Gazebo Sim: Follow the steps to launch a Gazebo Sim world for the my_box_bot robot.
   - Create a Gazebo Sim world: Follow the steps to create a Gazebo Sim world to spawn the robot.
   - Adapting a Robot Model for Gazebo Sim: Learn how to adapt a robot model for use in a Gazebo Sim simulation.
   - Complete the Robot!: Define the collisions and inertias for your robot.
   - Spawning the Robot Model in Gazebo Sim: Learn how to create a Launch File to spawn a Robot Model into the Gazebo Sim simulator.
   - Physical Properties: Learn how to define and apply physical properties to robot models.
   - Real Robot Project: Complete Part 1 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?
5. **Moving the robot** — Learn how to enable joint movement for a robot model.
   - Introduction: What will you learn in this unit?
   - Possible Approaches: An overview of possible approaches to enable joint movement for the robot.
   - Joint State Publisher Plugin: Learn how to use the Joint State Publisher plugin to control robot joints.
   - Differential Drive Plugin: Learn how to use the Differential Drive plugin for robot movement control.
   - Gazebo Sim ROS2 Control Plugin: Introduction to the Gazebo Sim ROS2 Control plugin for integrating hardware interfaces.
   - Move a laser up and down by position: Learn how to move a laser up and down by position using ros2_control.
   - Move a Joint programmatically: Learn how to move a joint programmatically using Python.
   - Rotate the laser model by velocity around the Z-axis: Learn how to rotate the laser model around its Z-axis using a velocity controller.
   - Conclusions: What did you learn in this unit?
6. **Sensing** — Learn how to add sensors to your robot model.
   - Introduction: What will you learn in this unit?
   - Lidar Plugin: Learn how to use the Lidar plugin to add lidar sensors to your robot.
   - Hands-on Practice!: Practice further by adding two more sensors to the robot: an RGB camera and a PointCloud camera.
   - Camera Sensor Plugin: Review how to use the Camera Sensor plugin to add cameras to your robot.
   - IMU Plugin: Learn how to use the IMU plugin to add an inertial measurement unit to your robot.
   - Real Robot Project: Complete Part 2 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?
7. **Xacro Basics** — Learn the basics of Xacro and how to use it to generate and simplify URDF files.
   - Introduction: What will you learn in this unit?
   - Basics on Using XACRO: Learn the basics of Xacro and how to use it to generate and simplify URDF files.
   - Manually Generating URDF Files from XACRO Files: Learn how to manually generate URDF files from XACRO files.
   - Process XACRO Files inside Launch Files: Learn how to process XACRO files within ROS 2 launch files.
   - Xacro Properties: Learn how to define and use properties in XACRO files.
   - Xacro Macros: Learn how to create and use macros in XACRO files.
   - Xacro Conditional Blocks: Learn how to use conditional blocks in XACRO files to control robot configuration.
   - Splitting Files: Learn how to split XACRO files for better organization and management.
   - Spawning Multiple XACRO Robot Models into Gazebo Sim: Learn how to spawn multiple XACRO robot models into Gazebo for simulation.
   - Real Robot Project: Complete Part 3 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?
8. **Robot Assembly Exporting** — Learn how to export a CAD assembly from Onshape to a URDF file
   - Introduction: What will you learn in this unit?
   - Onshape Export: Introduction to Onshape software.
   - Step 1: Create an Onshape account: Create an Onshape account.
   - Step 2: Step 2: Install Onshape in your local system: How to Install Onshape in your local system (not required or this course).
   - Step 3: Get your Onshape API keys: Learn how to get your Onshape API keys.
   - Step 4: Preconfig: Complete some required preconfiguration steps before exporting the model.
   - Step 5: Export: Export the model from OnShape.
   - Step 6: Post corrections: Fix some small errors in the final exported file.
   - Step 7: ROS 2 Launch: Lear how to start the exported model using a ROS 2 launch file.
   - Conclusions: What did you learn in this unit?

## ROS2 Control Framework
*Understand ROS 2 Control to add feedback control to your robot.*
**Rating:** 4.5 (101 reviews)
📂 **Detailed lessons:** [`04intermediateros2/ros2-control-framework/`](04intermediateros2/ros2-control-framework/README.md)

### Overview
Understand ROS2 Control to add feedback control to your robot

### What you'll learn
- How to configure a ros2_control pipeline
- How to write a minimal custom interface for a hardware device
- Real-life implementation of a custom hardware interface
- Different controller types included with ros2_control
- Application of the course content to solve a robotics project based on a quadruped robot

### Course outline
1. **Course Introduction** — First practical exercises and courses learning goals.
   - Introduction: What will you learn in this course?
   - What does 'control' mean?: What does control mean and why is it important in robotics?
   - A foretaste of what you will learn: Test the controllers already configured in a simulation, so you can have a practical look at what you will learn by completing this course.
   - What will you learn: Outline of all the ROS 2 Control skills you will learn in this course.
   - Minimum requirements: What are the minimum requirements before starting this course?
   - Acknowledgments: Special thanks to all the parties involved in making this course possible.
2. **ROS2 Control Basics** — Guided steps on configuring a ros2_control pipeline.
   - Introduction: What will you learn in this unit?
   - Simulation Setup: Download the required files and setup the simulation for this unit.
   - Add ROS2_control to a simulated robot: Learn the required steps to add ROS2 Control to a simulated robot.
   - Create a new package: Create a new package to host the ros2_control configuration and launch files.
   - Create a configuration file: Create a configuration file
   - Update the robot description file: Learn how to enable ros2_control by adding some new elements to the XACRO file that describes the robot.
   - Create a launch file for loading the controllers: Learn to create a ROS 2 launch file for loading the robot controllers.
   - Test your ros2_control pipeline: Launch and test your ros2_control pipeline to ensure proper functionality and performance.
   - Hands-on Practice!: Apply everything you've learned so far in a hands-on exercise.
   - Conclusions: What did you learn in this unit?
3. **The Controller Manager** — Learn about the Controller Manager in ROS 2, its role in managing controllers, and how to interact with it using command-line tools and service calls.
   - Introduction: What will you learn in this unit?
   - The controller manager explained: Understand how the controller manager works at an internal level.
   - Interact with ros2_control using the command line: Learn how to interact with ros2_control from the command line to manage controllers and hardware interfaces efficiently.
   - Using service calls to interact with ros2_control: Learn how to use service calls to interact with ros2_control, enabling dynamic control and management of hardware interfaces.
   - The spawner script: Discover how to use the spawner script to load and manage controllers in ros2_control efficiently.
   - What else can the controller manager do?: Review all the main functionalities of the controller manager.
   - Conclusions: What did you learn in this unit?
4. **Hardware Interface Implementation Template** — Write a minimal custom interface for a hardware device.
   - Introduction: What will you learn in this unit?
   - Hardware interfaces explained: Learn about hardware interfaces in ros2_control, their role, and how they facilitate communication between controllers and hardware.
   - Your hardware interface in 5 steps: Learn the 5 steps required to create a hardware interface for your robot.
   - Create a package for your hardware interface: Start by creating a new ROS 2 package for your hardware-specific interface.
   - Add a header file: Learn how to create a header file (.hpp) for your hardware interface.
   - Add a source file: Learn how to create a .cpp source file for your hardware interface.
   - Write the on_init() method: Learn how to implement the on_init() method to properly initialize your custom hardware interface.
   - Add the on_configure() method: Learn how to implement the on_configure() method to set up your hardware interface for operation.
   - Add the export_state_interfaces() method: Learn how to implement the export_state_interfaces() method to define the interfaces that your hardware offers.
   - Create the export_command_interfaces() method: Learn how to implement the export_command_interfaces() method to define the commands that control the robot's hardware.
   - Implement the on_activate() method: Learn how to implement the on_activate() method to initialize and activate the hardware interface.
   - Write the on_deactivate() method: Learn how to write the on_deactivate() method to properly deactivate the hardware interface and release any resources when the system is no longer in use.
   - Implement the read() method: Learn how to implement the read() method to retrieve and update the hardware state.
   - Implement the write() method: Learn how to implement the write() method to send control commands to the hardware.
   - Add the PLUGINLIB_EXPORT_CLASS macro: Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register your hardware interface as a plugin.
   - Writing Export Definition for pluginlib: Learn how to write the export definition for pluginlib to ensure your hardware interface is correctly registered and usable.
   - Prepare the CMakeLists.txt and package.xml Files: Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure your hardware interface.
   - Switching the Hardware Plugin: Learn how to switch the hardware plugin in ros2_control to modify or update the robot's hardware interface.
   - Create a New Launch File for Real Hardware: Learn how to create a new launch file in ROS2 to interface with real hardware.
   - Create a Configuration File for the Controller Manager and Controllers: Learn how to create a configuration file for the controller manager and controllers to customize and manage the hardware interface.
   - Compiling and Testing the Hardware Interface: Compile and test the hardware interface to ensure proper functionality and integration with the ROS2 control system.
   - Conclusions: What did you learn in this unit?
5. **Hardware Interface Implementation for Dynamixel Servos** — A real-life implementation of a custom hardware interface based on Dynamixel Servos.
   - Introduction: What will you learn in this unit?
   - The ROBOTIS Dynamixel SDK: Learn about the ROBOTIS Dynamixel SDK and how to use it to interface with Dynamixel servos for robot control in ROS 2.
   - SDK Installation: Follow some simple steps in order to install the Dynamizel SDK.
   - Create a Package for Your Dynamixel Hardware Interface: Start by creating a new ROS 2 package for your Dynamixel hardware interface.
   - Add a header file: Create a header file (.hpp) for your Dynamixel hardware interface.
   - Add a source File: Create a .cpp source file for your Dynamixel hardware interface.
   - Write the on_init() method: Learn how to implement the on_init() method to properly initialize the Dynamixel hardware interface.
   - Add the export_state_interfaces() method: Learn how to implement the export_state_interfaces() method for the Dynamixel hardware interface.
   - Create the export_command_interfaces() method: Learn how to implement the export_command_interfaces() method to define the commands that control the Dynamixel hardware.
   - Implement the on_activate() method: Learn how to implement the on_activate() method to initialize and activate the Dynamixel hardware interface.
   - Write the on_deactivate() method: Learn how to write the on_deactivate() method to properly deactivate the Dynamixel hardware interface.
   - Implement the read() method: Learn how to implement the read() method to retrieve and update the Dynamixel hardware state.
   - Implement the write() method: Learn how to implement the write() method to send control commands to the Dynamixel hardware.
   - Implement the enable_torque() method: Learn how to implement the enable_torque() method to enable/disable the Dynamixel servo's torque.
   - Implement the set_control_mode() method: Learn how to implement the set_control_mode() method to manage the servo's operating mode.
   - Implement the reset_command() method: Learn how to implement the reset_command() method to reset the joint's current position.
   - Add the PLUGINLIB_EXPORT_CLASS macro: Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register the Dynamixel hardware interface as a plugin.
   - Writing Export Definition for pluginlib: Learn how to write the export definition for pluginlib to ensure the Dynamixel hardware interface is correctly registered and usable.
   - Prepare your CMakeLists.txt and package.xml files: Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure the Dynamixel hardware interface.
   - Switching the Hardware Plugin: Learn how to switch the hardware plugin in ros2_control to modify or update the robot's hardware interface.
   - Create a new launch file: Learn how to create a new launch file in ROS2 to start the Dynamixel hardware interface.
   - Create a Configuration File for the Controller Manager and Controllers: Learn how to create a configuration file for the controller manager and controllers to customize and manage the Dynamixel hardware interface.
   - Compiling and Testing the Hardware Component: Compile and test the Dynamixel hardware interface to ensure proper functionality and integration with the ROS2 control system.
   - Conclusions: What did you learn in this unit?
6. **The ros2_controllers repository** — Explore the different controller types included by ros2_control
   - Introduction: What will you learn in this unit?
   - Available Controllers: Learn about the different built-in controllers provided by the ros2_controllers repository.
   - The position_controllers: Learn how the position_controllers in ros2_control manage joint position control, allowing you to command specific positions for robotic actuators.
   - The effort_controllers: Learn how the effort_controllers in ros2_control manage effort-based control, enabling you to command forces or torques to robotic actuators.
   - The velocity_controllers: Learn how the velocity_controllers in ros2_control allow you to command velocity commands to control the motion of robotic joints.
   - The forward_command_controller: Understand how the forward_command_controller in ros2_control is used to send commands for a robot's forward motion.
   - The joint_trajectory_controller: Learn how the joint_trajectory_controller in ros2_control enables precise control of robotic joints by following a predefined trajectory.
   - The diff_drive_controller: Learn how the diff_drive_controller in ros2_control allows for controlling differential drive robots.
   - Conclusions: What did you learn in this unit?
7. **Create a custom controller** — Learn how to create a custom controller in ros2_control to meet the specific needs of your robotic application, extending the functionality of existing controllers.
   - Introduction: What will you learn in this unit?
   - Your custom controller in 5 steps: Learn the 5 steps required to create a custom controller for your robot.
   - Create a package for your custom controller: Start by creating a new ROS 2 package for your custom controller.
   - Add a header file: Learn how to create a header file (.hpp) for your custom controller.
   - Add a source file: Learn how to create a .cpp source file for your custom controller.
   - Write the on_init() method: Learn how to implement the on_init() method to properly initialize your custom controller.
   - Add the on_configure() method: Learn how to implement the on_configure() method to set up your custom controller for operation.
   - Add the command_interface_configuration() method: Learn how to implement the command_interface_configuration() method to define what command interfaces are required by the controller.
   - Create the state_interface_configuration() method: Learn how to implement the state_interface_configuration() method to define what hardware sensor interfaces are required by the controller.
   - Implement the get_ordered_interfaces() template function: Learn how to implement the get_ordered_interfaces() method to properly order the available interfaces.
   - Write the on_activate() method: Learn how to implement the on_activate() method to initialize and activate the custom controller.
   - Write the on_deactivate() method: Learn how to write the on_deactivate() method to properly deactivate the custom controller.
   - Implement the update() method: Learn how to implement the update() method in a custom controller to update control commands and ensure the robot's actuators are driven correctly.
   - Add the PLUGINLIB_EXPORT_CLASS macro: Learn how to add the PLUGINLIB_EXPORT_CLASS macro to register your custom controller as a plugin.
   - Write a plugin description file: Learn how to write the export definition for pluginlib to ensure your custom controller is correctly registered and usable.
   - Prepare the CMakeLists.txt and package.xml files: Learn how to prepare the CMakeLists.txt and package.xml files to properly compile and configure your custom controller.
   - Create a Configuration File for the Controller Manager and Controllers: Learn how to create a configuration file for the controller manager and custom controller.
   - Update the Gazebo plugin configuration parameters: Update the Gazebo plugin configuration parameters to load the new YAML configuration file for the custom controller.
   - Create a new launch file to spawn the robot and run the new controller: Learn how to create a new launch file to spawn the robot in Gazebo and load the new custom controller.
   - Recompiling and testing: Compile and test your custom controller to ensure proper functionality and integration with the ROS2 control system.
   - Conclusions: What did you learn in this unit?
8. **Final Project: Quadruped Robot Solo 8** — Apply everything learned during the course to solve the Final Course Project based on a Quadruped robot!
   - Introduction: What is this project about?
   - Simulation Setup: Setup the Quadruped simulation for the final project.
   - Introducing the open source Solo quadruped robot: Introduction to the open source Solo 8 quadruped robot used for this project.
   - The course project starter code: Introduction to some starting files and code for the final project.
   - Spawn and delete from Gazebo: Learn how to spawn and delete the robot using the Gazebo simulator.
   - Steps to complete the project: List of all the tasks required to complete this project.
   - Test that ros2_control works: Once the project has been completed, properly test that the control systems of the robot work properly.
   - Expected Outcome: What is the expected final result of the project?
   - Project Solution: Solutions for the final project.

## TF ROS2
*To finally understand TF in ROS 2*
**Rating:** 4.6 (61 reviews)
📂 **Detailed lessons:** [`04intermediateros2/tf-ros2/`](04intermediateros2/tf-ros2/README.md)

### Overview
Imagine this scenario: you have a drone equipped with a camera that needs to follow a subject to capture footage correctly. How do you instruct the robot where to point the camera? How should it follow the subject and maintain the right distance—all dynamically? What is the exact distance between the camera and the subject? Is the orientation correct? ROS 2 TFs manage the relationships between different parts (frames) of a robot, providing the necessary transformations to track positions and orientations. In this ROS 2 TF course, you will learn how TF works through hands-on exercises designed to help you practice and apply these concepts effectively.

### What you'll learn
- How to Visualize `TFs` in ROS2
- How to Publish & Subscribe to TF data
- Understanding Transformations & Frames
- Common TF Command-line Tools (`tf_echo`, `view_frames`…)
- Understanding Static Transform Publisher

### Course outline
1. **Introduction to TF** — Understand the foundations of TF2 and the importance of coordinate frames in robotics.
   - Introduction: What is this course about?
   - A Typical Robot Problem: Presentation of a typical robotics problem to introduce the concept of coordinate frames.
   - Coordinate Systems, Reference Frames, and Coordinate Frames: Understand the concept of a coordinate frame and why it is essential in robotics.
   - Conventions: Introduction to the right-hand rule, a key concept in robotics for defining coordinate frames.
   - Create a Coordinate Frame: Learn how to create a coordinate in ROS 2 using the command-line tools.
   - Visualize Transformations and Coordinate Frames in RVIZ: Learn how to visualize transformations and coordinate frames in RViz.
   - The Many Coordinate Frames of a Robot: Learn the importance of coordinate frames in robotics to track the position of the robot's links in space.
   - What Is This Course About?: Overview of all the concepts you will learn during this course.
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **TF Tools and Visualization** — Get introduced to Transforms (TF) and learn how to use the proper tools to visualize them.
   - Introduction: What will you learn in this unit?
   - Scene Intro: Introduction to the simulation you will use during this unit.
   - Where Is The Turtle?: Presentation of the robotics problem to be solved in this unit.
   - View TF Frames in PDF Format: Learn how to use the view_frames ROS 2 tool to visualize the TF frames of a robot in PDF format.
   - View TF Frames using rqt_tf_tree: Learn how to use the rqt_tf_tree tool to visualize TF frames and see changes in real-time.
   - View TF Frames in the Terminal using tf_echo: Learn how to use the tf_echo ROS 2 node to visualize TF frames in the terminal.
   - View TF Frames using RVIZ2: Learn how to use RViz2 to visualize TF rames in 3D space.
   - Real Robot Project: Complete Part 1 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?
3. **Broadcast & Listen to TF data** — Learn how to broadcast and listen to transformations. Understanding how TFs are published and received is crucial for many robotic tasks.
   - Introduction: What will you learn in this unit?
   - Scene Intro: Introduction to the simulation you will use during this unit.
   - TF Broadcaster: The Turtle model cannot be visualized in RViz2! Solve the problem while learning how to create a TF Broadcaster.
   - TF2 Monitor: Learn how to use the tf2_monitor tool to monitor the status of TF data in ROS 2.
   - Static Broadcaster: Overview of the different methods to broadcast static transforms.
   - Static Broadcaster using the Command Line: Learn how to use the command line to broadcast static transforms in ROS 2.
   - Static Broadcaster through a launch file: Learn how to broadcast static transforms using a launch file in ROS 2.
   - Static Broadcaster via Python script: Learn how to broadcast static transforms using a Python script in ROS 2.
   - TF Listener: Learn how to use the TF Listener to receive and process transform data in ROS 2.
   - Real Robot Project: Complete Part 2 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?
4. **Robot State Publisher** — Learn how to use the Robot State Publisher to publish the TF data of complex robots.
   - Introduction: What will you learn in this unit?
   - Spawn a Robot into Gazebo: Spawn a new robot into a Gazebo simulation to comprehend the importance of the Robot State Publisher.
   - Robot State Publisher: Learn how to use the Robot State Publisher to broadcast joint states and transforms for a robot in ROS 2.
   - Real Robot Project: Complete part 2 of the Real Robot Project.
   - Conclusions: What did you learn in this unit?

## Intermediate ROS2 (C++)
*Take your ROS 2 knowledge to the next level.*
**Rating:** 0 (0 reviews)
📂 **Detailed lessons:** [`04intermediateros2/intermediate-ros2-cpp/`](04intermediateros2/intermediate-ros2-cpp/README.md)

### Overview
In this course, take a deep dive into more advanced ROS 2 learning topics.

### What you'll learn
- How to create different types of launch files in ROS2
- How to work with parameters in ROS2
- Threading in ROS2
- How to manage callbacks in ROS2
- Understand Quality of Service (QoS) in ROS2
- Understand DDS in ROS2
- Work with Managed Nodes in ROS2

### Course outline
1. **Course Introduction** — A brief introduction to the contents of the course. It contains a practical demo.
   - Introduction: What is this course about?
   - Demo Time!: Get a glimpse of what you'll learn in this course by controlling a robot's speed using ROS 2 parameters!
   - What will you learn with this course?: Outline of all the ROS 2 skills you will learn during this course.
   - Minimum requirements: What are the minimum requirements before starting this course?
2. **Advanced Launch Files** — Understand launch files in ROS2 and explore different methods of creating launch files
   - Introduction: What will you learn in this unit?
   - Nested and Modular Launch Files in ROS 2: Learn how to create nested and modular launch files for better organization and reusability in ROS 2.
   - Passing Parameters in ROS 2 Launch Files: Learn how to pass parameters in ROS 2 launch files to configure nodes dynamically.
   - Conclusions: What did you learn in this unit?
3. **XML and YAML Launch Files** — Learn how to create XML and YAML ROS2 launch files
   - Introduction: What will you learn in this unit?
   - Languages supported by launch files: Learn about the different languages supported for creating ROS 2 launch files.
   - Python Launch Version: Explore the Python-based approach to creating ROS 2 launch files.
   - XML Launch Version: Explore the XML-based approach to creating ROS 2 launch files.
   - YAML Launch Version: Explore the YAML-based approach to creating ROS 2 launch files.
   - Conclusions: What did you learn in this unit?
4. **Node Parameters** — Learn how to work with parameters in ROS2
   - Introduction: What will you learn in this unit?
   - How do Parameters work in ROS 2?: Learn how parameters work in ROS 2 and the main differences with respect to ROS 1.
   - Create a demo code: Create an initial program to practice working with parameters.
   - Interact with parameters from the command line tools: Learn how to manage ROS 2 node parameters using command line tools.
   - Loading and Dumping Parameters from YAML Files: Learn how to load and save ROS 2 parameters using YAML files.
   - Set Parameters via Command Line on Node Startup: Learn how to set parameters from the Command Line when starting a ROS 2 node.
   - Recap: Quick recap of the most relevant commands learned so far.
   - Examine the code: Analyze the code to gain a deeper understanding of what happens behind the scenes.
   - Loading Parameters in Launch Files: Learn how to load parameters into ROS 2 launch files for better node configuration.
   - Parameter Callbacks: Learn how to use parameter callbacks in ROS 2 to dynamically manage and update parameters during runtime.
   - Examine the code: Analyze the code to gain a deeper understanding of what happens behind the scenes.
   - Conclusions: What did you learn in this unit?
5. **Lifecycle Nodes** — Learn about managed nodes and how they work
   - Introduction: What will you learn in this unit?
   - Why do you need managed nodes?: Learn the importance of managed nodes in ROS 2 and how they improve node lifecycle management.
   - What is a Managed Node?: Understand the concept of managed nodes in ROS 2 and their role in simplifying node lifecycle management.
   - Simple managed node example: Learn how to create and implement a simple managed node in ROS 2 with an example.
   - Managed Nodes command-line interface: Explore the command-line interface for managing nodes in ROS 2, and learn how to interact with managed nodes.
   - Life Cycle Manager: Understand the role of the Life Cycle Manager in ROS 2 and how it manages node lifecycle transitions.
   - Hands-on Practice!: Practice working with managed nodes with a practical exercise!
   - Managed Nodes in Nav2: Learn how managed nodes are utilized in the Nav2 stack to enhance robot navigation and lifecycle management.
   - Conclusions: What did you learn in this unit?
6. **Quality of Service** — Understand how QoS is used in ROS 2 with simple examples
   - Introduction: What will you learn in this unit?
   - What is QoS?: Learn the basics of Quality of Service (QoS) in ROS 2 and its impact on communication.
   - Understanding QoS Compatibility: Learn how QoS settings affect compatibility between ROS 2 nodes.
   - Hands-on Practice!: Practice the concept of QoS compatibilities with a practical exercise!
   - Default QoS Policies: Explore the standard QoS policies used in ROS 2 and their impact on communication.
   - Durability: Learn how the Durability QoS policy affects message persistence in ROS 2.
   - Deadline: Understand how the Deadline QoS policy ensures timely message delivery in ROS 2.
   - Hands-on Practice!: Experiment with different deadline settings to observe their impact on communication.
   - Lifespan: Learn how the lifespan QoS policy controls how long messages remain valid.
   - Liveliness and LeaseDuration: Explore how liveliness and lease duration ensure reliable communication in ROS 2.
   - QoS in ROS 2 Bags: Learn how to handle QoS settings when working with ROS 2 bags for data recording and playback.
   - Conclusions: What did you learn in this unit?
7. **Understanding DDS** — Understand DDS in ROS 2, how to modify it, and how to work with QoS.
   - Introduction: What will you learn in this unit?
   - What is DDS?: Learn the basics of DDS (Data Distribution Service) and its role in ROS 2 communication.
   - Foundations of DDS: Explore the core principles of DDS and how it enables efficient communication in ROS 2.
   - Check the current Middleware: Learn how to evaluate and inspect the current middleware configuration in ROS 2.
   - DDS Implementations Supported in Humble: Explore the DDS implementations supported in ROS 2 Humble and how they impact communication and system performance.
   - How to change the DDS implementation: Learn how to switch between different DDS implementations in ROS 2 to optimize performance and compatibility.
   - Hands-on Practice!: Experiment with how DDS impacts communication through several practical examples.
   - What is the ROS 2 Daemon?: Understand the role of the ROS 2 Daemon and how it facilitates communication between nodes in the ROS 2 ecosystem.
   - Sources and Further Readings: Explore additional resources and readings to deepen your understanding of ROS 2 DDS.
   - Conclusions: What did you learn in this unit?
