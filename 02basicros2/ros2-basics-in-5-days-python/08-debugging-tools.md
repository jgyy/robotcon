# ROS2 Basics in 5 Days (Python) — Unit 8: Debugging Tools

With topics, services, actions, and callbacks all in your toolkit, the last practical skill is diagnosing a system when it doesn't behave as expected. This unit covers ROS 2's logging framework, RViz2 for visualizing data you can't just print, TF for understanding coordinate frames, and `ros2 doctor` for catching environment problems.

## ROS 2 debugging messages
`self.get_logger()` gives every node a leveled logger, so you're not choosing between silence and `print()` spam:
```python
self.get_logger().debug('low-level detail, hidden by default')
self.get_logger().info('normal operational message')
self.get_logger().warn('something is off but recoverable')
self.get_logger().error('something failed')
self.get_logger().fatal('unrecoverable')
```
Control verbosity per node without touching code:
```bash
ros2 run my_robot_pkg my_node --ros-args --log-level debug
ros2 run my_robot_pkg my_node --ros-args --log-level warn
```
For repeated, high-frequency callbacks, use throttled logging so you don't flood the terminal:
```python
self.get_logger().info('still scanning...', throttle_duration_sec=2.0)
```

## Visualize complex data with RViz2
Some data is effectively impossible to debug from log lines alone — a laser scan, a point cloud, a camera image, a robot's planned trajectory. RViz2 is ROS 2's 3D visualization tool: it subscribes to topics (`sensor_msgs/msg/LaserScan`, `sensor_msgs/msg/PointCloud2`, `nav_msgs/msg/Path`, etc.) and renders them spatially in real time.
```bash
rviz2
```
Inside RViz2, add a display panel for the message type you care about, point it at the right topic, and set the correct "Fixed Frame" (see below) — a huge fraction of "RViz2 shows nothing" issues are actually a Fixed Frame mismatch, not a missing publisher.

## Visualize robot frames
ROS 2 tracks spatial relationships between parts of a robot (and the world) using **TF** — a tree of named coordinate frames (`base_link`, `laser_frame`, `map`, ...) with transforms between them, broadcast on `/tf` and `/tf_static`. Almost every perception or navigation bug traces back to a broken or missing TF link. Inspect the tree with:
```bash
ros2 run tf2_tools view_frames    # renders the current TF tree to a PDF
ros2 run tf2_ros tf2_echo map base_link   # print the live transform between two frames
```
In RViz2, add a "TF" display to see every frame and its axes overlaid in 3D — a frame that never appears, or appears frozen at the origin, means something isn't broadcasting its transform.

## ROS2 Doctor
`ros2 doctor` audits your running environment and flags common misconfigurations — mismatched ROS_DOMAIN_ID, missing dependencies, network setup issues, QoS incompatibilities between a publisher and subscriber that silently prevent messages from being delivered:
```bash
ros2 doctor                 # quick pass/fail summary
ros2 doctor --report        # detailed report, useful to paste when asking for help
ros2 wtf                    # alias for ros2 doctor --report
```
Run this early whenever something looks wrong at the graph level (a node that won't discover another, a topic that shows a publisher and subscriber in `ros2 topic info` but never delivers data) before assuming the bug is in your callback logic.

## Try it yourself
Take any publisher/subscriber pair from Unit 3, deliberately set an incompatible QoS setting on one side (e.g. `reliability` mismatched between publisher and subscriber), and use `ros2 topic info -v` plus `ros2 doctor --report` to identify the mismatch without reading your own source code. Then fix it and confirm the report is clean.
