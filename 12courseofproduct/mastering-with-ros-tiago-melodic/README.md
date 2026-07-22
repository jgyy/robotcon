# Mastering with ROS: TIAGo - Melodic

TIAGo, from PAL Robotics, is a mobile manipulator that packs a differential/omnidirectional base, a lifting torso, a 7-DoF arm, and an RGB-D head camera onto one platform running on ROS 1 — which makes it a good vehicle for learning how mobile navigation, arm motion planning, and 2D/3D perception fit together on a single real robot rather than as isolated exercises. This course walks from TIAGo's hardware and ROS interfaces through joint- and velocity-level control, `move_base` navigation, three units of MoveIt motion planning (from RViz-driven planning to Cartesian paths and constraints), and perception with both OpenCV and PCL, before finishing with a micro project that chains navigation, perception, and manipulation into one autonomous pick task.

1. [Introduction to the Course](01-introduction-to-the-course.md) — TIAGo's hardware subsystems, how they map onto ROS topics/TF/controllers, and bringing up a simulation.
2. [Control](02-control.md) — Driving the base with `cmd_vel` and moving torso/head/arm/gripper through joint trajectory controllers.
3. [Navigation](03-navigation.md) — Localizing with `amcl`, understanding costmaps, and sending `move_base` goals from code.
4. [Motion Planning with MoveIt: Part 1](04-motion-planning-with-moveit-part-1.md) — Planning groups, and planning/executing arm motion interactively in RViz.
5. [Motion Planning with MoveIt: Part 2](05-motion-planning-with-moveit-part-2.md) — Programmatic planning with `moveit_commander`, pose/joint targets, and collision objects.
6. [Motion Planning with MoveIt: Part 3](06-motion-planning-with-moveit-part-3.md) — Cartesian paths, path/orientation constraints, and building toward pick-and-place.
7. [Perception with OpenCV](07-perception-with-opencv.md) — Getting images into OpenCV via `cv_bridge`, a basic detection pipeline, and publishing results back into ROS.
8. [Perception with PCL](08-perception-with-pcl.md) — Filtering, plane segmentation, and clustering point clouds to locate objects in 3D.
9. [Micro Project](09-micro-project.md) — A capstone loop that navigates to a table, perceives an object, and picks it up, combining every prior unit.
