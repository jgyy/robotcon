# Robot Fleet Management in ROS2 v2 — Unit 12: Human Interaction with RMF

Robots in a shared building share it with people. This unit covers how RMF represents humans and human-operated systems so the traffic scheduler and task dispatcher can account for them, not just robot-to-robot interaction.

## Humans as participants, not obstacles

Purely reactive obstacle avoidance (stop or swerve when something is detected in the way) is necessary but not sufficient for shared human-robot spaces — it handles the immediate collision case but not the coordination case: a robot shouldn't even *plan* to occupy a lift or corridor a human operator has flagged as currently in use. RMF supports registering humans (or human-driven vehicles/carts) as schedule participants with their own reserved itineraries, the same mechanism robots use to negotiate with each other.

## Registering a human-operated participant

A lightweight ROS 2 node can register a "free" participant on behalf of a human operator — for example, someone pushing a cart who has an app or badge scanner reporting rough position:

```python
from rmf_traffic_ros2 import schedule

participant = schedule.register_participant(
    node,
    name="operator_cart_1",
    responsive=False,          # a human won't respond to negotiation requests
    profile=schedule.Profile(footprint_radius=0.4),
)
```

Because a human can't "negotiate" in the algorithmic sense, these participants are typically registered as non-responsive: RMF's scheduler treats their claimed space as fixed and routes robots around it, rather than expecting them to yield.

## The rmf-panel operator interface

For day-to-day human interaction — dispatching tasks, watching fleet state, manually pausing a robot — RMF's web-based operator panel (`rmf-panel-js`, which you'll customize in Unit 14) is the primary touchpoint. It's a thin client over the same `/task_api_requests` and `/fleet_states` topics you've already been using from the CLI, so anything you can do with `ros2 topic pub`/`echo` a human operator can do by clicking in the panel.

## Emergency and manual override

RMF supports an emergency-alarm topic that operators (or building fire systems) can trigger to override normal task execution and send all robots to designated safe waypoints:

```bash
ros2 topic pub /fire_alarm_trigger std_msgs/msg/Bool "data: true"
```

Fleet adapters that implement the relevant callback will interrupt in-progress navigation and reroute; adapters that don't implement it will simply ignore the alarm, so confirming this behavior is part of validating any adapter meant for a human-occupied space.

## Try it yourself

Register a non-responsive "human" schedule participant occupying a waypoint in your test environment, then dispatch a robot task that would normally route through that waypoint. Confirm via `/fleet_states` and adapter logs that the robot's planned path routes around the occupied space rather than through it, the same way it would avoid another robot's claimed itinerary.
