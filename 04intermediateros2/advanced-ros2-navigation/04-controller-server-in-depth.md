# Advanced ROS2 Navigation — Unit 4: Controller Server In Depth

You've already met the controller server as "the thing that follows the path." This unit goes under the hood of `controller_server` itself: how it's configured, the three plugin roles it actually loads (not just "the controller"), and how to tune them so path-following looks smooth instead of jerky or overshoot-prone.

## Controller server configuration

`controller_server` is a lifecycle node configured almost entirely through one YAML block. Beyond naming which plugins to load, it owns a handful of parameters that apply regardless of which controller plugin you pick:

```yaml
controller_server:
  ros__parameters:
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_theta_velocity_threshold: 0.001
    failure_tolerance: 0.3
    progress_checker_plugin: "progress_checker"
    goal_checker_plugins: ["goal_checker"]
    controller_plugins: ["FollowPath"]
```

`controller_frequency` sets the control loop rate — this is the "hard real-time" number from Unit 3: at 20 Hz your controller plugin has 50ms to produce a velocity command, every tick, or the robot visibly stutters. `failure_tolerance` is how long (seconds) the controller is allowed to produce no valid command before the server reports failure back up to the behavior tree, which is what triggers a recovery (Unit 2) rather than an immediate abort.

## The three main controller server plugins

It's easy to think of "the controller" as one plugin, but `controller_server` actually loads three distinct plugin roles simultaneously, each with its own base class and its own job:

**1. The controller plugin** (`nav2_core::Controller`, e.g. `DWBLocalPlanner` or `RegulatedPurePursuitController`) does the actual path-tracking: given the current path and robot pose, produce a velocity command every tick. This is the one people mean when they say "which controller are you using."

```yaml
FollowPath:
  plugin: "nav2_regulated_pure_pursuit_controller::RegulatedPurePursuitController"
  desired_linear_vel: 0.5
  lookahead_dist: 0.6
  use_regulated_linear_velocity_scaling: true
```

**2. The progress checker** (`nav2_core::ProgressChecker`, e.g. `SimpleProgressChecker`) answers "is the robot actually making headway, or stuck?" by watching whether the robot's pose has moved more than a threshold distance within a time window. If not, it reports failure — this is often what's *really* behind a robot triggering a recovery, not the controller plugin itself.

```yaml
progress_checker:
  plugin: "nav2_controller::SimpleProgressChecker"
  required_movement_radius: 0.5
  movement_time_allowance: 10.0
```

**3. The goal checker** (`nav2_core::GoalChecker`, e.g. `SimpleGoalChecker` or `StoppedGoalChecker`) answers "have we arrived?" by comparing the robot's pose (and, for the stopped variant, velocity) against the goal tolerance — separate from path-following entirely, since "close enough in position" and "actually stopped" are different questions a controller shouldn't have to reason about itself.

```yaml
goal_checker:
  plugin: "nav2_controller::SimpleGoalChecker"
  xy_goal_tolerance: 0.15
  yaw_goal_tolerance: 0.15
  stateful: true
```

Splitting these three concerns into separate pluginizable roles is what lets you, for example, swap in a stricter goal checker for docking tasks without touching your path-tracking algorithm at all.

## Hands-on practice: tuning by feel

Numbers on a page don't tell you what "too aggressive" looks like — driving a robot does. With a working Nav2 bringup:

1. Send a goal and watch the robot's behavior with the defaults.
2. Increase `desired_linear_vel` by 50% and re-run the same goal — note any overshoot or clipped corners.
3. Tighten `xy_goal_tolerance` to `0.05` and watch the robot hunt/oscillate near the goal if the controller can't quite settle inside such a tight band.
4. Loosen `movement_time_allowance` on the progress checker and deliberately block the robot's path — confirm it now takes longer to declare itself stuck.

Each change should produce a visibly different — and explainable — robot behavior. If it doesn't, you likely changed a parameter on the wrong plugin.

## Try it yourself

Configure a `StoppedGoalChecker` instead of `SimpleGoalChecker` (it additionally requires the robot's velocity to be near zero before declaring the goal reached) and re-run a goal with a fairly high `desired_linear_vel`. Compare how much further the robot travels past the nominal goal point before the controller server reports success, versus the plain `SimpleGoalChecker` — that gap is entirely attributable to which goal checker plugin you loaded, not to the controller plugin driving the robot.
