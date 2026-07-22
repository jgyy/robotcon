# Web Development for ROS 2 — Unit 1: Introduction

This course teaches you to build web front-ends that talk to a live ROS 2 robot: HTML/CSS for structure and style, JavaScript for behavior, and Rosbridge as the bridge that turns ROS 2 topics and services into ordinary WebSocket messages a browser can consume. This unit sets expectations before you write a line of code.

## What is this course about?
A robot with no interface is only usable by the person who wrote its code. A web interface changes that: anyone with a browser — on a phone, a tablet, a wall-mounted display — can see the robot's state and send it commands, with no ROS 2 install on the client side at all. That last point is the core idea you'll build toward: **the browser never talks to ROS 2 directly**. It talks to Rosbridge over a WebSocket, and Rosbridge is the only piece that actually speaks the ROS 2 graph. Everything in this course — HTML, CSS, JavaScript, React — exists to build a good client for that WebSocket connection.

## What will you learn?
Roughly in order: how to serve a web page locally, how to structure it with HTML and style it with CSS, how to make it interactive with JavaScript (variables, functions, objects, arrays), how to wire that JavaScript to ROS 2 topics through Rosbridge, and finally how to rebuild the same ideas as reusable React components instead of hand-written DOM manipulation. Each unit's "Time to practice" exercise builds on the last, so by the end you'll have a small robot control panel: buttons that publish velocity commands, and a live read-out of sensor data such as laser scans.

## Course Outline
The ten units fall into three clear phases. Units 2-6 are static web development: serving pages, structuring them with HTML, and styling them with CSS — no ROS 2 involved yet, just the standard front-end skills any web developer needs. Unit 7 introduces JavaScript and, with it, your first real Rosbridge connection: this is the pivot point where the panel stops being a mockup and starts actually talking to a robot. Unit 8 deepens JavaScript with arrays, needed once you're handling list-shaped sensor data like laser scans. Units 9-10 rebuild the same panel's ideas in React, trading hand-written DOM updates for a component model that scales better as the panel grows. Treat each unit's page as a running project rather than a one-off: the HTML you write in Unit 3 is the same file you style in Units 5-6 and script in Unit 7.

## Robots used in this course
Any ROS 2 robot that publishes standard topics works — a differential-drive mobile robot publishing `/cmd_vel` (`geometry_msgs/msg/Twist`) and a laser scan on `/scan` (`sensor_msgs/msg/LaserScan`) is the common case used throughout this course's examples. You do not need physical hardware: a simulated robot in Gazebo or any other ROS 2-compatible simulator exposes the exact same topics over Rosbridge as a real one, since Rosbridge only cares about the ROS 2 graph, not what's driving it underneath.

## Requirements for the course
You should be comfortable programming already (this course assumes that, and will not re-teach general programming concepts) and have a working ROS 2 installation with a robot or simulation you can launch. You'll also want:
- A modern web browser with developer tools (Chrome, Firefox, or similar)
- A text editor
- The `rosbridge_suite` package installed (`sudo apt install ros-<distro>-rosbridge-suite` on a typical Debian-based ROS 2 install)
- Node.js installed, for the later units on npm-based tooling and React

## Try it yourself
Before Unit 2, confirm your environment is ready: launch your ROS 2 robot or simulation, then run `ros2 topic list` in a separate terminal and confirm you can see at least one topic you'd want a web page to display (a laser scan, an odometry topic, a battery state — whatever your robot publishes). Write down the topic name and its message type (`ros2 topic type <topic_name>`) — you'll use exactly this topic in Unit 3's first Rosbridge exercise.

Also confirm `rosbridge_suite` is installed and launches cleanly:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

You should see a log line confirming the WebSocket server started (default `ws://localhost:9090`). If this command fails, resolve it now — every unit from Unit 3 onward depends on it.
