# ROS Navigation in 5 Days — Unit 1: ROS Navigation Deconstruction

Before touching a single parameter file, you need a mental model of what "ROS Navigation" actually is: not one node, but a pipeline of cooperating pieces that turn raw sensor data into wheel commands. This unit takes that pipeline apart so the rest of the course has somewhere to hang its details.

## The Navigation Stack is a pipeline, not a black box

When people say "just launch the nav stack," they mean bringing up a coordinated set of nodes that each solve one narrow problem:

1. **A map** of the environment (static, from SLAM, or built on the fly).
2. **Localization** — figuring out where the robot is on that map.
3. **Global planning** — computing a path from the robot's current pose to a goal.
4. **Local planning / control** — following that path while reacting to obstacles the map doesn't know about.
5. **Costmaps** — the shared data structure that both planners read to know what's free space and what isn't.

In ROS 1 this pipeline is coordinated by the `move_base` node. In ROS 2, `nav2` splits the same responsibilities across a set of lifecycle-managed nodes (`controller_server`, `planner_server`, `bt_navigator`, `costmap_2d` instances) wired together by a behavior tree instead of one monolithic node. The *concepts* below apply to both — only the wiring differs.

## What you must already have before Navigation works

Navigation is not self-sufficient. It assumes:

- A robot publishing **odometry** (`nav_msgs/Odometry`), typically from wheel encoders or a fused estimate.
- A correct, continuously-updated **TF tree**: `map -> odom -> base_link -> sensor frames`. If this tree is broken or has the wrong static transforms, nothing downstream will work, no matter how well-tuned your planner is.
- At least one **range sensor** (2D lidar is the classic case, but depth cameras and sonar rings work too) publishing `sensor_msgs/LaserScan` or an equivalent point cloud.
- A way to **command velocity**, usually `geometry_msgs/Twist` (or `TwistStamped`) on a `cmd_vel` topic that your robot's base controller consumes.

Check this plumbing before you ever open a costmap YAML file:

```bash
ros2 run tf2_tools view_frames        # ROS 2: renders the current TF tree to a PDF
# or, ROS 1 equivalent:
rosrun tf view_frames

ros2 topic echo /odom --once
ros2 topic hz /scan
ros2 topic echo /cmd_vel
```

If any of those commands hang or show garbage, fix it first — Navigation will fail in confusing ways otherwise.

## How the pieces talk to each other

- The **map server** publishes a `nav_msgs/OccupancyGrid` on `/map`, latched so late subscribers still get it.
- **AMCL** (or an equivalent particle-filter localizer) subscribes to `/map`, `/scan`, and `/odom`, and publishes the `map -> odom` transform plus a pose estimate.
- The **global costmap** layers the static map with any known obstacles; the **local costmap** layers a rolling window around the robot with live sensor data.
- **move_base** / the **bt_navigator** accepts a goal (an action, not a topic — this matters for how you send goals and get feedback), asks the global planner for a path over the global costmap, then continuously asks the local planner to produce velocity commands that follow that path while respecting the local costmap.

## Setting up a workspace for this course

You don't need a physical robot to follow this course — a simulated differential-drive robot in Gazebo (or any simulator with a working `/scan`, `/odom`, and `/cmd_vel`) is enough. A minimal workspace layout:

```
nav_ws/
  src/
    my_robot_description/   # URDF/xacro, launch files
    my_robot_navigation/     # nav params, launch files you'll write in later units
```

Bring up your robot and simulator first, confirm the TF tree and topics above are healthy, and stop there for this unit — Units 2 through 6 build the actual navigation pipeline on top of this foundation.

## Try it yourself

Launch your simulated (or real) robot with no navigation stack running. Use `ros2 run tf2_tools view_frames` (or `rqt_tf_tree`) to capture the current TF tree, and run the three topic-checking commands above. Write down, in one sentence each, what frame `base_link` is a child of, what rate `/scan` publishes at, and what happens to `/odom` if you manually push or spin the robot. You'll need this baseline to sanity-check every unit that follows.
