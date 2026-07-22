# 08 Manipulation

## ROS Manipulation in 5 Days
*Learn how to make your manipulator interact with the environment using ROS*
**Rating:** 4.5 (76 reviews)

📂 **Detailed lessons:** [`08manipulation/ros-manipulation-in-5-days/`](08manipulation/ros-manipulation-in-5-days/README.md)

### Overview
ROS Manipulation is the term used to refer to any robot that manipulates something in its environment. The main goal of this Course is to teach you the basic tools you need to know in order to be able to understand how `ROS Manipulation` works, and teach you how to implement it for any manipulator robot.

### What you'll learn
At the end of this Course you will feel comfortable about the following subjects:
- Basics of `ROS Manipulation`
- How to create and configure a `MoveIt!` package for a manipulator robot
- How to perform Motion Planning.
- How to perform Grasping.

### Course outline
1. **Introduction to the Course** — A brief introduction to the contents of the Course. Includes a demo.
2. **Basic Concepts** — Some basic concepts you need to know in order to complete the Course.
3. **Motion Planning using Graphical Interfaces Part 1** — How to build a MoveIt package for your Manipulator robot.
4. **Motion Planning using Graphical Interfaces Part 2** — Add Perception to your MoveIt package
5. **Perform Motion Planning programmatically** — How to perform Motion Planning with code (Python)
6. **Grasping** — How to perform a basic pick and place task.
7. **Project** — A Project to test what you've learned.

## ROS2 Manipulation Basics
*Learn the ROS2 manipulation essentials. Learn how to configure and use MoveIt2 for controlling manipulator robots.*
**Rating:** 4.5 (66 reviews)

📂 **Detailed lessons:** [`08manipulation/ros2-manipulation-basics/`](08manipulation/ros2-manipulation-basics/README.md)

### Overview
In robotics, manipulation refers to the process in which a robot interacts with objects in its environment. This involves physically altering or manipulating items, such as moving them from their initial position to a new one. The primary objective of this course is to provide you with essential tools to understand the principles of manipulation in ROS2. You will learn the fundamentals necessary to comprehend how manipulation works and gain the skills to implement it for any manipulator robot.

### What you'll learn
- How to set up a MoveIt2 configuration package for a manipultor robot
- How to use MoveIt2 in ROS2 programmatically in C++
- Different types of motion planning
- How to use Perception to find object coordinates in the environment
- How to create a Pick and Place task in ROS2

### Course outline
1. **Introduction to the Course** — A brief introduction to the Course. It contains a practical Demo controlling a manipulator robot!
   - Introduction: What will you learn in this course?
   - Move a robotic arm using MoveIt2: Use Moveit2 to plan and execute trajectories for a robotic arm!
   - What will you learn in this course?: Outline of all the ROS 2 Manipulation skills you will learn in this course.
   - Minimum requirements: What are the minimum requirements before starting this course?
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **Create a MoveIt2 configuration package** — Learn how to create and configure a Moveit2 configuration package for your manipulator robot.
   - Introduction: What will you learn in this unit?
   - What is MoveIt2?: Learn about MoveIt2 and its role in robot motion planning and control in ROS2.
   - Launch the MoveIt2 Setup Assistant: Learn how to launch the MoveIt2 Setup Assistant.
   - Loading your robot's URDF file: Learn how to load your robot's URDF file into the MoveIt 2 Setup Assistant.
   - Define the self-collision matrix: Learn how to define and configure the self-collision matrix for your robot in MoveIt2.
   - Define virtual joints: Learn how to define virtual joints in MoveIt2 for your robot.
   - Define Planning Groups: Learn how to define planning groups in MoveIt2 to organize and control different parts of your robot for motion planning.
   - Define Robot Poses: Learn how to define robot poses in MoveIt2 to set predefined positions for motion planning and execution.
   - Define End Effector: Learn how to define an end effector in MoveIt2 to specify the robot's tool for manipulation tasks.
   - Setup MoveIt Controllers: Learn how to configure MoveIt controllers to manage and execute robot motions efficiently.
   - Generate the MoveIt2 package: Finish the process by generating the MoveIt2 package for your robotic arm.
   - Fine tune the generated MoveIt2 package: Do some final adjustments to properly configure the generated MoevIt2 for your robot.
   - Basic Motion Planning with RViz2: Use the generated MoveIt2 package with RViz2 to easily plan and execute motions for your robotic arm.
   - MoveIt2 architecture: Understand the key components and structure of the MoveIt2 architecture.
   - Conclusions: What did you learn in this unit?
3. **Motion Planning with C++** — Learn how to use the Move Group C++ Interface to interact with your manipulator robot in order to generate complex motions.
   - Introduction: What will you learn in this unit?
   - Planning a trajectory: Learn about the 2 main basic methods for planning trajectories.
   - Planning to a joint-space goal: Learn how to use the Move Group C++ Interface to plan trajectories to a joint-space goal.
   - Planning to an end-effector pose: Learn how to use the Move Group C++ Interface to plan trajectories to an end-effector pose.
   - Executing a trajectory: Learn how to use the Move Group C++ Interface to execute a previously planned trajectory.
   - Hands-on Practice!: Apply everything you've learned so far in a hands-on exercise.
   - Get your robot arms positioned fast and easy: Learn how to use rqt_joint_trajectory_controller to easily move and control a robotic arm through a graphical interface.
   - Controlling the gripper: Learn how to use the GripperCommand action to open and close the gripper.
   - Controlling the gripper with MoveIt2: Learn to use the Move Group C++ Interface to control the gripper from a ROS 2 program.
   - Approach & Retreat: Learn about the approach and retreat motions for picking objects.
   - Conclusions: What did you learn in this unit?
4. **Cartesian Paths & Kinematics Plugin** — Learn how to use the Cartesian Paths and Kinematics Plugins to control the movement of a robotic arm.
   - Introduction: What will you learn in this unit?
   - Cartesian Paths: Complete a practical example to better understand the concept of cartesian path planning.
   - Hands-on Practice!: Apply everything you've learned so far in a hands-on exercise.
   - Kinematics Plugin: Learn about the Kinematics Plugin and how to change it to optimize motion planning for your robot.
   - Full Pick & Place pipeline: Apply all the new concepts to successfully complete a full pick and place pipeline.
   - Conclusions: What did you learn in this unit?
5. **Object Detection with ROS2** — Learn how to perform Object Detection with ROS 2 in order to pick objects with a manipulator robot.
   - Introduction: What will you learn in this unit?
   - The simple_grasping package: Learn about the simple_grasping ROS 2 package and how to use it for object detection.
   - Depth Camera Sensor: Learn how to visualize the PointCloud from a Depth Camera Sensor.
   - Running the Object Detection action: Learn how to use the action server provided by the simple_grasping package to perform object detection.
   - Reviewing the code: Review and understand the code used for object detection.
   - Getting the object position: Learn to extract the object position data after detecting it.
   - Detecting multiple objects: Learn how to properly handle multiple object detections.
   - Pick & Place with Perception: Update your Pick & Place code to incorporate object detection for improved robustness.
   - Conclusions: What did you learn in this unit?
