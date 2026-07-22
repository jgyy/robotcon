# Mastering with ROS: TIAGo - Melodic — Unit 3: Navigation

Unit 2 got you moving the base by hand; this unit hands that job to the navigation stack so TIAGo can get from A to B on its own, avoiding obstacles it discovers along the way. This is the last unit before you turn to the arm, so treat it as your last "whole robot moving through space" checkpoint.

## Localization: knowing where TIAGo is

Before TIAGo can plan a path, it needs to know where it is on a map. The standard approach is `amcl` (Adaptive Monte Carlo Localization), which fuses laser scan data against a pre-built map to maintain a probabilistic pose estimate. You supply a static map (built ahead of time with a SLAM package such as `gmapping` or `slam_toolbox`) and the navigation stack keeps a live `map -> odom -> base_footprint` TF chain updated as the robot moves.

```bash
roslaunch tiago_navigation tiago_nav.launch map:=/path/to/my_map.yaml
```

If `amcl`'s initial pose guess is off, correct it once in RViz with the "2D Pose Estimate" tool, or publish directly:

```bash
rostopic pub -1 /initialpose geometry_msgs/PoseWithCovarianceStamped \
  '{header: {frame_id: "map"}, pose: {pose: {position: {x: 0.0, y: 0.0}}}}'
```

## Costmaps and move_base

`move_base` is the piece that turns "go to this pose" into wheel commands. It layers a **global costmap** (built from the static map, for long-range planning) and a **local costmap** (built from live sensor data, for short-range obstacle avoidance) and runs a global planner plus a local planner on top of them. You rarely write this logic yourself — you tune its costmap and planner parameters (inflation radius, footprint, max velocities) and let it run.

## Sending navigation goals programmatically

`move_base` exposes a `move_base_msgs/MoveBaseAction`, so sending a goal from code looks exactly like the trajectory-following pattern from Unit 2, just with a pose instead of joint positions:

```python
import rospy, actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal

rospy.init_node("tiago_go_to_point")
client = actionlib.SimpleActionClient("move_base", MoveBaseAction)
client.wait_for_server()

goal = MoveBaseGoal()
goal.target_pose.header.frame_id = "map"
goal.target_pose.header.stamp = rospy.Time.now()
goal.target_pose.pose.position.x = 2.0
goal.target_pose.pose.position.y = 0.5
goal.target_pose.pose.orientation.w = 1.0

client.send_goal(goal)
client.wait_for_result()
print(client.get_state())   # 3 == SUCCEEDED in actionlib's GoalStatus enum
```

## Watching it happen in RViz

RViz is where navigation debugging actually happens: add the `Map`, `LaserScan`, `Path`, and both costmap displays to see what `move_base` is "thinking" — the global plan as a line, the local plan as a shorter line, and the inflated obstacle regions as colored costmap cells. When a goal fails, the costmap view almost always tells you why (an obstacle inflated over the goal pose, a doorway too narrow for the configured footprint, etc.).

## Try it yourself

With a simulated TIAGo and a map loaded, send two sequential `MoveBaseGoal`s from a Python script — one to a point across the room, one back to the start — and print the `get_state()` result after each. Then place a simulated obstacle in the direct path and observe how the local costmap reroutes around it in RViz.
