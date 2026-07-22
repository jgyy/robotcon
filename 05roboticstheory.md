# 05 Robotics Theory

## Robot Control Basics
*Learn various methods and techniques of modern robot control.*
**Rating:** 4.1 (32 reviews)

📂 **Detailed lessons:** [`05roboticstheory/robot-control-basics/`](05roboticstheory/robot-control-basics/README.md)

### Overview
This course includes teaching the fundamental bases of control applied in robotics, starting from different control laws and applying different control methods to optimize the output of our systems. Using experimental results gain insights about the influence of each term within a PID controller.

### What you'll learn
- Get familiar with Proportional-Integral-Derivative PID control basics.
- Learn how to generate a trajectory through a given set of two or more joint positions.
- Learn about multivariable controllers including inverse dynamics and test their response to a sinusoidal set point.
- Learn how to apply a desired end-effector force based on feedback from a force sensor.

### Course outline
1. **Course Introduction** — An Introduction to the contents of this course.
   - Introduction: What is this course about?
   - Robots used in this course: Overview of the robot you will use during this course
   - Outline of the course: Outline of all the main concepts you will learn in this course.
   - Demo: Try a practical demonstration to get an idea of what you'll achieve by the end of this course.
   - Requirements for the course: What are the minimum requirements before starting this course?
   - Acknowledgements: Special thanks to all the parties involved in making this course possible.
2. **PID Control** — Get familiar with Proportional-Integral-Derivative PID control basics.
   - Introduction: What will you learn in this unit?
   - Robot dynamics review: Review the fundamental concepts of robot dynamics that govern robot motion and control.
   - Example 1: 2dof robotic arm (with gravity term): Learn how to apply dynamics to a 2DOF robotic arm, including the effects of gravity on the system’s motion.
   - Example 2: 2dof robotic arm (without gravity term): Explore the dynamics of a 2DOF robotic arm without considering the gravity term in the system’s motion.
   - Actuator dynamics: Study the dynamics of actuators, including their behavior, performance, and how they influence the overall system response.
   - Proportional control: Understand proportional control, where the input is proportional to the error.
   - Derivative control: Learn derivative control, where the control action is based on the rate of change of the error.
   - Integral control: Explore integral control, which focuses on correcting accumulated errors over time to achieve precise control.
   - PD control: Learn about PD control, which combines proportional and derivative control to improve stability and response time.
   - PI control: Learn about PI control, which combines proportional and integral control to eliminate steady-state error and improve system performance.
   - PID control: Explore PID control, a combination of proportional, integral, and derivative control.
   - Conclusions: What did you learn in this unit?
3. **Independent Joint Control** — We focus on controlling only one joint at a time, independent of the rest.
   - Introduction: What will you learn in this unit?
   - Quick Recap: Quick recap about how to control the joint angles of the arm
   - Set point tracking: Learn how to track set points in independent joint control, ensuring that each joint reaches and maintains its desired position effectively.
   - Set point tracking exercise: Practice tracking set points through hands-on exercises in independent joint control.
   - Trajectory generation: Learn how to generate smooth and feasible trajectories for robot motion planning.
   - Trajectory interpolation, general method: Understand the general method for interpolating trajectories to create smooth paths between waypoints.
   - Linear segments with Parabolic Blends (LSPB): Learn how to create smooth trajectories using linear segments with parabolic blends (LSPB) for smooth motion transitions.
   - Conclusions: What did you learn in this unit?
4. **Multivariable Control** — Learn how to construct and analyse a multivariable dynamic system and how to design an appropriate controller for it.
   - Introduction: What will you learn in this unit?
   - What is Multivariable Control?: Introduction to the concept of Multivariable Control.
   - PD Control revisited: Review the concept of PD control in multivariable systems.
   - Inverse Dynamics: Learn the principles of inverse dynamics, which involves calculating the required joint forces and torques to achieve desired motions in a robotic system.
   - Conclusions: What did you learn in this unit?
5. **Force Control** — Apply a desired end-effector force based on feedback from the force sensor.
   - Introduction: What will you learn in this unit?
   - Jacobian of the manipulator: Understand the Jacobian of a manipulator, a key concept in force control, used to relate joint velocities to end-effector velocities and forces.
   - Force control: Learn about force control, a technique that focuses on controlling the forces exerted by the robot's end-effector
   - Exercise: the 5000 Newtons: Apply force control concepts in this exercise, where you'll work with a simulated scenario involving a 5000 Newton force to practice controlling the robot's end-effector in different tasks.
   - Conclusions: What did you learn in this unit?
6. **Final Project** — Apply your knowledge with a guided project that makes use of inverse dynamics and inverse kinematics.
   - Introduction: Introduction to the course final project.
   - Inverse kinematics: Implement inverse kinematic control to make the end effector of the 2dof robotic arm follow different points.

## Robot Dynamics and Control
*Learn to develop dynamic models and intelligent control systems for simple robots.*
**Rating:** 3.8 (20 reviews)

📂 **Detailed lessons:** [`05roboticstheory/robot-dynamics-and-control/`](05roboticstheory/robot-dynamics-and-control/README.md)

