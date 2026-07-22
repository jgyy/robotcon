# Mastering with ROS: SUMMIT XL — Patrole with Summit XL Micro Project

This is the capstone: combine indoor/outdoor navigation (Units 1-2) with the person detection and recognition pipeline (Unit 3) into one reactive patrol program that walks a route and responds when it finds someone.

## Defining a patrol route as waypoints

A patrol route is just an ordered list of poses the robot cycles through, looping back to the start once it reaches the end. Keep the list as plain data, not hard-coded into your control logic — it makes the route trivial to edit or extend later:

```python
patrol_route = [
    {"x": 2.0, "y": 0.0, "frame": "map"},
    {"x": 2.0, "y": 4.0, "frame": "map"},
    {"x": -1.0, "y": 4.0, "frame": "map"},
    {"x": -1.0, "y": 0.0, "frame": "map"},
]
```

Mixed indoor/outdoor patrols are realistic (a loading dock that spans a warehouse door, say) but for this project keep the route inside whichever navigation stack you set up — indoor via Nav2 goals from Unit 1, or outdoor via the waypoint-follower loop from Unit 2. Mixing both cleanly is a natural extension once the basic loop works.

## A patrol state machine

The control logic needs at least three states: moving toward the next waypoint, investigating a detection, and (optionally) idle/paused. A small explicit state machine is easier to reason about — and debug — than a pile of nested conditionals:

```python
from enum import Enum, auto

class PatrolState(Enum):
    PATROLLING = auto()
    INVESTIGATING = auto()
    PAUSED = auto()

state = PatrolState.PATROLLING
current_waypoint_index = 0
```

Drive state transitions from events, not from polling everywhere in your code: a "goal reached" callback advances `current_waypoint_index` and re-sends the next goal; a "person detected" callback (from Unit 3's detectors) moves you into `INVESTIGATING` regardless of where you are in the route.

## Reacting to a detection

When either detector (laser leg-cluster or camera HOG/DNN) fires, stop the current navigation goal, hold position, and run the recognition + permission check from Unit 3:

```python
def on_person_detected(pose, state, nav_client):
    if state != PatrolState.PATROLLING:
        return state  # already investigating or paused, ignore re-triggers
    nav_client.cancel_goal()
    return PatrolState.INVESTIGATING

def on_recognition_result(identity, authorized_ids, state, nav_client, resume_goal):
    if identity in authorized_ids:
        nav_client.send_goal(resume_goal)   # known and authorized: resume the route
        return PatrolState.PATROLLING
    log_alert(identity)                     # unknown, or recognized but not authorized
    return PatrolState.PAUSED
```

Cancelling the in-flight navigation goal rather than letting it keep running is what makes the reaction feel immediate — an important detail, since a robot that "notices" a person three meters late undermines the whole point of the exercise.

## Putting it together

The full loop is an event-driven node: a timer or goal-result callback drives `PATROLLING`, the laser and camera detector callbacks can preempt it into `INVESTIGATING` at any time, and the recognition result callback resolves back to `PATROLLING` or `PAUSED`. Structuring it this way — states plus events, rather than one long procedural script — is exactly the pattern you'll reuse for any robot that has to combine "keep doing task X" with "react when Y happens," well beyond patrol robots.

## Try it yourself

Build the full loop in simulation: four waypoints, both detectors wired in, and a small authorized-IDs list. Walk a simulated person into the patrol path and confirm the robot stops, attempts recognition, and either resumes its route (authorized) or logs an alert and stays paused (unauthorized) — then confirm it correctly resumes from the waypoint it was heading to, not from the start of the route.
