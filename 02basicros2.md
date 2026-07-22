# 02 Basic ROS 2

## ROS2 Basics in 5 Days (C++)
*Learn ROS2 basics now. It doesn't matter if you are new to ROS or a veteran, ROS2 is here to stay. C++ is vital for professionals.*
**Rating:** 4.6 (14 reviews)

📂 **Detailed lessons:** [`02basicros2/ros2-basics-in-5-days-cpp/`](02basicros2/ros2-basics-in-5-days-cpp/README.md)

### Overview
ROS 2 is finally here! This introductory course is designed for both new ROS users and experienced ROS 1 users looking to transition to ROS 2. ROS 2 introduces many new features that will gain traction in the coming years. This course focuses on the fundamental concepts needed to get started with ROS 2, rather than diving into its more advanced features, which will be covered in specialized courses.

### What you'll learn
- Creation of ROS2 packages
- Management of the new Colcon universal building system.
- Topic Publishers and subscribers in ROS2 C++.
- New Launch system based on python
- Service servers and client generation for ROS2.
- Usage of executors and callback groups to manage multithreading in ROS2.
- Use of Debbuging tools in ROS2.

### Course outline
1. **Introduction** — Demo and introductin to the course
   - What is this course about?: A brief explanation of what to expect from this course.
   - Navigate the Leo Rover on Mars!: Use ROS 2 to move a Leo Rover robot around Mars!
   - What will you learn with this course?: Outline of all the ROS 2 skills you will learn in this course.
   - Real Robot Project: Apply what you've learned in the course to a project based on a real robot.
   - Minimum Requirements: What are the minimum requirements before starting this course?
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **Basics** — Learn how to create ROS2 packages, what they are and what are they for.
   - Introduction: What will you learn in this unit?
   - Move a Robot with ROS 2: Start practicing with ROS 2 by controlling a simulated Leo Rover robot!
   - What is a Package?: Understand what a ROS 2 package is.
   - Create a Package: Learn how to create a ROS 2 package.
   - Compile a Package: Learn how to build a ROS 2 package.
   - Create your first ROS 2 program: Learn, step by step, how to create your first ROS 2 program.
   - What are ROS 2 Nodes?: Learn what nodes are and their essential role in ROS 2 systems.
   - Interacting with ROS 2 Nodes: Learn some basic command line tools to interact with ROS 2 nodes.
   - The ROS 2 Node Class: Learn how to properly use the ROS 2 Node class to create your own custom ROS 2 nodes.
   - What is a Launch File?: Learn how to start ROS 2 nodes using a launch file.
   - Conclusions: What did you learn in this unit?
3. **Topics** — Learn about the basic information channel of ROS2
   - Introduction: What will you learn in this unit?
   - Basic Topic Commands: Learn the basic command line tools to interact with ROS 2 topics.
   - Explore the Mars Rover Topics: Start interacting with topics by exploring the Topics available for the Mars Rover robot.
   - What is a ROS 2 Topic?: Clearly define what a Topic is and its essential role within a ROS 2 system.
   - Topic Subscriber: Learn what a Topic Subscriber is and how to create one in a ROS 2 program
   - Topic Publisher: Learn what a Topic Publisher is and how to create one in a ROS 2 program
   - How to mix Publishers and Subscribers: Learn how to create a more complex ROS 2 node that combines Topic Publishers and Subscribers
   - Create a Custom Interface: Learn how to create a ROS 2 Custom Interface for customized data messages
   - Use a Custom Interface: Learn how to import and use a custom interface in your ROS 2 Node
   - Topics Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Real Robot Project: Complete the Real Robot Project section associated with Topics
   - Conclusions: What did you learn in this unit?
4. **Services** — Learn about services in ROS2
   - Introduction: Intro to services
   - What is a Service in ROS2?: Learn what a service is in ROS 2 and how it differs from topic-based communication.
   - Introducing NASA Mission: Get introduced to the NASA mission for this unit and set up all the required files.
   - Service Server: Learn what a Service Server is and how to create one in a ROS 2 program
   - Service Client: Learn what a Service Client is and how to create one in a ROS 2 program
   - Synchronous vs. Asynchronous Service Clients: Learn the main differences between Synchronous and Asynchronous Service Clients in ROS 2
   - Custom Service Interface: Learn how to create a ROS 2 Custom Service Interface for customized data messages
   - Use a Custom Service Interface: Learn how to import and use a custom service interface in your ROS 2 Node
   - Services Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Conclusions: What did you learn in this unit?
