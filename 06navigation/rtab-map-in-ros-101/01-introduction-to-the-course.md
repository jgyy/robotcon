# RTAB-Map in ROS 101 — Unit 1: Introduction to the Course

This unit sets the stage for everything that follows: what RTAB-Map actually is, where it sits relative to other SLAM approaches you may already know, and what you need on your machine before Unit 2 starts touching real topics and packages.

## What is RTAB-Map, and why it exists

RTAB-Map (Real-Time Appearance-Based Mapping) is a graph-based SLAM library built around one core idea: use appearance (images) rather than only geometry to decide whether the robot is revisiting a place it has already seen. Many SLAM stacks you may have used before — laser-scan-matching approaches like `slam_toolbox` or Cartographer — build a map primarily from 2D LIDAR returns and odometry. RTAB-Map is designed from the ground up for RGB-D (color + depth) and stereo cameras, and it produces both a 2D occupancy grid *and* a dense 3D point-cloud/mesh map, which is what makes it attractive for robots that need to reason about full 3D structure (shelves, stairs, overhangs) rather than a flat 2D slice of the world.

The name breaks down into its two jobs:
- **Real-Time** — it is engineered with memory-management strategies (a working memory / long-term memory split) so that map size doesn't blow up processing time as the environment grows, which is what lets it run online on modest hardware instead of only as an offline batch process.
- **Appearance-Based Mapping** — its loop closure detector (the mechanism that recognizes "I've been here before") is driven by visual bag-of-words matching on camera images, not just by aligning point clouds.

## How it fits into the ROS ecosystem

In ROS, RTAB-Map is distributed as the standalone `rtabmap` library plus the ROS integration layer `rtabmap_ros`, which wraps it in nodes, topics, services, and launch files so it plays nicely with the rest of the navigation stack (`tf`, `nav_msgs/OccupancyGrid`, `move_base`/Nav2, etc.). You will spend all of Units 2 and 3 inside `rtabmap_ros` — this unit is only about orienting yourself, not yet running nodes.

Where RTAB-Map typically sits in a robot's software pipeline:

```
RGB-D camera / stereo camera  --->  rtabmap_ros (odometry + SLAM nodes)  --->  occupancy grid + 3D map
                                              |
                                       loop closure detector (bag-of-words on images)
```

## Setting up your environment

You won't run any RTAB-Map nodes yet, but it's worth confirming the pieces exist so Unit 2 isn't blocked on installation problems:

```bash
# Confirm you have a working ROS 2 workspace and the rtabmap packages available
ros2 pkg list | grep rtabmap

# If nothing shows up, install the ROS wrapper (Debian package name may vary by distro)
sudo apt install ros-$ROS_DISTRO-rtabmap-ros

# Confirm you have an RGB-D-capable source available, even if simulated —
# a simulated depth camera in Gazebo/Ignition, or a recorded rosbag, is fine
ros2 bag info <your_rgbd_bag>.mcap
```

If you don't have a physical RGB-D camera (e.g. an Intel RealSense or an Orbbec Astra), that's fine — the course leans on a simulated camera or a recorded bag with color + depth + camera_info topics, which is enough to run every exercise in this course.

## Try it yourself

Confirm `rtabmap_ros` is installed and importable in your ROS 2 environment, then run `ros2 pkg xml rtabmap_ros | grep description` (or `ros2 pkg prefix rtabmap_ros`) to locate where it lives on disk. Separately, find (or record) one RGB-D data source — simulated or a bag file — that publishes a color image, a depth image, and a matching `camera_info` topic, and list the topic names with `ros2 topic list`. You'll feed this exact source into the pipeline in Unit 2.
