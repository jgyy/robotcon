# ROS 2 Perception in 5 Days — Unit 1: Course Intro

This unit is the map before the journey: it lays out what "perception" means in a ROS 2 context, previews the six units that follow, and makes sure your environment can actually run the exercises before you invest time in them.

## What you'll learn in this course
Perception is the pipeline that turns raw sensor readings — laser scans, camera frames, 3D point clouds — into information a robot can act on: "there is an obstacle 1.2 m ahead," "that pixel blob is a red ball," "this is Alice's face," "there is a person standing in the doorway." Over the next six units you will move from raw `sensor_msgs` data all the way up to deep-learning-based detection:

- **Unit 2** grounds you in the three sensor message types perception work is built on: `LaserScan`, `Image`, and `PointCloud2`.
- **Unit 3** brings in OpenCV via `cv_bridge` to do classical 2D image processing — color filtering, blob tracking, and a working line-follower.
- **Unit 4** moves to 3D with the Point Cloud Library (PCL): segmenting surfaces and clustering objects out of a point cloud.
- **Unit 5** applies 2D and 3D techniques specifically to people: face detection, face recognition, and human tracking.
- **Unit 6** replaces the classical detectors with a modern deep-learning detector (YOLO) for object detection, pose estimation, and segmentation.
- **Unit 7** is the capstone: an inventory-management robot that combines color detection, line following, and object counting into one pipeline.

## A demo of where you're headed
Picture a small mobile robot in a warehouse aisle: it follows a painted line on the floor using the image-processing skills from Unit 3, uses a point cloud from Unit 4 to know when it has reached a shelf, and uses a YOLO detector from Unit 6 to recognize which boxes are present and count them. That is, almost exactly, the final project in Unit 7 — everything you learn in between is a deliberate building block toward that scenario, not an isolated exercise.

## Course outline at a glance
| Unit | Focus | Depends on |
|---|---|---|
| 2 | Sensor message types (`LaserScan`, `Image`, `PointCloud2`) | — |
| 3 | 2D image processing with OpenCV/`cv_bridge` | Unit 2 |
| 4 | 3D point cloud processing with PCL | Unit 2 |
| 5 | Face detection, recognition, human tracking | Units 3-4 |
| 6 | Deep-learning detection with YOLO | Unit 3 |
| 7 | Capstone: inventory-management robot | Units 3, 4, 6 |

Units 2-4 are the foundation; skipping straight to Unit 6 will work mechanically, but you'll be missing the classical-technique intuition that later helps you debug why a learned detector is behaving oddly.

## Requirements before you start
You do not need prior robotics experience, but you should be comfortable with:
- **Python** (most examples use `rclpy`); familiarity with C++ (`rclcpp`) helps for reading PCL examples but is not required to follow along.
- **ROS 2 fundamentals**: nodes, topics, publishers/subscribers, `colcon build`, and workspace layout. If any of that is unfamiliar, work through a ROS 2 basics course first — this course assumes it.
- **Linux command-line basics**: navigating directories, editing files, reading process output.

On the machine side, you'll need a working ROS 2 installation with the vision and perception interfaces available — most distros ship these as separate packages, commonly named along the lines of `vision_opencv` (which provides `cv_bridge`) and `perception_pcl` (which bridges PCL and `sensor_msgs/PointCloud2`). A simulator such as Gazebo with camera and lidar plugins is enough to run every exercise in this course — no physical robot is required, though everything here transfers directly to real sensors.

## Try it yourself
Confirm your environment is ready before Unit 2. Source your ROS 2 installation, then run:

```bash
ros2 pkg list | grep -E "cv_bridge|pcl_conversions|image_transport"
ros2 run rqt_image_view rqt_image_view &
```

If `cv_bridge` and `pcl_conversions` show up in the package list, and `rqt_image_view` opens a window (even with no image source connected yet), your setup is ready for the rest of this course.
