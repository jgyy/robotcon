# Unit Testing with ROS — Unit 1: Introduction to the Course

This unit previews the course: why testing matters for robotics code specifically, and how the three levels of testing you'll build — plain Python, single ROS node, and multi-node integration — fit together into one coherent workflow.

## Why robotics code needs a testing discipline
Robotics software fails in ways that are expensive to reproduce: a race condition that only shows up on real hardware, a coordinate frame mixup that only matters once a physical arm is bolted to a table, a callback that silently drops messages under load. You cannot always attach a debugger to a robot that's about to run into a wall, and re-running a physical experiment costs time, batteries, and sometimes parts. Automated tests let you catch a large class of these bugs on your laptop, before anything moves, and let you catch *regressions* — old bugs coming back — automatically every time you change code.

The value compounds as a project grows. A single-node "hello world" publisher barely needs tests. A stack with a perception node, a planner, a controller, and a safety monitor talking to each other absolutely does, because a change to one node can silently break an assumption another node relies on.

## The three levels you'll build
This course is deliberately structured as a pyramid, from cheapest/fastest to most expensive/slowest:

1. **Library unit tests** (Unit 3) — test your plain Python functions and classes with no ROS involved at all. These run in milliseconds, need no `ros2 launch`, and should form the bulk of your test suite.
2. **ROS-node level tests** (Unit 4) — spin up a single ROS node (or a lightweight test node talking to it) and verify it behaves correctly as a ROS citizen: publishes what it should, responds to services, handles parameters.
3. **ROS integration tests** (Unit 5) — bring up multiple real nodes together (via `launch_testing` or equivalent) and verify the *system* behaves correctly, not just each node in isolation.

Each level trades speed for realism. You write many library tests, fewer node tests, and a handful of integration tests — the classic "test pyramid" shape, applied to robotics.

## What you'll need
You should already be comfortable writing Python and reading/writing ROS 2 packages (nodes, topics, services, launch files). This course does not re-teach ROS basics — it assumes you can already build and run a simple publisher/subscriber pair, and it teaches you how to *verify* that code automatically instead of by eyeballing `ros2 topic echo` output. A working ROS 2 workspace with `colcon` and `pytest` available is all the tooling you need; nothing here is pinned to a specific ROS distribution.

## Try it yourself
Before writing any test code, open one existing ROS package you've built (or clone a simple example one) and answer, in a short note to yourself: which pieces of its logic are pure Python (no ROS calls) that Unit 3's approach would cover, and which pieces only make sense once a node is actually running (Unit 4/5 territory)? You'll use this split as your working example for the rest of the course.
