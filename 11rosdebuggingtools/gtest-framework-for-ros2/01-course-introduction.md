# GTest Framework for ROS2 — Unit 1: Course Introduction

Before touching a single line of test code, you need a clear picture of what software testing actually buys you and why robotics code, in particular, punishes teams that skip it. This unit sets the vocabulary and mental model the rest of the course builds on.

## Why testing matters more in robotics than in typical software

A web backend that misbehaves usually produces a bad HTTP response. A robot that misbehaves can drive into a wall, crush a gripper, or drain a battery mid-mission. Robotics software also tends to have more failure surface than average: it talks to hardware with real latency and noise, it runs distributed nodes that can start in any order, and it depends on timing assumptions that are easy to violate under load. Manual testing ("build it, run it on the robot, see if it looks right") does not scale once you have more than a handful of nodes, and it actively discourages refactoring — nobody wants to touch code they can only validate by running the physical robot.

Automated tests give you a cheap, repeatable way to answer "did I just break something?" before you ever power on hardware. In ROS2 specifically, tests can run headless in CI, in a Docker container, or on a laptop with no robot attached at all, which is what makes them viable for everyday development.

## The testing pyramid: unit, integration, and system tests

Most testing strategies organize around three levels, and this course is structured to walk you up through all three:

- **Unit tests** exercise a single function, class, or small piece of logic in isolation — no ROS graph, no other nodes involved. These are fast (milliseconds) and pinpoint failures precisely. Unit 2 covers these with GTest.
- **Integration tests** check that a small number of components work together correctly, e.g. a node's publisher actually reaches a subscriber with the expected message content. Unit 3 covers this for ROS2 nodes.
- **System tests** validate an entire running system — multiple nodes, simulation, real message flow — against end-to-end behavior. Unit 4 covers this using `launch_testing` and Nav2/Gazebo as a worked example.

The pyramid shape matters: you want *many* fast unit tests, *fewer* integration tests, and a *small number* of expensive system tests. Unit tests catch most bugs cheaply; system tests catch the ones that only emerge from real interaction, but they are slow and harder to debug when they fail.

## How ROS2 fits testing into its build system

ROS2 packages are built with `colcon`, and testing is a first-class part of that workflow rather than a bolt-on. A package's `CMakeLists.txt` can register test executables via `ament_cmake_gtest`, and `colcon test` will build and run them, then `colcon test-result` summarizes pass/fail across the whole workspace:

```bash
colcon build --packages-select my_robot_pkg
colcon test --packages-select my_robot_pkg
colcon test-result --verbose
```

This is the loop you will use constantly through this course: write a test, build, run `colcon test`, read the result. GTest (Google Test) is the C++ testing framework ROS2 tooling wires up by default, which is why this course focuses on it — it is the path of least resistance for testing C++ nodes, and the same underlying assertion vocabulary reappears in `launch_testing` for Python-driven system tests later.

## What's ahead

By the end of this course you will be able to: write and run plain GTest unit tests inside a ROS2 package, test a node's publish/subscribe behavior without a full system running, assemble a multi-node system test with simulation in the loop, and apply all of it to validate a real package end to end in the course project.

## Try it yourself

Pick any existing ROS2 package on your machine (or create an empty one with `ros2 pkg create --build-type ament_cmake my_test_pkg`). Run `colcon test --packages-select my_test_pkg` and then `colcon test-result --verbose` even though no tests exist yet. Read the output carefully — get comfortable with what a "zero tests" report looks like so you can recognize the moment your own tests start appearing in it in the next unit.