### Overview
Robot Dynamics is really important since it will give you a complete understanding not only of how the robots move (kinematics) but also WHY they move (dynamics). In this course, you will learn to develop the dynamics models of basic robotic systems, as well as create intelligent controllers for them.

### What you'll learn
- How to solve the dynamics for the motion of rigid bodies in 3D space with the use of Newton's laws of motion
- How to model the dynamics of a simple robotic system and how to derive its equations of motion
- How to create a full state feedback controller to allow a robotic system to balance

### Course outline
1. **Introduction** — This unit presents the objectives of this course on dynamics for robot manipulators, and the learning methods and tools.
2. **Rigid Body Dynamics** — In this Unit you will learn how to solve for the motion of rigid bodies in 3D space with the use of Newton's laws of motion.
3. **Dynamic Modeling** — In this Unit you will learn how to model the dynamics of a simple robotic system and how to derive its equations of motion.
4. **Feedback Control** — In this unit, we will create a full state feedback controller for allowing the robot to balance.
5. **Project. Ball Kicking** — In this project you are going to program a simple dynamic controller for the RRBot arm that will move the robot for kicking a ball on the floor.

## Basic Kinematics of Mobile Robots
*Learn the basic kinematics of mobile robots.*
**Rating:** 4.6 (63 reviews)

📂 **Detailed lessons:** [`05roboticstheory/basic-kinematics-of-mobile-robots/`](05roboticstheory/basic-kinematics-of-mobile-robots/README.md)

### Overview
The aim of the course is to provide you with the concepts and tools for controlling a mobile robot along a pre-defined path. This is the cornerstone of robot mobility, as it can be later expanded with the addition of external sensors in other courses.

### What you'll learn
- Rigid-Body Motions
- Kinematics for Non-Holonomic Robots
- Kinematics for Holonomic Robots
- Kinematic Control

### Course outline
1. **Introduction to the Course** — A quick presentation of the contents of this Course.
   - Introduction: What is this course about?
   - A Hands-on Experience: Take a hands-on demo to get a glimpse of what you'll learn throughout the course.
   - Outline of the course: Outline of all the main skills you will learn in this course.
   - Requirements for the course: What are the minimum requirements before starting this course?
   - Acknowledgments: Special thanks to all the parties involved in making this course possible.
2. **Rigid Body Motions** — Learn how to mathematically describe and represent the movement of rigid bodies in space, including translations, rotations, and full 3D transformations.
   - Introduction: What will you learn in this unit?
   - Frame of reference: Introduction to the frame of reference concept.
   - Representing positions: Understand how to express positions using Cartesian coordinates in different reference frames.
   - Representing rotations: Learn how to describe the orientation of rigid bodies using rotation matrices.
   - Rotational transformations: Understand how to apply rotation matrices to transform vectors between reference frames.
   - Composition of rotations: Learn how to combine multiple rotations into a single, equivalent transformation.
   - Parameterization of rotations: Explore different ways to describe rotations using angles and vectors, such as Euler angles and axis-angle representations.
   - Homogeneous transformation matrices: Learn how to combine rotation and translation into a single matrix to represent the full motion of a rigid body in space.
   - Let's practice!: Practice all the concepts learned in this unit with a final exercise!
   - Conclusions: What did you learn in this unit?
3. **Kinematics of Nonholonomic robots** — Explore the motion constraints of nonholonomic robots and how they affect their kinematic modeling and control.
   - Introduction: What will you learn in this unit?
   - What is Kinematics?: Understand the concept of kinematics.
   - What is a model?: Understand the concept of a model in mathematics.
   - What is a kinematic model?: Understand the concept of the kinematic model.
   - The Unicycle robot: Explore the kinematic properties of the unicycle robot.
   - The Differential Drive robot: Explore the kinematic properties of the Differential Drive robot.
   - The ROS Twist message: Learn about the ROS Twist message, which is used for representing velocity commands in 2D and 3D space.
   - Let's practice!: Practice all the concepts learned so far with an exercise!
   - The Car-Like robot: Explore the kinematic properties of the car-like robot.
   - Canonical Simplified Model: Explore the Canonical Simplified Model, a basic representation of a robot's motion, used to simplify analysis and control in robotics.
   - Computing differential drive odometry using wheel encoder ticks: Learn how to compute differential drive odometry using wheel encoder ticks.
   - The ROS odometry message: Learn about the ROS odometry message for tracking a robot's position and velocity.
   - Visualization of odometry messages in Rviz: Learn how to visualize odometry messages in Rviz.
   - Let's practice!: Apply everything you've learned to compute the odometry of a simulated mobile robot.
   - Conclusions: What did you learn in this unit?
4. **Kinematics of Holonomic robots** — Explore the motion priperties of holonomic robots and how they affect their kinematic modeling and control.
   - Introduction: What will you learn in this unit?
   - Kinematic Model: Learn about the kinematic model for a holonomic robot.
   - Basic Motions: Explore the basic motions for holonomic robots.
   - Motion in the robot's frame: Explore how motion is represented within a holonomic robot's own frame of reference.
   - Motion in the absolute frame: Learn how motion is represented in the absolute frame of reference, independent of the robot's position.
   - Conclusions: What did you learn in this unit?
