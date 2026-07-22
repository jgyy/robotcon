# ROS2 Basics in 5 Days (Python) — Unit 7: Understanding ROS2 Actions

Topics stream continuously and services return instantly — but a lot of robot behavior (navigate to a waypoint, close the gripper, run a full sensor sweep) takes noticeable time, can be cancelled, and should report progress along the way. Actions are ROS 2's answer to that gap, and are the last core communication primitive this course covers.

## What is an action in ROS 2?
An action is a long-running, goal-oriented, preemptible request. It's built out of the two primitives you already know — goal submission and cancellation use service-like request/response calls, and progress feedback plus the eventual result stream over topic-like channels — bundled into a standard interaction pattern with a `.action` file (goal / result / feedback, separated by `---`). Compared to a service: a service is "do this and tell me the answer now," while an action is "start this, keep me posted while it runs, and tell me when it's done (or if it failed, or if I cancelled it)."

## Interacting with actions from the command line
```bash
ros2 action list                                   # every active action server
ros2 action info /navigate_to_pose                 # type, clients, servers
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose "{...}" --feedback
```
`--feedback` streams progress updates as the goal executes, which is a fast way to sanity-check an action server without writing a client node.

## Calling an action server from the CLI
The `send_goal` command above blocks in your terminal until the action completes (or you Ctrl-C), printing the result when it finishes. This is useful for manual testing and demos but isn't how a real client node interacts with an action — for that you need the Action Client API, next.

## Action Client
```python
from rclpy.action import ActionClient
from example_interfaces.action import Fibonacci

class FibClient(Node):
    def __init__(self):
        super().__init__('fib_client')
        self.client = ActionClient(self, Fibonacci, 'fibonacci')

    def send_goal(self, order):
        self.client.wait_for_server()
        goal = Fibonacci.Goal(order=order)
        future = self.client.send_goal_async(goal, feedback_callback=self.on_feedback)
        future.add_done_callback(self.on_goal_response)

    def on_feedback(self, feedback_msg):
        self.get_logger().info(f'partial: {feedback_msg.feedback.partial_sequence}')

    def on_goal_response(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().warn('goal rejected')
            return
        goal_handle.get_result_async().add_done_callback(self.on_result)

    def on_result(self, future):
        self.get_logger().info(f'result: {future.result().result.sequence}')
```
Notice the chain of futures: sending the goal, receiving feedback, and getting the final result are three separate asynchronous steps, not one blocking call.

## Action Server
```python
from rclpy.action import ActionServer

class FibServer(Node):
    def __init__(self):
        super().__init__('fib_server')
        self.server = ActionServer(self, Fibonacci, 'fibonacci', self.execute_callback)

    def execute_callback(self, goal_handle):
        seq = [0, 1]
        for i in range(goal_handle.request.order):
            seq.append(seq[-1] + seq[-2])
            feedback = Fibonacci.Feedback(partial_sequence=seq)
            goal_handle.publish_feedback(feedback)
        goal_handle.succeed()
        return Fibonacci.Result(sequence=seq)
```
`execute_callback` runs for the duration of the goal — this is exactly the kind of long-running callback that benefits from being placed in its own callback group (Unit 6) so it doesn't starve the rest of the node.

## Custom action interface
Define your own `.action` file, e.g. `action/ChargeBattery.action`:
```
float32 target_percentage
---
bool completed
---
float32 current_percentage
```
The three sections are goal, result, and feedback, in that order, separated by `---`. Wire it into `package.xml`/`setup.py`/`CMakeLists.txt` the same as messages and services, then rebuild.

## Using a custom action interface
```python
from my_robot_pkg.action import ChargeBattery
self.server = ActionServer(self, ChargeBattery, 'charge_battery', self.execute_callback)
```

## Try it yourself
Implement an action server `count_to` that takes a target integer as its goal, publishes the current count as feedback once per second until it reaches the target, and returns the elapsed time as its result. Test it first with `ros2 action send_goal ... --feedback` from the CLI, then write a small Python client that submits a goal and logs each feedback message as it arrives.
