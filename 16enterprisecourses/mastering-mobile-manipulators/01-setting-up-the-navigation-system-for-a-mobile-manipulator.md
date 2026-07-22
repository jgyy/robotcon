# Mastering Mobile Manipulators — Unit 1: Setting Up the Navigation System for a Mobile Manipulator

A mobile manipulator is still a mobile robot first: before an arm can grasp anything, the base has to reliably get itself next to the object and the drop-off location. This unit sets up the navigation layer (costmaps, planners, controllers) that every later unit — perception, manipulation, behaviors — will assume is already working.

## Why navigation for a manipulator-equipped base is different

A bare mobile base is a simple, roughly cylindrical or rectangular footprint. Bolt an arm onto it and two things change:

- **The footprint grows and becomes dynamic.** An arm tucked in for driving has a different swept volume than an arm extended to grasp. If you only feed the navigation stack the base's footprint, the arm can clip shelving, doorframes, or people while the robot thinks it has clearance.
- **Center of mass and turning behavior can change** as the arm moves, which matters for velocity/acceleration limits on real hardware (less relevant in simulation, but worth knowing).

The practical fix in most setups is to define a conservative "tucked" footprint (or a padded, worst-case footprint that accounts for the arm's reach) and use that for the navigation stack's costmaps, while relying on the arm's own collision checking (covered in Unit 2) for fine manipulation moves.

## The Navigation Stack building blocks

Regardless of which distro or planner set you use, the pieces are the same:

- **Costmaps** (global and local) — occupancy-grid-derived layers (static map, obstacle layer from sensors, inflation layer) that mark where the robot can and can't go.
- **Global planner** — computes a path from current pose to goal across the global costmap (e.g. A*, Dijkstra).
- **Local planner / controller** — turns that path into real-time velocity commands while reacting to the local costmap (dynamic obstacles).
- **Localization** — AMCL (particle-filter localization against a known static map) or an equivalent, so the robot knows where it is.
- **Recovery behaviors** — clear costmaps, rotate in place, back up — triggered when the robot gets stuck.

```bash
# Typical package set you'll pull in (names vary slightly by distro)
sudo apt install ros-$ROS_DISTRO-navigation2 ros-$ROS_DISTRO-nav2-bringup \
                  ros-$ROS_DISTRO-slam-toolbox
```

## Configuring the stack for your robot

Three files/parameters matter most when adapting a generic navigation config to your mobile manipulator:

1. **Footprint** — set `robot_radius` (circular approximation) or `footprint` (a polygon) in the costmap parameters to the padded, arm-aware shape discussed above.
2. **Sensor placement** — if the arm or its mount partially occludes the base's lidar/camera, the obstacle layer needs to be told to ignore that self-occlusion (a static "robot self-filter" or an adjusted sensor field of view) rather than treating the robot's own arm as an obstacle.
3. **Velocity/acceleration limits** — a heavier, top-loaded manipulator base often needs lower acceleration limits than a bare base to avoid tipping or slipping, especially carrying a payload.

```yaml
# excerpt of a costmap params file
local_costmap:
  robot_base_frame: base_link
  footprint: "[[0.35, 0.3], [0.35, -0.3], [-0.35, -0.3], [-0.35, 0.3]]"
  plugins: ["obstacle_layer", "inflation_layer"]
  inflation_layer:
    inflation_radius: 0.4  # generous padding for the arm's tucked envelope
```

## Launching and validating navigation

Bring the stack up against a known map, then confirm it end to end before moving on:

```bash
ros2 launch nav2_bringup bringup_launch.py map:=warehouse.yaml
ros2 topic echo /amcl_pose          # confirm localization is converging
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose \
  "{pose: {header: {frame_id: 'map'}, pose: {position: {x: 2.0, y: 1.0}}}}"
```

Watch in RViz that the global path avoids the padded footprint by a sensible margin, and that the robot actually stops within tolerance of the goal pose — later units will send navigation goals programmatically and assume this succeeds reliably.

## Try it yourself

Take (or build) a simple two-room map with one narrow doorway. Configure the local costmap footprint twice — once as the bare base's true footprint, once padded for the tucked arm — and send the same navigation goal through the doorway with each. Note how much the planned path and clearance change, and decide which margin you'd trust in a warehouse aisle.
