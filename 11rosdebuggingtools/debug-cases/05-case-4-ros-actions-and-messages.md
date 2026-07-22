# Debug Cases — Unit 5: Case 4: ROS Actions and Messages

Actions sit between topics and services: like services they're a request-driven interaction, but like topics they stream ongoing data (feedback) and support cancellation. That extra structure means there are more places for an action-based interaction to get stuck, and more diagnostic surface to check. This unit extends the topic/message debugging skills from earlier units to the action interface.

## Anatomy of an action definition

An `.action` file has three sections, separated by `---`: goal, result, and feedback.

```
# Fibonacci.action
int32 order
---
int32[] sequence
---
int32[] partial_sequence
```

Under the hood, an action is implemented as a bundle of topics and services (goal service, cancel service, result service, status topic, feedback topic) — which is why `ros2 topic list` on a running system with an action server shows several related topic names you didn't explicitly create.

## Inspecting an action server from the CLI

```bash
ros2 action list
ros2 action info /fibonacci
ros2 action send_goal /fibonacci example_interfaces/action/Fibonacci "{order: 5}" --feedback
```

`--feedback` streams intermediate feedback messages as they arrive, which is your primary tool for confirming a long-running action is actually making progress rather than silently stalled. If `ros2 action list` doesn't show your action at all, the server node isn't running or isn't advertising under the name you expect — check with `ros2 node info <server_node>`.

## Debugging intermediate ROS programs: goal, feedback, result

When writing or debugging an action server, log at each of the three lifecycle points separately rather than only at the end:

```python
def execute_callback(self, goal_handle):
    self.get_logger().info(f'Goal received: order={goal_handle.request.order}')
    feedback_msg = Fibonacci.Feedback()
    for i in range(goal_handle.request.order):
        feedback_msg.partial_sequence.append(i)
        goal_handle.publish_feedback(feedback_msg)
        self.get_logger().info(f'Feedback: {feedback_msg.partial_sequence}')
    goal_handle.succeed()
    result = Fibonacci.Result()
    result.sequence = feedback_msg.partial_sequence
    self.get_logger().info(f'Result: {result.sequence}')
    return result
```

A goal handle that never calls `succeed()`, `abort()`, or `canceled()` leaves the client waiting forever with no error — this is the action equivalent of the "server never spins" bug from services, and it's the most common cause of an action call that hangs.

## Action message particularities

- Goal, feedback, and result are three **distinct generated types** (`Fibonacci.Goal`, `Fibonacci.Feedback`, `Fibonacci.Result`) — mixing them up is a common source of confusing type errors.
- Cancellation is cooperative: calling `cancel_goal` only requests cancellation; a server must check `goal_handle.is_cancel_requested` inside its loop and respond, or the goal runs to completion regardless.
- A client that only checks the final result and ignores feedback will appear to "hang" for the full duration of a long action even when it's working correctly — always confirm via feedback before assuming something is broken.

## Try it yourself

Using any action server available in your simulation (or the standard Fibonacci example), send a goal with `send_goal --feedback` and confirm you see incremental feedback messages before the final result. Then send a goal and cancel it partway through with `ros2 action send_goal ... ` interrupted (Ctrl-C) or a dedicated cancel call, and confirm the server actually stops work rather than completing anyway.
