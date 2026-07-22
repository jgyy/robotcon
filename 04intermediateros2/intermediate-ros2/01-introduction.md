# Intermediate ROS2 — Unit 1: Introduction

This course assumes you can already write a ROS 2 publisher, subscriber, service, and a basic launch file. What it adds is everything that separates a toy node from a node that survives in a real system: a proper build system, real launch files, parameters, threading, QoS, DDS, and lifecycle management. This unit sets expectations and gives you a single practical demo that foreshadows almost every later unit at once.

## Why "basic" ROS2 isn't enough

A minimal ROS 2 node — one publisher, one timer callback, default QoS, no parameters — works fine in isolation. It falls over the moment you need any of the following, which is to say almost immediately in a real project: multiple nodes started together with different arguments per environment (dev laptop vs. robot vs. CI), values that need to change without a rebuild, more than one thing happening inside a node at once without blocking the executor, a topic that must survive a dropped connection or must never buffer stale data, or a node that needs to be started, configured, and activated as separate, controllable steps rather than "on process launch." Every one of those is a unit in this course.

## A practical demo: from one file to a system

Take the simplest possible node — a talker that publishes an incrementing counter. Written the "basic ROS2" way, it looks like this:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Int32

class Counter(Node):
    def __init__(self):
        super().__init__('counter')
        self.pub = self.create_publisher(Int32, 'count', 10)
        self.i = 0
        self.create_timer(0.5, self.tick)

    def tick(self):
        self.pub.publish(Int32(data=self.i))
        self.i += 1

rclpy.init()
rclpy.spin(Counter())
```

Run it with `ros2 run my_pkg counter` and it works — but the publish rate, topic name, and QoS are all hardcoded, there is no way to start it alongside a matching subscriber with one command, and if `tick()` ever did something slow (a service call, a file read), the whole node would stall because it shares one thread with everything else `rclpy.spin` handles.

By the end of this course, the same node will take its rate as a declared parameter, be started from a launch file alongside its subscriber with per-environment overrides, run its publishing on a callback group that can't be blocked by other callbacks, publish with an explicit QoS profile chosen for the data it carries, and optionally be rewritten as a lifecycle node so it only starts publishing once explicitly activated.

## Course roadmap

Units 2–4 rebuild how you package and launch nodes: the `ament_python`/`ament_cmake` build system, then advanced Python launch files, then their XML/YAML equivalents. Units 5–6 make nodes configurable and responsive: parameters, then multithreading and callback management. Units 7–8 go under the hood of ROS 2's transport: Quality of Service and the DDS middleware it sits on. Unit 9 covers lifecycle (managed) nodes, which tie parameters, threading, and QoS together into a controlled node state machine. Unit 10 is a capstone project — a laser-scan-based shape detector — that pulls several of these threads together in one package.

## Try it yourself

Before starting Unit 2, run `ros2 pkg list` and pick any package you already have installed. Run `ros2 node list`, `ros2 topic list`, and `ros2 topic info <topic> --verbose` against one of its running nodes (or a demo like `demo_nodes_cpp`'s talker/listener). The `--verbose` flag on `topic info` shows you the QoS profile in use — note it down; you'll understand every field in it by Unit 7.
