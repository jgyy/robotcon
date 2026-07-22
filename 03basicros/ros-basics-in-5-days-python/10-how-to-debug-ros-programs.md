# ROS Basics in 5 Days (Python) — Unit 10: How to Debug ROS Programs

Everything so far assumed your nodes behave. They won't always. This closing unit covers the tools ROS gives you for figuring out *why* — reading logs, inspecting live topic data, visualizing the node graph, recording data for offline analysis, and viewing 3D robot state in RViz.

## ROS debugging messages

`self.get_logger()` (used throughout this course) isn't just a `print()` replacement — it supports severity levels, which matters once a node is producing dozens of log lines per second:

```python
self.get_logger().debug('fine-grained internal state, usually silent')
self.get_logger().info('normal operational message')
self.get_logger().warn('something unexpected but not fatal')
self.get_logger().error('an operation failed')
self.get_logger().fatal('the node cannot continue')
```

By default `info` and above are shown; filter what you see at runtime without touching code:

```bash
ros2 run my_first_pkg minimal_publisher --ros-args --log-level debug
ros2 topic echo /rosout   # every node's log messages, as a topic
```

Treat log levels as a design tool: reserve `warn`/`error` for things a human actually needs to notice, or your terminal becomes noise you learn to ignore — exactly when a real error slips by.

## Rqt Console

`rqt_console` is a GUI that aggregates every node's log output (the `/rosout` topic) into one filterable, searchable window — filter by node name, severity, or a text pattern, instead of grepping scrollback across five terminals:

```bash
ros2 run rqt_console rqt_console
```

This is usually the first tool to reach for when something has gone wrong somewhere in a multi-node system and you don't yet know which node is at fault.

## Plotting topic data with Rqt Plot

Numeric fields inside a message stream are often easier to understand as a graph than as scrolling numbers — is that sensor reading noisy, drifting, or oscillating?

```bash
ros2 run rqt_plot rqt_plot /odom/twist/twist/linear/x
```

`rqt_plot` takes a dotted field path into a message and live-plots it, which is exactly how you'd confirm, for instance, that the `Takeoff` action server from Unit 9 was actually incrementing altitude smoothly rather than in erratic jumps.

## Node connections with Rqt Graph

Once a system has more than two or three nodes, understanding *who talks to whom* from source code alone gets hard. `rqt_graph` draws the live ROS computation graph — nodes as boxes, topics as edges between them:

```bash
ros2 run rqt_graph rqt_graph
```

This is the fastest way to confirm a wiring mistake: if you expected `PatrolNode` and `TakeoffServer` to be connected and the graph shows them as isolated boxes, you have a topic name or type mismatch — the exact class of bug flagged back in Unit 4.

## Recording and replaying data with rosbag

`ros2 bag` records topic traffic to disk so you can replay it later — invaluable for debugging a rare event without needing the physical robot (or simulator) available every time, and for building repeatable test cases:

```bash
ros2 bag record -o my_session /odom /cmd_vel /takeoff/_action/feedback
ros2 bag play my_session
ros2 bag info my_session   # topics, message counts, duration
```

A recorded bag plays messages back on the same topic names at the same relative timing they were recorded — any subscriber node can't tell the difference between live data and a bag replay, which is what makes this useful for regression testing.

## RViz

RViz is ROS's 3D visualization tool: it subscribes to topics like laser scans, point clouds, camera images, and transform (`tf`) data, and renders them spatially over the robot's model, rather than as raw numbers.

```bash
ros2 run rviz2 rviz2
```

Add a display for a topic (e.g. `LaserScan` on `/scan`, or `Odometry` on `/odom`) through RViz's GUI panel, and you can visually confirm things numeric tools can't easily show — is the laser scan pointed the right direction, does the robot's estimated position actually track its simulated movement, is a transform frame missing or mis-oriented.

## Try it yourself

Take any two nodes you built earlier in this course that communicate (e.g. the `MinimalPublisher`/`MinimalSubscriber` pair from Units 3–4), run them both, and use three tools from this unit in sequence: `rqt_graph` to confirm the connection exists, `rqt_plot` to graph one numeric field live, and `ros2 bag record` to capture 10 seconds of the traffic — then `ros2 bag info` the result to confirm the message count roughly matches the publish rate you configured.
