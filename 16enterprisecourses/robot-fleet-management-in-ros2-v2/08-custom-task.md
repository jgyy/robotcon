# Robot Fleet Management in ROS2 v2 — Unit 8: Custom Task

RMF ships with a handful of built-in task types (covered in Unit 10), but real deployments usually need something bespoke — "when the robot arrives at the loading dock, trigger this behavior." This unit covers one practical approach: location-triggered custom actions.

## The pattern: performable actions at waypoints

Rather than inventing a brand-new task type from scratch (a heavier lift involving RMF's task planning API), the simplest path to custom behavior is to define a **performable action** attached to a waypoint. When a robot's itinerary includes visiting that waypoint, RMF calls back into your fleet adapter once it arrives, and your adapter runs arbitrary code before reporting the action complete.

## Declaring the action in your adapter

```python
class MyRobotAPI(RobotAPI):
    def perform_action(self, robot_name: str, category: str, description: dict,
                        execution):
        if category == "inspect_shelf":
            self._start_shelf_inspection(robot_name, description)
            # execution.update(...) as work progresses
            # execution.finished() when done, or execution.error(...) on failure
        else:
            execution.error(f"Unsupported action: {category}")

    def _start_shelf_inspection(self, robot_name, description):
        # e.g., trigger a camera capture routine on the robot
        ...
```

The `category` string is how you distinguish between different custom actions on the same robot, and `description` carries whatever parameters the task requester attached (e.g., which shelf to inspect).

## Wiring the action into a task request

A task requester (human operator, dispatcher script, or another system) references your custom action by category when composing a task:

```python
from rmf_task_msgs.msg import ApiRequest
import json

request = {
    "type": "robot_task_request",
    "robot": "tinyRobot1",
    "fleet": "tinyRobot",
    "request": {
        "category": "compose",
        "description": {
            "category": "inspect_shelf",
            "phases": [{
                "activity": {
                    "category": "perform_action",
                    "description": {
                        "unix_millis_action_duration_estimate": 60000,
                        "category": "inspect_shelf",
                        "description": {"shelf_id": "A12"}
                    }
                }
            }]
        }
    }
}
```

RMF's task API is JSON over a ROS 2 topic (`/task_api_requests`), which is convenient — you can compose and send tasks from any language or even `ros2 topic pub` for quick testing, without linking against RMF's C++/Python libraries.

## Reporting progress and completion

Long-running custom actions should call `execution.update()` periodically so the task's progress is visible in `/task_summaries`, and must eventually call either `execution.finished()` or `execution.error()` — RMF will otherwise consider the robot permanently busy with that action and never assign it further work.

## Try it yourself

Define a custom action category `wait_and_beep` that, when triggered, pauses for five seconds (simulating some robot-side behavior) and then calls `execution.finished()`. Compose a task that sends a robot to a waypoint and then performs `wait_and_beep`, dispatch it, and confirm in `/task_summaries` that the task transitions through in-progress and completed states around your action.