5. **Kinematic Control** — Explore methods for controlling a robot's motion based on its kinematic model, ensuring accurate movement towards a desired position.
   - Introduction: What will you learn in this unit?
   - Starter Code: Introduction to the necessary code for initializing the ROS node, publishing to the velocity topic, and subscribing to the odometry topic.
   - Open Loop Control: Learn about open-loop control, where the robot’s actions are based on predefined commands without feedback.
   - Feedback Control: Explore feedback control, where the robot adjusts its actions based on real-time feedback to correct errors.
   - Hands-on Practice!: Create a program for implementing the feedback control law presented in the previous section.
   - Conclusions: What did you learn in this unit?

## Kalman Filters
*Learn how Kalman filters work and how to apply them to mobile robots using ROS.*
**Rating:** 4.5 (119 reviews)

📂 **Detailed lessons:** [`05roboticstheory/kalman-filters/`](05roboticstheory/kalman-filters/README.md)

### Overview
One of the most common problems in robot navigation is to know where your robot is localized in the environment (known as robot localization). In this field, Kalman Filters are one of the most important tools that we can use. With this course, you will understand the importance of Kalman Filters for robotics, and how they work. You will learn the theoretical meaning, but also the Python implementation. Finally, you will also apply the studied filters to mobile robots using ROS.

### What you'll learn
- In this course you will learn:
- What is a Kalman Filter and why are required
- Different types of Kalman Filters and when to apply each one.
- Bayesian Filters
- One-dimensional Kalman Filters
- Multivariate Kalman Filters
- Unscendent Kalman Filters
- Extended Kalman Filters
- Particle Filters

### Course outline
1. **Introduction** — A brief introduction to the course contents. It containing a practical demonstration.
2. **Bayesian Filter** — In this Chapter, you will learn about the Bayes Filter. Specifically, you will learn about the following concepts: the building blocks of the Bayes Filter, how sensor noise affects predictions, robot motion under uncertainty, the recursive nature of Bayesian filtering and how to implement a 1-dimensional discrete Bayes Filter.
3. **Kalman Filters** — In this Chapter, you will learn about traditional Kalman filters. Specifically, you will learn about the following concepts: Histograms and Gaussian distributions, One-dimensional Kalman filter and Multi-dimensional Kalman filter.
4. **Extended Kalman Filter and Unscented Kalman Filter** — In this chapter, you will learn about the Extended Kalman Filter (EKF) and the Unscented Kalman Filter (UKF).Specifically, upon completion of this chapter, you will: understand the underlying logic each filter uses for dealing with non-linear functions, understand how the traditional Kalman Filter is modified in each case, and use the robot_localization package which contains EKF and UKF estimation nodes.
5. **Particle Filter** — In this Unit, you will learn about the Particle filter. Specifically, upon completion of this unit, you will: understand the properties of the Particle filter, learn how the main filter steps work, implement the Adaptive Monte Carlo Localization package (AMCL), and use the AMCL package on a robot with rangefinder sensors to estimate its pose in a known map.
6. **Project** — In this Unit, you will practice the acquired knowledge directly on a hands-on project. In order to successfully complete the project, you will need to complete all the exercises that are described in it. For this, you will need to use all your skills learned and, maybe, get some new ones. Good luck!

## Basic Maths for Robotics
*Learn the most useful Mathematics: the ones we can apply to Robotics!*
**Rating:** 4.5 (93 reviews)

📂 **Detailed lessons:** [`05roboticstheory/basic-maths-for-robotics/`](05roboticstheory/basic-maths-for-robotics/README.md)

### Overview
Mathematics are the key to describe everything we can appreciate or interact with in nature. Thus, a robot also needs the abilities to move its mechanisms (locomotion), sense the environment (perception), reason accordingly (cognition), and take actions in the environment (navigation). A good understanding of what geometry stands for, basic linear algebra, calculus and operations with numbers, and some probability theory will be necessary to become a robotics developer.

### What you'll learn
- Linear Algebra, where you'll learn about vectors and matrices
- Calculus, where you'll learn about functions, derivatives, and integrals
- Probability, where you'll learn about random variables and belief distributions

### Course outline
1. **Course Introduction** — Unit for previewing the contents of the Course.
   - Introduction: What is this course about?
   - What will you learn with this course?: Overview of the contents you will learn during this course.
   - What tools will you use in this course?: Overview of the tools and robots you will use during the course.
   - Which code will you be developing in this course?: Download the course repository and try out the first practical demo.
   - How can mathematics help you become a robotics developer?: Overview of different robotics scenarios where maths is relevant.
   - What chapters are you going to see in this course?: Overview of all the chapters that will be covered during the course.
   - Requirements for this course: What are the minimum requirements for this course?
