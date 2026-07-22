# TEB Local Planner — Unit 3: Customize Parameters and Optimization

This is where TEB stops being a black box. You'll learn how the optimization node actually works, which parameters matter most, and how to use RViz to watch the planner think — which turns tuning from guesswork into an iterative, observable process.

## How the optimizer works, briefly

TEB represents the local trajectory as a graph of poses and time differences between them, then formulates trajectory quality as a sum of weighted cost terms (edges in the graph): obstacle clearance, path-following, kinodynamic feasibility, goal attraction, and more. It hands this graph to **g2o**, a general-purpose graph optimization library, which iteratively adjusts the poses to minimize total cost. The result is a locally optimal trajectory, re-optimized every control cycle as new sensor data arrives.

You don't need to understand g2o internals to tune TEB, but understanding that every parameter is a **weight in a cost function** — not a hard rule — explains a lot of TEB's tuning behavior: pushing one weight higher doesn't just enable a behavior, it trades off against every other weighted term.

## Key parameter groups

TEB's parameters are large in number but fall into a few functional groups you'll touch constantly:

**Trajectory** — controls the discretization and horizon of the elastic band:
```yaml
teb_local_planner:
  ros__parameters:
    dt_ref: 0.3              # desired time resolution between poses
    dt_hysteresis: 0.1
    max_global_plan_lookahead_dist: 3.0
    min_obstacle_dist: 0.25
    include_costmap_obstacles: true
```

**Robot kinematics** — your robot's actual velocity/acceleration limits, which TEB treats as hard constraints, not suggestions:
```yaml
    max_vel_x: 0.5
    max_vel_theta: 1.0
    acc_lim_x: 0.5
    acc_lim_theta: 1.0
```

**GoalTolerance** — how precisely the robot must reach the final pose before Navigation calls the goal reached:
```yaml
    xy_goal_tolerance: 0.1
    yaw_goal_tolerance: 0.1
    free_goal_vel: false
```

**Optimization weights** — the cost-term multipliers that shape *how* the band deforms:
```yaml
    weight_max_vel_x: 2.0
    weight_obstacle: 50.0
    weight_optimaltime: 1.0
    weight_kinematics_nh: 1000.0   # non-holonomic constraint, keep high for diff-drive
```

A useful mental model: `weight_obstacle` vs. `weight_optimaltime` is the classic safety-vs-speed tradeoff. Raise obstacle weight and the robot gives wider berth to clutter at the cost of longer paths; raise optimaltime weight and it prioritizes reaching the goal fast, hugging obstacles more tightly.

## Visualizing trajectories in RViz

TEB publishes debug topics that are invaluable for tuning — enable them and add the corresponding RViz displays:

```yaml
    publish_feedback: true
```

```bash
ros2 topic list | grep teb
# look for something like /local_plan and /teb_markers or /teb_poses
```

Add a `MarkerArray` display subscribed to TEB's trajectory markers topic, and a `Path` display on the published local plan. What you're looking for:

- **Multiple candidate trajectories** briefly appearing around obstacles — TEB explores several homotopy classes (fundamentally different ways around an obstacle, e.g. "go left" vs. "go right") before committing to one.
- **Smoothness** of the committed band — jagged, sawtooth trajectories usually mean your optimization weights or `dt_ref` need adjustment, not that something is broken.

## Tuning workflow

1. Change one parameter (or one closely related group) at a time.
2. Reload params (`ros2 param set`, a param reload service, or a full relaunch — check what your distro's controller server supports live) and re-run the same test scenario.
3. Watch RViz for the specific behavior on your Unit 1 list (jerky commands, corner-cutting, stalling).
4. Record what changed before moving to the next parameter — tuning multiple things at once makes it impossible to attribute cause and effect.

## Try it yourself

Take one behavior from your Unit 1 observation list and fix it through parameter tuning alone. For example, if the robot cuts corners too tightly, try raising `min_obstacle_dist` and `weight_obstacle` together, then rerun the same goal in simulation and compare the RViz-visualized trajectory before and after. Write down the exact parameter values you changed and the observed difference.
