# ROS Manipulation in 5 Days — Unit 3: Motion Planning using Graphical Interfaces Part 1

Now that you know the underlying concepts, it's time to build the artifact that ties them together: a **MoveIt configuration package**. This unit walks through generating one with the MoveIt Setup Assistant and using it to plan motions interactively in RViz, entirely through graphical tools — no planning code yet.

## The MoveIt Setup Assistant

The Setup Assistant is a GUI wizard that turns a URDF into a working MoveIt package. Launch it and point it at your robot's URDF (or Xacro):

```bash
ros2 launch moveit_setup_assistant setup_assistant.launch.py
# ROS 1: roslaunch moveit_setup_assistant setup_assistant.launch
```

It walks you through several steps in order: loading the URDF, generating a self-collision matrix (which link pairs can never collide and so should be ignored for speed), defining virtual joints (how the robot's base attaches to the world — fixed for a bolted-down arm, floating for a mobile base), and finally generating the package files.

## Defining planning groups and end effectors

This is the step where the "basic concepts" from Unit 2 become configuration. In the **Planning Groups** tab you create a group (e.g. `arm`) and add either a kinematic chain (pick the base link and the tip link) or an explicit joint list. You also choose a kinematics solver plugin here — KDL's numerical IK works for any chain but can be slow or get stuck near singularities; if your vendor ships an analytic IK plugin, prefer it.

In the **End Effectors** tab you associate a group (e.g. `gripper`) with the arm group and tag it as the end effector, and in **Poses** you can save named joint configurations (like `home` or `ready`) that you'll reuse constantly in code and in RViz.

| SRDF concept | What you configure it with |
|---|---|
| Planning group | Setup Assistant → Planning Groups tab |
| Self-collision pairs | Setup Assistant → Self-Collisions tab (auto-computed, then reviewed) |
| Named poses | Setup Assistant → Robot Poses tab |
| End effector | Setup Assistant → End Effectors tab |

## Generating and launching the package

The final "Generate Package" step writes out a full ROS package: the SRDF, kinematics/planning YAML configs, controller config stubs, and a `demo.launch.py` (or `.launch`) that brings up RViz with the Motion Planning plugin already loaded and pointed at your robot. This generated package is what every downstream unit — perception, programmatic planning, grasping — builds on top of, so treat it as source-controlled project output, not a throwaway.

```bash
colcon build --packages-select my_robot_moveit_config
ros2 launch my_robot_moveit_config demo.launch.py
```

## Planning visually in RViz

With the demo running, the **Motion Planning** panel's interactive marker on the end effector lets you drag a target pose, press **Plan** to compute a trajectory with OMPL (the default sampling-based planner library MoveIt ships with), inspect it as an animated preview, and press **Execute** to run it (against the fake controller by default, so nothing physical moves). Try switching the "Query" tab's planner and planning time to see how solutions change — this is the fastest way to build intuition for what "hard" versus "easy" planning problems look like before you ever write a line of planning code.

## Try it yourself

Run the Setup Assistant against a manipulator URDF end to end: define one arm planning group and one gripper/end-effector group, save at least one named pose (e.g. `home`), generate the package, build it, and launch the demo. Plan and execute three different pose goals in RViz, including one that requires the arm to visibly reconfigure around itself (not a straight-line move) to confirm the planner is doing real collision-aware search.
