# Path Planning Basics — Unit 1: Introduction to the Course

This unit sets the frame for everything that follows: what path planning actually is, where it sits inside the larger autonomous-navigation stack, and why the four algorithm families covered later (Dijkstra, A*, RRT, potential fields) each earn a place in a robot's toolbox.

## What is path planning?
Given a robot's current pose, a goal pose, and a representation of the environment (occupied vs. free space), path planning is the problem of computing a sequence of positions (or configurations) that takes the robot from start to goal without colliding with anything. That's distinct from *control*, which is the separate problem of actually driving the wheels/joints to follow the planned path, and from *localization*, which is figuring out where the robot currently is. Path planning sits between "where am I and what does the world look like" (perception + localization) and "how do I move my actuators to get there" (control).

## Challenges of autonomous navigation
A few things make this harder than "find the shortest line between two points":
- **Discretization** — most planners don't reason over continuous space directly; they reason over a grid, graph, or sampled roadmap built from sensor or map data, and the choice of representation shapes which algorithm even applies.
- **Uncertainty** — real sensors are noisy and maps are often incomplete or stale, so a plan computed once may need to be re-checked or replanned as new information arrives.
- **Dynamics and constraints** — a differential-drive robot can't strafe sideways, a car-like robot has a minimum turning radius, and a manipulator arm has joint limits; a geometrically valid path isn't always a physically followable one.
- **Time budget** — a plan that's optimal but takes 30 seconds to compute is often worse in practice than a decent plan computed in 50ms, especially for local, reactive obstacle avoidance.

## Global vs. local path planning
This distinction recurs throughout the course:
- **Global planning** works over a full (usually static) map of the environment and produces a complete path from start to goal before the robot starts moving. Dijkstra, A*, and RRT (Units 2-4) are global planners.
- **Local planning** operates on a short time/space horizon using live sensor data, adjusting or replacing the immediate next stretch of the path to react to obstacles the global map didn't know about (a person walking by, a chair that moved). Potential fields (Unit 5) are most often used this way.
In a typical navigation stack — such as ROS 2's Nav2 — a global planner produces a coarse path once, and a local planner/controller continuously refines the next few meters of it at a much higher rate.

## A first taste: Dijkstra in one paragraph
Represent the environment as a grid of cells, where each free cell is a node connected to its free neighbors. Dijkstra's algorithm explores outward from the start node, always expanding the node with the lowest known cost-so-far, until it reaches the goal — guaranteeing the shortest path by construction. You'll implement this for real in Unit 2; for now, the point is just to see that "path planning" reduces to a well-known graph search problem once you fix a discretization of space.

## Try it yourself
Before writing any code, sketch (on paper or in a text file) a 6x6 grid with a handful of cells marked as obstacles, a start cell, and a goal cell. By hand, trace what you believe the shortest obstacle-free path is. Keep this grid — you'll re-use it in Unit 2 to check your first Dijkstra implementation against your own by-hand answer.
