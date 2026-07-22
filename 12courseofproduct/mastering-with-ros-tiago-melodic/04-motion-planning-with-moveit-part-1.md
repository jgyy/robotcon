# Mastering with ROS: TIAGo - Melodic — Unit 4: Motion Planning with MoveIt: Part 1

This is the first of three units on MoveIt, the motion-planning framework that turns "move the gripper to this pose" into a collision-free arm trajectory. Part 1 stays entirely in the graphical interface so you build correct mental models of planning groups, planning scenes, and the plan/execute cycle before you automate any of it in Part 2.

## What MoveIt needs to plan for a robot

MoveIt plans against a **kinematic model**, not the raw URDF: it needs joint limits, which joints belong to which "planning group," a self-collision matrix, and an inverse kinematics solver. For TIAGo this configuration already exists as a MoveIt config package (conventionally named something like `tiago_moveit_config`) — you don't build this from scratch, you launch it.

```bash
roslaunch tiago_moveit_config moveit_rviz.launch
```

This starts the `move_group` node (the actual planning service) and opens RViz with the MoveIt motion planning plugin pre-loaded.

## Planning groups

TIAGo's MoveIt config typically defines several overlapping planning groups you'll pick between depending on the task:

- `arm` — just the 7 arm joints, torso fixed.
- `arm_torso` — the arm plus the torso lift joint, giving extra reach at the cost of a slightly harder IK problem.
- `gripper` — the end-effector open/close joints, planned separately from arm motion.

Choosing the right group matters: `arm_torso` can reach targets `arm` alone cannot, but takes longer to plan and moves the whole robot's height, which affects stability and camera framing.

## Planning and executing from RViz

In the MotionPlanning panel: drag the orange interactive marker on the end effector to a candidate goal pose, hit **Plan** to have `move_group` compute a candidate trajectory (shown as an animated preview, not yet executed), inspect it for anything that looks wrong (an elbow swinging through the torso, an oddly long path for a short move), and only then hit **Execute**. Getting used to always previewing before executing is the single habit from this unit that prevents the most real-world mistakes — a plan that looks fine kinematically can still be a bad idea near people or fragile objects.

## Reading the planning scene

The **Scene Robot** and **Planning Request** displays show you what MoveIt currently believes about the world: the robot's current joint state, any collision objects it knows about, and the requested goal. If a plan fails with "no solution found," the first thing to check is whether the planning scene actually matches reality — a phantom collision object left over from an earlier test is a very common cause.

## Choosing a planner

`move_group` doesn't have one planning algorithm — it loads a planning *pipeline* (OMPL is the common default, sitting alongside optional pipelines like CHOMP or Pilz for straight-line motion) and within OMPL a specific planner (RRTConnect is a solid, fast default for the first pass). The RViz panel's "Context" tab lets you switch planner and re-plan without touching code, which is the quickest way to build intuition for how planner choice trades off planning speed against path quality before you start hard-coding a choice in Part 2.

## Try it yourself

Launch the MoveIt RViz interface against a simulated TIAGo, switch between the `arm` and `arm_torso` planning groups for the *same* target pose, and compare the two computed plans — note which one succeeds, how the trajectories differ, and how execution time changes. Then, keeping the group fixed, switch the OMPL planner in the Context tab and re-plan the same request a few times to see how much the resulting path varies run to run.
