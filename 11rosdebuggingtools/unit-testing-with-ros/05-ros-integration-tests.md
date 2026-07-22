# Unit Testing with ROS — Unit 5: ROS Integration Tests

Unit 4 tested one node in isolation, inside a single test process. Real robot bugs frequently live *between* nodes: a topic name mismatch, incompatible QoS profiles, a message field one node fills in differently than another expects. This unit brings up actual separate node processes via a launch file and tests the system as a whole.

## Why integration tests are a separate, smaller layer
Launching real processes is slow (seconds, not milliseconds) and can be flaky if timing isn't handled carefully, so you write far fewer of these than library or node-level tests. Their job isn't to re-verify logic you already covered — it's to catch the specific class of bugs that *only* exist when independent processes actually talk to each other over the wire: wrong topic name in one node's config, a QoS mismatch that silently drops messages, launch argument wiring that's wrong.

## Anatomy of a launch-based test
The standard tool is `launch_testing`, which pairs a normal ROS 2 launch description with a `unittest`-style test class. The file has two parts: a `generate_test_description()` that launches the nodes under test, and one or more test classes that run while (or after) those processes are up.

```python
# test/test_goal_checker_integration.launch.py
import unittest
import launch
import launch_ros.actions
import launch_testing.actions
import pytest
import rclpy
from std_msgs.msg import Bool, Float32MultiArray


@pytest.mark.launch_test
def generate_test_description():
    goal_checker = launch_ros.actions.Node(
        package='my_robot_pkg',
        executable='goal_checker_node',
        parameters=[{'tolerance': 0.1}],
    )
    return launch.LaunchDescription([
        goal_checker,
        launch_testing.actions.ReadyToTest(),
    ]), {'goal_checker': goal_checker}


class TestGoalCheckerIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        rclpy.init()
        cls.node = rclpy.create_node('test_driver')

    @classmethod
    def tearDownClass(cls):
        cls.node.destroy_node()
        rclpy.shutdown()

    def test_reports_reached_end_to_end(self):
        received = []
        self.node.create_subscription(
            Bool, 'goal_reached', received.append, 10)
        pub = self.node.create_publisher(
            Float32MultiArray, 'current_position', 10)

        for _ in range(50):
            rclpy.spin_once(self.node, timeout_sec=0.1)
            pub.publish(Float32MultiArray(data=[0.02, 0.0]))
            if received:
                break

        self.assertTrue(received, "goal_checker process never responded")
        self.assertTrue(received[0].data)
```

Run it with `launch_test test/test_goal_checker_integration.launch.py`, or let `colcon test` discover it automatically if the package is registered correctly (`ament_add_pytest_test` for `ament_cmake`, or placing it under `test/` and registering it in `setup.py`'s `tests_require`/entry points for `ament_python`).

## Post-shutdown checks
`launch_testing` also supports assertions that run *after* the launched processes exit — useful for checking exit codes and for scanning stdout/stderr for things like uncaught exceptions or ROS error logs that a passing-looking test might otherwise hide:

```python
@launch_testing.post_shutdown_test()
class TestProcessExit(unittest.TestCase):
    def test_exit_code(self, proc_info, goal_checker):
        launch_testing.asserts.assertExitCodes(proc_info, process=goal_checker)
```

## Avoiding flakiness across process boundaries
Integration tests are where timing assumptions bite hardest, because you're waiting on process startup, discovery, and message delivery across the DDS layer, not just an in-process callback queue. Three habits keep this manageable: always loop-with-timeout rather than a fixed sleep (as in Unit 4); use `launch_testing.actions.ReadyToTest()` rather than an arbitrary launch delay to signal "nodes are up"; and keep the number of nodes per integration test small and focused so failures are easy to attribute to a specific interaction.

## Try it yourself
Extend the launch description to add a second node (even a trivial one built from `demo_nodes_py` or similar) that publishes `current_position` on a timer, and rewrite the test to assert `goal_reached` becomes `True` purely by observing the system — without the test itself publishing anything. This is closer to a real end-to-end integration check than driving stimulus from the test process.
