# Mastering with ROS: Turtlebot3 — Unit 7: Motion Planning with MoveIt

Everything so far has moved the base. This unit introduces the manipulator — the OpenManipulator arm fitted to a Waffle-class Turtlebot3 — and MoveIt, the standard ROS motion-planning framework, so you can plan and execute arm trajectories instead of driving joints by hand.

## What MoveIt actually does for you

MoveIt takes a kinematic description of the arm (from its URDF/SRDF, generated once via the MoveIt Setup Assistant) and gives you planning against that model: given a target — a joint configuration or an end-effector pose — it searches for a collision-free trajectory through the arm's configuration space and hands it to a controller for execution. Without MoveIt you'd be solving inverse kinematics, collision checking, and trajectory generation yourself; with it, you describe *what* you want and it works out *how*.

## The planning scene

MoveIt reasons about collisions using a **planning scene** — the arm's own links (checked against each other for self-collision), plus any known obstacles in the environment. On a mobile platform like Turtlebot3, don't forget to represent the base and any payload as collision objects too, or MoveIt will happily plan a trajectory that swings the gripper straight through the robot's own chassis:

```python
from moveit_commander import PlanningSceneInterface
from geometry_msgs.msg import PoseStamped

scene = PlanningSceneInterface()

table_pose = PoseStamped()
table_pose.header.frame_id = 'base_link'
table_pose.pose.position.z = -0.05
scene.add_box('table', table_pose, size=(1.0, 1.0, 0.02))
```

## Planning to a target

The two most common planning requests are joint-space goals (drive specific joints to specific angles — useful for named poses like "home" or "ready") and pose goals (move the end effector to a Cartesian position/orientation — useful when you actually care where the gripper ends up, e.g. above a detected object from Unit 6):

```python
from moveit_commander import MoveGroupCommander

arm = MoveGroupCommander('arm')  # planning group name from your SRDF

# Joint-space goal
arm.set_named_target('home')
arm.go(wait=True)

# Pose goal
target = arm.get_current_pose().pose
target.position.z += 0.1
arm.set_pose_target(target)
plan_success, trajectory, planning_time, error_code = arm.plan()
if plan_success:
    arm.execute(trajectory, wait=True)
```

Always inspect the plan before blindly executing it in earlier learning stages — visualize it in RViz's MotionPlanning panel first, especially near the workspace boundary where a poorly-conditioned pose can produce a valid-but-ugly trajectory that swings wide before reaching the target.

## Grasping: the gripper as its own (trivial) planning group

The gripper is usually its own SRDF planning group with just an open/closed named pose pair, controlled separately from the arm:

```python
gripper = MoveGroupCommander('gripper')
gripper.set_named_target('open')
gripper.go(wait=True)
```

A basic pick sequence is then: plan the arm to a pre-grasp pose above the object, open the gripper, plan down to the grasp pose, close the gripper, plan back up. Each of those is an independent planning call — MoveIt doesn't know "pick up the red block" as a single primitive, you compose it from these steps yourself (or use its Cartesian path / pick-and-place helpers once you're comfortable with the basics).

## Try it yourself

Add a box collision object representing an object detected by your Unit 6 pipeline (place it using a plausible position in front of the robot), then plan and execute an arm motion to a pose just above it without executing a plan that intersects the box. Confirm in RViz that MoveIt refuses (or replans around) any pose goal you deliberately place *inside* the box.
