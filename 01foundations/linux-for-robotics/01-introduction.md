# Linux for Robotics — Unit 1: Introduction

This unit sets the stage for the whole course: why Linux is non-negotiable for robotics work, and how the next three units build up your command-line skills through a single running project instead of disconnected exercises.

## Why ROS lives on Linux
Robot Operating System (ROS and ROS 2) is developed and tested primarily against Linux, and Ubuntu specifically has first-class, binary-package support from the ROS build farm (see docs.ros.org for supported platforms per distribution). That is not an accident: robotics stacks need low-latency scheduling, mature real-time patches, direct access to device files under `/dev` for sensors and actuators, and a packaging ecosystem (`apt`) that can pull in hundreds of interdependent C++ libraries reliably. Windows and macOS support exists for some ROS 2 distributions, but you will hit fewer surprises, more community help, and better driver support running Linux — whether that's bare metal, dual-boot, a VM, or WSL2.

Practically, this means almost everything you do as a robotics developer — building code, launching nodes, reading sensor logs, flashing firmware, deploying to an onboard computer — happens through a Linux shell. If you're comfortable in Python or C++ but have only ever used a GUI file manager and an IDE's built-in terminal for `git commit`, this course closes that gap.

## What "the shell" actually is
The shell (commonly `bash`, increasingly `zsh`) is a program that reads text you type, interprets it as commands, and asks the kernel to execute them. Everything you can do with a mouse in a file manager, you can do faster and more repeatably from the shell — and critically, you can *script* it, which matters enormously once a robot needs to run the same startup sequence every time it powers on.

```bash
echo $SHELL          # which shell you're currently running
bash --version        # confirm bash is available
```

You don't need to memorize commands up front. You need a mental model: a shell session has a *current working directory*, an *environment* (a set of key-value variables), and a *history* of what you've run. Every unit in this course adds tools that operate on top of that model.

## Choosing how you run Linux
You don't need to wipe your machine to follow this course. Four common setups, roughly in order of fidelity to a real robot's environment:

- **Bare metal / dual-boot** — best performance and hardware access (USB, serial, GPU), but the most setup friction.
- **Virtual machine** (VirtualBox, VMware, GNOME Boxes) — safe, disposable, easy to snapshot before risky experiments; USB passthrough for real hardware is fiddly.
- **WSL2** (Windows) — convenient if Windows is your daily driver; good enough for everything in this course, though direct device access needs extra configuration.
- **Cloud VM / remote server** — no local footprint at all; you'll be using SSH (Unit 4) to reach it anyway, which is good practice for the real workflow of talking to a robot's onboard computer.

Any of these is fine for this course. Pick the one with the least friction for you and move on — the goal is shell fluency, not a perfect setup.

## How this course is structured
The remaining three units are not independent topic dumps — they're staged around one continuous "final project" thread:

- **Unit 2 (Linux Essentials)** has you set up a workspace directory that mimics how a real robot software package is laid out, and starts the final project.
- **Unit 3 (Advanced Utilities I)** has you write and run a bash script against that same workspace, and continues the final project.
- **Unit 4 (Advanced Utilities II)** has you manage the script as a background process and reach it over SSH as if it were running on an onboard robot computer, finishing the final project.

By the end, you'll have touched filesystem navigation, permissions, scripting, environment variables, process management, and remote access — the exact toolkit you'll lean on constantly once you start writing ROS 2 nodes.

## Try it yourself
Confirm your environment is ready before Unit 2: open a terminal, run `uname -a` and `lsb_release -a` (or `cat /etc/os-release` if `lsb_release` isn't installed) to see your kernel and distribution, then run `echo $HOME` and `pwd` to see where your shell starts you off. Write down the three outputs — you'll refer back to them when you build your workspace directory in the next unit.
