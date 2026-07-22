# TEB Local Planner — Unit 2: Set up the Navigation Stack

Before TEB can plan anything, you need a Navigation Stack that's already bringing a robot from a map and a goal to *some* working local planner — even a bad one. This unit gets that scaffolding in place and shows exactly where TEB will be swapped in.

## Install the package

TEB is not part of the core navigation packages by default; it's an extra plugin you install alongside your existing stack.

```bash
# ROS 1 (apt, distro-agnostic form)
sudo apt install ros-$ROS_DISTRO-teb-local-planner

# ROS 2 (community port; package name may vary by distro/source)
sudo apt install ros-$ROS_DISTRO-teb-local-planner
# or build from source into your workspace if your distro doesn't ship a binary:
#   cd ~/nav_ws/src && git clone <teb_local_planner repo for your ROS 2 distro>
#   cd ~/nav_ws && colcon build --packages-select teb_local_planner
```

Confirm it's visible to the plugin system before going further:

```bash
ros2 pkg list | grep teb          # ROS 2
rospack list | grep teb           # ROS 1
```

## Prerequisites TEB assumes are already working

TEB is a drop-in replacement for your local planner, which means everything *around* it must already be functional:

- A **global costmap** and **local costmap** publishing correctly (`ros2 topic echo /local_costmap/costmap --once` or the ROS 1 equivalent should return data, not silence).
- A **global planner** producing a path (NavFn, SmacPlanner, or whatever you're already using — TEB doesn't care which).
- A robot **footprint** defined (either as a `robot_radius` for circular robots or a polygon `footprint` for anything else) — TEB uses this directly for its obstacle-avoidance constraints, so an inaccurate footprint will produce either overly cautious or unsafely tight trajectories.

If you don't have this baseline running yet, get a stock DWA or NavFn-based setup working end to end first. Debugging "is my costmap broken" and "is TEB misconfigured" at the same time is miserable.

## Wire TEB in as the local planner plugin

**ROS 1 (`move_base`)** — in your `move_base` launch file or params, point the local planner at TEB:

```yaml
base_local_planner: "teb_local_planner/TebLocalPlannerROS"
```

**ROS 2 (`controller_server`)** — in your `nav2_params.yaml`, replace the controller plugin:

```yaml
controller_server:
  ros__parameters:
    controller_plugins: ["FollowPath"]
    FollowPath:
      plugin: "teb_local_planner::TebLocalPlannerROS"
      # TEB-specific parameters go here (Unit 3)
```

At this point add no tuning parameters yet — leave TEB on its defaults. The goal of this unit is only to confirm the plugin loads and produces *any* velocity output.

## Launch and sanity-check

```bash
ros2 launch <your_nav_bringup> navigation.launch.py
ros2 topic echo /cmd_vel
```

Send a short, easy goal (a straight line with no obstacles) through RViz's "Nav2 Goal" tool or the equivalent `move_base_simple/goal` topic in ROS 1. You should see:

- The controller/`move_base` log reporting TEB as the active local planner, with no plugin-load errors.
- Non-zero `cmd_vel` messages while the goal is active, dropping to zero once the goal is reached.

If the plugin fails to load, double-check the plugin class name string matches exactly what your installed package exports — a common source of silent failures is a typo or a mismatched ROS 2 distro build.

## Try it yourself

Get TEB loaded as your active local planner with default parameters and drive the robot through one simple, obstacle-free goal in simulation. Capture the `move_base`/`controller_server` startup log and confirm it names `teb_local_planner` as the loaded plugin — save that log snippet, since Unit 3 will have you compare it against a run with your first custom parameter file.
