# Basic Kinematics of Mobile Robots — Unit 4: Kinematics of Holonomic Robots

Unit 3 was all about robots that can't move sideways. This unit covers the opposite case — omnidirectional platforms (mecanum or omni-wheel bases) that can translate in any direction independent of their heading — and shows why that extra freedom simplifies control at the cost of mechanical complexity.

## Introduction
A robot is **holonomic** when its controllable degrees of freedom equal its degrees of freedom in the world — for a planar robot, that means it can independently command `ẋ`, `ẏ`, and `θ̇` at any instant, with no coupling between them. Omni-wheel and mecanum-wheel platforms achieve this mechanically: each wheel has rollers set at an angle so it can contribute force in a direction other than purely "forward," and combining three or four such wheels gives full planar mobility. The payoff is significant for control: you can drive sideways into a loading dock, rotate in place while translating, or crab-walk along a wall — none of which a differential-drive or car-like robot can do without complex maneuvering.

## Kinematic model
For a holonomic robot, the kinematic model is just the trivial mapping between the requested body velocity and pose rate — there's no constraint equation coupling `θ̇` to `ẋ`/`ẏ` the way `θ̇ = ω` was tied to heading direction in the unicycle model:

```
ẋ = vx
ẏ = vy
θ̇ = ω
```

where `vx, vy` can be specified independently of the robot's current heading (in the robot's own frame) or the world frame, and `ω` is set independently of both. The "interesting" kinematics for a holonomic robot live one level down, in the mapping from `(vx, vy, ω)` to individual wheel speeds — for a 3-wheel omni platform with wheels at 120° apart and roller angle `γ`, that mapping is a fixed 3x3 matrix multiply; for a 4-wheel mecanum base it's a 4x3 matrix. The important conceptual point for this course is simpler: at the body-frame level, holonomic robots decouple translation from rotation completely, which is exactly the nonholonomic constraint that Unit 3's robots didn't have.

## Basic motions
Because `vx`, `vy`, and `ω` are independent, a holonomic robot's motion vocabulary decomposes cleanly into three primitives you can command in any combination:
- **Pure translation** — `vx ≠ 0` and/or `vy ≠ 0`, `ω = 0`: the robot slides without turning.
- **Pure rotation** — `vx = vy = 0`, `ω ≠ 0`: spins in place around its own center.
- **Combined motion** — any nonzero combination, e.g. sliding sideways while slowly rotating to keep a camera pointed at a fixed target.

```python
# holonomic body-frame command: slide right at 0.2 m/s while rotating slowly
vx, vy, omega = 0.0, -0.2, 0.1
```

A differential-drive robot has no way to express "slide right" at all — this is the practical payoff of holonomic mobility.

## Motion in the robot's frame
Commands are usually most naturally expressed in the **robot's own frame**: "forward," "left," "rotate clockwise" all make sense relative to the chassis regardless of which way the robot happens to be facing in the world. This is what a `Twist` message on `/cmd_vel` represents for a holonomic robot too — `linear.x` and `linear.y` are both meaningful now (unlike for a differential-drive robot, where `linear.y` is always zero), plus `angular.z`:

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.1, y: -0.15}, angular: {z: 0.0}}" --once
```

## Motion in the absolute frame
Sometimes you want to command motion relative to the **world/map frame** instead — "move north at 0.3 m/s" regardless of which way the robot is currently facing. Converting a world-frame command into the robot-frame command it needs to send to its wheels requires exactly the rotation-matrix machinery from Unit 2, using the robot's current heading `θ`:

```python
import numpy as np

def world_to_body(vx_world, vy_world, theta):
    R_inv = np.array([[ np.cos(theta), np.sin(theta)],
                       [-np.sin(theta), np.cos(theta)]])
    return R_inv @ np.array([vx_world, vy_world])

vx_body, vy_body = world_to_body(vx_world=0.2, vy_world=0.0, theta=1.57)
# facing world +y (theta=90 deg), "world +x" motion is now "body -y"
```

This body/world distinction is a common source of subtle bugs: a holonomic controller that mixes up which frame a velocity command is expressed in will drive correctly only when the robot happens to be facing one particular direction, and drift sideways everywhere else.

## Conclusions
Holonomic robots trade mechanical complexity (angled rollers, more actuators) for kinematic simplicity: translation and rotation are fully decoupled, so there is no equivalent of the nonholonomic constraint equations from Unit 3. The main new skill this unit adds is converting velocity commands between the robot frame and the world frame using the rotation math from Unit 2 — a step that's unnecessary for a unicycle-type robot (where "forward" and "heading" are the same thing by construction) but essential here.

## Try it yourself
Write `body_to_world(vx_body, vy_body, theta)` as the inverse of `world_to_body` above, and verify numerically that composing them (`world_to_body(*body_to_world(vx, vy, theta), theta)`) returns your original `(vx, vy)` for several different `theta` values.