2. **Linear Algebra (vectors and matrices)** — In this chapter, you are going to get a gentle introduction to the most basic field of mathematics: Linear Algebra. This discipline is a prerequisite to any career you want to follow in mathematics, physics, engineering, etc.
   - Introduction: What will you learn in this unit?
   - Vectors - Declaration and properties: Learn how to declare vectors and understand their key mathematical properties for use in robotics.
   - Matrices - Declaration and properties: Learn how to declare matrices and explore their fundamental properties for robotic applications.
   - Linear Maps: Understand linear maps and how they relate to matrix transformations in robotics.
   - Useful Identities: Learn key matrix and vector identities that simplify robotic computations.
   - Conclusions: What did you learn in this unit?
3. **Calculus** — In this chapter, you are going to be introduced to the basic unit of calculus: a function. In mathematics, this unit provides valuable information on how a variable changes. It may change over time, position, or orientation, but it all can be studied with the properties of functions.
   - Introduction: What will you learn in this unit?
   - Functions - Declaration and properties: This unit covers how to declare and use functions, focusing on inputs, outputs, and their structure.
   - Common functions: This unit introduces commonly used functions, explaining their purpose and how to apply them effectively.
   - Derivatives: This unit introduces derivatives, explaining their calculation and application in various contexts.
   - Differentiability of a function: Introduction to the concept of differentiability and how it determines the smoothness of a function.
   - Differential rules: This unit introduces key rules for computing derivatives, such as the product, quotient, and chain rules.
   - Partial derivatives: Introduction to the concept of Partial derivatives.
   - Gradients: This unit introduces gradients as vectors of partial derivatives, essential for understanding multivariable functions and optimization.
   - The Jacobian matrix: This unit presents the Jacobian matrix as a tool for describing how multivariable functions change with respect to their inputs.
   - The Hessian matrix: This unit introduces the Hessian matrix, which captures second-order partial derivatives to analyze curvature in multivariable functions.
   - Hands-on Practice!: Complete an exercise to calculate the first and second order derivatives of some equations.
   - Properties of derivatives: This unit reviews key properties of derivatives that simplify computation and help understand function behavior.
   - Integrals: This unit introduces integrals as a tool for calculating areas under curves and solving accumulation problems.
   - Integral Rules: This unit covers essential rules for computing integrals efficiently.
   - Final Exercise: Put into practice what you have learned about derivatives and integrals with a final exercise!
   - Conclusions: What did you learn in this unit?
4. **Probability** — Autonomous robots develop their behaviours in pairs of perception of their state and the environment, and action from their motors to the environment. Probability is a representation of how uncertain we can be that the robot perceives what we think, or performs the actions we want.
   - Introduction: What will you learn in this unit?
   - Basics of probability: Introduction to the most basic concepts of probability.
   - Foundations of Probabilistic Reasoning: An overview of some core probability concepts used in robotics, such as joint and conditional probabilities, and the chain and Bayes' rules.
   - Hands-on Practice!: Put into practice the concepts learned so far with an exercise!
   - Random variables: Introduction to random variables and how they represent uncertainty in probabilistic models.
   - Probability distributions: Brief introduction to the concept of Probability distributions.
   - The Uniform Distribution: Overview of the uniform distribution and its properties.
   - The Cumulative Distribution: Overview of the Cumulative Distribution and its properties.
   - The Gaussian Distribution: Overview of the Gaussian Distribution and its properties.
   - Hands-on Practice!: Work on a practical exercise to apply the latest concepts you have learned!
   - Beliefs: Introduction to beliefs in probabilistic reasoning, including belief distributions and Bayesian filters.
   - Hands-on Practice!: Work on a practical exercise to apply the latest concepts you have learned!
   - Conclusions: What did you learn in this unit?
5. **Final Project: Escape the maze!** — In the final project of this course, you are going to help a mobile robot escape of a maze. It consists of making a program that dictates the robot the movements to perform in order to get out of the maze.
   - Introduction: What is this final project about?
   - Preliminary setup: Initialization Code: Create some preliminary scripts for the final project.
   - Project Task: Detailed description of the main task for this Final Project.
   - Project Solutions: Solutions for the Final Project.

## Path Planning Basics
*Learn the theory behind the most used path planning algorithms.*
**Rating:** 4.6 (176 reviews)

📂 **Detailed lessons:** [`05roboticstheory/path-planning-basics/`](05roboticstheory/path-planning-basics/README.md)

### Overview
Path planning is a key component required to solve the larger problem of “autonomous robot navigation”. In this course, you will learn about the most used path planning algorithms.

### What you'll learn
- You will start the course by learning how to develop allegedly one of the most famous algorithms in Computer Science: Dijkstra's shortest path algorithm. We will continue by introducing Greedy Best-First Search, which evolves the fundamental principles set by Dijkastra to include a heuristic function which in some cases can speed up the search process significantly. As your understanding progresses, you will expand your path planning skills evolving the properties of the algorithm to convert it into the implementation of A* (A -Star). Then you will turn to learn a method that takes a completely different approach to path planning, namely RRT. At the end of this course, you will be well aware of various different approaches that have been developed and applied to successfully solve the global path planning problem. Furthermore, you will be able to understand and explain the differences between them as well as the advantages and drawbacks of each other. Last but not least you will have gained solid practical experience by implementing these methods yourself.

