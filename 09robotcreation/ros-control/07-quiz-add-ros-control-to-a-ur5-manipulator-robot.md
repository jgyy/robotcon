# ROS Control — Unit 7: QUIZ — Add ros_control to a UR5 Manipulator Robot

This capstone unit has no new theory — it's where units 1 through 6 get combined into one working pipeline on a realistic robot. The UR5 is a good target: a genuine 6-DOF industrial arm with widely available URDF/XACRO descriptions, so the exercise mirrors what you'd actually do on the job.

## The brief
Starting from a UR5 (or UR-family) robot description, get it moving under `ros2_control` in simulation, end to end:

1. Add a `<ros2_control>` block to the robot's URDF/XACRO declaring all six joints with `position` command interfaces and `position`/`velocity` state interfaces, backed by a simulated hardware plugin (Unit 3, Unit 6).
2. Write a controller manager YAML loading a `joint_state_broadcaster` and a `joint_trajectory_controller` covering all six UR5 joints, in the arm's correct joint order (Unit 5).
3. Bring the robot up in your simulator of choice and spawn both controllers.
4. Confirm `/joint_states` is publishing and `ros2 control list_controllers` shows both controllers `active`.
5. Send at least one multi-waypoint trajectory that visibly moves the arm from its home configuration to a different pose and back.

## Step-by-step checklist
- [ ] `ros2 control list_hardware_interfaces` shows all six UR5 joints with the interfaces you declared.
- [ ] `ros2 control list_controllers` shows `joint_state_broadcaster` and your trajectory controller both `active`, not `inactive` or `unconfigured`.
- [ ] `ros2 topic echo /joint_states` shows six joint names updating as the arm moves.
- [ ] A `FollowJointTrajectory` goal sent via `ros2 action send_goal` (or a small publisher script) completes successfully and the arm visibly reaches the target pose in your simulator.
- [ ] Joint order is consistent across the URDF, the controller YAML, and any trajectory you send — deliberately test a mismatched order once and observe what breaks, then fix it.

## Where this usually breaks
- **Interface mismatch**: a controller requiring `velocity` command interfaces when the hardware only exports `position` — the controller manager will refuse to activate it. Re-read the error in the controller manager's log; it names the missing interface explicitly.
- **Wrong or missing `robot_description`**: `ros2_control` reads the `<ros2_control>` block from whatever URDF is loaded on the `robot_description` parameter — if your launch file loads a different (or stale) XACRO than the one you edited, none of your changes take effect.
- **Controller manager never starts**: on real setups this is launched explicitly (often via a `ros2_control_node` executable pointed at your YAML); double-check it's actually part of your launch file, not just assumed.
- **Trajectory rejected instantly**: usually a joint-name mismatch between the goal message and the `joints:` list in the YAML, or a `goal_time` constraint too tight for the requested motion.

## Try it yourself
Once the base checklist passes, add a second, independent goal: send a trajectory with three waypoints instead of two (home → pose A → pose B) in a single `FollowJointTrajectory` goal, and verify the arm passes through pose A rather than jumping straight to pose B. This confirms your controller is genuinely interpolating a full trajectory, not just snapping to a final setpoint.
