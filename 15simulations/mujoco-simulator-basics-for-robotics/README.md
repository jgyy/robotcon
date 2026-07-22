# MuJoCo Simulator Basics for Robotics

MuJoCo is one of the most widely used physics engines in robotics, prized for fast and accurate contact-rich dynamics that make it a default choice for both classical control and reinforcement-learning research. This course takes you from installing MuJoCo through authoring scenes and robot models in its MJCF format, adding sensors and driving them with Python, and finally bridging a running simulation into ROS2 so it can plug into the rest of a robotics stack — finishing with a mini-project that assembles all of it into one working simulated robot arm.

The diagram below shows how each unit builds on the one before it, from installing MuJoCo through to the final integrated mini-project.

```mermaid
flowchart LR
    U1[Unit 1: Introduction] --> U2[Unit 2: User Interface]
    U2 --> U3[Unit 3: Scene Creation]
    U3 --> U4[Unit 4: Model Creation]
    U4 --> U5[Unit 5: Robot Creation]
    U5 --> U6[Unit 6: Sensors & Python]
    U6 --> U7[Unit 7: ROS2 Integration]
    U7 --> U8[Unit 8: Mini-Project]
```

1. [Introduction to MuJoCo Simulator](01-introduction-to-mujoco-simulator.md) — A quick introduction to this course and its contents along with some sample simulations with MuJoCo simulator using real robot models.
2. [User Interface](02-user-interface.md) — Learn about the essential components in the Graphical User Interface of MuJoCo and how to use them.
3. [Scene Creation](03-scene-creation.md) — Learn how to create simulation Scenes for MuJoCo simulations.
4. [Model Creation](04-model-creation.md) — Learn how to create simulation Models for MuJoCo simulations.
5. [Robot Creation](05-robot-creation.md) — Learn how to create a Robot Model with a Scene for MuJoCo simulations.
6. [Sensor Integration and Simulation Programming](06-sensor-integration-and-simulation-programming.md) — Learn how to integrate Sensors to a Robot Model and how write a program with Python to perform MuJoCo simulations.
7. [ROS2 Integration and Simulation Programming](07-ros2-integration-and-simulation-programming.md) — Learn how to quickly integrate ROS2 with MuJoCo simulations and how to write a program with ROS2 and Python to perform MuJoCo simulations.
8. [Course Mini-Project and Conclusion](08-course-mini-project-and-conclusion.md) — Instructions for course mini-project and concluding words.
