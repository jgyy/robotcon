# ROS2 Navigation — Unit 2: How to Build a Map

Nav2's global planner needs a model of the world to plan through, and its localizer needs one to localize against. That model is a **map**, and this unit covers what a map actually is, how to build one automatically with SLAM, and how to manage the nodes involved as they start up and shut down.

## What is a map in ROS2?

The standard ROS 2 map representation is an **occupancy grid** (`nav_msgs/msg/OccupancyGrid`): a 2D array of cells, each holding a probability (0–100) that the cell is occupied, or -1 if unknown. On disk, a saved map is a pair of files — a `.pgm` (or `.png`) grayscale image where pixel brightness encodes occupancy, and a `.yaml` metadata file recording resolution (meters/pixel), origin, and occupancy thresholds:

```yaml
image: my_map.pgm
resolution: 0.05
origin: [-10.0, -10.0, 0.0]
negate: 0
occupied_thresh: 0.65
free_thresh: 0.25
```

This is deliberately a static, 2D, top-down representation — good enough for a ground robot navigating a floor plan, and simple enough that planners, costmaps, and localizers can all share it as a common frame of reference.

## What's required to build a map

To build a map you need a robot that can move through the environment while publishing two things reliably: a distance-ranging sensor (a 2D laser scanner is the standard choice, publishing `sensor_msgs/msg/LaserScan` on `/scan`) and odometry (`nav_msgs/msg/Odometry` plus the `odom` → `base_link` TF transform). The mapping algorithm fuses scans against odometry-predicted motion to build the grid and correct for drift as it goes.

## SLAM: simultaneous localization and mapping

You can't build a map without knowing where the robot is, and you can't know where the robot is without a map — SLAM solves both at once. As the robot moves, the SLAM node uses odometry to predict how far it has traveled, then matches the new laser scan against previously seen structure (scan matching) or against a probabilistic pose-graph to correct that prediction, add the corrected scan to the map, and refine earlier map estimates. The output is both a live occupancy grid and a corrected `map → odom` TF transform.

## Running SLAM with cartographer_ros

`cartographer_ros` is one widely used SLAM implementation for ROS 2 (Google's Cartographer, wrapped for ROS). Conceptually it is a graph-based SLAM system: it builds local "submaps" from short scan sequences, then periodically runs loop closure to stitch submaps together consistently. Launching it typically looks like:

```bash
ros2 launch cartographer_ros my_robot_cartographer.launch.py
```

which starts the `cartographer_node` (does the SLAM) and `cartographer_occupancy_grid_node` (converts Cartographer's internal representation into the `nav_msgs/OccupancyGrid` the rest of Nav2 expects on `/map`). You then drive the robot around the environment — manually via teleop is standard — until the map looks complete. (`slam_toolbox` is a common alternative with a similar workflow; the concepts here apply either way.)

## Configuring SLAM for your robot

Every SLAM package exposes tuning knobs in a `.lua` or `.yaml` configuration file: how far apart scans must be before they're matched, how aggressive loop closure search is, the expected sensor noise, and TF frame names (`odom_frame`, `map_frame`, `tracking_frame`). Mismatched frame names are the most common first-time failure — verify with:

```bash
ros2 run tf2_tools view_frames
```

which renders the current TF tree to a PDF so you can confirm `map → odom → base_link` exists and matches your config.

## Saving and serving the map

Once mapping looks good, save it to disk:

```bash
ros2 run nav2_map_server map_saver_cli -f my_map
```

This writes `my_map.pgm` and `my_map.yaml`. To make that saved map available to the rest of Nav2 later (localization, planning), you no longer run SLAM — you run `map_server` instead, pointed at the YAML file, which publishes the static `/map` topic that AMCL and the costmaps subscribe to.

## Lifecycle nodes and the Nav2 lifecycle manager

Both `map_server` and most other Nav2 nodes are **managed lifecycle nodes** (`rclcpp_lifecycle`): they don't just start and immediately run — they move through states `Unconfigured → Inactive → Active` (and back down through `Deactivating`/`Cleaning Up` on shutdown), driven externally by service calls. This exists so a set of interdependent nodes can be brought up in a controlled order rather than racing each other at process start. The `nav2_lifecycle_manager` is the node responsible for driving those transitions for a named group of servers — you give it a list of node names and it configures and activates them together, and can bring them all back down together too. You'll configure a lifecycle manager explicitly once you have more than one server running, starting in Unit 4.

## Try it yourself

Bring up a simulated robot, launch a SLAM node against it, and drive it in a loop around a room (or simulated world) large enough to require at least one loop closure. Save the resulting map, then inspect the `.yaml` file and change `resolution` to a coarser value (e.g. from `0.05` to `0.1`) without touching the `.pgm` — reload the map with `map_server` and observe how the reported map dimensions and RViz rendering change. This will make the relationship between the YAML metadata and the raw image concrete.
