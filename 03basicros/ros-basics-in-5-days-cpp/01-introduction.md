# ROS Basics in 5 Days (C++) — Unit 1: Introduction

This unit is a map, not a lesson: it tells you what ROS is, how the next eleven units are organized, and what you need on your machine before you touch any code. Skim it once now and come back to it whenever you lose the thread of why a later unit exists.

## What "ROS" actually is
ROS (Robot Operating System) is not an operating system in the kernel sense — it's a middleware and toolset that sits on top of Linux. It gives you three things you would otherwise have to build yourself for every robot project: a message-passing layer between processes (so a camera driver, a planner, and a motor controller can talk without knowing about each other's internals), a large ecosystem of reusable packages (drivers, transforms, navigation, manipulation), and a common set of developer tools (build system, CLI introspection, visualization, logging, simulation hooks). You are learning C++ ROS specifically because most performance-sensitive robotics code — drivers, control loops, perception pipelines — is written in C++, while Python is more common for glue code and quick scripts.

## How the five days map to this course
The units are grouped around ROS's three communication patterns, which is also how you should think about designing any robot system:
- **Foundations (Units 2-3)** — vocabulary and the pieces of the graph: nodes, parameters, environment.
- **Topics (Units 4-5)** — the fire-and-forget, many-to-many streaming pattern used for sensor data and continuous state.
- **Services (Units 6-7)** — the request/response pattern used for one-off, synchronous calls.
- **C++ structure (Unit 8)** — how to stop writing throwaway procedural nodes and start writing maintainable ones.
- **Actions (Units 9-10)** — the pattern for long-running, cancellable, feedback-producing goals (navigation, arm motion).
- **Debugging (Unit 11)** and **Appendix (Unit 12)** — the tools and setup you'll lean on constantly but that don't fit neatly into "day 1 through day 5."

## What you should have installed
You need a Linux machine (native or VM) with a ROS distribution installed, a C++17-capable compiler (g++ or clang), and the build tooling that ships with your distro (`catkin` for ROS 1, `colcon` for ROS 2). Unit 12 walks through installation in detail if you haven't done this yet — it's fine to skip ahead to it now and come back, since nothing in Units 2-11 depends on unit ordering for setup.

## How to work through this course
Each unit after this one follows the same shape: a concept explanation, then working code you type and run yourself, then a small self-check. Don't just read the C++ — type it. ROS bugs are overwhelmingly about *wiring* (wrong topic name, message type mismatch, node never spinning) rather than algorithmic mistakes, and you only build the instinct to spot those by running code and watching it fail.

## Try it yourself
Before Unit 2, confirm your ROS install works end to end: open two terminals, and in one run whatever "hello world" demo your distro ships (e.g. a talker/listener demo node), and in the other use the CLI to list running nodes and topics. If you see the demo nodes and at least one topic connecting them, your environment is ready for the rest of this course.
