# ROS2 Basics in 3 Days (Rust) — Unit 1: Introduction to the Course

This unit orients you before any code is written: why Rust is a serious choice for ROS 2 development, what the three-day arc looks like, and what has to be installed and verified on your machine first. Treat it as a checklist and a map, not a lecture.

## Why Rust for ROS 2
ROS 2's official client libraries are `rclcpp` (C++) and `rclpy` (Python), but a community-maintained binding, `rclrs` (part of the `ros2_rust` project), exposes the same underlying `rcl` C API to Rust. The appeal for someone who already knows Rust is the same appeal Rust has everywhere else: no garbage collector, memory and data-race safety enforced at compile time, and a strict type system — properties that matter in robotics, where a node that panics mid-flight or leaks memory over a 12-hour mission is a real failure mode, not an inconvenience. The trade-off is ecosystem maturity: `ros2_rust` covers nodes, topics, services, and parameters solidly, but some higher-level tooling (rich launch introspection, some client library conveniences) is still ahead of where C++/Python are. This course sticks to the well-supported core.

## What this course covers, and what it doesn't
Over the three units that follow, you'll go from an empty workspace to a working publisher/subscriber pair written entirely in Rust, launched through a standard ROS 2 launch file. Unit 2 covers how ROS 2 packages are structured and built (including how Cargo fits into the `colcon` build), what a node and a client library are, and how launch files tie multiple nodes together. Unit 3 is entirely about topics — the publish/subscribe messaging pattern that underlies most ROS 2 communication — including writing your own message types. This course does not cover services, actions, or parameters in depth; those build directly on what you learn here and belong in a follow-on course.

## Environment check
Before Unit 2, confirm you have:
- A working ROS 2 installation (native Linux or a container/dev image) with the standard command-line tools (`ros2`, `colcon`) on your `PATH`.
- A recent stable Rust toolchain, managed via `rustup`, with `cargo` available.
- The `ros2_rust` build tooling cloned into your workspace `src/` (it provides the `cargo-ament-build` cargo plugin and the message-generation crates that `colcon` needs to compile Rust packages alongside C++/Python ones).

Verify the pieces talk to each other:

```bash
ros2 doctor --report        # confirms your ROS 2 environment is sane
cargo --version              # confirms the Rust toolchain is installed
ros2 pkg list | grep rust    # once ros2_rust is built, rust-related packages should appear
```

## A quick practical demo
To see the destination before you build the road: if you have `ros2_rust`'s examples built in your workspace, run its publisher and subscriber examples in two terminals and watch messages flow between two independent OS processes written in Rust, coordinated entirely by ROS 2 — no shared memory, no manual sockets, just topic names and message types. That publish/subscribe mechanic is exactly what you'll build from scratch in Unit 3.

## Try it yourself
Run `cargo --version` and `ros2 doctor --report` on your machine and save the output. If either command fails or reports warnings, resolve them now — Unit 2 assumes both toolchains are working before you create your first package.