5. **Multithreading** — First steps on multithreading in ROS2 C++
   - Introduction: What will you learn in this unit?
   - Introduction to NASA mission: Introducing the main mission for this unit.
   - Functions: Learn what a function is and its role in a ROS 2 program.
   - Callback Functions: Learn what a callback function is and its role in a ROS 2 program.
   - Hands-on Practice!: Put all your newly learned concepts into practice by creating an automatic plant detection system for Mars!
   - Spin Once: Learn about Spin Once and its role in a ROS 2 program
   - Conclusions: What did you learn in this unit?
6. **MultiThreading Part2** — Second part in this multithreading in ROS2
   - Introduction: What will you learn in this unit?
   - Introduction to NASA mission: Get introduced to the NASA mission for this unit and set up all the required files.
   - Why You Need Multithreading?: Get familiar with the concept of multithreading and why it is essential in ROS 2.
   - Why You Need Callback Groups?: Get familiar with the concept of callback groups and why it is essential in ROS 2.
   - Reentrant Callback Group: Learn more details about the Reentrant Callback Group.
   - Mutually Exclusive Callback Group: Learn more details about the Mutually Exclusive Callback Group.
   - Multiple Nodes in One Executor: Learn how to handle multiple ROS 2 Nodes in one single executor for creating more complex ROS 2 programs.
   - Real Robot Project: Complete the Real Robot Project section associated with Multithreading
   - Conclusions: What did you learn in this unit?
7. **Actions** — Learn about actions
   - Introduction: Introduction to Actions in ROS2 C++
   - What is an Action in ROS2?: Learn what an action is in ROS 2 and how it differs from topic and service-based communications.
   - Interacting with Actions: Learn some basic command line tools to interact with ROS 2 actions.
   - Calling an Action Server: Learn how to call an Action Server using the command line tools.
   - Action Client: Learn what an Action Client is and how to create one in a ROS 2 program
   - Action Server: Learn what an Action Server is and how to create one in a ROS 2 program
   - Custom Action Interface: Learn how to create a ROS 2 Custom Action Interface for customized data messages
   - Use a Custom Action Interface: Learn how to import and use a custom action interface in your ROS 2 Node
   - Actions Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Real Robot Project: Complete the Real Robot Project section associated with Topics
   - Conclusions: What did you learn in this unit?
8. **Node Composition** — Learn how to dynamically load multiple nodes into a single process at runtime
   - Introduction: What will you learn in this unit?
   - What are ROS2 Components?: Learn about ROS2 Components and how they enable dynamic management of nodes within ROS2 systems.
   - Run-time Composition: Explore run-time composition in ROS2 and how it allows dynamic assembly and management of nodes during execution.
   - Summary: Quick recap of the most important commands learned so far in the unit.
   - Loading components with a launch file: Learn how to load ROS2 components dynamically using a launch file.
   - Compile-time composition: Understand compile-time composition in ROS2 and how it differs from run-time composition.
   - Service composition: Learn how to compose and manage services in ROS 2.
   - Conclusions: What did you learn in this unit?
9. **Debugging** — Learn skills for debugging code and robotics related issues.
   - Introduction: What will you learn in this unit?
   - ROS2 Debugging Messages: Learn how to use debugging messages in your ROS 2 programs.
   - Visualize Complex Data with RViz2: Learn to use RViz2 to visualize complex data such as laser scans.
   - Visualize Robot Frames: Learn about robot frames and how to visualize them to debug potential issues.
   - ROS2 Doctor: Learn to use the ROS2 Doctor tool to debug potential issues in your ROS 2 system.
   - Conclusions: What did you learn in this unit?

## ROS2 Basics in 5 Days (Python)
*Learn ROS2 basics now. It doesn't matter if you are new to ROS or a veteran, ROS2 is here to stay.*
**Rating:** 4.4 (258 reviews)

📂 **Detailed lessons:** [`02basicros2/ros2-basics-in-5-days-python/`](02basicros2/ros2-basics-in-5-days-python/README.md)

### Overview
ROS2 is finally here! This introductory course is intended not only for new ROS users but also ROS1 old users that want to start with ROS2. ROS2 adds a lot of new features that will get traction in the next year. This course will give you the basics for starting ROS2, more than the bells and whistles of ROS2 that are much more advanced topics and will be addressed in their respective specialized courses.

