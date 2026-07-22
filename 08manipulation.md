# 08 Manipulation

## Why this matters
Manipulation is what turns a robot from something that moves through the world into something that changes it — picking a part off a conveyor, opening a door, assembling components. It's where the kinematics and control theory from 05roboticstheory.md meet hardware reality: joint limits, singularities, self-collision, and the physical uncertainty of actually touching something. MoveIt2 is the de facto ROS2 framework for arm motion planning, so understanding its architecture pays off across almost any arm you touch, commercial or homebrew.

## Core concepts
- Forward kinematics — computing end-effector pose from joint angles via the kinematic chain defined in a robot's URDF (see 05roboticstheory.md for the DH-parameter math)
- Inverse kinematics (IK) — solving for joint angles that reach a target end-effector pose; analytical closed-form solutions vs numerical/iterative solvers, and handling multiple or zero solutions
- Kinematic redundancy and singularities — extra-DOF arms give solution freedom, but singular configurations (Jacobian rank loss) break velocity-level control and need explicit handling
- MoveIt2 architecture — the move_group node, planning scene, robot model/robot state, and how RViz2's MotionPlanning plugin drives it
- MoveIt2 Setup Assistant — generating a MoveIt config package from a URDF: planning groups, end effectors, virtual joints, self-collision matrix, controller config
- Sampling-based motion planning — RRT, RRT-Connect, PRM and friends via OMPL, and how arm planners differ in intent from the mobile-base path planners in 05roboticstheory.md
- Joint-space vs Cartesian-space planning — planning to a joint-angle goal vs a straight-line end-effector path (computeCartesianPath), and why Cartesian planning fails more often
- Planning scene and collision checking — representing the world (known objects, octomaps/point clouds) so planners avoid hitting the environment and the robot's own links
- IK solver plugins — KDL as the default, TRAC-IK and others as drop-in replacements with different speed/success tradeoffs
- Programmatic control — the MoveGroupInterface (C++) and moveit_py/moveit_commander (Python) for scripting planning and execution instead of clicking through RViz2
- Grasp strategy — antipodal/force-closure grasps, choosing approach and retreat vectors, and structuring a grasp as pre-grasp → grasp → lift stages
- End-effectors and grippers — parallel-jaw, suction, and underactuated/adaptive grippers, and which object classes each suits
- Gripper control — the GripperCommand action interface, and treating the gripper as its own MoveIt planning group alongside the arm
- Perception-to-grasp pipeline — turning segmented point clouds or detections (07perception.md) into candidate grasp poses, e.g. via simple_grasping-style object-to-grasp packages
- ros2_control as the actuation layer — MoveIt2 hands off planned trajectories to controllers running under ros2_control (04intermediateros2.md covers that layer in depth)

## Resources
- MoveIt2 official documentation — moveit.picknik.ai
- moveit2_tutorials on GitHub — worked examples building up a Panda-arm MoveIt config and Move Group API usage
- ROS2 documentation — docs.ros.org, for URDF/SRDF and general ROS2 reference
- ros2_control documentation — control.ros.org
- OMPL (Open Motion Planning Library) documentation — ompl.kavrakilab.org
- Orocos KDL (Kinematics and Dynamics Library) — orocos.org, the default kinematics/IK backend behind MoveIt2
- Beeson & Kuindersma, "TRAC-IK: An Open-Source Library for Improved Solving of Generic Inverse Kinematics" (IROS 2015) — the paper behind the popular TRAC-IK plugin
- Craig, "Introduction to Robotics: Mechanics and Control" — classic textbook on forward/inverse kinematics and the DH convention
- Siciliano, Sciavicco, Villani, Oriolo, "Robotics: Modelling, Planning and Control" — covers manipulator kinematics, dynamics, and grasping in depth
- Murray, Li, Sastry, "A Mathematical Introduction to Robotic Manipulation" — freely available PDF, rigorous treatment of manipulation kinematics using screw theory
- GraspIt! — grasp analysis/planning simulator for exploring grasp quality outside of ROS (search for the current project page/repo)

## Hands-on checkpoints
- [ ] Work out forward kinematics by hand for a small 2-3 DOF planar arm, then verify it against a URDF loaded in RViz2 with joint_state_publisher_gui
- [ ] Run the MoveIt2 Setup Assistant against a URDF (a stock arm like the Panda, or your own) and produce a working MoveIt config package
- [ ] Plan and execute a joint-space goal and a pose goal from RViz2's MotionPlanning panel, then repeat both programmatically via the Move Group interface
- [ ] Add a collision object to the planning scene and confirm the planner routes around it instead of through it
- [ ] Plan a Cartesian path for a straight-line end-effector motion and compare its success rate to an equivalent joint-space plan
- [ ] Swap the IK solver plugin (e.g. KDL for TRAC-IK) and compare solve time and success rate across several target poses
- [ ] Command a gripper open/close through its action interface, then add it as a second planning group alongside the arm
- [ ] Build a minimal pick-and-place pipeline: detect an object's pose, plan an approach, grasp it, lift, and place it at a target location
