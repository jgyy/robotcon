# ROS2 Control Framework — Unit 1: Course Introduction

This unit sets the stage: what "control" means for a robot, how the pieces of `ros2_control` fit together at a high level, and what you need in place before you start wiring up real controllers in later units.

## What "control" means in robotics

In everyday programming, "control" often just means program flow. In robotics it has a narrower, more specific meaning: **making a physical actuator track a desired reference value despite disturbances and imperfect models.** If you tell a motor "go to 90 degrees," something has to repeatedly compare the actual joint position against 90 degrees and adjust the commanded effort until the error shrinks to zero — that comparison-and-correction loop is control.

Two flavors matter here:

- **Open-loop control** sends a command and never checks the outcome (e.g., "run this motor at a fixed voltage for 2 seconds"). Simple, but drifts under load, friction, or battery sag.
- **Closed-loop (feedback) control** reads a sensor (encoder, IMU, force sensor), computes an error against the setpoint, and continuously corrects — the classic example being a PID controller. Almost everything in `ros2_control` is built around closed-loop control, because real robots are never perfectly predictable.

`ros2_control` doesn't invent new control theory; it gives you a standard, reusable *framework* for wiring sensors, actuators, and controllers (PID loops, trajectory followers, etc.) together in ROS 2, so you write the hardware-specific glue once and reuse the same controllers everyone else does.

## The ros2_control architecture in one picture

Three concepts you'll meet repeatedly for the rest of the course:

- **Hardware interface** — a plugin that talks to your actual actuators/sensors (real motor drivers, or a simulator standing in for them) and exposes their state/command values through a standard interface.
- **Controller manager** — a ROS 2 node that owns the real-time control loop: it reads hardware state, runs the active controllers, and writes commands back to hardware, at a fixed rate (typically hundreds of Hz).
- **Controllers** — plugins that consume state interfaces (e.g., joint position/velocity) and produce command interfaces (e.g., desired effort), implementing a specific control strategy (position control, trajectory following, differential-drive kinematics, and so on).

The data flow each cycle is: `hardware read → controllers update → hardware write`, orchestrated entirely by the controller manager. You configure *which* hardware interface and *which* controllers are loaded via YAML and XACRO — you rarely write the orchestration code yourself.

## Try before you build: inspecting a running controller

Before writing any code, it helps to see this running. Bring up any `ros2_control`-enabled demo robot (many simulators ship one, or your ROS 2 distribution's example packages include one), then inspect it from a second terminal:

```bash
ros2 control list_hardware_interfaces
ros2 control list_controllers
```

The first command shows every state/command interface the hardware interface exposes (e.g., `joint1/position`, `joint1/velocity`). The second shows which controllers are currently loaded and whether they're `active` or `inactive`. Getting comfortable reading this output now will make the Controller Manager unit much faster to absorb.

## Minimum requirements and how this course is structured

You should already be comfortable with: core ROS 2 concepts (nodes, topics, services, launch files), basic package structure (`package.xml`, `CMakeLists.txt`), URDF/XACRO fundamentals, and C++ (the hardware interface and controller units are written in C++, since the control loop is real-time-sensitive code). From here the course moves in a deliberate arc: configure an existing pipeline (Unit 2), learn to operate it (Unit 3), then write your own hardware interface (Units 4–5) and your own controller (Unit 7), before combining everything into a legged-robot project (Unit 8).

## Try it yourself

Find (or bring up) any simulated or real robot on your machine that already has `ros2_control` configured, and run `ros2 control list_controllers` and `ros2 control list_hardware_interfaces`. Write down, in your own words, what each controller you see is probably doing and which interfaces it must be claiming to do it. You'll revisit this exact exercise with full understanding by the end of Unit 3.
