# TEB Local Planner — Unit 1: Introduction to the Course

TEB (Timed Elastic Band) is one of the most capable local planners available for ROS Navigation, and it's the one you reach for when a simple trajectory rollout planner like DWA starts to feel too rigid. This unit orients you: what TEB actually optimizes, how it differs from the local planners you may already know, and what you'll be able to build by the end of the course.

## What a local planner does, and why TEB is different

The global planner gives you a path — a sequence of waypoints from A to B that ignores dynamics and only cares about static free space. The **local planner** turns that path into actual velocity commands, moment to moment, while reacting to obstacles the global map doesn't know about (a person walking by, a chair that moved).

Classic local planners like DWA (Dynamic Window Approach) or the ROS 1 `base_local_planner` work by *sampling*: they generate a handful of candidate `(v, ω)` velocity pairs, forward-simulate each one for a short horizon, score them against a cost function (distance to obstacles, progress toward goal, path alignment), and execute the best-scoring one. This is fast and simple but short-sighted — it re-decides from scratch every control cycle and doesn't reason explicitly about time.

TEB instead treats the whole local trajectory as an **elastic band**: a sequence of poses connected by time intervals, which gets deformed by competing forces expressed as optimization terms — obstacles push the band away, the via-points and goal pull it forward, kinodynamic limits constrain how sharply it can bend or accelerate. Rather than picking from a small discrete sample set, TEB *optimizes* a continuous trajectory using a graph-based solver (g2o), which is why it produces noticeably smoother, more natural-looking paths and can react gracefully to dynamic obstacles.

## Where TEB fits in the Navigation Stack

TEB is a **plugin**, not a standalone system. In ROS 1 it's `teb_local_planner`, loaded as the `base_local_planner` plugin inside `move_base`. In Nav2 it's typically used via a community `teb_local_planner` port loaded as a plugin in the `controller_server`. Either way, TEB slots into the same pipeline you already know: it still reads the local costmap, it still gets a global path to follow, and it still ultimately publishes `cmd_vel`. What changes is entirely internal — the algorithm that turns "path + costmap" into "velocity command."

This matters for how you'll work through this course: you are not learning a new navigation architecture, you're learning to configure and tune one specific, swappable component within an architecture you likely already have running.

## Course roadmap

- **Unit 2** gets a working Navigation Stack up so there's something to plug TEB into.
- **Unit 3** is the heart of the course: launching the optimization node, understanding the major parameter groups, and using RViz to actually see the candidate trajectories TEB is considering.
- **Unit 4** covers the setup unique to car-like (Ackermann-steered) robots, where TEB's ability to respect a minimum turning radius is a major reason to choose it over simpler planners.
- **Unit 5** is a mini project where you configure TEB end to end and drive a robot through a cluttered environment.

## Try it yourself

Before writing any configuration, watch how your current local planner (or a stock DWA config, if you have one running) behaves near a sharp corner or a narrow gap between two obstacles in simulation. Note two or three specific behaviors you'd want to *improve* — jerky velocity changes, cutting corners too tight, stalling near obstacles. Keep this list; you'll revisit it in Unit 3 when you start tuning TEB's optimization weights, and it'll be a concrete way to tell whether your tuning actually helped.
