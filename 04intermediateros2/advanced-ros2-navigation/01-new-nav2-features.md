# Advanced ROS2 Navigation — Unit 1: New Nav2 Features

The basic Nav2 course gets a robot from A to B. This unit goes past that: scripting navigation from Python instead of clicking in RViz, chaining multiple goals, and using costmap filters to encode "soft rules" about the environment — no-go zones and speed zones — directly into the map instead of hardcoding them in your application logic.

## Setting up Nav2 for this unit

Everything here assumes you already have a working Nav2 bringup (a robot, a map, and `nav2_bringup`-style launch files) from the introductory course — real or simulated. Bring it up as usual and confirm the servers are active before continuing:

```bash
ros2 launch nav2_bringup bringup_launch.py map:=/path/to/your_map.yaml use_sim_time:=true
ros2 lifecycle get /controller_server
ros2 lifecycle get /planner_server
```

Both should report `active`. If you're working from a fresh workspace, also grab the `nav2_simple_commander` package (it ships with a standard Nav2 install) — that's what the next section drives.

## The Simple Commander API

Clicking "Nav2 Goal" in RViz is fine for a demo, but real applications need to send goals from code, check on progress, and react to failure. The **Simple Commander API** (`nav2_simple_commander.robot_navigator.BasicNavigator`) wraps Nav2's action interfaces in a small, blocking-style Python class so you don't have to hand-write `rclpy` action clients for every goal.

```python
import rclpy
from nav2_simple_commander.robot_navigator import BasicNavigator, TaskResult
from geometry_msgs.msg import PoseStamped

rclpy.init()
nav = BasicNavigator()
nav.waitUntilNav2Active()   # blocks until AMCL + the BT navigator report active

goal = PoseStamped()
goal.header.frame_id = 'map'
goal.header.stamp = nav.get_clock().now().to_msg()
goal.pose.position.x = 2.0
goal.pose.position.y = 1.0
goal.pose.orientation.w = 1.0

nav.goToPose(goal)
while not nav.isTaskComplete():
    feedback = nav.getFeedback()
    if feedback and feedback.navigation_time.sec > 60:
        nav.cancelTask()

result = nav.getResult()
if result == TaskResult.SUCCEEDED:
    print('Arrived!')
```

`waitUntilNav2Active()` is the piece people skip and then wonder why their first goal is silently dropped — the BT navigator lifecycle node needs to be active first.

## Navigating with poses and waypoints

`BasicNavigator` exposes one method per Nav2 navigation action:

- `goToPose(pose)` — wraps `NavigateToPose`: drive to a single goal.
- `goThroughPoses(poses)` — wraps `NavigateThroughPoses`: pass through an ordered list of poses without necessarily stopping at each one; the planner treats intermediate poses as via-points for a single continuous path.
- `followWaypoints(poses)` — wraps `FollowWaypoints`: visit each pose as a discrete stop, optionally running a task (e.g. take a photo) at each one via waypoint task executors.

```python
waypoints = [goal, goal2, goal3]   # list of PoseStamped
nav.followWaypoints(waypoints)
while not nav.isTaskComplete():
    pass
print(nav.getResult())
```

Pick `goThroughPoses` when you just need a smooth route past some points (e.g. patrol a hallway), and `followWaypoints` when the robot must actually stop and do something at each one (e.g. inspection points).

## Costmap Filters: keepout masks and speed limits

Costmap filters let you paint semantic information onto a **second, static filter mask image** (a PGM/YAML pair, made the same way you'd make a map) and have Nav2 apply it automatically during planning and control — no code changes to your planner needed.

A **Keepout Filter** marks regions the robot must never enter (a loading dock, a stairwell) by painting them at high cost in the filter mask. You enable it by loading the `nav2_costmap_2d::KeepoutFilter` plugin and pointing it at the mask:

```yaml
global_costmap:
  ros__parameters:
    plugins: ["static_layer", "keepout_filter", "inflation_layer"]
    keepout_filter:
      plugin: "nav2_costmap_2d::KeepoutFilter"
      enabled: true
      filter_info_topic: "/costmap_filter_info"
```

A **Speed Filter** does the same thing but scales the robot's max speed within painted regions instead of blocking them entirely — useful for slowing down near a doorway or a pedestrian-heavy zone. Both filters are driven by a shared `costmap_filter_info_server` node that publishes a `CostmapFilterInfo` message describing which mask maps to which physical meaning (binary mask vs. a linear speed scale), so the filter plugin knows how to interpret pixel values.

```bash
ros2 launch nav2_map_server costmap_filter_info_server.launch.py \
  mask:=/path/to/keepout_mask.yaml mode:=keepout
```

## Try it yourself

Take your existing map and, using any image editor (or `nav2_map_server`'s mask-generation tools), paint a small rectangular region as a keepout zone in a copy of the map. Wire it up with a `KeepoutFilter` and `costmap_filter_info_server`, then use the Simple Commander API to send a goal on the far side of that region. Confirm in RViz that the global costmap shows the region as lethal and that the planned path routes around it rather than through it.
