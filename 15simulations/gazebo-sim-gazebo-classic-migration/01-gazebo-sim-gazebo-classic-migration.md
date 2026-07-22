# Gazebo Sim - Gazebo Classic Migration — Unit 1: Gazebo Sim - Gazebo Classic Migration

This unit is a practical field guide for the migration you'll eventually run in the opposite direction of most tutorials: taking a project built on modern Gazebo Sim (formerly "Ignition Gazebo") + ROS 2 and porting it back to Gazebo Classic + ROS 1. You'll hit this scenario when a lab, employer, or downstream package still pins Classic, and you need your model, plugins, and launch files to behave identically on both stacks.

## Introduction: what you'll learn

Gazebo Sim and Gazebo Classic share a name and a lot of vocabulary (SDF, models, worlds, plugins) but they are different codebases with different plugin APIs, different transport layers (Gazebo Transport vs. the old `gazebo::transport`), and different ROS integration packages (`ros_gz` vs. `gazebo_ros_pkgs`). Migrating "backward" from Sim to Classic means you can't just swap a version number — you're re-targeting an API. By the end of this unit you'll be able to take a working Gazebo Sim + ROS 2 package and produce a Gazebo Classic + ROS 1 equivalent that spawns the same robot, keeps the same physical behavior, and exposes the same topics to the rest of your stack.

## Initial setup: preparing your environment

Before touching any files, get a clean, side-by-side environment so you can compare behavior rather than guess at it.

- Install Gazebo Classic and `gazebo_ros_pkgs` alongside your ROS 1 distribution (`sudo apt install ros-<distro>-gazebo-ros-pkgs`), and keep your existing ROS 2 + Gazebo Sim workspace untouched as your reference.
- Create a fresh ROS 1 workspace (`catkin_ws` or `catkin build`-based) that mirrors the package layout of your ROS 2 workspace — same package name where possible, so downstream references don't need renaming.
- Copy your `urdf/`, `worlds/`, `meshes/`, and `launch/` directories into the new package as a starting point; you will edit copies, not the originals, so the ROS 2 version keeps working.
- Sanity-check the baseline: launch the Gazebo Sim version first (`ros2 launch <pkg> sim.launch.py`) and note exactly what topics, TF frames, and joint behavior it produces with `ros2 topic list` and `ros2 topic echo`. This is your regression baseline for the Classic port.

## Migrating URDF files

The URDF `<robot>` block itself is largely portable — links, joints, visuals, and collisions don't change between simulators. What changes is everything inside `<gazebo>` extension tags, because those tags configure simulator-specific plugins and sensors.

```xml
<!-- Gazebo Sim (ros_gz) style -->
<gazebo>
  <plugin filename="gz-sim-diff-drive-system"
          name="gz::sim::systems::DiffDrive">
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
  </plugin>
</gazebo>

<!-- Gazebo Classic (gazebo_ros_pkgs) style -->
<gazebo>
  <plugin name="differential_drive_controller"
          filename="libgazebo_ros_diff_drive.so">
    <leftJoint>left_wheel_joint</leftJoint>
    <rightJoint>right_wheel_joint</rightJoint>
  </plugin>
</gazebo>
```

Work through the URDF one `<gazebo>` block at a time: keep the geometry untouched, and replace each plugin reference and its parameter names using the Classic equivalents. If you use xacro, keep the xacro macros for links/joints shared between both versions and split only the `<gazebo>` extensions into a per-simulator include file — this avoids maintaining two full copies of the robot description.

## Migrating materials & wheel friction

Gazebo Sim commonly expresses visual materials via `<material>` with PBR (physically based rendering) textures, while Classic expects the older Ogre material scripts or the simpler `<material>Gazebo/Blue</material>` shorthand. Convert PBR material references to a Classic material script (`.material` file under a `media/materials/scripts/` folder) or fall back to a built-in Gazebo color name if the exact look doesn't matter for your simulation.

Friction is the part most people get wrong, because the two simulators expose ODE friction coefficients through slightly different surface tags:

```xml
<gazebo reference="left_wheel_link">
  <mu1>1.0</mu1>
  <mu2>1.0</mu2>
  <kp>1000000.0</kp>
  <kd>100.0</kd>
</gazebo>
```

