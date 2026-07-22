# ROS Autonomous Vehicles 101 — Final Recommendations

You now have a small but complete Level 3 stack: sensing, GPS navigation, obstacle handling, and CAN-Bus actuation, tied together in a microproject. This closing unit points at where to take that foundation next.

## Where to go deeper
Each unit in this course used the simplest version of its topic on purpose. The natural next steps:

- **Navigation**: swap the hand-rolled waypoint follower (Unit 2) for Nav2, ROS 2's standard navigation stack — it adds proper global/local path planning, costmaps, and recovery behaviors instead of the reactive rules you wrote here.
- **Perception**: the obstacle detection in Unit 3 used raw laser ranges only. Adding camera-based object detection (so the car can distinguish "pedestrian" from "traffic cone") is the natural next skill, and pairs well with a course on deep learning for perception.
- **Full open-source AV stacks**: once you're comfortable with the pieces individually, it's worth reading through the architecture of a complete open-source autonomous driving project built on ROS 2 — Autoware is the best-known example — to see how a production-oriented team structures the same sensing/planning/control problem at much larger scale.
- **Simulation fidelity**: if you built this course's exercises against a simple simulator, revisit them in Gazebo (gazebosim.org) with a more realistic vehicle dynamics model — cornering, tire slip, and braking distance all behave differently once you're not just integrating a velocity command.

## Safety and real-world considerations
Everything in this course was built and tested in simulation, which is the right place to learn — but worth naming clearly before you consider any of this near a real vehicle:

- Real automotive safety work is governed by standards like ISO 26262 (functional safety) and involves redundant sensing, formal hazard analysis, and extensive validation far beyond what a self-study course covers.
- The emergency-stop and watchdog patterns from Unit 3 are the right *shape* of a real safety system, but a real one needs hardware-level redundancy (a stop that works even if the software has crashed), not just a well-written ROS node.
- Treat everything you built here as a simulation-and-learning project, not a blueprint for road use.

## Build a portfolio project
The microproject in Unit 5 is intentionally small. To turn this course into something you can show, consider extending it with one clear addition rather than many small ones — for example, add lane-following from camera input, add a second obstacle vehicle that moves (not just a static one), or port the mission node to Nav2 and compare behavior against your hand-rolled version. A single well-documented extension demonstrates more than a pile of half-finished features.

## Continuing resources
- **docs.ros.org** — the canonical reference for ROS 2 concepts, CLI tools, and package documentation; worth bookmarking for any future ROS work, not just this course.
- **gazebosim.org** — documentation and tutorials for the Gazebo simulator, useful once you outgrow whatever simulator this course used.
- Package-specific documentation for `robot_localization` and `ros2_socketcan` (searchable on the ROS package index) if you continue down the GPS-fusion or CAN-bridging paths from Units 2 and 4.

## Try it yourself
Write a one-page plan (just for yourself) for the single extension you'd make to the Unit 5 microproject: what changes, which existing nodes it touches, and what a successful test run looks like. Treat it as the spec you'd hand to yourself before the next coding session.
