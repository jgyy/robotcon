# Basic Kinematics of Mobile Robots — Unit 1: Introduction to the Course

This unit orients you before the math starts: what "kinematics" buys you as a robotics engineer, what a working demo looks like end to end, and what you need installed and understood before Unit 2 gets serious.

## What is this course about?
Kinematics is the study of motion without worrying about the forces that cause it — given a robot's wheel speeds or joint velocities, where does it end up, and how fast is it getting there? This course builds that mapping for mobile robots specifically: differential-drive, car-like (Ackermann), and omnidirectional platforms. You'll go from raw actuator commands to predicted robot pose, and back the other way — from a desired path to the commands that produce it. That two-way mapping (forward kinematics and inverse/control) is the foundation every navigation stack, from a warehouse AMR to a Mars rover's local planner, sits on top of.

Contrast this with **dynamics** (covered in a separate course), which factors in mass, inertia, friction, and motor torque. Kinematics ignores all of that and asks a purely geometric question: "if the wheels turn at these rates, how does the body move?" It's a simplification, but it is accurate enough at low-to-moderate speeds that nearly all mobile robot motion controllers are built on kinematic models, not dynamic ones.

## A hands-on experience
Here's the shape of the problem you'll be able to solve by the end of the course. A differential-drive robot with left/right wheel angular velocities `ω_l`, `ω_r`, wheel radius `r`, and axle separation `L` has body-frame velocities:

```
v = r * (ω_r + ω_l) / 2          # linear speed
ω = r * (ω_r - ω_l) / L          # angular speed (yaw rate)
```

And integrating those over time (odometry) gives you a pose estimate `(x, y, θ)`. A minimal Python sketch of that integration loop:

```python
import math

def integrate_odometry(x, y, theta, v, omega, dt):
    x += v * math.cos(theta) * dt
    y += v * math.sin(theta) * dt
    theta += omega * dt
    return x, y, theta

# 0.2 m/s forward, turning at 0.1 rad/s, for one 50 ms control tick
x, y, theta = integrate_odometry(0.0, 0.0, 0.0, v=0.2, omega=0.1, dt=0.05)
print(f"x={x:.4f} y={y:.4f} theta={theta:.4f}")
```

By Unit 3 you'll know exactly where the `v` and `ω` equations above come from, why this simple integration accumulates error (drift), and how a real ROS 2 node structures this as a control loop against `/cmd_vel` and `/odom`.

## Outline of the course
- **Unit 2 — Rigid Body Motions**: the math toolbox (reference frames, rotation matrices, homogeneous transforms) used to describe *any* robot's pose, not just wheeled ones.
- **Unit 3 — Kinematics of Nonholonomic Robots**: unicycle, differential-drive, and car-like models; wheel-encoder odometry; ROS `Twist`/`Odometry` messages.
- **Unit 4 — Kinematics of Holonomic Robots**: omnidirectional platforms that can move in any direction regardless of heading.
- **Unit 5 — Kinematic Control**: closing the loop — driving a real (or simulated) robot to a goal pose using open-loop and feedback control laws.

Each unit builds directly on the last: the transform math from Unit 2 is the language Units 3 and 4 use to write down kinematic models, and Unit 5 uses those models to compute control commands.

## Requirements for the course
- Comfort with Python or C++ at a working-programmer level (this course won't re-teach syntax).
- Linear algebra: vectors, matrix multiplication, and ideally a passing familiarity with matrix inverses/transposes. Trigonometry (sin/cos/atan2) will be used constantly.
- No prior ROS experience is assumed, but having ROS 2 installed (any recent distribution) and being able to run `ros2 topic echo` will make the ROS-flavored subsections concrete rather than abstract. A simulator (Gazebo, or even just a small custom Python simulator) is useful but not mandatory — the exercises can be done with pen, paper, and a Python REPL if needed.

## Acknowledgments
This course structure follows the standard progression used across many mobile-robotics curricula (rigid-body math → nonholonomic models → holonomic models → control), a sequence popularized by robotics educators and textbooks such as Siegwart, Nourbakhsh & Scaramuzza's *Introduction to Autonomous Mobile Robots*. Thanks to that broader body of open robotics teaching material for establishing the vocabulary and worked examples this course builds on.

## Try it yourself
Run the `integrate_odometry` snippet above for 200 steps of `dt=0.05` s with constant `v=0.3` m/s and `ω=0.2` rad/s, and plot or print the resulting `(x, y)` trail. Notice the path curves — you've just computed your first robot trajectory from body-frame velocities alone, with zero mention of motors, mass, or friction. That's kinematics.
