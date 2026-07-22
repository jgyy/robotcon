# TF ROS2

TF2 is how ROS 2 keeps track of every coordinate frame on a robot — sensors, joints, the map, the body — and the transformations between them, so that any node can ask "where is X relative to Y, right now or at some point in the past" without hand-rolling matrix math. This course builds from the core concepts of frames and transforms, through the standard toolbox for visualizing and debugging a live TF tree, into writing your own broadcasters and listeners, and finishes with `robot_state_publisher`, the tool that automates TF for a full articulated robot from a URDF and live joint states.

1. [Introduction to TF](01-introduction-to-tf.md) — Why TF exists, coordinate frames and the frame tree, the right-hand rule convention, and creating/visualizing your first frame.
2. [TF Tools and Visualization](02-tf-tools-and-visualization.md) — Inspecting a live TF tree with `view_frames`, `rqt_tf_tree`, `tf2_echo`, and RViz2.
3. [Broadcast & Listen to TF Data](03-broadcast-listen-to-tf-data.md) — Writing dynamic and static TF broadcasters (CLI, launch file, Python), monitoring with `tf2_monitor`, and writing a TF listener.
4. [Robot State Publisher](04-robot-state-publisher.md) — Spawning an articulated robot, how `robot_state_publisher` turns a URDF and `/joint_states` into the full TF tree, and verifying it end-to-end.
