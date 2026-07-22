# ROS Navigation in 5 Days — Unit 3: Map Creation

Navigation needs somewhere to navigate *in*. This unit covers what a ROS map actually is, how SLAM produces one, and how to configure mapping so it works with whatever robot and sensors you have — not just the reference platform in a tutorial.

## What a map means in ROS Navigation

A ROS map is, at its core, a `nav_msgs/OccupancyGrid`: a 2D grid where each cell holds a probability that it's occupied (0), free (100 in some conventions, or the reverse — check your consumer), or unknown (-1). It comes with a resolution (meters/cell), an origin pose, and width/height in cells. Two files usually represent it on disk:

- `map.yaml` — metadata (resolution, origin, image path, occupied/free thresholds).
- `map.pgm` (or `.png`) — the actual grid as a grayscale image; black is occupied, white is free, gray is unknown.

This format is deliberately simple: it's 2D, it's static once built, and it says nothing about dynamic obstacles — that's the local costmap's job at runtime, not the map's.

## How SLAM builds the map

SLAM (Simultaneous Localization and Mapping) solves two problems at once: where is the robot, and what does the environment look like — using each answer to improve the other. As the robot moves, a SLAM node:

1. Uses odometry as a motion prior.
2. Matches new laser scans against the growing map (scan matching) to correct drift.
3. Periodically closes loops — recognizing "I've been here before" — to fix accumulated error across a full traversal.
4. Publishes the evolving occupancy grid and the corrected `map -> odom` transform.

Common SLAM backends you'll encounter: `gmapping` and `cartographer` in ROS 1, and `slam_toolbox` or `cartographer_ros` in ROS 2. They differ in algorithm (particle filter vs. graph-based optimization) but expect the same inputs: laser scans, odometry, and a sane TF tree.

## Configuring mapping for your robot

Mapping quality is dominated by three things, in order of impact:

1. **Odometry quality.** Noisy or miscalibrated odometry (wrong wheel radius, wrong wheel separation) makes scan matching work harder and increases the chance of a bad loop closure. Fix odometry calibration before blaming the SLAM algorithm.
2. **Sensor placement and TF.** The static transform from `base_link` to your laser frame must be accurate — even a few centimeters of error shows up as a blurry, doubled-up map.
3. **Algorithm parameters**, e.g. for `slam_toolbox`:

```yaml
slam_toolbox:
  ros__parameters:
    odom_frame: odom
    map_frame: map
    base_frame: base_link
    scan_topic: /scan
    resolution: 0.05
    max_laser_range: 20.0
    minimum_travel_distance: 0.2   # don't process a scan unless robot moved this far
    minimum_travel_heading: 0.2
```

Launching a mapping session typically looks like:

```bash
ros2 launch slam_toolbox online_async_launch.py
# then drive the robot around manually or with teleop until coverage looks complete
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```

## Saving and loading the map

Once you've driven a full loop of the environment, save the map:

```bash
ros2 run nav2_map_server map_saver_cli -f ~/maps/my_room
# ROS 1 equivalent:
rosrun map_server map_saver -f ~/maps/my_room
```

To serve a previously-built map back to the navigation stack (instead of building a new one every run):

```bash
ros2 run nav2_map_server map_server --ros-args -p yaml_filename:=/home/you/maps/my_room.yaml
```

You'll use this static map as the input to Units 4–6: localization needs it to know where the robot is, and the global costmap needs it to know what's permanently there.

## Try it yourself

Bring up SLAM on your simulated or real robot, drive a loop around a room-sized space (doubling back over part of your path to force a loop closure), and save the resulting map. Open the `.pgm` file in an image viewer and look for blurring or "ghost" double walls — that's your signal odometry or TF calibration needs work before you move on.
