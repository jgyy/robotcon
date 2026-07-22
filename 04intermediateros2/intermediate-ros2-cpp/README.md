# Intermediate ROS2 (C++)

This course picks up where a first ROS 2 course leaves off and goes deep on the machinery that turns a handful of nodes into a real, maintainable robot system: composing launch files across Python, XML, and YAML; declaring and reacting to node parameters at runtime; structuring nodes as managed lifecycle nodes the way Nav2 does; and understanding the Quality of Service policies and DDS middleware that determine whether two nodes can actually talk to each other. It assumes you can already write and build an `rclcpp` C++ node — the focus here is everything around that node, not how to write one from scratch.

1. [Course Introduction](01-course-introduction.md) — What the course covers, a parameter-driven speed-control demo, and what you should already know before starting.
2. [Advanced Launch Files](02-advanced-launch-files.md) — Composing nested, modular launch files and passing arguments and parameters through them.
3. [XML and YAML Launch Files](03-xml-and-yaml-launch-files.md) — Writing the same launch description in Python, XML, and YAML, and choosing between them.
4. [Node Parameters](04-node-parameters.md) — Declaring parameters in C++, managing them from the CLI and YAML files, and reacting to changes with callbacks.
5. [Lifecycle Nodes](05-lifecycle-nodes.md) — Managed node states and transitions, a minimal `LifecycleNode`, the Life Cycle Manager pattern, and how Nav2 uses it.
6. [Quality of Service](06-quality-of-service.md) — QoS policies (reliability, durability, deadline, lifespan, liveliness), compatibility rules, and QoS in rosbag2.
7. [Understanding DDS](07-understanding-dds.md) — What DDS is, inspecting and switching the RMW implementation, and the ROS 2 daemon.
