# Create Your First Robot with ROS (Deprecated) — Unit 1: Introduction

This unit previews the whole course: the robot you'll end up with, the order in which you'll build it, and the mental model you need going in. It exists so that when you're knee-deep in wiring diagrams in Unit 2, you already know why that step matters to the finished robot.

## The robot you're building
The course walks you through a small two-wheeled differential-drive robot (referred to throughout as "RIAbot" or "ROSbots") from bare parts to an autonomous machine. By the end you will have assembled the chassis and electronics, built a simulated twin of the robot, connected to the physical robot over a network, written the motor drivers that let ROS actually move the wheels, and layered increasingly sophisticated autonomy on top: line following, monocular SLAM, and a deep-learning-driven lane follower. Each unit is a strict prerequisite for the next — you cannot debug a motor driver you haven't wired, and you cannot train a lane-following model on a robot that can't yet drive straight.

## Why ROS instead of a one-off script
You could drive two motors and read a camera with a plain Python script. The reason to do it inside ROS instead is reuse and composability: a motor driver written as a ROS node exposes a standard topic/service interface that every later unit — the line follower, the SLAM stack, the deep learning pipeline — can call without knowing anything about GPIO pins or PWM duty cycles. This course predates ROS 2's dominance and uses classic ROS (catkin workspaces, `rospy`/`roscpp`, `roslaunch`) as its plumbing; the concepts (nodes, topics, launch files, parameters) carry over directly if you later move to ROS 2, only the tooling names change.

## Simulation-first, hardware-second
Notice the outline: Unit 3 builds a simulation *before* Unit 4 connects to the real robot. That ordering is deliberate and worth internalizing now — every piece of navigation and control logic you write should be exercised in simulation first, where a bug costs you a restarted process instead of a robot driving off a table. Treat the simulated robot as a full stand-in for the physical one throughout the course; anywhere you see "test on the robot," read it as "test in sim first, then on the robot."

## What you need before starting
- A Linux machine able to run a ROS distribution and a 3D simulator (Gazebo or an equivalent) comfortably — a laptop with a discrete or reasonably capable integrated GPU is enough for a robot this size.
- The physical robot kit's parts on hand for Unit 2: two-wheeled chassis, geared DC motors, a motor driver board, a single-board computer, and a battery pack. Exact part numbers depend on which kit you're following.
- Comfort with the Linux command line, Python, and reading a wiring diagram; no prior ROS experience is assumed, but general programming fluency is.

## Try it yourself
Before touching any hardware, sketch (on paper or in a text file) the pipeline you expect to end up with: which ROS node publishes motor commands, which node(s) read sensors, and which node ties them together for line following. You don't need it to be correct — you'll revise it after Unit 5 — the point is to give yourself a target architecture to compare against as you build each piece.
