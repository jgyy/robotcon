# RTAB-Map in ROS 101 — Unit 3: Autonomous Navigation with rtabmap_ros

This is the capstone unit: you take everything from Units 1 and 2 and run the full cycle — build a map with RTAB-Map, localize the robot inside that saved map, and hand the resulting occupancy grid to a navigation stack so the robot can plan and drive autonomously.

## Building the map (mapping mode)

In mapping mode, RTAB-Map starts with an empty database and builds it up as the robot (or you, teleoperating it) explores. A typical launch looks like this (parameter names are representative — check `ros2 launch rtabmap_launch rtabmap.launch.py --show-args` for the exact set on your installed version):

```bash
ros2 launch rtabmap_launch rtabmap.launch.py \
    rtabmap_args:="--delete_db_on_start" \
    rgb_topic:=/camera/color/image_raw \
    depth_topic:=/camera/depth/image_rect_raw \
    camera_info_topic:=/camera/color/camera_info \
    frame_id:=base_link
```

`--delete_db_on_start` guarantees you begin from a clean map each run — useful while learning, since a stale database from a previous attempt can otherwise silently get reused. While this runs, drive the robot (teleop or a scripted patrol) through the whole area you want mapped, and deliberately close a loop — revisit a place you started from — so you can observe loop closure correcting the map, exactly as discussed in Unit 2.

When you're satisfied with map coverage, save it:

```bash
ros2 service call /rtabmap/rtabmap/save_map std_srvs/srv/Empty
```

The database (by default something like `~/.ros/rtabmap.db`) now holds both the 3D map and the visual bag-of-words data needed for localization later.

## Localizing in a saved map

Once a map exists, you don't want the robot rebuilding it every time — you want it to recognize where it is *inside* the existing map. This is localization mode, and it reuses the same RTAB-Map machinery with mapping disabled:

```bash
ros2 launch rtabmap_launch rtabmap.launch.py \
    rgb_topic:=/camera/color/image_raw \
    depth_topic:=/camera/depth/image_rect_raw \
    camera_info_topic:=/camera/color/camera_info \
    frame_id:=base_link \
    rtabmap_args:="" \
    localization:=true
```

Under the hood, this is the same appearance-based loop closure detector from Unit 2, just now matching every incoming frame against the fixed, pre-built database instead of growing it. A successful localization shows up as the robot's estimated pose snapping onto a consistent location in the saved map rather than drifting freely.

## Handing off to a navigation stack

RTAB-Map's job ends at producing a good occupancy grid (`/rtabmap/grid_map` or similar) plus a corrected `tf` tree — it does not itself do path planning or velocity control. From here you connect it to a standard navigation stack (e.g. Nav2), the same way you would connect any other SLAM source's occupancy grid:

- Point the navigation stack's costmap/map server at the topic RTAB-Map publishes (or export the map and serve it with `nav2_map_server`).
- Make sure the `tf` tree RTAB-Map maintains (`map -> odom -> base_link`) matches what the navigation stack expects — this is the same convention used across the ROS navigation ecosystem, so nothing RTAB-Map-specific needs to change in your planner/controller configuration.
- Send goals as usual (e.g. via `ros2 action send_goal` against the navigation stack's `navigate_to_pose` action, or through RViz's "2D Nav Goal" tool) and let the planner/controller drive while RTAB-Map keeps correcting localization drift with loop closures along the way.

## Try it yourself

Map a small loop-shaped area (a room, or a simulated equivalent), save the database, then restart in localization mode and drive the robot back into that same area from a different starting pose than where mapping began. Confirm — via RViz or by echoing the estimated pose topic — that RTAB-Map recognizes the location and snaps to the correct place in the map rather than reporting drifted, unconstrained odometry.
