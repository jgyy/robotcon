# Robotics Introduction For High Schoolers Part 3 — Unit 1: Anatomy of a Robot

Before you can program a robot, you need a mental map of what a robot actually *is*: which parts sense the world, which parts think, and which parts act on decisions. This unit builds that map so the rest of the course (sensors, actuators, kinematics, odometry) has somewhere to attach.

The diagram below shows the sense-think-act loop as a continuous cycle, where an actuator's effect on the world becomes the next thing a sensor picks up.

```mermaid
flowchart LR
    Sense[Sense<br/>cameras, lidar, encoders, IMUs] --> Think[Think<br/>compute stack: MCU, SBC, ROS nodes]
    Think --> Act[Act<br/>motors, servos, grippers]
    Act --> World[World / Environment]
    World --> Sense
```

## The sense-think-act loop

Almost every robot, from a Roomba to a warehouse arm, runs the same basic cycle:

1. **Sense** — read the world through sensors (cameras, lidar, encoders, IMUs).
2. **Think** — turn raw sensor data into a decision (a control program, a planner, a neural network).
3. **Act** — send commands to actuators (motors, servos) that change the world.

This loop repeats continuously, often tens to hundreds of times per second. A line-following robot might sense a camera frame, decide "drift left," and command the left wheel to slow down, all within milliseconds. When you later write ROS nodes, you are almost always implementing one stage of this loop: a sensor driver node publishes data, a logic node subscribes and decides, and a driver node turns decisions into motor commands.

```
[ Sensors ] --topics--> [ Compute / Logic ] --topics--> [ Actuators ]
   lidar,                 your Python node,               motors,
   camera,                 planners, filters                servos,
   encoders                                                  grippers
```

## Mechanical components

Strip away the electronics and every robot is built from a handful of mechanical primitives:

- **Chassis / links** — the rigid bodies that give the robot its shape (a wheeled base, an arm segment).
- **Joints** — the connections between links. A *revolute* joint rotates (like an elbow); a *prismatic* joint slides (like a linear rail). A wheeled mobile robot mostly uses revolute joints at the wheels; a robot arm is a chain of revolute (and sometimes prismatic) joints.
- **End effectors** — whatever the robot uses to interact with the world: a gripper, a suction cup, a pen, a camera mount.
- **Kinematic chain** — the ordered sequence of links and joints from the robot's base to its end effector. Later in this course you'll learn how to describe wheeled robots (Ackermann, differential, omnidirectional) and arm robots as different kinds of kinematic chains.

## The compute stack

Every robot needs something running the "think" stage, but that job is usually split across layers:

- **Microcontrollers (MCUs)** — cheap, real-time chips (Arduino-class, STM32) that talk directly to motors and low-level sensors and enforce tight timing loops (e.g., PID control at 1 kHz).
- **Single-board computers (SBCs)** — Linux machines (Raspberry Pi, Jetson, an industrial PC) that run higher-level logic, perception, and networking. This is where ROS nodes typically live.
- **Middleware (ROS)** — the glue that lets many independent programs (nodes) exchange sensor data and commands without every node needing to know about every other node. A driver node doesn't know or care which node subscribes to its lidar topic; it just publishes.

A simulated robot like Limo, which you'll use throughout this course, mirrors this stack in software: a physics engine stands in for the mechanics, and simulated sensor/actuator nodes stand in for the microcontroller layer, so the same ROS code you write can later run on real hardware with minimal changes.

## Power and energy

Every actuator draws current, and every sensor and computer draws power too. On real robots, power is a design constraint you must respect from day one:

- Batteries have a voltage (which motors and boards are rated for) and a capacity (how long you can run before recharging).
- Motors under load can spike current draw well above their rated value — this is why real robots have fuses, current limiters, and separate power rails for logic vs. motors.
- In simulation this constraint mostly disappears, but it's worth knowing it exists: a robot that "works perfectly" in simulation can still fail on hardware because of a browned-out motor driver.

## Try it yourself

Pick any household or fictional robot you know (a robot vacuum, a drone, a warehouse picking arm). On paper, list: (1) at least three sensors it likely needs, (2) at least two actuators, (3) whether its main kinematic chain looks more like a wheeled base or an arm, and (4) one thing that would go wrong if its compute stack (the "think" stage) froze for two seconds while sensing and acting kept running.
