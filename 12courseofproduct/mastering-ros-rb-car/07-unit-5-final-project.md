# Mastering ROS: RB-Car — Unit 7: Final Project

This closing unit has no new ROS concepts — it's where you integrate everything from Units 1-6 (platform basics, mapping and navigation, TEB planning, GPS-fused localization, and perception) into one autonomous run that behaves like a small self-driving demo, not a collection of separate exercises.

## Project brief and success criteria

Build and demonstrate: RB-CAR autonomously drives a mapped outdoor route from a start point to a goal point, using fused GPS/IMU/odometry localization and a TEB local planner tuned for its Ackermann kinematics, while its perception pipeline detects at least one traffic light or pedestrian-equivalent obstacle along the route and causes the vehicle to stop appropriately before continuing.

Concretely, a passing run should satisfy:

- The vehicle completes the mapped route via `NavigateToPose` goals without manual intervention.
- Localization is GPS-fused (Unit 5's EKF setup), not raw odometry alone.
- TEB is configured with RB-CAR's real turning radius and footprint (Unit 4) — no invalid, unexecutable trajectories.
- At least one perception-triggered stop occurs and is logged (Unit 6) — a red traffic light or a "pedestrian" in the vehicle's path.
- The whole thing runs from a single launch file.

## Architecture: wiring navigation, planning, and perception together

The main integration work isn't in any individual subsystem you've already built — it's the **behavior layer** that arbitrates between them. A minimal but workable design:

```
                 ┌────────────────────┐
 /rbcar/odom ───▶│                    │
 /rbcar/gps/fix ─▶│   robot_localization │──▶ /odometry/filtered_map
 /rbcar/imu ─────▶│                    │
                 └────────────────────┘
                            │
                            ▼
                 ┌────────────────────┐
   /map ────────▶│   nav2 / move_base  │──▶ /rbcar/command (Ackermann)
                 │  (TEB local planner)│
                 └─────────▲──────────┘
                            │ cancel / pause goal
                 ┌────────────────────┐
 /camera/image ─▶│  perception nodes   │──▶ /perception/stop_flag
                 │ (detector + lanes)  │
                 └────────────────────┘
```

A single small "behavior" node subscribes to `/perception/stop_flag` and either cancels the current `NavigateToPose` goal (simple, robust) or publishes a zero-velocity override that takes priority over the planner's output (smoother, but requires a velocity-arbitration layer). Start with the simpler cancel-and-resend approach — it's easier to debug and good enough to demonstrate the concept.

## Suggested milestones

Work toward the final run incrementally rather than attempting the whole pipeline at once:

1. **Static integration** — launch every node from Units 2-6 together in one launch file with no interaction between them yet; confirm nothing conflicts (topic name collisions, TF tree errors) and everything shows up correctly in `rqt_graph`.
2. **Navigation-only run** — with perception nodes running but not wired to anything, complete the mapped route end-to-end using GPS-fused localization and TEB.
3. **Perception-triggered stop** — wire the behavior node so a detected stop condition halts the vehicle, tested first with the vehicle stationary (play a pre-recorded bag of a traffic light turning red) before testing it while driving.
4. **Full run** — put it all together and drive the complete route.

## Demonstrating and evaluating your solution

Capture a rosbag of the full run (`ros2 bag record -a` or an explicit topic list covering odometry, TF, the local/global plan, and perception output) so you have evidence of the run beyond a live demo, and so you can debug any failure after the fact instead of only during it. When reviewing your own run, specifically check: did the fused localization stay smooth through the whole route (no jumps when GPS quality changed), did TEB ever request a trajectory that violated the configured turning radius, and did the perception-triggered stop actually happen before the vehicle reached the hazard rather than on top of it.

## Try it yourself

Before attempting the full integrated run, deliberately break one subsystem at a time (kill the GPS topic mid-run, feed the detector a blank/black image, set an unreachable navigation goal) and observe how the rest of the stack behaves. A robust final project degrades gracefully — a lost GPS signal shouldn't make the vehicle attempt a maneuver it can't safely complete. Document what you observe; it's the most realistic preview of how a real autonomous system fails.
