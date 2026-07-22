# Python 3 for Robotics — Unit 1: Introduction

This unit orients you before the coding starts: why Python is the language you will reach for constantly in robotics, and how to get a working Python 3 environment ready on your machine so every later unit is "write code, run code" with no setup friction.

## Why Python dominates robotics scripting

Robotics work splits roughly into two layers: performance-critical code (drivers, real-time control loops, tight perception pipelines) usually written in C++, and everything else — gluing nodes together, prototyping algorithms, writing test scripts, tuning parameters, processing logged data — usually written in Python. ROS 2's client library `rclpy` gives Python full access to topics, services, actions, and parameters, so you can write a working robot node in a fraction of the lines a C++ equivalent needs. Python's read-eval-print loop (REPL) and lack of a compile step also make it the fastest way to poke at a live robot: import a message type, publish a test value, see what happens.

None of this means Python replaces C++ in robotics — it means you'll use both, and this course builds the Python half of that toolkit.

## Setting up your environment

You need Python 3 (3.10+ is a safe target for current ROS 2 distributions) and a way to keep project dependencies isolated from your system Python. Check what you have first:

```bash
python3 --version
which python3
```

Create an isolated virtual environment per project rather than installing packages globally — this avoids version conflicts between unrelated projects and keeps your system Python untouched:

```bash
python3 -m venv ~/venvs/robotics-course
source ~/venvs/robotics-course/bin/activate
python -m pip install --upgrade pip
```

With the environment active, `python` and `pip` point inside it. Deactivate any time with `deactivate`. Note: if you're following along inside a ROS 2 workspace later in the curriculum, ROS 2 has its own conventions around virtual environments (it generally expects the system Python), but for these standalone Python units a venv is the right, safe default.

## How this course is structured

The next four units build on each other in order:

1. **Python Essentials** — variables, types, and the data structures you'll use to hold sensor readings and robot state.
2. **Conditional Statements & Loops** — the control-flow tools behind every decision loop a robot makes.
3. **Methods** — packaging logic into reusable, testable functions.
4. **Python Classes & OOP** — organizing code the way ROS 2 itself organizes nodes, so your programs stay readable as they grow.

Each unit assumes you can already program — the focus is Python's specific syntax and idioms, framed with robotics-flavored examples (joint angles, sensor readings, velocity commands) rather than generic textbook exercises.

## Try it yourself

Create and activate a virtual environment, confirm `python --version` reports 3.10 or newer inside it, then write a one-line script `hello_robot.py` that prints `"Robot online, Python <version> ready."` using an f-string that reads the version from the `sys` module. Run it with `python hello_robot.py`.
