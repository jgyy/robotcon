# Mastering with ROS: Jackal — Unit 5: Patrol with Jackal Micro Project

This is the capstone unit: everything from the earlier units — waypoint navigation, GPS goals, and person detection — comes together into one reactive patrol behavior that loops through a route and responds when it spots someone.

## Designing the Patrol Behavior

The whole project reduces to a small state machine with two states: `PATROLLING`, where Jackal drives its waypoint loop, and `REACTING`, where it stops and responds to a detected person before resuming. Keep it explicit rather than burying the logic in nested conditionals — it makes the behavior easy to reason about and easy to extend later (e.g. adding a `RETURNING_HOME` or `LOW_BATTERY` state):

```python
from enum import Enum, auto

class State(Enum):
    PATROLLING = auto()
    REACTING = auto()

state = State.PATROLLING
```

## Looping Through Waypoints

Reuse the `BasicNavigator` pattern from the indoor navigation unit, but instead of a single goal, cycle through a fixed list forever:

```python
waypoints = [pose_a, pose_b, pose_c, pose_a]
idx = 0

while rclpy.ok():
    nav.goToPose(waypoints[idx])
    while not nav.isTaskComplete():
        rclpy.spin_once(node, timeout_sec=0.1)
        if state == State.REACTING:
            nav.cancelTask()
            break
    else:
        idx = (idx + 1) % len(waypoints)
```

The `else` on the `while` only runs if the inner loop completed without `break` — a convenient way to advance to the next waypoint only when the current leg actually finished normally, not when it was interrupted by a detection.

## Reacting to a Person

Wire the laser and/or camera detector from the previous unit into a callback that flips the state machine, and give `REACTING` its own short routine — stop, optionally turn to face the last known bearing, publish or log an alert, wait, then hand control back to the patrol loop:

```python
def person_callback(msg):
    global state
    if msg.detected:
        state = State.REACTING

def handle_reacting():
    stop_robot()
    log_alert(last_known_position)
    time.sleep(REACT_HOLD_SECONDS)
    return State.PATROLLING
```

Deciding *how long* to hold in `REACTING` and *when* to consider the person "gone" is a real design choice, not a detail — too short and the robot flickers between states on a noisy detection, too long and it stops being a patrol.

## Assembling the Micro Project

Structure the finished node around three pieces: subscribers feeding the laser and camera detectors into a single fused "person seen" signal, a timer callback that steps the state machine, and the waypoint navigator driving the actual motion. Build and test it incrementally rather than all at once — get the patrol loop solid on its own first, then add detection as a pure logger before you let it actually interrupt navigation, then finally wire in the interrupt-and-resume behavior.

## Try it yourself

Implement the patrol loop over three waypoints in simulation, then walk a simulated actor across the path and confirm the robot pauses, logs an alert, and resumes patrolling from a sensible point in the route once the actor leaves the sensors' field of view.
