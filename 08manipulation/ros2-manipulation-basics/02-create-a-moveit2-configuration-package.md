# ROS2 Manipulation Basics — Unit 2: Create a MoveIt2 Configuration Package

Every robot MoveIt2 controls needs a configuration package: SRDF semantics layered on top of your URDF, plus planning, kinematics, and controller settings. This unit walks the MoveIt2 Setup Assistant end to end so you can generate that package for your own arm.

## What MoveIt2 needs beyond your URDF

Your URDF/XACRO already describes links, joints, and geometry — enough for `robot_state_publisher` and simulation, but not enough for planning. MoveIt2 needs additional semantic information that has no natural home in a URDF: which joints move together as a logical "arm", which link pairs can never collide and shouldn't be checked, where the gripper is, and what named poses ("home", "ready") mean for this robot. That information lives in an **SRDF** (Semantic Robot Description Format) file, and the **MoveIt2 Setup Assistant** is the GUI tool that generates it — along with kinematics, planning-pipeline, and controller configuration YAML — into a ready-to-launch package. Launch it with:

```bash
ros2 launch moveit_setup_assistant setup_assistant.launch.py
```

## Loading the URDF and building the collision matrix

Start a new configuration and point the assistant at your robot's URDF or XACRO file. The assistant loads the robot's geometry and lets you generate a **self-collision matrix**: an automated check that samples random joint configurations and disables collision checking between link pairs that either can never physically collide (too far apart) or always collide (adjacent links whose meshes overlap at the joint). This matters for performance — checking every link pair against every other on each planning iteration is wasted work once you know most pairs are irrelevant.

Also define any **virtual joints** here if the robot's base isn't fixed to the world — a virtual joint (often a fixed or planar joint) attaches the robot's root link to a `world` frame so MoveIt2 has a coherent reference frame to plan in.

## Planning groups, poses, and the end effector

A **planning group** names a set of joints MoveIt2 should treat as one unit for planning — typically "arm" (the manipulator's joints) and "gripper" (the end effector's joints) as separate groups. Define the arm group by selecting its kinematic chain (base link to tip link) or listing its joints directly, and assign it a kinematics solver (defaults to KDL; see Unit 4 for swapping it).

With the group defined, add **robot poses**: named joint configurations like `home` or `ready` that you can plan to by name later instead of specifying every joint angle. Then define the **end effector**: associate the gripper's planning group with a parent link on the arm, which is what lets MoveIt2 reason about "the end effector's pose" as a single concept rather than a chain of individual links.

## Controllers, generation, and testing

Set up **MoveIt controllers** by mapping each planning group to the `ros2_control` controller (typically a `FollowJointTrajectory` action interface) that will actually execute its trajectories — this is the bridge between MoveIt2's planned trajectories and your robot's real or simulated actuators. Once everything is defined, generate the package: the assistant writes out the SRDF, kinematics/planning YAML, controller configs, and launch files into a new ROS 2 package you can build with `colcon build`.

The generated package is a starting point, not a finished product — it's common to hand-tune things afterward: tightening planning timeouts, adjusting the OMPL planner selection, or fixing controller names that don't quite match your `ros2_control` setup. Verify the result with the same demo launch file from Unit 1:

```bash
ros2 launch <your_robot>_moveit_config demo.launch.py
```

If planning and execution work in RViz2 against your own robot, the package is sound. A generated package is organized around a few key pieces you'll come back to repeatedly: the `config/` directory (SRDF, kinematics.yaml, controllers.yaml) and the `launch/` directory (`demo.launch.py`, `move_group.launch.py`) — knowing this layout is what lets you debug and extend the package instead of re-running the assistant every time.

## Try it yourself

Run the Setup Assistant against a URDF you have (or a simple simulated arm's XACRO). Define one arm planning group and one gripper group, generate the self-collision matrix, add a `home` pose, and generate the package. Launch the resulting `demo.launch.py` and confirm you can plan to your `home` pose from RViz2's Motion Planning panel by name.
