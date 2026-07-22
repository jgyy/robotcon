# Mastering ROS 2 with LIMO-Robot — Unit 5: How to do Path Planning in ROS2

Now that LIMO can build a map and localize on it, it's time to actually get it moving toward a goal. This unit breaks down the Nav2 stack's three cooperating pieces — the global planner, the local controller, and the behavior tree navigator that orchestrates them — and shows how to send LIMO a navigation goal.

## Nav2's layered architecture

Nav2 deliberately separates "where should I go, roughly" from "how do I move right now" — these operate at very different timescales and with different information. The **planner** computes a full path from start to goal against the static map, running relatively infrequently (once per goal, or when the goal changes). The **controller** (sometimes called the local planner) converts the next stretch of that path into actual velocity commands tens of times a second, reacting to obstacles the global path doesn't know about. A **behavior tree** ties both together with recovery logic, deciding things like "if the controller reports it's stuck, trigger a recovery behavior, then retry planning."

```
Goal pose → [BT Navigator] → [Planner Server] → global path
                    │
                    └──→ [Controller Server] → /cmd_vel (continuous, reactive)
```

## The global planner

The planner searches the static costmap (the map inflated with obstacle-clearance costs) for a path from LIMO's current pose to the goal. Nav2 ships several planner plugins — `NavFn` and `SmacPlanner2D` are common defaults for a differential-drive base like LIMO, both variants of graph search (Dijkstra/A*) over the grid. Configure which plugin runs via the planner server's params:

```yaml
planner_server:
  ros__parameters:
    planner_plugins: ["GridBased"]
    GridBased:
      plugin: "nav2_navfn_planner/NavfnPlanner"
      use_astar: true
```

## The local controller

The controller takes the global path and produces `/cmd_vel` output, respecting LIMO's actual kinematic constraints (max speed, acceleration, differential-drive turning) and reacting to the *local* costmap, which updates in real time from live sensor data and captures obstacles the static map never knew about. `DWB` (Dynamic Window Approach) and `RegulatedPurePursuit` are the two controller plugins you'll most commonly reach for — DWB samples a set of candidate velocity commands and scores them against the path and obstacles, while RegulatedPurePursuit tracks a lookahead point on the path and is often smoother on differential-drive robots.

```bash
ros2 param get /controller_server FollowPath.plugin
```

## The BT Navigator

The BT Navigator runs a behavior tree (an XML file of sequence/fallback/condition nodes) that governs the whole navigation attempt end to end: call the planner, hand the path to the controller, monitor for failure, and invoke recovery behaviors (covered fully next unit) before retrying. This is what makes Nav2 resilient rather than a single planner call — a stuck robot doesn't just fail silently, the tree decides what to try next.

## Sending a navigation goal

The simplest way to test the whole pipeline is Nav2's action interface, either via RViz's "Nav2 Goal" tool or the CLI:

```bash
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose \
  "{pose: {header: {frame_id: 'map'}, pose: {position: {x: 2.0, y: 1.0, z: 0.0}, orientation: {w: 1.0}}}}"
```

Watch `/plan` (the global path) and `/cmd_vel` (the resulting motion) simultaneously in RViz to see both layers working together.

## Try it yourself

Send LIMO two different navigation goals in a row from the CLI as shown above, and while it's executing, watch how `/plan` recomputes if you nudge the local costmap by manually placing a temporary obstacle in front of it — note that only the local controller's behavior changes in the short term, not the whole global plan, unless the obstacle actually blocks the planned corridor.
