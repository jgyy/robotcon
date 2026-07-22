# Mastering ROS 2 with LIMO-Robot — Unit 6: How Obstacle Avoidance happens in ROS2

Planning a path is only useful if LIMO can also keep itself from hitting things that weren't on the map — furniture that moved, a person walking by, a door left ajar. This unit covers costmaps, the layered obstacle model Nav2 uses, and the recovery behaviors that kick in when avoidance alone isn't enough.

## Costmaps: the data structure obstacle avoidance runs on

A costmap is a grid overlaid on (or independent of) the map, where each cell holds a cost from free (0) to lethal (254, guaranteed collision). Nav2 maintains two: the **global costmap**, seeded from the static map and updated slowly, and the **local costmap**, a smaller rolling window centered on LIMO that updates continuously from live sensor data. Both are built from stacked **layers**, each contributing cost independently before being combined:

```yaml
local_costmap:
  ros__parameters:
    plugins: ["obstacle_layer", "inflation_layer"]
    obstacle_layer:
      plugin: "nav2_costmap_2d::ObstacleLayer"
      observation_sources: scan
      scan:
        topic: /scan
        data_type: "LaserScan"
        marking: true
        clearing: true
    inflation_layer:
      plugin: "nav2_costmap_2d::InflationLayer"
      inflation_radius: 0.4
      cost_scaling_factor: 3.0
```

## Static obstacles

The **static layer** marks cells as occupied directly from the saved map — walls, fixed furniture, anything that was there when you mapped the space. This is the baseline the global planner routes around; it never changes at runtime (unless you explicitly reload a different map).

## Dynamic obstacles and inflation

The **obstacle layer** marks and clears cells in real time from live lidar (or depth camera) data: every scan both adds newly detected obstacles ("marking") and clears cells the sensor can now see through that were previously marked ("clearing") — this is what lets a person who walked away stop blocking LIMO's path. The **inflation layer** then spreads cost outward from every lethal obstacle in a decaying gradient, so the planner naturally prefers routes that keep LIMO's centerline further from walls and objects rather than shaving them as closely as geometrically possible — `inflation_radius` should be at least LIMO's turning radius plus a safety margin, and `cost_scaling_factor` controls how sharply the gradient decays with distance.

Because the local costmap is small and fast-updating while the global one is large and slow-updating, LIMO's *reactive* dodging of a sudden obstacle happens entirely in the local costmap/controller loop, while the *global* path only gets replanned if the obstacle actually blocks the corridor the current global path depends on.

## Recovery behaviors

Sometimes avoidance alone isn't enough — LIMO gets boxed in, the controller reports it can't make progress, or the local costmap is so cluttered no valid velocity command exists. The BT Navigator's tree includes recovery nodes for exactly this: `Spin` (rotate in place to refresh the sensor's view and clear stale costmap cells), `BackUp` (reverse a short distance to escape a tight spot), and `Wait` (pause, useful if the obstruction is a person who will likely move). These are configured as behavior plugins and wired into the default BT XML that ships with `nav2_bt_navigator`:

```bash
ros2 run rqt_reconfigure rqt_reconfigure   # watch recovery params live while LIMO runs
```

## Try it yourself

While LIMO is executing a navigation goal from the previous unit, step into the local costmap's view partway along the path (or place a box) and observe in RViz how the local costmap marks the new obstacle, how the inflation gradient appears around it, and whether the controller reroutes locally or the BT Navigator triggers a recovery behavior if it becomes fully blocked.
