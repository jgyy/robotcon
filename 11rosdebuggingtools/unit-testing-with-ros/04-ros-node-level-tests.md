# Unit Testing with ROS — Unit 4: ROS-Node Level Tests

Library tests (Unit 3) verify plain functions, but most bugs in practice live at the boundary where that logic gets wired into a ROS node — wrong topic name, wrong QoS, a callback that never gets called, a service that returns the wrong type. This unit tests a single node as a ROS citizen, still without bringing up a whole system.

## The node under test
Wrap the Unit 2/3 logic in a minimal node:

```python
# my_robot_pkg/goal_checker_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import Bool, Float32MultiArray
from .robot_math import is_goal_reached


class GoalCheckerNode(Node):
    def __init__(self):
        super().__init__('goal_checker')
        self.declare_parameter('tolerance', 0.05)
        self.goal = (0.0, 0.0)
        self.reached_pub = self.create_publisher(Bool, 'goal_reached', 10)
        self.create_subscription(
            Float32MultiArray, 'current_position', self.on_position, 10)

    def on_position(self, msg):
        tol = self.get_parameter('tolerance').value
        current = (msg.data[0], msg.data[1])
        reached = is_goal_reached(current, self.goal, tol)
        self.reached_pub.publish(Bool(data=reached))
```

## Instantiating a node inside a test
Because a `Node` needs `rclpy` initialized and, for real work, needs its executor spun, node-level tests follow a fixed pattern: init once for the test class, create/destroy the node per test, shut down once at the end.

```python
# test/test_goal_checker_node.py
import unittest
import rclpy
from my_robot_pkg.goal_checker_node import GoalCheckerNode


class TestGoalCheckerNode(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        rclpy.init()

    @classmethod
    def tearDownClass(cls):
        rclpy.shutdown()

    def setUp(self):
        self.node = GoalCheckerNode()

    def tearDown(self):
        self.node.destroy_node()

    def test_default_tolerance_parameter(self):
        self.assertAlmostEqual(
            self.node.get_parameter('tolerance').value, 0.05)
```

This already catches real bugs: a typo in `declare_parameter`'s name, a wrong default value, a publisher created on the wrong topic — all without needing a second process.

## Driving the node and observing its output
To test behavior (not just construction), publish a message into the node and spin briefly to let callbacks fire, then check what it published in response. A second, plain `rclpy.node.Node` acting as a test harness — publishing stimulus and subscribing to the result — is the standard pattern:

```python
from std_msgs.msg import Bool, Float32MultiArray

def test_publishes_true_when_goal_reached(self):
    harness = rclpy.create_node('test_harness')
    received = []
    harness.create_subscription(Bool, 'goal_reached', received.append, 10)
    pub = harness.create_publisher(Float32MultiArray, 'current_position', 10)

    pub.publish(Float32MultiArray(data=[0.01, 0.0]))

    # spin both nodes briefly so pub -> callback -> pub round-trips
    for _ in range(20):
        rclpy.spin_once(self.node, timeout_sec=0.05)
        rclpy.spin_once(harness, timeout_sec=0.05)
        if received:
            break

    self.assertTrue(received, "no message received within timeout")
    self.assertTrue(received[0].data)
    harness.destroy_node()
```

The bounded loop-with-timeout (rather than a fixed `time.sleep`) is the key technique for avoiding flaky ROS tests: you wait *just long enough* for the message to arrive instead of guessing a sleep duration, and you still fail deterministically if it never does.

## Testing parameters and services in isolation
The same pattern extends to parameter reconfiguration and service servers: call `node.set_parameters([...])` directly and re-check behavior, or create a client node that calls `node`'s service and asserts on the response — no launch file needed, because both node objects live in the same test process.

## Try it yourself
Add a test that sets the `tolerance` parameter to `0.5` on the node (via `self.node.set_parameters`), publishes a position far from the goal but within that relaxed tolerance, and asserts `goal_reached` still comes back `True`. This checks that runtime parameter changes actually take effect, not just the declared default.
