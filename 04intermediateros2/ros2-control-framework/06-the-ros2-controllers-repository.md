# ROS2 Control Framework — Unit 6: The ros2_controllers Repository

You've written a hardware interface; now survey the controllers you get "for free." The `ros2_controllers` repository ships a set of general-purpose controllers covering the vast majority of robot joints, so before writing a custom controller (Unit 7), it's worth knowing exactly what already exists and which one fits your command interface.

## Available Controllers at a Glance

Controllers in `ros2_controllers` fall into two families: **broadcasters**, which publish hardware state to ROS topics without commanding anything (e.g., `joint_state_broadcaster`, `imu_sensor_broadcaster`), and **command controllers**, which claim one or more command interfaces and drive them from a ROS input (topic, action, or service). Picking the right command controller is really a question of "what command interface did my hardware interface export, and what input shape does my application need to send?"

## The position_controllers

`position_controllers/JointGroupPositionController` claims `position` command interfaces and takes a simple array of target positions on a topic — the most direct mapping when your hardware interface (or simulator) accepts absolute joint targets:

```yaml
position_controller:
  ros__parameters:
    joints: ["joint1", "joint2"]
    interface_name: position
```

```bash
ros2 topic pub /position_controller/commands std_msgs/msg/Float64MultiArray \
  '{data: [0.5, -0.3]}' --once
```

## The effort_controllers

`effort_controllers/JointGroupEffortController` follows the identical shape but claims `effort` command interfaces — appropriate when your actuators are torque/current-controlled and you want to command force directly rather than position (common for compliant manipulation or legged robots where torque control matters for ground contact).

## The velocity_controllers

`velocity_controllers/JointGroupVelocityController` claims `velocity` command interfaces, taking a target velocity per joint — the natural choice for continuously-rotating joints like wheels, or any application built around velocity setpoints rather than absolute positions.

## The forward_command_controller

`forward_command_controller/ForwardCommandController` is the generic base all three controllers above build on: it forwards whatever values arrive on its command topic straight to the named command interfaces, with no interpretation. Reach for it directly (rather than the position/effort/velocity wrappers) when you have a non-standard interface name that isn't one of the three built-in types.

## The joint_trajectory_controller

`joint_trajectory_controller/JointTrajectoryController` is the workhorse for arms and other multi-joint manipulators: it accepts a full `FollowJointTrajectory` action goal (a time-parameterized sequence of waypoints per joint) and interpolates between them each cycle, rather than jumping to a single target. This is what MoveIt and most manipulation pipelines talk to under the hood:

```yaml
arm_controller:
  ros__parameters:
    joints: [joint1, joint2, joint3]
    command_interfaces: [position]
    state_interfaces: [position, velocity]
```

## The diff_drive_controller

`diff_drive_controller/DiffDriveController` is purpose-built for two-wheeled differential-drive mobile bases: it subscribes to `geometry_msgs/msg/Twist` on `cmd_vel`, converts linear/angular velocity into left/right wheel velocity commands using the wheel separation and radius you configure, and publishes odometry computed from wheel encoder feedback — exactly the controller used in Unit 2's basic pipeline.

## Try it yourself

For a robot you've configured in an earlier unit (or a fresh two-joint stub), list every command interface your hardware interface exports, then match each one against a controller from this unit. Configure and spawn the matching controller, and confirm with `ros2 control list_controllers -v` that it claims exactly the interfaces you expected — no more, no fewer.
