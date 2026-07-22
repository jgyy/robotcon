# ROS RViz Advanced Markers — Unit 1: RvizMarkers Unit 0: Presentation in ROS

This unit sets the stage for the whole course: what RViz actually is, why markers are the language you use to make a robot's internal state visible, and how to get a working RViz session talking to your own nodes before you touch any marker code.

## Why visualize robot state at all
A robot's "mind" — sensor data, planned paths, detected objects, cost maps — is a pile of numbers flowing through topics. None of that is inspectable by eye until something renders it. RViz is that renderer: a 3D viewer that subscribes to standard ROS message types (`sensor_msgs/PointCloud2`, `nav_msgs/OccupancyGrid`, `visualization_msgs/Marker`, TF frames, and more) and draws them in a shared 3D scene. Debugging "why did the robot stop" or "why did the planner pick that path" is dramatically faster when you can see the cost map, the goal, and the planned trajectory overlaid on each other instead of grepping log lines.

Markers specifically are the escape hatch for *your own* data — anything that doesn't already have a standard message type and display. If you want to draw "here is the bounding box my detector found" or "here is the footstep the robot is about to take," you publish a `Marker`, and RViz draws exactly what you told it to.

## RViz architecture: displays, plugins and the TF tree
RViz's UI is organized around **displays** — each row in the left-hand panel is one display instance (a `TF` display, a `RobotModel` display, a `Marker` display, etc.), each subscribing to one topic and rendering it a specific way. Displays are implemented as plugins loaded through `pluginlib`, which is exactly why the last unit of this course shows you how to write your own.

Everything RViz draws is positioned relative to a **fixed frame** you choose in Global Options (commonly `map` or `odom`), and the TF tree is what lets RViz place data published in different frames (a lidar frame, a camera frame, a base frame) into that one common frame consistently. If your markers ever appear in the wrong place or flicker, the TF tree — not the marker code — is usually the first thing to check.

## Setting up your workspace and package
Make sure RViz and the visualization message packages are installed:

```bash
sudo apt install ros-${ROS_DISTRO}-rviz2 ros-${ROS_DISTRO}-visualization-msgs ros-${ROS_DISTRO}-interactive-markers
```

Create a small package to hold every exercise in this course:

```bash
cd ~/ros2_ws/src
ros2 pkg create rviz_markers_course --build-type ament_python --dependencies rclpy visualization_msgs geometry_msgs std_msgs
cd ~/ros2_ws
colcon build --packages-select rviz_markers_course
source install/setup.bash
```

## Launching RViz2 and connecting to a live robot/topic
Launch RViz2 on its own:

```bash
ros2 run rviz2 rviz2
```

In the left panel, click **Add**, choose a display by topic or by type, and set the **Fixed Frame** in Global Options to a frame that actually exists in your TF tree (check with `ros2 run tf2_tools view_frames` or `ros2 topic echo /tf_static`). You can save your current display layout to a `.rviz` config file (**File → Save Config As**) and reload it later or hand it to a launch file with `rviz2 -d my_config.rviz`, so you don't have to rebuild the same panel layout every session.

## Try it yourself
Create the `rviz_markers_course` package above, publish a static transform from `map` to `sensor_frame` (`ros2 run tf2_ros static_transform_publisher --x 0 --y 0 --z 1 --frame-id map --child-frame-id sensor_frame`), open RViz2, add a `TF` display, set the fixed frame to `map`, and confirm you can see both frames and the arrow between them. Save the layout to `course.rviz` — you'll reuse it in every later unit.