### Course outline
1. **Introduction to the Course** — A brief introduction to the course contents. It includes a practical demonstration.
   - Introduction: What is this course about?
   - Challenges of Autonomous Mobile Robot Navigation: Introduction to some challenges present in autonomous mobile robot navigation.
   - So what is path planning anyway?: Learn about the concept of path planning in robotics.
   - Lots of algorithms!: Overview of some of the algorithms available for solving path planning.
   - Separating concerns: Differentiation between the concepts of global and local path planning.
   - Do you want to have a taste?: Use Dijkstra's shortest path algorithm to guide a robot in its environment while avoiding any collision.
   - What will you learn?: Overview of all the concepts you will learn during this course.
   - Requirements & Special Thanks: Minimum requirements for this course, and Special thanks to all the parties involved in making this course possible.
2. **Dijkstra algorithm** — In this unit, we will get into Dijkstra’s super-famous path planning algorithm and apply it to the motion planning of a mobile robot.
   - Introduction: What will you learn in this unit?
   - The problem to solve: Introduction to the path planning problem.
   - Let's get started with a preview: Introduction to the simulation environment through a hands-on demonstration.
   - Step by step example: A step-by-step walkthrough of how Dijkstra's shortest path algorithm works.
   - Reflection on Dijkstra's core elements: Brief analysis of Dijkstra’s key components and their role in path planning.
   - The generic Dijkstra algorithm: Analysis of the generic Dijkstra’s algorithm resolution process.
   - Dijkstra's Algorithm in Python: Implement Dijkstra’s Algorithm in Python to solve shortest path problems.
   - Testing: Test Dijkstra's Algorithm implementation in Python using ROS and Gazebo.
   - Limitations: Overview of some of Dijkstra's Algorithm limitations.
   - Conclusions: What did you learn in this unit?
3. **A* search algorithm** — This unit focuses on the A* (pronounced "A-star"). A* is one of the most popular choices for pathfinding, because it is only a step up from Dijkstra's, but can often find an optimal path much faster.
   - Introduction: What will you learn in this unit?
   - Informed Search Algorithms: Learn how informed search algorithms use heuristics to plan paths more efficiently.
   - Heuristics: Understand the role of heuristics in guiding informed search algorithms toward the goal.
   - Euclidean distance: Learn how Euclidean distance is used as a heuristic to estimate cost to the goal.
   - Manhattan Distance: Understand how Manhattan distance serves as a heuristic for grid-based path planning.
   - Greedy Best-First Search: Learn how Greedy Best-First Search uses heuristics to guide path planning efficiently.
   - Testing Greedy Best-First Search: Test and evaluate the Greedy Best-First Search algorithm through practical testing using ROS and Gazebo.
   - Exposing Greedy BFS's Behavoir: Analyze the behavior and limitations of the Greedy Best-First Search algorithm.
   - A*'s special secret: Discover the unique features of A* that make it both optimal and efficient in pathfinding.
   - A* search, full details: Complete analysis of the A* search algorithm process.
   - Your own A* implementation: Implement the A* search algorithm using Python.
   - Testing A* Search: Test and evaluate A* Search through practical testing using Gazebo and ROS.
   - A* search limitations: Analyze the behavior and limitations of the A* Search algorithm.
   - Conclusions: What did you learn in this unit?
4. **Rapidly-Exploring Random Tree (RRT)** — This unit covers the fundamentals of the Rapidly-Exploring Random Tree (RRT) algorithm applied to the robotic path planning problem.
   - Introduction: What will you learn in this unit?
   - A foretaste of what's to come: Try a practical demo of RRT-based path planning using ROS and Gazebo.
   - Step-by-step example: A step-by-step walkthrough of how the RRT algorithm works.
   - The basic RRT algorithm: Analysis of the basic RRT algorithm resolution process.
   - RRT in Python: Implement the RRT Algorithm in Python to test it in Gazebo.
   - Testing: Test RRT Algorithm implementation in Python using ROS and Gazebo.
   - Benefits, Challenges, and Variants of RRT: Explore the advantages, challenges, and different variants of the Rapidly-Exploring Random Tree (RRT) algorithm in path planning.
   - Conclusions: What did you learn in this unit?
5. **Artificial Potential Fields** — This unit covers the fundamentals of the artificial potential fields (also known as APF) method applied to the mobile robotic path planning problem.
   - Introduction: What will you learn in this unit?
   - Creating Potential Fields: Learn how to create artificial potential fields to guide a robot from a start position to a goal while avoiding obstacles.
   - Attractive Potentials: Introduction to the concept of attractive potentials.
   - Conical Potential Function: Understand the concept of conical potential functions and how they can be used to guide robots in path planning.
   - Quadratic Potential Function: Learn about quadratic potential functions and their application in guiding robots through path planning.
   - Repulsive Field: Introduction to the concept of repulsive field.
   - The Relationship Between Costmaps and Repulsive Fields: Understand how costmaps relate to repulsive fields in path planning, and how they help in navigating robots around obstacles by modifying potential fields.
   - Repulsive Fields Parameters: Introduction to Repulsive Fields Parameters.
   - Expanding the size of map obstacles: Learn how to expand map obstacles for better path planning and navigation.
   - Creating an additional buffer zone: Learn how to create an additional buffer zone around obstacles to improve robot navigation and safety.
   - Generating the Total Potential Field: Understand how to combine attractive and repulsive potentials to generate a total potential field for robot path planning.
   - Gradient Descent: Learn how to use gradient descent to navigate a robot through a potential field by following the path of least resistance.
   - Testing: Test the Potential Field method using ROS and Gazebo.
   - Pros and Cons of Potential Field Methods: Explore the advantages and disadvantages of using potential field methods for robot path planning.
   - Conclusions: What did you learn in this unit?
