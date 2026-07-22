# Mastering ROS 2 with LIMO-Robot — Unit 8: Autonomous Navigation with RTAB-Map

This closing unit takes the point cloud map from Unit 7 and puts it to work: switching RTAB-Map from building a map to localizing against a saved one, and feeding that localization into Nav2 so LIMO can navigate autonomously using camera-based perception instead of (or alongside) a 2D lidar.

## Mapping mode vs localization mode

RTAB-Map runs the same node in two distinct modes. In **mapping mode** (what you used in Unit 7) it keeps adding new nodes to the map graph and actively searches for loop closures against everything it has seen so far. In **localization mode** it freezes the map — no new nodes are added — and only estimates the camera's live pose by matching incoming frames against the fixed map, which is both cheaper to run and safer (you don't want the map silently drifting or growing every time you redeploy LIMO in a space you've already mapped).

```bash
ros2 launch rtabmap_launch rtabmap.launch.py \
    localization:=true \
    database_path:=~/.ros/rtabmap.db \
    rgb_topic:=/camera/color/image_raw \
    depth_topic:=/camera/depth/image_rect_raw \
    camera_info_topic:=/camera/color/camera_info
```

`database_path` points at the `.db` file you saved in Unit 7 — without it, localization mode has nothing to localize against.

## Integrating with Nav2

RTAB-Map publishes the `map -> odom` transform and (via `rtabmap_util`) can project its 3D point cloud down into a 2D occupancy grid on `/map`, which lets it slot into the exact same Nav2 stack from Units 5 and 6 — the planner, controller, and BT Navigator don't know or care whether `/map` came from a lidar-based `slam_toolbox` grid or a projected RTAB-Map cloud. The practical difference shows up in the obstacle layer: with RTAB-Map you typically also feed `/rtabmap/cloud_obstacles` into the costmap as a `PointCloud2` observation source, since it captures obstacles at multiple heights that a single-plane lidar scan would miss entirely (a table overhang, low shelving).

```yaml
local_costmap:
  ros__parameters:
    plugins: ["obstacle_layer", "inflation_layer"]
    obstacle_layer:
      plugin: "nav2_costmap_2d::ObstacleLayer"
      observation_sources: pointcloud
      pointcloud:
        topic: /rtabmap/cloud_obstacles
        data_type: "PointCloud2"
        marking: true
        clearing: true
```

## Running it end to end

With RTAB-Map in localization mode publishing `/map` and the transform tree, bring up Nav2 exactly as in Unit 5, then send a goal the same way:

```bash
ros2 launch nav2_bringup navigation_launch.py params_file:=~/limo_ws/config/nav2_params.yaml
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose \
  "{pose: {header: {frame_id: 'map'}, pose: {position: {x: 1.5, y: 0.5, z: 0.0}, orientation: {w: 1.0}}}}"
```

## Troubleshooting the loop

Two failure modes are specific to camera-based localization and worth knowing before you hit them: **tracking loss**, where fast motion, motion blur, or a visually featureless stretch of wall (RTAB-Map has too few trackable visual features to match against) causes the pose estimate to jump or freeze — driving slower through such stretches or supplementing with wheel odometry fusion mitigates this; and **lighting change**, where the map was built under different lighting than the robot is now running in, which can degrade appearance-based matching since it partly relies on visual similarity, not just geometry. If localization keeps failing in the same physical spot, that's usually the first thing to check.

## Try it yourself

Put RTAB-Map into localization mode against the `.db` you saved in Unit 7, bring up Nav2 on top of it, and send LIMO a goal on the far side of the loop you mapped. Compare the resulting `/plan` and drive quality against what you got with lidar-based SLAM + AMCL in Units 3–5, and note where the two approaches diverge (e.g. how each handles an obstacle only visible to the camera, like an overhanging shelf).