Check the SDF version your Gazebo Sim world was authored against (`<sdf version="1.9">` or similar) versus what Classic ships with — friction and contact parameter names have shifted across SDF versions, so a value that "worked" in Sim may silently default to something else in Classic. After migrating, drive the robot in both sims on the same flat plane and compare wheel slip qualitatively; don't assume the numbers transfer 1:1.

## Migrating ROS plugins

This is the core of the port. `ros_gz` (ROS 2 + Gazebo Sim) and `gazebo_ros_pkgs` (ROS 1/2 + Gazebo Classic) are separate plugin sets with different naming conventions, different `.so`/library names, and different parameter block styles (`<left_joint>` vs `<leftJoint>`, snake_case topics vs configurable topics). There is no automatic converter — you map plugin-by-plugin:

| Purpose | Gazebo Sim plugin | Gazebo Classic plugin |
|---|---|---|
| Differential drive | `gz-sim-diff-drive-system` | `libgazebo_ros_diff_drive.so` |
| Joint state publishing | `gz-sim-joint-state-publisher-system` | `libgazebo_ros_joint_state_publisher.so` |
| Camera sensor | `gz-sim-sensors-system` (via `<sensor type="camera">`) | `libgazebo_ros_camera.so` |
| IMU sensor | `gz-sim-imu-system` | `libgazebo_ros_imu_sensor.so` |

For each plugin, open the Classic plugin's parameter list (usually documented in header comments in `gazebo_ros_pkgs`) and re-express every Sim parameter in the Classic tag names, keeping topic names identical if you want downstream nodes to work unchanged. Rebuild the workspace after each plugin swap and check `rostopic list` against your ROS 2 baseline rather than migrating everything at once — one plugin failing silently (wrong `.so` name, missing dependency) is much easier to spot in isolation.

## Migrating launch files

`ros2 launch` Python launch files and ROS 1 `.launch` XML files differ enough that a straight syntax translation is the wrong mental model — translate intent instead. Identify what the ROS 2 launch file actually does (start Gazebo, spawn the robot from URDF, start `robot_state_publisher`, start controllers) and rebuild that sequence with ROS 1 idioms:

```xml
<launch>
  <include file="$(find gazebo_ros)/launch/empty_world.launch">
    <arg name="world_name" value="$(find my_robot_gazebo)/worlds/my_world.world"/>
  </include>

  <param name="robot_description"
         command="$(find xacro)/xacro $(find my_robot_description)/urdf/my_robot.urdf.xacro"/>

  <node name="spawn_robot" pkg="gazebo_ros" type="spawn_model"
        args="-urdf -param robot_description -model my_robot"/>

  <node name="robot_state_publisher" pkg="robot_state_publisher"
        type="robot_state_publisher"/>
</launch>
```

Note the structural swaps: `ros2 launch`'s `IncludeLaunchDescription` becomes `<include>`, `Node` actions become `<node>` tags, and spawning is done via the `spawn_model` script instead of a `ros_gz_sim create` call. Keep launch arguments (`world`, `use_sim_time`, `x`/`y`/`z` spawn pose) named consistently across both files so any wrapper tooling or CI scripts you have don't need simulator-specific branches.

## Conclusions: what you learned

You now have a repeatable checklist for porting a Gazebo Sim + ROS 2 project to Gazebo Classic + ROS 1: stand up a parallel workspace, port geometry-only URDF as-is and rewrite `<gazebo>` extensions, re-derive materials and friction per SDF version, map ROS plugins one-for-one by function rather than by name, and translate launch file *intent* rather than syntax. The same checklist runs in reverse for a Classic-to-Sim migration, which is worth remembering if your team eventually moves the other way.

## Try it yourself

Take a URDF with at least one differential-drive plugin and one sensor (camera or IMU) authored for Gazebo Sim. Produce a Gazebo Classic version of it: rewrite the `<gazebo>` extensions using the mapping table above, spawn it in Classic with `roslaunch`, and verify with `rostopic echo` that the same topic names publish data with the same approximate rate and shape as the Gazebo Sim original.