6. **Final Project: Roadmap Based Path Planning** — This last unit is meant to be a bit of an extension lesson about path planning as well as a review of some of the core concepts that you learned throughtout this course. Specifically, you will be applying your knowledge about Dijkstra's shortest path algorithm, only this time, for a robot that is constrained by a road network.
   - Introduction: What is this final project about?
   - Setup: Download the required code for the final project.
   - Introducing Open Street Map (OSM): Learn the basics of Open Street Map (OSM) and how to integrate its data into robot path planning systems using ROS.
   - The open_street_map ROS Packages: Explore the ROS packages for Open Street Map (OSM), and learn how to configure and use them for robot path planning with real-world map data.
   - Starter Code for the Course Project: Some template code to help you get started with the final project.
   - Project Outcome: Expected outcome of the final project.

## Basic Arm Kinematics
*Learn the kinematics concepts through theory and hands on experience.*
**Rating:** 4.4 (49 reviews)

📂 **Detailed lessons:** [`05roboticstheory/basic-arm-kinematics/`](05roboticstheory/basic-arm-kinematics/README.md)

### Overview
Robot Kinematics is vital for robot manipulation and locomotion. Knowing how to define the frames of reference and create the Inverse Kinematics equations is key to being able to move the robot end effector to the needed position and orientation.

### What you'll learn
- The baiscs of Rigid Body tranformations
- The Denavit Hartenberg method for frames generation.
- Forwards kinematics
- Inverse Kinematics

### Course outline
1. **Course Introduction** — A brief introduction to the course contents. Contains a practical demo.
   - Introduction: What is this course about?
   - A Hands-on Experience: Try a practical demonstration to get an idea of what you'll achieve by the end of this course.
   - Outline of the course: Outline of all the main concepts you will learn in this course.
   - Requirements for the course: What are the minimum requirements before starting this course?
   - Acknowledgments: Special thanks to all the parties involved in making this course possible.
2. **Basic Kinematic Concepts** — Learn the basics of Rigid Body Transformations.
   - Introduction: What will you learn in this unit?
   - Rigid Body: Introduction to the concept of rigid bodies.
   - Rigid Body Position and Orientation: Learn about rigid body position and orientation, essential concepts for defining the location and direction of objects in space.
   - Rotation and Translation with Homogeneous Matrix: Explore rotation and translation using homogeneous matrices to represent rigid body movements in robotics.
   - Hands-on Practice!: Compute the rotation matrix and validate that it correctly predicts the Daruma robot's rotations.
   - Conclusions: What did you learn in this unit?
3. **Denavit Hartenberg** — Learn the Denavit-Hartenberg method for efficiently representing and solving robot kinematics.
   - Introduction: What will you learn in this unit?
   - Create a Kinematic diagram of your robot: Learn to create a kinematic diagram of your robot to visually represent its joints, links, and movements.
   - DH parameters: Understand the basic concepts behind DH parameters and their role in robot kinematics.
   - Step 0 - Basics: First steps for finding the generic Homogeneous Matrix.
   - Step 1 - Translation in d_i and Rotation in theta_i: Learn how to represent translation using d_i and rotation using theta_i in the DH parameter method.
   - Step 2: Translation in r_i and Rotation in alpha_i: Understand how to represent translation using r_i and rotation using alpha_i in the DH parameter method.
   - Hands-on Practice!: In this exercise, the objective is to calculate the Homogeneous Matrix for a simulated robot arm.
   - Conclusions: What did you learn in this unit?
4. **Forward and Inverse Kinematics** — Learn how to compute both forward and inverse kinematics for robotic systems, determining position and orientation from joint parameters and vice versa.
   - Introduction: What will you learn in this unit?
   - Forward Kinematics: Understand how to compute the position and orientation of a robot's end-effector using its joint parameters and the forward kinematics equations.
   - Inverse Kinematics: Introduction to Inverse Kinematics.
   - Operational Space: Understand how to define and manipulate the operational space for inverse kinematics solutions.
   - Inverse Kinematics Resolution: Learn methods to solve inverse kinematics problems and compute joint configurations for desired end-effector positions.
   - Step 1: Simplify the problem: Simplify inverse kinematics problems by breaking them down into smaller, manageable steps.
   - Step 2: Sum of squares for theta_2: Use the sum of squares method to solve for theta_2 in inverse kinematics problems.
   - Step 3: Division for theta_1: Solve for theta_1 by dividing the appropriate terms in the inverse kinematics equation.
   - Step 4: Use orientation equations for theta_3: Use the orientation equations to solve for theta_3, ensuring the robot's end-effector aligns correctly.
   - Step 5: First partial solution: Obtain the first partial solution based on the previously derived equations.
   - Step 6: Search for the relation between P2 and P3: Analyze and establish the relationship between points P_2 and P_3 to refine the inverse kinematics solution.
   - Step 7: Final Solution of the IK: Derive the final solution for the inverse kinematics problem, incorporating all previous steps to determine the joint angles.
   - Hands-on Practice! - Part 1: Create a Python script that resolves the IK for a simulated planar arm.
   - Hands-on Practice! - Part 2: Use the computed IK to move the robot's arm End Effector in a continuous elliptical trajectory around its center.
   - Conclusions: What did you learn in this course?

