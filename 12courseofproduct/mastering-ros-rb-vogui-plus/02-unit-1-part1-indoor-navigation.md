# Mastering ROS : RB-Vogui+ — Unit 1 Part 1: Indoor navigation

With the platform bring-up and teleop loop from Unit 0 working, it's time to let the robot drive itself. This unit covers the indoor half of navigation — building or loading a map, localizing against it, and sending goals through the navigation stack — before Part 2 extends the same ideas to GPS-based outdoor navigation.

## Localizing indoors: SLAM vs. a known map

Indoor navigation stacks (ROS 2's Nav2, or `move_base`/AMCL on ROS 1) need to answer one question continuously: where is the robot on the map? There are two ways to get there:

- **SLAM** (`slam_toolbox` is the common ROS 2 choice) builds the map *and* localizes simultaneously, useful when you don't have a map yet or the environment changes often.
- **AMCL** (Adaptive Monte Carlo Localization) localizes against an already-built, static map — cheaper, more predictable, and the usual choice once you have a reliable map of the space RB-Vogui+ operates in.

A typical indoor workflow is to SLAM once to build the map, save it, then switch to AMCL for day-to-day operation:

```bash
# build the map
ros2 launch slam_toolbox online_async_launch.py
# ...drive the robot around indoors with teleop until coverage looks complete...
ros2 run nav2_map_server map_saver_cli -f ~/maps/lab_map

# later: localize against the saved map
ros2 launch nav2_bringup localization_launch.py map:=~/maps/lab_map.yaml
```

AMCL needs a reasonable initial pose estimate to converge quickly — set it from RViz's "2D Pose Estimate" tool, or publish it directly:

```bash
ros2 topic pub --once /initialpose geometry_msgs/msg/PoseWithCovarianceStamped \
  "{header: {frame_id: 'map'}, pose: {pose: {position: {x: 0.0, y: 0.0}}}}"
```

## Costmaps: turning sensor data into "where can't I go"

Nav2's planner and controller don't reason about raw lidar returns directly — they reason about **costmaps**, 2D grids layered from multiple sources: the static map, live obstacle detections from lidar/depth camera (the "obstacle layer"), and an "inflation layer" that pads obstacles outward so the planner keeps a safety margin proportional to the robot's footprint. RB-Vogui+'s footprint (its real physical dimensions, set in the costmap config) matters here — an under-sized footprint will plan paths that clip corners in real corridors:

```yaml
local_costmap:
  local_costmap:
    ros__parameters:
      footprint: "[[0.35, 0.28], [0.35, -0.28], [-0.35, -0.28], [-0.35, 0.28]]"
      inflation_layer:
        inflation_radius: 0.4
      obstacle_layer:
        observation_sources: scan
        scan:
          topic: /robot/front_laser/scan
          data_type: LaserScan
```

Visualize both the local and global costmap in RViz while the robot is stationary — obstacles that don't line up with what you can see in the room usually mean a TF or sensor topic misconfiguration, not a planning bug.

## Sending and monitoring navigation goals

Once localization and costmaps look correct, driving the robot autonomously is a matter of sending a goal pose to Nav2's `NavigateToPose` action — either by clicking "Nav2 Goal" in RViz, or programmatically:

```python
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

nav = BasicNavigator()
nav.waitUntilNav2Active()

goal = PoseStamped()
goal.header.frame_id = 'map'
goal.pose.position.x = 3.0
goal.pose.position.y = 1.5
goal.pose.orientation.w = 1.0

nav.goToPose(goal)
while not nav.isTaskComplete():
    feedback = nav.getFeedback()
    print(f"distance remaining: {feedback.distance_remaining:.2f} m")
print(nav.getResult())
```

`nav2_simple_commander` is deliberately thin wrapping over the action interface — it's worth knowing you could call `NavigateToPose` directly with `ros2 action send_goal` for debugging without any Python at all.

## Tuning for real indoor spaces

Default Nav2 tuning is conservative and general-purpose; corridors and doorways expose the gaps quickly. Two parameters worth revisiting first: inflation radius (too large and the planner refuses to pass through doorways it should fit through; too small and it clips furniture) and recovery behaviors (what the robot does when the local planner gets stuck — spin-in-place and back-up are the defaults, and both are worth testing deliberately in a dead-end corridor rather than discovering them mid-demo).

## Try it yourself

Build a map of one room with `slam_toolbox`, save it, then switch to AMCL localization against that saved map and send RB-Vogui+ a `NavigateToPose` goal on the far side of a doorway — watch the local costmap in RViz as it passes through, and if it clips or refuses the doorway, adjust `inflation_radius` and the footprint until it doesn't.
