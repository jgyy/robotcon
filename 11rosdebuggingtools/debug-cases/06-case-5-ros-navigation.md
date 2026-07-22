# Debug Cases — Unit 6: Case 5: ROS Navigation

Navigation stacks (such as Nav2) tie together nearly everything from the earlier units — topics, TF, and often actions — into one system, which makes navigation bugs some of the hardest to root-cause: is it a bad sensor topic, a broken transform, a misconfigured parameter, or the planner itself? This closing unit gives you a triage order so you check the cheap, common causes before the expensive, rare ones.

## Triage order for a broken navigation stack

When the robot won't plan, won't move, or moves somewhere wrong, check in this order — each step rules out an entire category of causes cheaply:

1. **TF tree is complete and current.** `ros2 run tf2_tools view_frames`, confirm `map -> odom -> base_link` (or your stack's equivalent chain) exists and timestamps are recent.
2. **Sensor topics are flowing at the expected rate.** `ros2 topic hz /scan`, `ros2 topic hz /odom`.
3. **Costmaps are populated, not empty.** Visualize `/global_costmap/costmap` and `/local_costmap/costmap` in RViz — an all-unknown or all-free costmap usually means the sensor topic feeding it isn't configured correctly in the costmap's parameters.
4. **Parameters match what you think they are** — see below.

Working top-down like this avoids the common trap of tuning planner parameters for an hour when the real problem was a stale TF frame.

## Inspecting navigation parameters

Navigation stacks are heavily parameter-driven, and a misconfigured parameter often produces behavior that looks like a code bug. Query the live values rather than trusting the YAML file on disk (launch-time overrides and defaults can differ from what's actually loaded):

```bash
ros2 param list /planner_server
ros2 param get /planner_server GridBased.tolerance
ros2 param get /local_costmap/local_costmap robot_radius
```

A frequent source of confusion: editing a params YAML file but forgetting the node needs to be restarted (or the param set live via `ros2 param set`) for the change to take effect — the running node keeps whatever it loaded at startup.

## Frame name consistency across the stack

Every navigation component — costmaps, the planner, the controller, AMCL or another localizer — is configured with frame names (`global_frame`, `robot_base_frame`, etc.) that must all agree with each other and with what your TF tree and sensor drivers actually publish. A mismatch here doesn't always error loudly; it can instead produce a planner that silently plans in the wrong frame, or a costmap that never updates because it's listening for transforms that don't exist under that name. Cross-check every `*_frame` parameter against the frame names you confirmed with `view_frames` in Unit 4.

## Common navigation issues checklist

- Robot doesn't move at all → check `/cmd_vel` is actually being published (`ros2 topic echo /cmd_vel`) and that something is subscribed to it.
- Planner refuses a goal → check the goal pose's frame_id and that it falls inside the costmap bounds, not on an obstacle.
- Robot oscillates or gets stuck near obstacles → check `inflation_radius` and `robot_radius` costmap parameters against the robot's real footprint.
- Global plan looks fine but robot doesn't follow it → the controller (local planner) parameters or the local costmap, not the global planner, are the likely culprits.

## Try it yourself

With any navigation stack running in simulation, deliberately misconfigure one `global_frame` parameter on the local costmap so it no longer matches your TF tree, send a navigation goal, and observe how the failure manifests (silently stale costmap vs. an explicit TF error). Fix it and re-confirm the goal is reachable, using the triage order above rather than jumping straight to planner tuning.