## Kalman Filters in ROS 2
*Learn how Kalman filters work and how to apply them to mobile robots using ROS.*
**Rating:** 5 (5 reviews)

📂 **Detailed lessons:** [`05roboticstheory/kalman-filters-in-ros-2/`](05roboticstheory/kalman-filters-in-ros-2/README.md)

### Overview
One of the most common problems in robot navigation is to know where your robot is localized in the environment (known as robot localization). In this field, Kalman Filters are one of the most important tools that we can use. With this course, you will understand the importance of Kalman Filters for robotics, and how they work. You will learn the theoretical meaning, but also the Python implementation. Finally, you will also apply the studied filters to mobile robots using ROS 2.

### What you'll learn
- In this course you will learn:
- What is a Kalman Filter and why are required
- Different types of Kalman Filters and when to apply each one.
- Bayesian Filters
- One-dimensional Kalman Filters
- Multivariate Kalman Filters
- Unscendent Kalman Filters
- Extended Kalman Filters
- Particle Filters

### Course outline
1. **Introduction to the Course** — A brief introduction to the course contents. It containing a practical demonstration.
   - Introduction: What is this unit about?
   - What's this course about?: What are you going to learn in this course?
   - What are Kalman filters and why do we need them?: Why are Kalman Filters essential in robotics?
   - Do you want to have a taste?: Go over a practical demo to see Kalman Filters in action in a typical robotics scenario.
   - Robots used in this course: Meet the robots you will be using during this course!
   - Requirements: What are the minimum requirements before starting this course?
   - Special Thanks!: Special thanks to all the parties involved in making this course possible.
2. **Bayesian Filter** — In this Chapter, you will learn about the Bayes Filter. Specifically, you will learn about the following concepts: the building blocks of the Bayes Filter, how sensor noise affects predictions, robot motion under uncertainty, the recursive nature of Bayesian filtering and how to implement a 1-dimensional discrete Bayes Filter.
   - Introduction: What will you learn in this unit?
   - What is a Bayes Filter?: What is a Bayes Filter, and how does it relate to Kalman Filters?
   - Bayes Filter Localization Example: This unit walks through a concrete localization example using a Bayes filter, showing step by step how a robot updates its belief about its position from motion and sensor data.
   - Bayes Filter Initialization: This unit explains how to initialize a Bayes filter by defining the robot’s initial belief (prior) and uncertainty before any motion or sensor updates.
   - Correct Step: This unit focuses on the **correction step** of the Bayes filter, where sensor measurements are used to update and refine the robot’s belief about its state
   - Sensor Noise: This unit introduces sensor noise and explains how uncertainty in measurements affects state estimation, motivating the need for probabilistic filtering methods.
   - Predict Step: This unit covers the **prediction step** of the Bayes filter, where the robot’s belief is updated using the motion model to account for movement and process uncertainty.
   - Movement noise: This unit explains movement noise and how uncertainty in robot motion affects state prediction, highlighting its impact on the Bayes filter’s accuracy.
   - Predict Step as a Sum of two probablity density functions: This unit explains the prediction step as a combination (sum) of probability density functions, showing how motion uncertainty spreads the robot’s belief over possible states.
   - Real strength comes from repetition: This unit emphasizes that Bayes estimation gains its real strength through repetition, as the predict and correct steps are applied iteratively in a continuous loop.
   - Noisy odometry and noisy sensor: This unit explores how noisy odometry and sensor measurements introduce uncertainty, and how these imperfections are handled within the Bayes estimation loop through a practical example.
   - Moving the robot several times in sequence: This unit shows how repeatedly moving the robot updates its belief over time, illustrating the cumulative effect of multiple predict and correct steps in sequence.
   - Conclusions: What did you learn in this unit?
