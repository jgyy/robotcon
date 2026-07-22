# ROS Perception in 5 Days — Unit 9: PhantomX Hexapod Perception Project

This capstone unit combines several skills from the course — 3D perception, object detection, and tracked motion — into one integrated project running on a PhantomX hexapod, an eighteen-degree-of-freedom six-legged platform that makes a good testbed because its motion (yaw, sway, uneven gait) stresses perception pipelines that assume a smooth wheeled base.

## Defining the project scope
Rather than "do perception on the hexapod" as a vague goal, pick a concrete, testable objective built from earlier units, for example: *the hexapod detects a target object on a nearby surface (Units 4-5), walks toward it while keeping it centered in frame (Unit 2's steering logic, applied to a leg-based gait command), and stops within a set distance.* Writing the objective as a single sentence with a clear success condition ("stops within 20cm of the object, centered within 10 pixels") is what turns this into a testable project rather than an open-ended demo.

## Architecture: one node per responsibility
Resist the temptation to write one large node. Following the pattern from every earlier unit, split responsibilities across nodes connected by topics:
- **Perception node** — runs object detection/segmentation (reusing Unit 4 or 5's pipeline) and publishes the target's position as a `PoseStamped` in a stable frame.
- **Tracking/state node** — smooths the perception output over time (reusing Unit 8's predict/correct idea) so a single missed detection doesn't cause a lurch in gait commands.
- **Gait/motion node** — the hexapod's existing walking controller, which this project only needs to *command* (forward speed, turn rate) rather than reimplement.
- **Behavior/coordinator node** — a small state machine (e.g. `SEARCHING → APPROACHING → ARRIVED`) that turns the tracked target position into motion commands for the gait node, and decides what to do if the target is lost (reuse the "detection lost" discipline from Units 3 and 6).

## Handling a legged platform's perception challenges
A walking gait introduces camera shake that a wheeled base doesn't have, which can make frame-to-frame jitter look like the target moving when it's really the camera moving. Two practical mitigations: smooth detections with a short moving average or the Kalman filter from Unit 8 before acting on them, and where possible, gate perception processing to run on frames captured mid-stride rather than during the most jarring part of the gait cycle if your platform exposes gait phase.

## Testing incrementally
Validate each node in isolation before wiring the full pipeline: confirm the perception node publishes sane target positions with the hexapod stationary, confirm the coordinator's state machine transitions correctly on recorded/replayed perception data (`rosbag record` / `rosbag play`), and only then let the coordinator drive the real gait node. Debugging a six-node pipeline all at once, live, on a walking robot is the slowest possible way to find a bug that turns out to be a sign error in the coordinator.

## Try it yourself
Design and build the full pipeline described above for a target object of your choice: perception node, tracking/smoothing node, and a coordinator state machine that commands the hexapod to approach and stop near the target. Record a `rosbag` of one full successful run, and one run where you deliberately occlude the target mid-approach — confirm the coordinator's lost-target handling engages correctly in the second case instead of the hexapod continuing to walk blind.
