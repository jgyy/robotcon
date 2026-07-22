# ROS2 Navigation — Unit 5: How Obstacle Avoidance Happens in ROS2

Planning and control (Unit 4) assume they know what's free space and what isn't. This unit covers where that information actually comes from — **costmaps** — and finishes by assembling everything from Units 2–5 into one launch file.

## Costmaps: turning sensor data into navigable space

A costmap (`nav2_costmap_2d`) is a 2D grid, much like the occupancy grid map, but where each cell holds a *cost* rather than a raw occupancy probability: 0 for free space, up to 254 (`LETHAL_OBSTACLE`) for cells the robot's center absolutely cannot occupy, plus a gradient of intermediate values near obstacles representing increasing risk. Planners and controllers use this cost field directly — a path through low-cost cells is preferred, and lethal cells are treated as impassable. Costmaps are built from **layers** stacked together, each contributing information independently before being combined (typically by taking the maximum cost per cell across layers).

## Global and local costmaps

Nav2 runs two separate costmap instances with different purposes and different lifetimes:
- The **global costmap** covers the entire known map, updates relatively infrequently, and is what `planner_server` plans across — it answers "what does the whole environment look like."
- The **local costmap** is a small window centered on the robot (a few meters across), updates at high frequency directly from live sensor data, and is what `controller_server` uses to react to obstacles in real time — it answers "what's immediately around me right now, including things not in the static map."

This split mirrors the global-planner/local-controller split from Unit 4 for the same reason: global information can be coarse and slow, but local safety reactions cannot.

## Adding a global costmap

The global costmap is configured under its own parameter namespace and typically includes a **static layer** (sourced from the map built in Unit 2) plus an **inflation layer**:

```yaml
global_costmap:
  ros__parameters:
    global_frame: map
    robot_base_frame: base_link
    resolution: 0.05
    plugins: ["static_layer", "inflation_layer"]
```

## Global costmap obstacle layers

An **obstacle layer** ingests live sensor data (laser scans, point clouds) and marks/clears cells accordingly, letting the global costmap reflect obstacles that weren't present when the map was built — a parked cart, a closed door. It's configured with the sensor topics to subscribe to and how to interpret them (2D scan vs. 3D point cloud, marking/clearing ray behavior):

```yaml
    obstacle_layer:
      plugin: "nav2_costmap_2d::ObstacleLayer"
      observation_sources: scan
      scan:
        topic: /scan
        marking: true
        clearing: true
```

## Configuring the global costmap parameters

Beyond layers, costmap-wide parameters matter: `resolution` (cell size — should generally match your map's resolution), `update_frequency` and `publish_frequency` (how often the costmap recomputes and republishes), and `inflation_layer` settings like `inflation_radius` and `cost_scaling_factor`, which control how large a "buffer zone" of rising cost surrounds each obstacle — this is what keeps the planner from routing paths that graze walls.

## Adding a local costmap

The local costmap is configured almost identically but is `rolling_window: true` (it moves with the robot rather than covering the full map) and typically skips the static layer in favor of relying entirely on live obstacle data, since its whole purpose is reacting to what the map didn't capture:

```yaml
local_costmap:
  ros__parameters:
    global_frame: odom
    robot_base_frame: base_link
    rolling_window: true
    width: 3
    height: 3
    plugins: ["obstacle_layer", "inflation_layer"]
```

Note it's typically anchored in the `odom` frame, not `map` — it needs to stay smooth and jitter-free even if AMCL's map-frame correction jumps slightly, since it's driving real-time reactive control.

## The role of robot shape in costmaps

Costmaps need to know how much space the robot itself occupies to correctly decide what's traversable. This is set via either a simple `robot_radius` (for roughly circular robots) or a full `footprint` polygon (for non-circular robots, e.g. rectangular ones):

```yaml
    robot_radius: 0.22
    # or, for a non-circular robot:
    # footprint: "[[0.3, 0.2], [0.3, -0.2], [-0.3, -0.2], [-0.3, 0.2]]"
```

This directly drives inflation: a larger footprint means obstacles need a wider cost buffer around them before the robot's center is considered safe to occupy a cell, since the whole footprint — not just the center point — must clear the obstacle.

## Creating a single navigation launch file

By this point you have five to six lifecycle-managed servers (`map_server`, `amcl`, `planner_server`, `controller_server`, `behavior_server`, `bt_navigator`) plus two costmaps embedded inside `planner_server`/`controller_server`, and a `lifecycle_manager` bringing them all up together. `nav2_bringup`'s `bringup_launch.py` is the reference example of composing all of this into one launch file: it declares each node, points them all at one shared params YAML, and configures a lifecycle manager with the full node list so a single `ros2 launch nav2_bringup bringup_launch.py map:=my_map.yaml` call brings the entire stack up in the correct order.

## Try it yourself

Place a static obstacle in your simulated world that is *not* present in your saved map (e.g. spawn a box in Gazebo after mapping was done). Send a navigation goal on the far side of it and watch the local costmap (`Add → Map`, topic `/local_costmap/costmap`) light up around the obstacle in RViz as the controller reroutes around it in real time, even though the global plan drawn through the static map ignores it entirely.
