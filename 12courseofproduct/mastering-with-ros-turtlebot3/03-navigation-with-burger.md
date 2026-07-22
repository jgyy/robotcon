# Mastering with ROS: Turtlebot3 — Unit 3: Navigation with Burger

Manual driving doesn't scale — a robot that's actually useful needs to build a map of its environment and then plan its own way through it. This unit covers the two halves of that problem: SLAM (building the map) and navigation (using it to reach a goal autonomously), using the Burger as the reference platform since its 360° LiDAR and compact footprint make it forgiving to tune.

## Building a map with SLAM

SLAM (Simultaneous Localization And Mapping) fuses LiDAR scans and odometry to estimate both the robot's trajectory and a consistent map at the same time — "simultaneous" because each one depends on the other and you don't have ground truth for either. Bring up SLAM (Cartographer or slam_toolbox, depending on what your distro ships) alongside the robot:

```bash
ros2 launch turtlebot3_cartographer cartographer.launch.py
# or
ros2 launch slam_toolbox online_async_launch.py
```

Then drive the robot around the whole space with teleop from Unit 2, covering every room and corridor slowly and covering loops when possible — SLAM algorithms use loop closures (recognizing you've returned to a previously-seen place) to correct accumulated drift, so a purely linear exploration path gives a worse map than one that revisits areas. Once you're satisfied with the map shown in RViz, save it:

```bash
ros2 run nav2_map_server map_saver_cli -f ~/maps/my_first_map
```

This produces a `.pgm` image (occupancy grid: free, occupied, unknown) and a `.yaml` sidecar describing resolution and origin.

## Understanding costmaps

Navigation doesn't plan directly against the raw occupancy grid — it inflates obstacles into a **costmap**, where cells near an obstacle carry a rising cost rather than a hard binary wall, and the robot's known footprint is used to make sure a path is actually driveable, not just collision-free at a point. There are two costmaps running simultaneously: a **global costmap** (built from the static map, used for long-range path planning) and a **local costmap** (built from live sensor data in a rolling window around the robot, used for short-range obstacle avoidance). This split is why a Turtlebot3 can follow a globally planned path around a hallway corner while still dodging a box someone left on the floor that wasn't in the map.

## Localizing against the saved map

With a map saved, launch navigation with AMCL (Adaptive Monte Carlo Localization) to figure out where the robot is within it:

```bash
ros2 launch turtlebot3_navigation2 navigation2.launch.py map:=~/maps/my_first_map.yaml
```

AMCL maintains a particle filter — a cloud of pose hypotheses, each weighted by how well it explains the current LiDAR scan given the map. In RViz, use the "2D Pose Estimate" tool to give it a rough starting guess; watch the particle cloud converge and tighten around the true pose as the robot moves and gathers more evidence.

## Sending navigation goals

Once localized, send a goal through RViz's "Nav2 Goal" tool, or programmatically via the action interface:

```python
from nav2_simple_commander.robot_navigator import BasicNavigator
from geometry_msgs.msg import PoseStamped

nav = BasicNavigator()
nav.waitUntilNav2Active()

goal = PoseStamped()
goal.header.frame_id = 'map'
goal.pose.position.x = 1.5
goal.pose.position.y = 0.5
goal.pose.orientation.w = 1.0

nav.goToPose(goal)
while not nav.isTaskComplete():
    pass
print(nav.getResult())
```

Under the hood this is a `NavigateToPose` action: a global planner produces a path, a local controller (DWB or a similar trajectory-rollout controller) tracks it while reacting to live obstacles, and a recovery behavior tree kicks in if the robot gets stuck (clearing costmaps, rotating in place, backing up).

## Try it yourself

Map a small real or simulated space, save it, relocalize the robot from a cold start (don't reuse the pose it ended SLAM at), and send it to three waypoints in sequence using `BasicNavigator`. Note what happens if you place an obstacle in the local costmap's path that wasn't present during mapping — does it route around it?
