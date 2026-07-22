# ROS Basics in 5 Days (C++) — Unit 11: How to Debug ROS Programs

You now know how to build every major piece of a ROS system. This unit is about what to do when one of those pieces doesn't behave — the tool layer from Unit 2 that turns a silent, distributed, multi-process system back into something you can actually reason about.

## Logging: levels and filtering
Every `RCLCPP_*` (or `ROS_*` in ROS 1) macro takes a severity level — `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` — and your node's logger can be configured to only emit at or above a chosen level, so verbose `DEBUG` output doesn't drown a running system by default but is there when you need it. You can also filter and search aggregated logs from the CLI across all running nodes, which is faster than tailing individual terminal windows once you have more than two or three nodes running. A good habit: use `DEBUG` liberally during development for values you'd want to inspect, `WARN` for recoverable-but-suspicious conditions (e.g. a parameter defaulted because it was unset), and `ERROR` only for things that actually broke behavior.

## Recording and replaying data
Robot bugs are often not reproducible on demand — a sensor glitch, a race condition triggered by specific timing. The recording tool (`rosbag` in ROS 1, `ros2 bag` in ROS 2) subscribes to a set of topics and writes every message to disk with its timestamp; replaying that file later republishes the exact same sequence, letting you re-run your analysis or a fixed version of your node against data you can no longer reproduce live. This is the single highest-leverage debugging habit in robotics: record broadly and often, especially before you know you'll need it.

```
# record everything (careful: can be large)
ros2 bag record -a
# record specific topics
ros2 bag record /scan /cmd_vel
# replay
ros2 bag play my_bag_directory
```

## Plotting topic data live
Numeric fields on a topic (a velocity, a battery percentage, a PID error term) are much easier to understand as a live line graph than as scrolling text. The plotting tool subscribes to a specific field path on a topic and graphs it in real time — invaluable for tuning a controller, where you want to *see* the oscillation or overshoot rather than infer it from numbers.

## Visualizing the node graph
When something isn't connecting, the fastest sanity check is usually visual: a graph tool that draws every running node and every topic connecting them as boxes and arrows. This immediately reveals the two most common wiring bugs from Units 4-5 — a subscriber that never actually connected to its intended publisher (no arrow between them at all) — which text-based introspection can make you hunt for but a graph diagram shows at a glance.

## Basic RViz usage
For anything spatial — laser scans, point clouds, robot poses, planned paths — RViz (docs available at the ROS wiki and each distro's docs) renders topic data in 3D instead of asking you to interpret raw numbers. For debugging purposes you mostly need three skills: adding a display for a topic (e.g. a `LaserScan` display subscribed to `/scan`), setting the fixed frame so everything renders in a consistent reference frame, and toggling displays on/off to isolate which data source is behaving unexpectedly.

## Try it yourself
Take the `RobotStatus` publisher/subscriber pair from Unit 5: record a short bag of the topic while it runs, then kill both nodes and replay the bag while your subscriber (only) is running, confirming it still logs the low-battery warning correctly against replayed data instead of live data.