3. **Kalman Filters** — In this Chapter, you will learn about traditional Kalman filters. Specifically, you will learn about the following concepts: Histograms and Gaussian distributions, One-dimensional Kalman filter and Multi-dimensional Kalman filter.
   - Introduction: What will you learn in this unit?
   - Histograms and Gaussians: This unit introduces histograms and Gaussian distributions as ways to represent uncertainty, moving from discrete probability maps to compact continuous models used in Kalman filters.
   - A closer look into our simulated environment: Introduction to the simulated scenario that will be used during this unit.
   - One-dimensional Kalman Filter: This unit introduces the one-dimensional Kalman filter, showing how motion models and sensor measurements are combined to estimate a single state variable under uncertainty.
   - Filter Initialization: This unit explains how to initialize a Kalman filter by choosing an initial state estimate and uncertainty, and why these choices affect early filter behavior and convergence.
   - Correct Step: This unit explains the correct (update) step of the Kalman filter, where sensor measurements are used to refine the predicted state and reduce uncertainty.
   - Predict Step: This unit explains the predict step of the Kalman filter, where the system model is used to forecast the next state and its uncertainty before incorporating new measurements.
   - Visualizing the Kalman Filter in action: Use rqt_plot to visualize how Kalman filters reduce noise and refine state estimates over time.
   - Multidimensional Kalman Filter: This unit extends the Kalman filter to multiple dimensions, showing how correlated state variables are estimated simultaneously using matrix-based models.
   - Multidimensional Kalman Filter Equations: This unit presents the full set of multidimensional Kalman filter equations, explaining how state vectors and covariance matrices are updated during the predict and correct steps.
   - Appendix: Sensor noise in Gazebo Sim: This appendix shows how to simulate sensor noise in Gazebo Sim, helping you create realistic measurements for testing and tuning Kalman filters.
   - Conclusions: What did you learn in this unit?
4. **Extended Kalman Filter and Unscented Kalman Filter** — In this chapter, you will learn about the Extended Kalman Filter (EKF) and the Unscented Kalman Filter (UKF). Specifically, upon completion of this chapter, you will: understand the underlying logic each filter uses for dealing with non-linear functions, understand how the traditional Kalman Filter is modified in each case, and use the robot_localization package, which contains EKF and UKF estimation nodes.
   - Introduction: What will you learn in this unit?
   - Extended Kalman Filter (EKF): This unit introduces the Extended Kalman Filter (EKF), which extends the Kalman filter to nonlinear motion and sensor models using local linearization.
   - Example: Jacobian Matrix for an Unicycle motion model: This unit walks through the computation of the Jacobian matrix for a unicycle motion model, illustrating how nonlinear dynamics are linearized for use in the EKF.
   - A Jacobian Matrix for the measurement model?: This unit explains how to compute the Jacobian matrix of the measurement model, enabling the EKF to incorporate nonlinear sensor measurements into the state update.
   - EKF Predict Step: This unit covers the EKF predict step, where the nonlinear motion model and its Jacobian are used to propagate the state estimate and uncertainty forward in time.
   - EKF Correct Step: This unit explains the EKF correct step, where nonlinear sensor measurements and their Jacobians are used to update the predicted state and reduce uncertainty.
   - EKF localization demo: This unit demonstrates EKF-based localization in practice, showing how motion and sensor models are fused to estimate a robot’s pose in a simulated environment.
   - The ekf_localization ROS node explained: This unit explains the `ekf_localization` ROS node, detailing how it fuses multiple sensor inputs to produce a consistent and accurate state estimate.
   - The Unscented Kalman Filter (UKF): This unit introduces the Unscented Kalman Filter (UKF), which handles nonlinear systems by propagating carefully chosen sigma points instead of linearizing models.
   - UKF Predict Step: This unit explains the UKF predict step, where sigma points are propagated through the nonlinear motion model to estimate the predicted state and covariance.
   - UKF Correct Step: This unit explains the UKF correct step, where predicted sigma points are updated using sensor measurements to refine the state estimate and uncertainty.
   - Configuring the robot_localization package: This unit explains how to configure the `robot_localization` package, focusing on sensor fusion settings, frame conventions, and filter parameters for reliable state estimation.
   - Conclusions: What did you learn in this unit?
5. **Particle Filter** — In this Unit, you will learn about the Particle filter. Specifically, upon completion of this unit, you will: understand the properties of the Particle filter, learn how the main filter steps work, implement the Adaptive Monte Carlo Localization package (AMCL), and use the AMCL package on a robot with rangefinder sensors to estimate its pose in a known map.
   - Introduction: What will you learn in this unit?
   - Generic Particle Filter Algorithm: This unit introduces the generic particle filter algorithm, explaining how a set of weighted samples is used to represent and update a probability distribution over the system state.
   - Particle Filter Initialization: This unit explains how to initialize a particle filter by selecting the initial particle distribution and weights, and how this choice affects convergence and accuracy.
   - Particle Filter Predict Step: This unit explains the particle filter's predict step, where particles are propagated through the motion model to represent the system’s predicted state distribution.
   - Particle Filter Correct Step: This unit explains the particle filter correct step, where particle weights are updated using sensor measurements to reflect how well each particle explains the observed data.
   - Particle Resampling: This unit explains particle resampling, where low-weight particles are discarded, and high-probability particles are duplicated to maintain an accurate and diverse state representation.
   - Configuring the AMCL package: This unit explains how to configure the AMCL package, focusing on motion models, sensor parameters, and particle filter settings for robust robot localization.
   - Test your configuration: This unit guides you through testing your configuration, verifying that sensor fusion and localization outputs behave correctly in practice.
   - Conclusions: What did you learn in this unit?