### What you'll learn
- Creation of ROS2 packages
- Management of the new Colcon universal building system.
- Topic Publishers and subscribers in ROS2 Python.
- New Launch system based on Python
- Service servers and client generation for ROS2.
- Basic use of ROS1-Bridge to communicate ROS2 systems with ROS1 systems.
- Use of Debbuging tools in ROS2.

### Course outline
1. **Introduction to the Course** — What is this course about?
   - What is this course about?: A brief explanation of what to expect from this course.
   - Navigate the Leo Rover on Mars!: Use ROS 2 to move a Leo Rover robot around Mars!
   - What will you learn with this course?: Outline of all the ROS 2 skills you will learn in this course.
   - Real Robot Project: Apply what you've learned in the course to a project based on a real robot.
   - Get a certificate!: Earn a certificate that validates your knowledge of ROS 2 Basics!
   - Minimum Requirements: What are the minimum requirements before starting this course?
   - Special Thanks: Special thanks to all the parties involved in making this course possible.
2. **ROS2 Basic Concepts** — Basic ROS2 concepts: packages, nodes, compilation, launch files, etc...
   - Introduction: What will you learn in this unit?
   - Move a Robot with ROS 2: Start practicing with ROS 2 by controlling a simulated Leo Rover robot!
   - What is a Package?: Understand what a ROS 2 package is.
   - Create a Package: Learn how to create a ROS 2 package.
   - Compile a Package: Learn how to build a ROS 2 package.
   - Create your first ROS 2 program: Learn, step by step, how to create your first ROS 2 program.
   - What are ROS 2 Nodes?: Learn what nodes are and their essential role in ROS 2 systems.
   - Interacting with ROS 2 Nodes: Learn some basic command line tools to interact with ROS 2 nodes.
   - The ROS 2 Node Class: Learn how to properly use the ROS 2 Node class to create your own custom ROS 2 nodes.
   - What is a Launch File?: Learn how to start ROS 2 nodes using a launch file.
   - Conclusions: What did you learn in this unit?
3. **Understanding ROS2 Topics** — The main objective of this unit is to teach you all the basics needed to work with topics, the basic messages used by ROS2 to connect its different processes, access sensor data, and control actuators.
   - Introduction: What will you learn in this unit?
   - Basic Topic Commands: Learn the basic command line tools to interact with ROS 2 topics.
   - Explore the Mars Rover Topics: Start interacting with topics by exploring the Topics available for the Mars Rover robot.
   - What is a ROS 2 Topic?: Clearly define what a Topic is and its essential role within a ROS 2 system.
   - Topic Subscriber: Learn what a Topic Subscriber is and how to create one in a ROS 2 program
   - Topic Publisher: Learn what a Topic Publisher is and how to create one in a ROS 2 program
   - How to mix Publishers and Subscribers: Learn how to create a more complex ROS 2 node that combines Topic Publishers and Subscribers
   - Create a Custom Interface: Learn how to create a ROS 2 Custom Interface for customized data messages
   - Use a Custom Interface: Learn how to import and use a custom interface in your ROS 2 Node
   - Topics Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Real Robot Project: Complete the Real Robot Project section associated with Topics
   - Conclusions: What did you learn in this unit?
4. **Understanding ROS2 Services** — What is a ROS2 Service? How to manage services in a robot and how to call a service.
   - Introduction: What will you learn in this unit?
   - What is a Service in ROS2?: Learn what a service is in ROS 2 and how it differs from topic-based communication.
   - Introducing NASA Mission: Get introduced to the NASA mission for this unit and set up all the required files.
   - Service Server: Learn what a Service Server is and how to create one in a ROS 2 program
   - Service Client: Learn what a Service Client is and how to create one in a ROS 2 program
   - Synchronous vs. Asynchronous Service Clients: Learn the main differences between Synchronous and Asynchronous Service Clients in ROS 2
   - Custom Service Interface: Learn how to create a ROS 2 Custom Service Interface for customized data messages
   - Use a Custom Service Interface: Learn how to import and use a custom service interface in your ROS 2 Node
   - Services Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Conclusions: What did you learn in this unit?
