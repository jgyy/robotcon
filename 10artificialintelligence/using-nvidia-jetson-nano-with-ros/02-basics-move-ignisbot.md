# Using NVIDIA Jetson Nano with ROS — Unit 2: Basics - Move Ignisbot

Before any deep learning enters the picture, Ignisbot needs to move on command. This unit covers the JetBot motor API, how to wrap it as a proper ROS driver node, and how to drive the robot the same way regardless of whether it's simulated or physical.

This shows how a Twist command published by any upstream node flows through the driver's conversion step down to the motors, in either simulation or hardware.

```mermaid
flowchart LR
    T["teleop_twist_keyboard / joystick / Nav2"] -->|"Twist on cmd_vel"| D[IgnisbotDriver node]
    D -->|twist_to_wheel_speeds| M[left/right motor speeds]
    M --> R["JetBot Robot() API"]
    R --> W[Physical or simulated motors]
```

## The JetBot hardware API

JetBot-style robots expose a small Python class (commonly `jetbot.robot.Robot`) that talks to the onboard motor driver over I2C. It's deliberately low-level — it knows nothing about ROS, coordinate frames, or velocities, only raw per-motor speed:

```python
from jetbot import Robot

robot = Robot()
robot.set_motors(0.3, 0.3)   # left, right, range roughly -1.0 .. 1.0
robot.forward(0.4)
robot.left(0.3)
robot.stop()
```

This is the layer you never want application code talking to directly — it's hardware-specific, it has no safety limits, and it can't be swapped for a simulated robot without touching every call site.

## From Twist to differential-drive motor commands

ROS's standard way to command a mobile base is a velocity command — `geometry_msgs/Twist` (ROS 1) or `geometry_msgs/msg/Twist` (ROS 2) — carrying linear and angular velocity, published on `cmd_vel`. Your driver node's job is to convert that into the two motor speeds the JetBot API wants, using standard differential-drive kinematics:

```python
def twist_to_wheel_speeds(linear_x: float, angular_z: float, wheel_base: float = 0.1):
    """Convert desired linear/angular velocity into normalized left/right motor commands."""
    left = linear_x - (angular_z * wheel_base / 2.0)
    right = linear_x + (angular_z * wheel_base / 2.0)
    # normalize into the [-1, 1] range the Robot() API expects
    scale = max(abs(left), abs(right), 1.0)
    return left / scale, right / scale
```

## Writing the driver node

Wrap that conversion in a subscriber so the rest of your ROS graph never needs to know a JetBot is on the other end:

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from jetbot import Robot

class IgnisbotDriver(Node):
    def __init__(self):
        super().__init__('ignisbot_driver')
        self.robot = Robot()
        self.create_subscription(Twist, 'cmd_vel', self.on_cmd_vel, 10)

    def on_cmd_vel(self, msg: Twist):
        left, right = twist_to_wheel_speeds(msg.linear.x, msg.angular.z)
        self.robot.set_motors(left, right)

def main():
    rclpy.init()
    rclpy.spin(IgnisbotDriver())
```

Note what this buys you: teleop tools (`teleop_twist_keyboard`, a joystick node, RViz's 2D nav goal, a Nav2 controller) all speak `Twist` already, so none of them need to know Ignisbot exists — they just publish to `cmd_vel` like they would for any other mobile base.

## Simulation vs. physical robot

Keep the `Twist`-in / motors-out contract identical in both worlds, and only the driver node changes: in simulation, a Gazebo (or other simulator) differential-drive plugin subscribes to `cmd_vel` and moves a simulated model; on hardware, `IgnisbotDriver` subscribes to the same topic and drives the real motors. Everything upstream — teleop, navigation, your own behavior nodes — is unaware of the swap. This is also why it's worth adding a safety timeout in the real driver (stop the motors if no `cmd_vel` has arrived in, say, 500ms) since a simulated robot won't run into a wall when a node crashes, but a physical one will.

## Try it yourself

Implement `IgnisbotDriver`, launch it alongside `teleop_twist_keyboard`, and drive Ignisbot (simulated or physical) in a square path using only keyboard input. Then kill the teleop node mid-motion and confirm your watchdog timeout stops the motors instead of leaving them running.
