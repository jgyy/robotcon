# ROS2 Manipulation Basics — Unit 1: Introduction to the Course

This unit orients you before you touch any code: what manipulation means in ROS 2, what MoveIt2 actually does for you, and what you need already installed. It closes with a short demo so you see a working pipeline before you build one yourself.

## What "manipulation" means here

Manipulation is the subset of robotics concerned with a robot changing the state of its environment through contact — grasping, moving, placing, and releasing objects, as opposed to just moving itself around (that's navigation, covered elsewhere in this repo). A manipulation stack has to solve several problems together:

- **Where can the end effector go?** — forward/inverse kinematics for the arm.
- **How does it get there without hitting itself or the world?** — collision-aware motion planning.
- **What's actually out there to pick up?** — perception (object detection, pose estimation).
- **How does it hold and release things?** — end-effector/gripper control.

MoveIt2 is the ROS 2 framework that owns the first two: given a robot description and a goal, it plans a collision-free trajectory and hands it to your controllers for execution. It does not replace perception or gripper drivers — it integrates with them. This course builds that integration piece by piece: Unit 2 configures MoveIt2 for a specific robot, Unit 3 drives it programmatically, Unit 4 adds Cartesian paths, and Unit 5 closes the loop with perception so the robot picks up things it has actually detected.

## A first look: commanding an arm with MoveIt2

Before building your own configuration, it's worth seeing a complete MoveIt2 pipeline run end to end using a demo configuration package (most MoveIt2-supported robots ship one, invoked as a launch file, commonly named something like `demo.launch.py`):

```bash
ros2 launch <your_robot>_moveit_config demo.launch.py
```

This brings up three things at once: the `move_group` node (the planning brain), RViz2 with the MoveIt2 Motion Planning plugin loaded, and (in simulation) a virtual robot to move. In RViz2's Motion Planning panel you can drag the interactive marker on the end effector to a new pose, hit **Plan**, watch the previewed trajectory, and hit **Execute** to run it. This is the same pipeline you'll drive from C++ in Unit 3 — the GUI is just a human-friendly front end to the same `move_group` action interface your code will call.

## Minimum requirements before you start

To follow along hands-on you need:

- A working ROS 2 installation with MoveIt2 installed for your distro.
- Comfort with ROS 2 fundamentals: nodes, topics, actions, launch files, and building packages with `colcon`. This course does not re-teach those.
- A robot to practice on — either a manipulator arm in simulation (a URDF/XACRO description is enough to get started) or real hardware with a working `ros2_control` interface.
- Basic C++ (the programmatic units use the Move Group C++ Interface, not Python).

If any of those are shaky, it's worth backfilling them before Unit 2 — MoveIt2 configuration errors are much easier to debug when you already understand what a planning group or a controller spawner is doing underneath.

## Try it yourself

Find (or install) a MoveIt2 demo configuration for any supported arm — check `moveit.picknik.ai` or your ROS 2 distro's package index for a `<robot>_moveit_config` package. Launch its demo, drag the end effector to three different reachable poses, and for each one note whether **Plan** succeeded on the first try. If a plan fails, try nudging the goal closer to the robot's current pose — you're building intuition for what "reachable" looks like before Unit 2 teaches you why.
