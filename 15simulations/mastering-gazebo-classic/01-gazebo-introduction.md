# Mastering Gazebo Classic — Unit 1: Gazebo Introduction

Before you build anything, you need a working mental model of what Gazebo actually is, how its processes and files fit together, and how to drive the GUI without guessing. This unit takes you from a blank terminal to a running simulation you can navigate, inspect from the command line, and reason about.

## What Gazebo Is, and Why Simulate

Gazebo Classic (versions 1 through 11) is a 3D rigid-body physics simulator purpose-built for robotics: it integrates an ODE/Bullet/DART-class physics engine, sensor models (cameras, lidars, IMUs, contact sensors), and a rendering pipeline behind a single application. The payoff over hand-rolled test scripts is that you get physically plausible contact, gravity, and sensor noise "for free," so a controller or perception pipeline that works in simulation has a real chance of working on hardware — and you can crash a simulated robot into a wall as many times as you like without buying a new one.

Gazebo Classic is the predecessor to the newer "Gazebo Sim" (formerly Ignition Gazebo); Classic is feature-complete but in maintenance mode, which is exactly why it's worth learning well — a huge amount of existing ROS tooling, tutorials, and robot packages still target it, and understanding it thoroughly makes the migration path to Gazebo Sim (covered in a later course) far easier.

## Worlds and Models: The Two Core Building Blocks

Everything you place in Gazebo is described in **SDF** (Simulation Description Format), an XML dialect. A **world** is the top-level SDF document: it defines physics parameters, lighting, and which models are present.

```xml
<sdf version="1.7">
  <world name="default">
    <include><uri>model://sun</uri></include>
    <include><uri>model://ground_plane</uri></include>
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1</real_time_factor>
    </physics>
  </world>
</sdf>
```

A **model** is a reusable, self-contained description of one object — a robot, a table, a traffic cone — with its own `model.config` (metadata) and `model.sdf` (geometry, physics, plugins). Worlds `<include>` models by name; models live in a search path so any world can reference them without copy-pasting their SDF.

## Environment Variables

Gazebo locates models, meshes, and plugins through a small set of environment variables, all of which behave like `PATH` (colon-separated, searched in order):

- `GAZEBO_MODEL_PATH` — directories containing model folders (each with `model.config` + `model.sdf`).
- `GAZEBO_RESOURCE_PATH` — world files, media, and general resources.
- `GAZEBO_PLUGIN_PATH` — compiled `.so` plugin libraries (Unit 5).
- `GAZEBO_MASTER_URI` — the address `gzclient` uses to reach a running `gzserver`, useful when the two run on different machines.

```bash
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/my_ws/src/my_robot_description/models
```

## Gzserver, Gzclient, and Plugins

Gazebo splits cleanly into two processes: **gzserver** runs physics, sensors, and plugin code headlessly, while **gzclient** is the Qt GUI that connects to a running server purely to visualize and let you interact with it. The `gazebo` command is a convenience wrapper that launches both together.

```bash
gzserver --verbose worlds/empty.world   # terminal 1: physics only, no GUI
gzclient                                # terminal 2: attach a viewer
```

This split matters in practice: headless CI test rigs and cloud training runs use `gzserver` alone (faster, no rendering cost), while you reach for `gzclient` only when a human needs to look at the scene. **Plugins** are shared libraries loaded into `gzserver` at runtime that hook into the simulation loop to add custom behavior — world logic, per-model control, or sensor post-processing — without modifying Gazebo itself; you'll write your first one in Unit 5.

## The Graphical User Interface

`gzclient`'s main window has a few areas worth knowing by name: the **World** tab (left panel) lists live models and lights and lets you inspect/edit their properties; the **Insert** tab lets you drag prebuilt models from your model path into the scene; the toolbar along the top gives you translate/rotate/scale manipulators, wireframe and transparent view toggles, and play/pause/step controls for the physics clock.

You can also inspect a running simulation from the terminal without touching the GUI at all:

```bash
gz topic -l          # list all topics gzserver is publishing/subscribing
gz model -l          # list models currently in the world
gz world -i          # print info about the running world (physics, etc.)
```

## Try it yourself

Launch `gzserver` and `gzclient` against the built-in empty world, use the Insert tab to drop in a simple shape model, then pause the simulation, nudge it forward one physics step at a time with the step button, and confirm with `gz model -l` from a terminal that the model you inserted shows up by name.
