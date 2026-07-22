# ROS2 Basics in 5 Days (Python) — Unit 9: Final Recommendations

This closing unit isn't a new topic — it's a map of where to go next, now that you have the core ROS 2 vocabulary (nodes, topics, services, actions, callbacks, multithreading, debugging) under your belt.

## What you now have
You can scaffold and build a package, write nodes that publish and subscribe, expose and call services, run and monitor long-running actions, reason about when a slow callback needs its own callback group, and diagnose a broken graph with `ros2 doctor`, RViz2, and TF tools. That's a genuinely complete foundation — it's the same vocabulary used in navigation stacks, manipulation pipelines, and perception systems; those courses will introduce *domain* concepts (costmaps, planning scenes, point cloud filters) on top of mechanics you already know.

## Where to go next
Pick a direction based on what kind of robot problem interests you most:
- **Perception** — camera/LiDAR processing, OpenCV integration (docs.opencv.org), point clouds.
- **Manipulation** — arm control and motion planning, typically via MoveIt (moveit.picknik.ai).
- **Navigation** — autonomous movement, costmaps, path planning, localization.
- **Simulation** — building and testing robots virtually before touching hardware, e.g. with Gazebo (gazebosim.org).

Whichever you pick, revisit this course's units as reference material — you will forget the exact `create_service` signature or the difference between the two callback group types, and that's normal. Bookmark docs.ros.org as your primary reference for API details and distro-specific behavior, since ROS 2 evolves between distributions.

## Habits worth keeping
A few practices from this course are worth carrying forward into every future ROS 2 project:
- Inspect the graph with CLI tools (`ros2 node info`, `ros2 topic echo`, `ros2 doctor`) *before* reading code, when something misbehaves — it's almost always faster than debugging blind.
- Keep callbacks short, and reach for callback groups deliberately rather than defaulting to `MultiThreadedExecutor` everywhere "just in case."
- Write custom interfaces (`.msg`/`.srv`/`.action`) as soon as a built-in type is a poor fit, rather than overloading an existing message with unrelated fields.
- Treat launch files as the normal way to start more than one node together, not an afterthought you add once a project gets big.

## Try it yourself
Pick one small project idea that combines at least three primitives from this course (e.g. a node that subscribes to a simulated sensor topic, exposes a service to change a threshold, and runs a long "calibration" action when triggered). Sketch its package structure and interfaces on paper before writing any code — this is the same design step you'd do for any nontrivial software project, applied to a ROS 2 graph.
