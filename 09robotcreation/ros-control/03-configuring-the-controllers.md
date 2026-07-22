# ROS Control — Unit 3: Configuring the Controllers

With the vocabulary from Unit 2 in hand, this unit is about the practical mechanics of wiring stock controllers onto a robot in simulation: the URDF tag that declares the hardware interface, the YAML file that configures controllers, and the commands that bring them to life.

## Declaring the hardware interface in URDF
`ros2_control` expects a `<ros2_control>` block inside (or included from) your robot's URDF/XACRO, describing each joint's available command and state interfaces and which hardware plugin backs them:

```xml
<ros2_control name="MyRobotSystem" type="system">
  <hardware>
    <plugin>gazebo_ros2_control/GazeboSystem</plugin>
  </hardware>
  <joint name="wheel_left_joint">
    <command_interface name="velocity"/>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
  <joint name="wheel_right_joint">
    <command_interface name="velocity"/>
    <state_interface name="position"/>
    <state_interface name="velocity"/>
  </joint>
</ros2_control>
```

In simulation the `<plugin>` points at a simulator-provided hardware interface (e.g. `gazebo_ros2_control/GazeboSystem`); on real hardware it points at the custom hardware interface you'll build in Unit 6. In ROS 1's `ros_control`, the equivalent is a `<transmission>` block plus a `hardware_interface::RobotHW` implementation — same idea, older syntax.

## The controller configuration YAML
Controllers are configured, not hardcoded — a YAML file lists which controllers to instantiate, their type, and their parameters:

```yaml
controller_manager:
  ros__parameters:
    update_rate: 100  # Hz

    joint_state_broadcaster:
      type: joint_state_broadcaster/JointStateBroadcaster

    diff_drive_controller:
      type: diff_drive_controller/DiffDriveController

diff_drive_controller:
  ros__parameters:
    left_wheel_names: ["wheel_left_joint"]
    right_wheel_names: ["wheel_right_joint"]
    wheel_separation: 0.4
    wheel_radius: 0.1
```

Keeping controller parameters in YAML rather than code means you can retune gains, swap wheel geometry, or point a controller at different joints without recompiling anything.

## Loading and activating controllers
Once the controller manager is running (usually started from your robot's launch file), controllers are *spawned* — loaded, configured, and activated — via a helper:

```bash
ros2 run controller_manager spawner joint_state_broadcaster
ros2 run controller_manager spawner diff_drive_controller
```

Most launch-file setups call the same `spawner` as a launch action so the whole robot comes up with its controllers already active. Order matters loosely: `joint_state_broadcaster` is conventionally spawned first since almost everything else (RViz, TF) depends on `/joint_states` existing.

## Try it yourself
Take a differential-drive robot description (your own from an earlier course, or any simulator example package) and write a `controller_manager` YAML that loads a `joint_state_broadcaster` and a `diff_drive_controller` for it. Launch the robot, spawn both controllers, and confirm with `ros2 topic echo /joint_states` that state is flowing before you try sending any velocity commands.
