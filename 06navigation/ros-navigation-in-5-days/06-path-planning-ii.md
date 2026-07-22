# ROS Navigation in 5 Days — Unit 6: Path Planning II

Unit 5 got you a global path. This unit closes the loop: turning that path into actual motor commands via the local planner, recovering when the robot gets stuck, and tuning the motion limits that determine how confidently — or cautiously — your robot drives.

## The local planner's job

The local planner (called the "controller" in Nav2's terminology) runs at a high frequency — typically 10–20 Hz — and on every cycle it must produce a `cmd_vel` that:

- makes progress along the global path,
- respects the robot's dynamic limits (max velocity, max acceleration, turning radius for non-holonomic bases),
- and avoids anything currently in the local costmap, including obstacles the global plan never saw.

The classic default is **DWA** (Dynamic Window Approach): it samples a set of feasible (v, ω) velocity pairs reachable within one control cycle given the robot's acceleration limits, simulates each forward a short distance, scores the resulting trajectories against a cost function (progress toward the path, clearance from obstacles, goal heading), and picks the best-scoring one. **TEB** (Timed Elastic Band) is a newer alternative that instead optimizes the entire local trajectory as a spline against a cost function including time-optimality — it tends to produce smoother paths and handles narrow spaces better, at higher computational cost. (TEB gets its own dedicated course elsewhere in this repo if you want to go deep.)

A representative slice of DWA-style parameters:

```yaml
controller_server:
  ros__parameters:
    controller_frequency: 20.0
    FollowPath:
      plugin: "dwb_core::DWBLocalPlanner"
      max_vel_x: 0.5
      min_vel_x: 0.0
      max_vel_theta: 1.0
      acc_lim_x: 2.5
      acc_lim_theta: 3.2
      xy_goal_tolerance: 0.15
      yaw_goal_tolerance: 0.2
```

## Recovery behaviors

Sometimes the local planner can't find any valid trajectory — the robot is boxed in by obstacles the global planner didn't anticipate, or localization has drifted enough that the costmap and reality disagree. Rather than fail immediately, the stack runs **recovery behaviors** in escalating order, e.g.:

1. **Clear costmap** — discard recent obstacle observations, in case of a sensor glitch or stale data.
2. **Rotate in place** — sweep the sensor to refresh the local costmap and possibly find an opening.
3. **Back up** a short distance.
4. **Abort** the goal if none of the above helped after a configured number of attempts.

In Nav2 this sequence lives explicitly in the behavior tree XML, so you can reorder it, add your own recovery node, or change the retry count without touching C++:

```xml
<RecoveryNode number_of_retries="3" name="RecoveryFallback">
  <ReactiveFallback name="ComputePathToPoseRecoveryFallback">
    <GoalUpdated/>
    <ComputePathToPose goal="{goal}" path="{path}" planner_id="GridBased"/>
  </ReactiveFallback>
  <ReactiveFallback name="RecoveryFallback">
    <ClearEntirely name="ClearGlobalCostmap-Context" service_name="global_costmap/clear_entirely_global_costmap"/>
    <Spin spin_dist="1.57"/>
    <BackUp backup_dist="0.15" backup_speed="0.025"/>
  </ReactiveFallback>
</RecoveryNode>
```

## Tuning velocity and acceleration limits

The single most common cause of jerky or dangerous-looking navigation isn't a bad planner — it's velocity/acceleration limits set higher than the robot (or its controller) can actually deliver. If `max_vel_x` and `acc_lim_x` overstate reality, the local planner will plan trajectories the base controller can't track, and you'll see overshoot, oscillation, or the robot clipping corners it "should" have cleared. Start conservative, verify smooth tracking, then raise limits incrementally.

## Sending goals and monitoring execution

Beyond the one-shot CLI goal from Unit 2, watch execution live:

```bash
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose \
  "{pose: {header: {frame_id: 'map'}, pose: {position: {x: 3.0, y: 0.5, z: 0.0}, orientation: {w: 1.0}}}}" \
  --feedback
```

The `--feedback` flag streams distance-remaining and current-pose updates as the robot drives, which is the fastest way to tell "still working" apart from "stuck and about to trigger recovery."

## Try it yourself

Deliberately place an obstacle in the robot's local costmap that blocks its only route to a goal (in simulation, this is easy — drop a box in the way after the global plan is computed). Send the goal and observe, in order, which recovery behaviors fire before the action either succeeds via a new route or aborts. Then tighten `max_vel_x` and `acc_lim_x` to roughly half their original values and repeat the same goal, comparing how differently — and how much more cautiously — the robot handles the same obstacle.
