# Mastering with ROS: TIAGo - Melodic — Unit 6: Motion Planning with MoveIt: Part 3

The last MoveIt unit covers the two things basic pose-target planning doesn't give you: motion that follows a precise straight-line path, and motion that's constrained along the way rather than just at the destination. Together these get you close to a real pick-and-place capability.

## Cartesian paths

`set_pose_target` plans *a* path to a goal — not necessarily a straight one. When you need the end effector to travel a specific line (approaching an object straight-on, or lifting an object vertically without tipping it), use `compute_cartesian_path`, which plans through a list of waypoints and reports back how much of the path it actually managed to complete:

```python
waypoints = [arm_group.get_current_pose().pose]
approach = Pose()
approach.position.x, approach.position.y, approach.position.z = 0.55, 0.1, 0.75
approach.orientation.w = 1.0
waypoints.append(approach)

plan, fraction = arm_group.compute_cartesian_path(
    waypoints, eef_step=0.01)   # eef_step: max distance between interpolated points, in meters

if fraction > 0.95:
    arm_group.execute(plan, wait=True)
else:
    rospy.logwarn("Cartesian path only %.0f%% complete — not executing", fraction * 100)
```

Always check `fraction` before executing — a partial Cartesian path means MoveIt couldn't find a valid arm configuration for part of the line, and blindly executing it will either error out mid-motion or, worse, silently truncate.

## Path and orientation constraints

Sometimes you want ordinary (non-Cartesian) planning but with a restriction along the way — the classic example is carrying a filled cup: the end effector's orientation must stay roughly upright for the *entire* trajectory, not just at the goal. `moveit_msgs/OrientationConstraint` expresses exactly this and gets attached to the planner via `set_path_constraints`:

```python
from moveit_msgs.msg import OrientationConstraint, Constraints

oc = OrientationConstraint()
oc.link_name = arm_group.get_end_effector_link()
oc.header.frame_id = "base_footprint"
oc.orientation.w = 1.0
oc.absolute_x_axis_tolerance = 0.1
oc.absolute_y_axis_tolerance = 0.1
oc.absolute_z_axis_tolerance = 3.14   # free to rotate about z

constraints = Constraints()
constraints.orientation_constraints.append(oc)
arm_group.set_path_constraints(constraints)
```

Constrained planning is noticeably slower and can fail where unconstrained planning would succeed — reach for it only when the task genuinely requires it, and clear it (`arm_group.clear_path_constraints()`) once you're done.

## Toward pick and place

A real pick-and-place is a sequence built entirely from tools you now have: a Cartesian approach toward the object, closing the `gripper` planning group's controller, a Cartesian retreat straight up (often under an orientation constraint so the object stays level), a regular pose-target transit to the drop location, then opening the gripper again. MoveIt's `pick()`/`place()` helpers exist to package this sequence with grasp generation, but understanding the manual version first means you're never stuck when the automated helper doesn't fit your task.

## Try it yourself

Chain a Cartesian approach, a simulated "grasp" (just close the gripper group), a Cartesian vertical retreat under an orientation constraint, and a regular pose-target move to a drop-off point — all in one script, printing the outcome of each step so a failure at any stage is immediately visible.
