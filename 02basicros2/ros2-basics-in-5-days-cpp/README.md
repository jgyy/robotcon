# ROS2 Basics in 5 Days (C++)

This course is a hands-on introduction to ROS 2 using the C++ client library (`rclcpp`), aimed at programmers who are new to robotics but not new to code. Starting from an empty workspace, it builds up the full core toolkit — packages and builds, topics, services, actions, multithreaded execution, node composition, and debugging — through a running Mars-rover-flavored example, so that by the end you can structure, build, run, and troubleshoot a real multi-node ROS 2 C++ system.

1. [Introduction](01-introduction.md) — Course orientation, ROS 2 vs. ROS 1, environment setup, and the running rover example.
2. [Basics](02-basics.md) — Packages, workspaces, colcon builds, your first node, and launch files.
3. [Topics](03-topics.md) — The publish/subscribe communication channel, CLI tools, publishers, subscribers, and custom message interfaces.
4. [Services](04-services.md) — Request/response communication, service servers and clients, sync vs. async calls, and custom service interfaces.
5. [Multithreading](05-multithreading.md) — Callbacks, the executor, and the difference between `spin()` and `spin_once()`.
6. [MultiThreading Part2](06-multithreading-part2.md) — Callback groups, the multithreaded executor, and running multiple nodes in one executor.
7. [Actions](07-actions.md) — Long-running, cancellable, feedback-producing tasks: action servers, clients, and custom action interfaces.
8. [Node Composition](08-node-composition.md) — Loading multiple nodes as components in a single process, at run-time and compile-time.
9. [Debugging](09-debugging.md) — Logging, RViz2 visualization, TF frames, and the `ros2 doctor` diagnostic tool.