5. **Callbacks in ROS 2** — The main objective of this unit is to learn why you need callbacks and how they work in ROS 2.
   - Introduction: What will you learn in this unit?
   - Introduction to NASA mission: Introducing the main mission for this unit.
   - Functions: Learn what a function is and its role in a ROS 2 program.
   - Callback Functions: Learn what a callback function is and its role in a ROS 2 program.
   - Hands-on Practice!: Put all your newly learned concepts into practice by creating an automatic plant detection system for Mars!
   - Spin Once: Learn about Spin Once and its role in a ROS 2 program
   - Conclusions: What did you learn in this unit?
6. **Multithreading** — Learn how to use multithreading in ROS2 and how it connects with callbacks.
   - Introduction: What will you learn in this unit?
   - Introduction to NASA mission: Get introduced to the NASA mission for this unit and set up all the required files.
   - Why You Need Multithreading?: Get familiar with the concept of multithreading and why it is essential in ROS 2.
   - Why You Need Callback Groups?: Get familiar with the concept of callback groups and why it is essential in ROS 2.
   - Reentrant Callback Group: Learn more details about the Reentrant Callback Group.
   - Mutually Exclusive Callback Group: Learn more details about the Mutually Exclusive Callback Group.
   - Multiple Nodes in One Executor: Learn how to handle multiple ROS 2 Nodes in one single executor for creating more complex ROS 2 programs.
   - Real Robot Project: Complete the Real Robot Project section associated with Multithreading
   - Conclusions: What did you learn in this unit?
7. **Understanding ROS2 Actions** — What is a ROS2 Action, how to manage actions in a robot and how to call an Action Server.
   - Introduction: What will you learn in this unit?
   - What is an Action in ROS2?: Learn what an action is in ROS 2 and how it differs from topic and service-based communications.
   - Interacting with Actions: Learn some basic command line tools to interact with ROS 2 actions.
   - Calling an Action Server: Learn how to call an Action Server using the command line tools.
   - Action Client: Learn what an Action Client is and how to create one in a ROS 2 program
   - Action Server: Learn what an Action Server is and how to create one in a ROS 2 program
   - Custom Action Interface: Learn how to create a ROS 2 Custom Action Interface for customized data messages
   - Use a Custom Action Interface: Learn how to import and use a custom action interface in your ROS 2 Node
   - Actions Quiz: Complete an auto-corrected exercise to test your current knowledge.
   - Real Robot Project: Complete the Real Robot Project section associated with Topics
   - Conclusions: What did you learn in this unit?
8. **Debugging Tools** — How to manage log messages in ROS2. Also, learn how to launch and use RViz2 and how to use the new ros2 doctor tool.
   - Introduction: What will you learn in this unit?
   - ROS2 Debugging Messages: Learn how to use debugging messages in your ROS 2 programs.
   - Visualize Complex Data with RViz2: Learn to use RViz2 to visualize complex data such as laser scans.
   - Visualize Robot Frames: Learn about robot frames and how to visualize them to debug potential issues.
   - ROS2 Doctor: Learn to use the ROS2 Doctor tool to debug potential issues in your ROS 2 system.
   - Conclusions: What did you learn in this unit?
9. **Final Recommendations** — What to do after finishing the course?
   - What next?: How can you keep improving your ROS 2 skills?

## ROS2 Basics in 3 Days (Rust)
*Be at the forefront of robotics engineering by combining ROS2 and Rust.*
**Rating:** 3 (6 reviews)

📂 **Detailed lessons:** [`02basicros2/ros2-basics-in-3-days-rust/`](02basicros2/ros2-basics-in-3-days-rust/README.md)

### Overview
We'll start with the fundamentals, building a strong foundation that will enable you to confidently work with ROS2 in Rust. From creating a package to understanding publishers and subscribers, you'll get the knowledge and skills you need to bring your robotics projects to life.

### What you'll learn
- Creation of ROS2 packages for Rust
- Writing Cargo build scripts
- Topic Publishers and subscribers in ROS2 Rust.
- Create launch files based on Python.

### Course outline
1. **Introduction to the Course** — This unit is an introduction to the ROS2 Basics in 3 Days using Rust course. You will have a quick preview of the contents to be covered in the course and a practical demo.
2. **Basic Concepts** — This course unit covers structuring and launching ROS2 programs (packages and launch files), creating basic ROS2 programs in Rust, and fundamental ROS2 concepts like nodes and client libraries.
3. **ROS2 Topics** — This course unit explores managing topics, creating publishers and subscribers, understanding topic messages, and developing custom interfaces in topic-based communication within a limited character count.
