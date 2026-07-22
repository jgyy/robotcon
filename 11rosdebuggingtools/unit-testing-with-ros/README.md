# Unit Testing with ROS

Robots fail in expensive, hard-to-reproduce ways, so this course builds up a practical testing discipline in three layers: plain Python unit tests for your logic, ROS-node-level tests that exercise a single node as a ROS citizen, and multi-node integration tests that catch the bugs that only appear once separate processes actually talk to each other. Each unit builds on the same running example, culminating in a small end-to-end project that wires all three layers into one `colcon test` suite.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Why robotics needs automated testing and how the course's three testing levels fit together.
2. [Basic Concepts](02-basic-concepts.md) — Core testing vocabulary and the example Python module used throughout the course.
3. [Library Unit Tests](03-library-unit-tests.md) — Testing plain Python logic with `unittest`/`pytest`, no ROS involved.
4. [ROS-Node Level Tests](04-ros-node-level-tests.md) — Testing a single ROS node's parameters, publishers, and callbacks in-process.
5. [ROS Integration Tests](05-ros-integration-tests.md) — Testing multiple real node processes together with `launch_testing`.
6. [MicroProject](06-microproject.md) — A capstone `bumper_stop` node exercised at all three testing levels.
