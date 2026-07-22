# Basics of Robotics with LIMO — Unit 1: Anatomy of a Robot

Before writing a single line of robot code, you need a mental model of what a robot actually is: a loop of sensing, computing, and acting, wired together by a communication layer. This unit builds that model using LIMO as the running example, and it sets the vocabulary the rest of the course leans on.

## The sense-think-act loop

Every robot, no matter how sophisticated, is an instance of the same loop:

1. **Sense** — sensors turn the physical world into numbers (a lidar scan, a camera frame, a wheel encoder tick).
2. **Think** — software consumes those numbers, updates some notion of state, and decides what to do next.
3. **Act** — actuators turn a decision back into physical motion (wheel torque, a servo angle).

This loop runs continuously, usually at rates between a few Hz (planning) and several hundred Hz (low-level motor control). As an experienced programmer, the useful reframe is: a robot is a distributed, real-time system where "distributed" means physical, not just networked — the sensor node, the compute node, and the actuator node are different pieces of hardware that must agree on timing and units.

## LIMO's hardware stack

LIMO is a small four-wheel-drive research platform, and its layout is representative of most wheeled robots you'll meet:

- **Onboard computer** — a single-board computer (e.g. an NVIDIA Jetson variant) running Linux, which is where your ROS nodes live.
- **Motor controller (MCU)** — a lower-level microcontroller that talks to the SBC over serial/USB, reads encoder ticks, and drives the motors in a tight closed loop. Your high-level code never touches PWM directly; it sends a target velocity to the MCU and trusts it to hold it.
- **Sensors** — a 2D lidar for obstacle detection and mapping, a depth/RGB camera for vision, wheel encoders for odometry, and often an IMU for orientation and acceleration.
- **Actuators** — four drive motors, and optionally a steering mechanism or a mounted robot arm depending on the LIMO configuration.
- **Power** — a battery plus a power distribution board; worth knowing about early because "the robot is unresponsive" is more often a battery/voltage problem than a software one.

## The role of the middleware layer

None of these components talk to each other directly in application code — they publish and subscribe to a middleware layer (ROS/ROS 2), which gives every component a name and a message type. This is the key abstraction that lets you write software against "the lidar" instead of against a specific driver's function calls. You can inspect this graph of components live:

```bash
ros2 node list
ros2 topic list
ros2 topic info /scan
```

`ros2 node list` shows every running process participating in the graph (the lidar driver node, the motor driver node, your own nodes); `ros2 topic list` shows the named channels they communicate over. This is your primary debugging tool for the rest of the course — when something isn't working, the first question is always "is the data flowing through the graph at all?"

## Degrees of freedom and the robot's workspace

A robot's capability is bounded by its **degrees of freedom (DOF)** — the number of independent ways it can move. LIMO's base has 2 controllable DOF in the plane (forward/backward speed and turning rate), even though it physically occupies 3 DOF of space (x, y, heading) — it cannot slide sideways. This distinction between *controllable* and *physical* DOF will matter directly in Unit 4 when you look at kinematics: a robot's chassis design determines which motions are even reachable, no matter how good your control software is.

## Try it yourself

With LIMO (real or simulated) running, use `ros2 node list` and `ros2 topic list` to sketch, on paper, the sense-think-act loop as an actual graph: which node publishes `/scan`, which node(s) subscribe to it, and which topic carries the commands that reach the motor controller. Then run `ros2 topic hz /scan` (or the equivalent for another sensor topic) and note the rate — does it match what you'd expect for a lidar versus a camera versus wheel odometry?
