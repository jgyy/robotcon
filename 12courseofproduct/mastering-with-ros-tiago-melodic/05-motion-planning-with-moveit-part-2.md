# Mastering with ROS: TIAGo - Melodic — Unit 5: Motion Planning with MoveIt: Part 2

Part 1 taught you to plan by dragging a marker in RViz. This unit does the same job from code with MoveIt's Python interface — the step that turns motion planning into something you can call from a larger program instead of a person clicking buttons.

## The MoveGroupCommander

`moveit_commander` wraps the `move_group` node behind a Python object scoped to one planning group. Creating one and asking it for the robot's current pose is the standard first move in any MoveIt script:

```python
import sys, rospy, moveit_commander

moveit_commander.roscpp_initialize(sys.argv)
rospy.init_node("tiago_moveit_demo")

arm_group = moveit_commander.MoveGroupCommander("arm_torso")
print(arm_group.get_current_pose().pose)
print(arm_group.get_current_joint_values())
```

## Setting pose and joint targets

You can ask for a target in either Cartesian space (a pose for the end effector) or joint space (explicit joint angles). Pose targets are more intuitive for task-level goals; joint targets are useful when you want a specific, repeatable arm configuration (a "tucked" travel pose, for instance).

```python
from geometry_msgs.msg import Pose

target = Pose()
target.position.x, target.position.y, target.position.z = 0.5, 0.1, 0.8
target.orientation.w = 1.0

arm_group.set_pose_target(target)
plan = arm_group.plan()          # returns (success, trajectory, planning_time, error_code) in recent APIs
success = arm_group.go(wait=True)
arm_group.stop()                 # ensure no residual motion
arm_group.clear_pose_targets()
```

Always call `stop()` after `go()` and clear your targets afterward — leftover targets silently carry over into the next planning call and are a common source of "why did it move somewhere I didn't ask for" bugs.

## Adding the world: collision objects

A pose that's kinematically reachable can still be a bad plan if it collides with something MoveIt doesn't know about. You describe real-world obstacles with a `PlanningSceneInterface`, most simply as boxes:

```python
from moveit_commander import PlanningSceneInterface
from geometry_msgs.msg import PoseStamped

scene = PlanningSceneInterface()
table_pose = PoseStamped()
table_pose.header.frame_id = "base_footprint"
table_pose.pose.position.x, table_pose.pose.position.z = 0.6, 0.4
scene.add_box("table", table_pose, size=(0.6, 1.0, 0.05))
rospy.sleep(1.0)   # give the scene time to publish before planning against it
```

Once added, `table` is a permanent obstacle for every subsequent plan until you `scene.remove_world_object("table")` — this is exactly how you'll model TIAGo's surroundings before pick-and-place attempts in later units.

## Try it yourself

Write a script that adds a box collision object directly in front of TIAGo's current end-effector position, then requests a pose target on the *far side* of that box. Confirm the returned plan routes around the obstacle rather than through it, and print `success` to check the planning call actually reported success.
