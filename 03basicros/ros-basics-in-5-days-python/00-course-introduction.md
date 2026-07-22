# ROS Basics in 5 Days (Python) — Unit 0: Course Introduction

This unit is a preview, not a technical lesson: it orients you to what ROS is, why this course is structured the way it is, and gets you looking at a running robot before you write a single line of code.

## Why programming robots has a big future

Robotics used to mean bespoke, one-off software written from scratch for every machine: a different stack for every arm, every mobile base, every drone. ROS (Robot Operating System) exists because that approach doesn't scale. It gives the robotics community a shared set of conventions — how processes talk to each other, how sensor and actuator data is represented, how packages are built and distributed — so that a driver written for a camera by one team can be reused by another team building an entirely different robot. That reuse is why ROS has become the de facto standard in robotics research, and increasingly in industrial and service robotics: warehouse robots, surgical robot prototypes, self-driving research vehicles, and countless university and hobbyist projects all speak some dialect of ROS. Learning it is less like learning one library and more like learning the plumbing that lets robotics code compose.

## Why this course, and how it differs from others

Most programming tutorials teach a language or a framework in isolation. This course is built around a different idea: **ROS Deconstruction**, covered in the next unit — breaking ROS down into a small number of core communication patterns (topics, services, actions) and drilling each one with working code, on a simulated robot, before moving to the next. You already know how to program in Python; you don't need another "hello world" course. What you need is to map concepts you already understand (functions, callbacks, message passing, client/server) onto ROS's specific vocabulary and tooling, and to build the muscle memory of the ROS command-line workflow. Each unit pairs a short explanation with hands-on exercises against a real (simulated) robot, because ROS concepts that seem abstract on a slide become obvious the moment you see a robot react to your code.

## Hands-on right now: a first look

You don't need a working ROS install to understand the shape of what's coming. A ROS 2 system is a graph of independent processes called **nodes** that exchange data. A node that publishes velocity commands to a simulated robot looks conceptually like this:

```bash
# once a simulation and the robot's control node are running:
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.2}, angular: {z: 0.0}}"
```

That one command — no custom program required — publishes a message onto a topic named `/cmd_vel`, and any robot (simulated or real) subscribed to that topic will start moving forward. Over the next four days you'll go from typing commands like this on the command line to writing the Python nodes that publish, subscribe, serve, and act on exactly this kind of data.

## What you'll learn and how

By the end of this course you will be able to: explain the core ROS communication mechanisms (topics, services, actions) and when to use each; write ROS nodes in Python using classes, including custom message and service definitions; and use ROS's built-in debugging tools (logging, `rqt` tools, `rosbag`, RViz) to figure out why a robot isn't doing what you told it to. The learning method is deliberately two-pronged: short conceptual explanations followed immediately by exercises you run yourself, plus quizzes and small "real robot project" checkpoints that string several units' worth of skills together.

## How the five days fit together

The units that follow aren't independent topics you can shuffle — they build on each other in order. Unit 1 hands you the full roadmap and vocabulary; Unit 2 gets a real package built and running; Units 3–4 and 5–6 each teach one communication mechanism from both directions (publish then subscribe, call then serve); Unit 7 steps back to show why everything is written as a class; Units 8–9 tackle the most complex mechanism last, once the simpler two are second nature; and Unit 10 arms you with the tools to diagnose whatever inevitably goes wrong along the way. If a later unit references something from an earlier one and it doesn't ring a bell, that's a signal to double back rather than push through.

## Try it yourself

Before Unit 1, write down (in a scratch file, no ROS install needed yet) one sentence each answering: what problem do you think "topics" solve, what problem do you think "services" solve, and what problem do you think "actions" solve, based only on the words themselves. You'll revisit these guesses at the end of Unit 1 and see how close your intuition was.
