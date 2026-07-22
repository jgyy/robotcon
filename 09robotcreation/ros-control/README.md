# ROS Control

`ros_control`/`ros2_control` is the layer that turns target positions, velocities, and trajectories into real commands on a robot's actuators, and real actuator/encoder data back into usable state — the piece that lets a robot actually move its wheels or joints instead of just knowing where they are. This course builds that picture from the ground up: the core actors (controller manager, controllers, hardware interfaces), how to configure stock controllers for both a simple robot and a full manipulator, how to write a custom controller and a custom hardware interface, and a capstone project wiring the whole stack onto a UR5 arm.

The diagram below shows how each unit builds on the one before it, from core concepts through to the UR5 capstone.

```mermaid
flowchart LR
    U1[Unit 1: Introduction] --> U2[Unit 2: Essentials]
    U2 --> U3[Unit 3: Configure Controllers]
    U3 --> U4[Unit 4: Create a Controller]
    U4 --> U5[Unit 5: Clarkson Manipulator]
    U5 --> U6[Unit 6: Hardware Abstraction Layer]
    U6 --> U7[Unit 7: QUIZ - UR5 Capstone]
```

1. [Introduction to the Course](01-introduction-to-the-course.md) — Why ros_control exists, its three core actors, and a roadmap for the course.
2. [ROS_Controls Essentials](02-ros-controls-essentials.md) — Controller manager, state/command interfaces, controller types, and the real-time update loop.
3. [Configuring the Controllers](03-configuring-the-controllers.md) — The `<ros2_control>` URDF tag, controller YAML, and spawning controllers on a simple robot.
4. [Create a Controller](04-create-a-controller.md) — Writing a minimal custom controller class and registering it as a pluginlib plugin.
5. [Configuring the Controllers (Clarkson Manipulator)](05-configuring-the-controllers-clarkson-manipulator.md) — Configuring a `joint_trajectory_controller` for a 6-DOF arm, and why joint order matters.
6. [Hardware Abstraction Layer](06-hardware-abstraction-layer.md) — What a HAL does, the `SystemInterface` lifecycle, and simulated vs. real hardware interfaces.
7. [QUIZ: Add ros_control to a UR5 Manipulator Robot](07-quiz-add-ros-control-to-a-ur5-manipulator-robot.md) — Capstone project combining every prior unit on a realistic 6-DOF arm.
