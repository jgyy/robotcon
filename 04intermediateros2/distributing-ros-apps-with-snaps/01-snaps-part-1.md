# Distributing ROS Apps with Snaps — Unit 1: Snaps - Part 1

Robotics teams often ship software the way it was built ten years ago: copy a compiled workspace onto the robot over SSH, hope the target has the right `apt` packages, and pray nobody upgrades the OS. This unit introduces snaps as a repeatable, self-contained packaging format for ROS and ROS 2 applications, and walks through building your first one.

## What a snap actually is

A snap is a compressed, read-only filesystem image (a squashfs) containing your application plus every library and runtime dependency it needs, mounted read-only at `/snap/<name>/<revision>` and run under confinement (a restricted set of kernel and filesystem permissions, similar in spirit to a container). Because the snap carries its own dependencies, it runs the same way on Ubuntu Server, Ubuntu Core (the IoT/robotics-focused OS), and any of the dozens of Linux distributions that support `snapd` — you are not relying on the target machine having the right `ros-humble-*` packages already installed.

For robotics this solves a specific pain point: a robot fleet running different OS images, or a lab machine with a different ROS distro installed than the one your code was built against, can all install the exact same snap and get identical behavior. Snaps also support **transactional, automatic updates with rollback** — if a new revision fails to start, `snapd` can revert to the last working one, which matters a lot more on a robot than on a laptop.

## Anatomy of `snapcraft.yaml`

Every snap is described by a single YAML file, `snap/snapcraft.yaml`, at the root of your project. The three concepts to internalize are **parts** (how to build the software), **apps** (what gets exposed as runnable commands), and **confinement/base** (the security and runtime environment):

```yaml
name: turtle-driver
version: '0.1'
summary: Minimal ROS 2 driver snap
description: |
  Packages a ROS 2 node as a snap for distribution to robot fleets.
base: core22
confinement: strict
grade: stable

parts:
  turtle-driver:
    plugin: colcon
    source: .
    colcon-packages: [turtle_driver]
    build-packages: [ros-humble-rclcpp]
    stage-packages: [ros-humble-rclcpp]

apps:
  turtle-driver:
    command: opt/ros/humble/bin/ros2 launch turtle_driver driver.launch.py
    plugs: [network, network-bind]
```

The `colcon` plugin (provided by `snapcraft`'s ROS support) knows how to run `colcon build` inside the snap's build environment and stage the resulting install space. `base: core22` pins the underlying Ubuntu runtime the snap builds against — pick whichever `core2X` release lines up with the ROS distro you're targeting. `plugs` are the confinement interfaces your app needs (network access, hardware, etc.) — strict confinement denies everything not explicitly plugged.

## Building and running your first snap

With `snapcraft` installed (`sudo snap install snapcraft --classic`), building is a single command run from the directory containing `snap/snapcraft.yaml`:

```bash
snapcraft                       # builds inside a managed LXD/Multipass VM by default
ls *.snap                       # turtle-driver_0.1_amd64.snap

sudo snap install --dangerous ./turtle-driver_0.1_amd64.snap
snap list                       # confirm it's installed
turtle-driver                   # the app's binary is on PATH as <snap-name>
```

The `--dangerous` flag is required for locally-built, unsigned snaps — once you publish through the Snap Store, installs are signed and verified automatically and you drop that flag. Use `snap logs turtle-driver` and `snap run --shell turtle-driver` while iterating; the shell drops you inside the confined environment so you can poke at paths and env vars exactly as your app sees them.

## Iterating without full rebuilds

Rebuilding from scratch on every change is slow. `snapcraft` supports incremental lifecycle steps you can target directly:

```bash
snapcraft pull      # fetch sources for all parts
snapcraft build     # compile (colcon build under the hood)
snapcraft stage      # copy build output into a staging area
snapcraft prime      # assemble the final snap payload
snapcraft pack        # squash the primed tree into a .snap file
```

Running `snapcraft clean turtle-driver` clears just one part's build state rather than the whole project — useful when you've only touched one ROS package in a multi-package workspace.

## Try it yourself

Take a ROS 2 package you already have (or `ros2 pkg create --build-type ament_cmake my_snap_demo` a trivial talker/listener pair). Write a `snap/snapcraft.yaml` for it using the `colcon` plugin, build it with `snapcraft`, install it locally with `--dangerous`, and confirm with `ros2 topic echo` that the node runs identically to running it from a normal `colcon build` workspace. Then run `snap logs <name>` to see where its output goes.
