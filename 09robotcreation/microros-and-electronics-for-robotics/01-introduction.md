# MicroROS and Electronics for Robotics — Unit 1: Introduction

This unit sets the stage for the whole course: what micro-ROS actually is, why it exists alongside "regular" ROS 2, and what you'll be building — a small differential-drive robot (nicknamed PEDRITO in this course) that senses, moves, and talks to the ROS 2 graph from a microcontroller.

## Why embedded ROS at all

ROS 2 nodes normally run on a full Linux (or Windows) machine with a real DDS middleware stack — plenty of RAM, a filesystem, and a POSIX scheduler underneath them. A microcontroller (MCU) like an ESP32 or an STM32 has none of that: kilobytes of RAM, no OS (or a tiny RTOS), and hard real-time deadlines for reading sensors and driving motors. micro-ROS is a project that ports a constrained subset of the ROS 2 client library (rclc, a C API) onto MCUs, so the same publish/subscribe/service concepts you already know from desktop ROS 2 work down at the metal — just with a lighter-weight middleware (typically eProsima's Micro XRCE-DDS) instead of full DDS.

The key architectural idea you'll meet repeatedly in this course is the **micro-ROS agent**: a bridge process that runs on a "big" machine (your PC, a Raspberry Pi) and translates between the lightweight XRCE-DDS protocol spoken by the MCU and full DDS on the ROS 2 side. From the rest of the ROS 2 graph's point of view, your microcontroller just looks like another node.

## What you'll build

Across this course you assemble and program PEDRITO, a small robot with:
- Two DC motors driven through a motor controller, for locomotion
- One or more sensors (e.g. distance/IMU) wired directly to the MCU
- An ESP32-CAM module for vision, added later in the course
- A single microcontroller running micro-ROS firmware that exposes all of this as ROS 2 topics and services

By the final unit, PEDRITO will run an autonomous "don't get too close" behavior end to end, entirely triggered and observed through standard ROS 2 tooling.

## Prerequisites and mindset

You already know how to program and you're comfortable with ROS 2 concepts (nodes, topics, services, `ros2` CLI) from earlier units in this repo — this course does not re-teach those. What's new here is the embedded half: cross-compiling firmware, flashing a board, reasoning about interrupts and timing, and wiring real electronics (motors, drivers, sensors, power). Expect a slower feedback loop than pure software work — flashing a board and watching serial output takes longer than `ros2 run`, and a loose wire can look exactly like a software bug. Patience and a multimeter go a long way.

## What you'll need

- A supported microcontroller board (ESP32 is the most common target for micro-ROS tutorials and is used throughout this course)
- A USB cable and a free USB port for flashing and serial monitoring
- Basic electronics tools: breadboard, jumper wires, a small screwdriver set, and ideally a multimeter
- A Linux (or WSL) machine with a ROS 2 distribution installed, since the micro-ROS build tools and agent run there

## Try it yourself

Before touching any hardware, sketch (on paper or in a text file) the ROS 2 graph you expect PEDRITO to have by the end of the course: list the nodes, the topics they'll publish/subscribe to, and any services. You'll revisit this sketch in later units and can compare it against what you actually build — it's a useful way to notice, early, which parts of the system you don't yet understand.
