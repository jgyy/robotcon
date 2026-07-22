# ROS Autonomous Vehicles 101 — Unit 3: Obstacles and Security

Knowing where you are (Unit 2) is useless if you drive into something along the way. This unit covers detecting obstacles from laser data, reacting to them, and building the safety systems a Level 3 car needs to hand control back cleanly.

## Reading obstacles from LaserScan
A `sensor_msgs/msg/LaserScan` message is an array of range readings swept across an angle. The key fields:

- `ranges[]` — the distance measurement at each angle step.
- `angle_min`, `angle_max`, `angle_increment` — define what angle each index in `ranges[]` corresponds to.
- `range_min`, `range_max` — the sensor's valid range; readings outside this window (often `inf` or `nan`) mean "nothing detected," not "zero distance."

A minimal check for "is anything dangerously close in front of us":

```python
def min_range_in_forward_cone(scan, cone_deg=30.0):
    import math
    half = math.radians(cone_deg / 2)
    closest = float('inf')
    for i, r in enumerate(scan.ranges):
        angle = scan.angle_min + i * scan.angle_increment
        if -half <= angle <= half and scan.range_min <= r <= scan.range_max:
            closest = min(closest, r)
    return closest
```

## A simple reactive obstacle avoider
The obstacle-avoidance behavior you're asked to build in this unit doesn't need a full planner — a reactive rule is enough for a first pass:

```python
def obstacle_avoid_cmd(scan, cruise_speed=0.8, stop_distance=1.0, slow_distance=3.0):
    closest = min_range_in_forward_cone(scan)
    if closest < stop_distance:
        return 0.0, 0.5   # stop forward motion, turn to find a clear path
    if closest < slow_distance:
        fraction = (closest - stop_distance) / (slow_distance - stop_distance)
        return cruise_speed * fraction, 0.0
    return cruise_speed, 0.0
```

This is a "brake and turn" reflex, not a path planner — it will not find its way around a wall. Treat it as the safety net underneath whatever navigation logic (Unit 2's waypoint follower, or later a full planner) is driving the car normally.

## Safety systems
A Level 3 car needs explicit, testable safety behavior, not just "hopefully it stops in time":

- **Emergency stop** — a dedicated topic or service (e.g. `/estop`) that immediately zeroes velocity commands regardless of what any other node is publishing. Wire it so it takes priority at the lowest possible level — ideally in the node that talks to the motors, not just in your planning code.
- **Watchdogs** — if a critical topic (like `/scan` or `/gps/fix`) stops publishing, the car should stop, not keep acting on stale data. Track the timestamp of the last message and trigger a stop if it goes silent past a threshold.
- **Geofencing** — refuse to execute waypoints outside a pre-approved area, a cheap sanity check against bad GPS data or a bad mission plan.

```python
def watchdog_ok(last_msg_time, now, timeout_sec=0.5):
    return (now - last_msg_time).nanoseconds / 1e9 < timeout_sec
```

## Combining navigation with avoidance
In practice you run the waypoint follower from Unit 2 and the obstacle avoider from this unit side by side, and let a simple priority rule decide who wins: if the obstacle avoider says "stop or turn," that overrides the waypoint follower's command. This is a lightweight stand-in for what a real costmap-based planner (like Nav2's) does more rigorously by treating obstacles as a cost layer the planner routes around rather than a separate override.

## Try it yourself
Combine Unit 2's `steer_command` and this unit's `obstacle_avoid_cmd`: publish the obstacle avoider's command whenever it detects something inside `slow_distance`, and the waypoint follower's command otherwise. Drive toward a waypoint with an obstacle placed in the direct path and confirm the car slows, avoids, and then resumes toward the target.
