# Basic Kinematics of Mobile Robots — Unit 5: Kinematic Control

This closing unit puts everything together: given the kinematic models from Units 3–4, how do you compute the `(v, ω)` commands that actually drive a robot to a goal pose? You'll build both an open-loop and a feedback controller and see concretely why one of them is the one you'll actually use.

## Introduction
"Control" here means the algorithm that turns a *goal* (a target pose, or a point on a path) into the velocity command you publish on `/cmd_vel` this control tick. Every navigation stack — however sophisticated its global planner — bottoms out in a kinematic controller like the ones in this unit, running at tens of Hz, converting "where do I want to be next" into "what should my wheels do right now." Getting this layer right matters more than it might seem: a bad low-level controller will make even a perfect path plan produce jerky, imprecise, or unstable motion.

## Starter code
A minimal ROS 2 control node needs three pieces: a subscription to odometry (to know current pose), a publisher for velocity commands, and a timer that runs the control law periodically. In Python (rclpy):

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from nav_msgs.msg import Odometry

class KinematicController(Node):
    def __init__(self):
        super().__init__('kinematic_controller')
        self.pose = None  # (x, y, theta)
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.create_subscription(Odometry, '/odom', self.odom_cb, 10)
        self.create_timer(0.05, self.control_loop)  # 20 Hz

    def odom_cb(self, msg):
        q = msg.pose.pose.orientation
        theta = 2 * math.atan2(q.z, q.w)   # yaw from quaternion (planar case)
        self.pose = (msg.pose.pose.position.x, msg.pose.pose.position.y, theta)

    def control_loop(self):
        if self.pose is None:
            return
        v, omega = self.compute_command(self.pose)
        cmd = Twist()
        cmd.linear.x = v
        cmd.angular.z = omega
        self.cmd_pub.publish(cmd)
```

Everything else in this unit is what goes inside `compute_command`.

## Open loop control
The simplest possible controller: precompute a fixed sequence of `(v, ω, duration)` commands from the kinematic model and play them back on a timer, without ever looking at the actual measured pose. For example, "drive straight for 3 seconds, then rotate 90° over 1.5 seconds" computed purely from the unicycle equations.

```python
def open_loop_command(elapsed_time):
    if elapsed_time < 3.0:
        return 0.2, 0.0          # drive straight
    elif elapsed_time < 4.5:
        return 0.0, math.pi / 3  # rotate ~90 deg over 1.5s
    return 0.0, 0.0
```

This works in simulation with a perfect model, and fails on real hardware almost immediately: wheel slip, encoder noise, uneven floors, and battery-voltage sag all mean the *actual* trajectory diverges from the planned one, and open-loop control has no way to notice or correct that — error just accumulates unboundedly, exactly like the odometry drift you saw in Unit 1.

## Feedback control
A feedback controller instead computes the command *from the current error* between measured pose and goal pose, every tick, so it continuously self-corrects. A standard formulation for driving a unicycle-model robot to a goal `(x_g, y_g)`:

```python
def feedback_command(pose, goal, k_rho=0.5, k_alpha=1.5):
    x, y, theta = pose
    x_g, y_g = goal
    dx, dy = x_g - x, y_g - y
    rho = math.hypot(dx, dy)                       # distance to goal
    alpha = math.atan2(dy, dx) - theta              # heading error, wrapped
    alpha = math.atan2(math.sin(alpha), math.cos(alpha))  # wrap to [-pi, pi]

    v = k_rho * rho
    omega = k_alpha * alpha
    return v, omega
```

`rho` (distance) drives forward speed to zero as the robot arrives; `alpha` (heading error, properly wrapped to avoid a 359°/1° discontinuity) drives turning to zero once the robot is pointed at the goal. `k_rho` and `k_alpha` are gains you tune: too low and the robot crawls or ignores heading error; too high and it overshoots or oscillates. This is a proportional (P) controller — the same idea generalizes to PID by adding integral and derivative terms on `rho`/`alpha` if steady-state error or oscillation becomes a problem.

## Hands-on practice!
Implement `feedback_command` in a small simulation loop: start the robot at `(0, 0, 0)`, set a goal at `(2.0, 1.0)`, and at each of ~200 ticks (`dt = 0.05` s) call `feedback_command`, then feed the result through `integrate_odometry` from Unit 1 to update the simulated pose. Log `rho` each tick and confirm it decreases monotonically toward zero (if it doesn't, your gains are likely too aggressive — try halving `k_alpha` first, since heading overcorrection is the usual cause of oscillation). Then compare against the open-loop controller: inject a small constant bias (e.g. multiply `v` by 0.9 to simulate wheel slip) into the integration step and rerun both — the feedback controller should still converge; the open-loop one will miss the goal by a margin proportional to the bias.

## Conclusions
You've now built the full pipeline this course set out to teach: rigid-body math (Unit 2) to describe pose and frames, kinematic models (Units 3–4) to relate actuator commands to body velocity, and a feedback control law (this unit) that closes the loop between measured pose and commanded velocity. This proportional pose controller is deliberately simple — production navigation stacks (e.g. Nav2's controller plugins, documented at docs.ros.org) add obstacle avoidance, path-following rather than single-goal-seeking, and more robust gain scheduling — but the underlying kinematic relationships are exactly what you derived here.

## Try it yourself
Modify `feedback_command` so the robot also arrives at a *desired final heading* `theta_g`, not just a position — you'll need a second heading-error term (final-heading error, separate from `alpha`) that only dominates once `rho` is small, otherwise the robot will spin to face the goal orientation before it has even started driving toward it.
