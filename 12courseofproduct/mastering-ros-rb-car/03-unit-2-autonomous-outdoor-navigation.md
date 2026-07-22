# Mastering ROS: RB-Car — Unit 3: Autonomous Outdoor Navigation

With manual driving under your belt, this unit gets RB-CAR moving on its own: build a map of an outdoor area, localize the robot in it, and send it navigation goals it plans and drives to itself. This is the first unit where you'll bring up the full navigation stack rather than a single node.

## Why outdoor navigation is different from indoor

Indoor navigation courses lean on walls: LIDAR-based SLAM works beautifully in corridors and rooms because there's dense, stable geometry everywhere. Outdoors, RB-CAR often faces open fields, long straight paths, and sparse or repetitive geometry (a featureless field looks the same everywhere to a LIDAR scan-matcher). That's part of why real outdoor rigs — RB-CAR included — carry GPS: it supplies an absolute position reference that pure LIDAR SLAM can't. This unit focuses on building and using a map the same way you would indoors; Unit 5 comes back to add GPS into the mix for when geometry alone isn't enough.

## Building a map with SLAM

Bring up a SLAM node (`slam_toolbox` is a common, distro-agnostic choice) pointed at the LIDAR scan topic, then drive the robot around the area you want mapped — slowly, with plenty of loop closures if the environment allows:

```bash
ros2 launch slam_toolbox online_async_launch.py \
  slam_params_file:=rbcar_slam_params.yaml
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r cmd_vel:=/rbcar/cmd_vel
```

Watch the map build live in RViz by adding a `Map` display subscribed to `/map`. Once you've covered the area, save it:

```bash
ros2 run nav2_map_server map_saver_cli -f outdoor_track_map
```

This produces a `.pgm` occupancy grid plus a `.yaml` metadata file — the same map format used across the ROS navigation ecosystem regardless of distro.

## Localizing and setting up the navigation stack

With a saved map, launch a localization node (AMCL, or its Nav2 equivalent) so the robot knows where it is *within* that map rather than just relative to where it started:

```bash
ros2 launch nav2_bringup localization_launch.py \
  map:=outdoor_track_map.yaml
```

Give it a rough initial pose in RViz with the "2D Pose Estimate" tool, then confirm convergence by watching the particle cloud (AMCL) collapse around the robot's true position as it moves.

Bring up the rest of the navigation stack — global planner, local planner (a placeholder default for now; Unit 4 replaces it with TEB tuned for Ackermann kinematics), costmaps, and the behavior/recovery layer:

```bash
ros2 launch nav2_bringup navigation_launch.py
```

## Sending navigation goals

You can send a goal two ways: interactively from RViz with the "Nav2 Goal" tool, or programmatically:

```bash
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose \
  "{pose: {header: {frame_id: 'map'}, pose: {position: {x: 12.0, y: 4.5, z: 0.0}}}}"
```

Watch `ros2 topic echo /rbcar/odom` and the global/local costmaps in RViz while it drives. If the robot refuses to move, check the costmap first — an obstacle inflated over the goal or the start pose is the most common cause, and it's a mapping/costmap problem, not a planner bug.

## Try it yourself

Map a small outdoor loop (or a large open area in simulation), save it, then send three sequential navigation goals that trace a triangle around the space. Note where the robot's actual path deviates from a straight line between goals — you're seeing the global planner respect the costmap, and next unit you'll see the *local* planner respect the vehicle's Ackermann constraints on top of that.
