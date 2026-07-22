# Unit Testing with ROS — Unit 6: MicroProject

This closing unit is a small hands-on project that pulls together all three testing levels from Units 3-5 into one coherent test suite, so you leave the course with a working pattern you can copy into your own packages.

## The scenario
Build (or reuse) a tiny `bumper_stop` package: a node that subscribes to a `range` topic (a single `Float32` distance reading from a simulated proximity sensor) and publishes a `cmd_vel`-style `Twist` telling the robot to stop if the reading drops below a safety threshold, otherwise to keep moving forward at a fixed speed. This is deliberately safety-flavored — exactly the kind of node where "we never actually tested this" is not an acceptable answer.

```python
# bumper_stop/safety.py  (pure logic, no ROS)
def compute_command(range_reading, stop_threshold, cruise_speed):
    if range_reading is None:
        return 0.0  # fail safe: no data means stop
    if range_reading < stop_threshold:
        return 0.0
    return cruise_speed
```

## Task 1 — library tests
Write `test/test_safety.py` covering: normal cruising, stopping exactly at the threshold (decide and document the boundary behavior, same as Unit 3's boundary exercise), stopping well below threshold, and the `None`/missing-reading fail-safe case. Aim for every `if`/`return` branch in `compute_command` to be hit by at least one test.

## Task 2 — node-level tests
Wrap `compute_command` in a `BumperStopNode` (subscribe `range` as `Float32`, publish `cmd_vel` as `Twist`) and write `test/test_bumper_stop_node.py` following Unit 4's pattern: construct the node directly in the test process, drive it with a harness node publishing `range` readings, and assert on the published `Twist.linear.x`. Include at least one test that changes the `stop_threshold` parameter at runtime and confirms the new value is honored.

## Task 3 — integration test
Write a `launch_testing`-based test (Unit 5's pattern) that launches the real `bumper_stop_node` executable and a second node that publishes a scripted sequence of `range` readings on a timer (start far away, then approach, then get close). Assert that the observed `cmd_vel` stream transitions from cruising to stopped at roughly the right point in the sequence — this is the only place in the suite that proves the two nodes actually agree on topic names, message types, and timing when run as separate processes.

## Wiring it into `colcon test`
Confirm all three files are discovered by running the full suite from your workspace root:

```bash
colcon build --packages-select bumper_stop
colcon test --packages-select bumper_stop
colcon test-result --verbose
```

`colcon test-result --verbose` is worth knowing well beyond this project — it's the command that turns a wall of pytest/launch_testing output into a clear per-package pass/fail summary, and it's what you'd wire into a CI job.

## Try it yourself
Deliberately introduce one bug — e.g. change the node's published topic name from `cmd_vel` to `cmd_vel_out` without updating the integration test's subscriber — and confirm which layer of your suite catches it. If only the integration test fails while the library and node-level tests still pass, you've just demonstrated in miniature exactly why this course teaches all three levels rather than just one.
