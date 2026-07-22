# GTest Framework for ROS2 — Unit 4: Full-System and Sub-System Tests

Unit tests check pieces in isolation, and Unit 3's node tests check one node's pub/sub contract. This unit goes a level higher: verifying that a whole stack of nodes — potentially including simulation — behaves correctly together, using Nav2 over Gazebo as the running example.

## Where system tests fit, and their trade-offs

A system test launches (part of) your real application — multiple nodes, possibly a simulator, possibly real config files — and asserts on end-to-end behavior, such as "the robot reaches the goal pose" or "the safety node stops the base within 200 ms of an obstacle appearing." These catch integration bugs that no combination of unit tests will ever find: misconfigured parameters, wrong topic remappings between packages, timing assumptions that only break under real message rates. The cost is that they are slow (seconds to minutes), flaky if not written carefully, and hard to debug when they fail because the failure could be anywhere in the stack. This is why the pyramid from Unit 1 says: write many unit tests, some node tests, and only as many system tests as you need to cover critical end-to-end behaviors.

## Setting up a launch_testing environment

ROS2's `launch_testing` package is the standard tool for system tests: it lets you write a launch file that starts your nodes (and simulator), then runs a Python test process alongside it that interacts with the running system and makes assertions. A minimal structure:

```python
import launch_testing
import launch_testing.actions
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_test_description():
    nav_node = Node(package='nav2_bringup', executable='bringup_launch.py')
    return LaunchDescription([
        nav_node,
        launch_testing.actions.ReadyToTest(),
    ]), {'nav_node': nav_node}

class TestNavBringsUp(unittest.TestCase):
    def test_node_starts(self, proc_output):
        proc_output.assertWaitFor('Bringup launch complete', timeout=30)
```

Register this in `CMakeLists.txt` with `add_launch_test(test/system_test.py)`, and `colcon test` will pick it up alongside your GTest binaries — one unified pass/fail report across both C++ unit tests and Python system tests.

## A Nav2 system test with Gazebo

For a Navigation2 system test, the launch file typically brings up: Gazebo with a world, the robot's simulated sensors/description, and the full Nav2 stack (planner, controller, behavior tree navigator). The test process then acts like a client: it sends a `NavigateToPose` action goal via an `rclpy` action client and waits for a result.

```python
class TestNavigateToGoal(unittest.TestCase):
    def test_reaches_goal(self):
        node = rclpy.create_node('nav_test_client')
        client = ActionClient(node, NavigateToPose, 'navigate_to_pose')
        client.wait_for_server(timeout_sec=30)

        goal = NavigateToPose.Goal()
        goal.pose.pose.position.x = 2.0
        goal.pose.pose.position.y = 0.0

        future = client.send_goal_async(goal)
        rclpy.spin_until_future_complete(node, future, timeout_sec=60)
        result_future = future.result().get_result_async()
        rclpy.spin_until_future_complete(node, result_future, timeout_sec=60)

        self.assertEqual(result_future.result().status, GoalStatus.STATUS_SUCCEEDED)
```

The important habit here is generous, explicit timeouts on every blocking call — simulation startup and planning can legitimately take tens of seconds, and a system test with no timeout just hangs forever on failure instead of reporting one.

## Adapting the pattern to your own system

The Nav2/Gazebo example generalizes directly: swap the launch file's nodes for your own stack, swap the action/service/topic interaction for whatever your system's entry point is (a service call, a published command, a topic to observe), and keep the same shape — bring the system up, drive it, assert on the outcome, tear it down. For systems without a convenient single "did it succeed" signal, fall back to subscribing to relevant topics for a bounded window and asserting on the collected data (e.g. "the estimated pose settled within 0.1 m of ground truth for the last 2 seconds of a 10-second run").

## Try it yourself

Write a `launch_testing` file for any two-node system you have (or a trivial one: a "commander" node that publishes a goal and a "follower" node that reports when it reaches it). Launch both nodes, and in the test body subscribe to the follower's status topic, then assert that a "reached" status arrives within a reasonable timeout after the commander starts. Run it through `colcon test` and confirm it appears in the same report as your Unit 2/3 GTest tests.
