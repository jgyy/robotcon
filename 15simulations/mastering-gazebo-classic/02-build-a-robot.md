# Mastering Gazebo Classic — Unit 2: Build a Robot

With the Gazebo mental model in place, it's time to describe an actual robot. This unit builds a simple differential-drive mobile robot piece by piece — links, joints, wheels, meshes — and gets it standing in a Gazebo world.

## URDF vs SDF

Gazebo natively speaks SDF, but almost every ROS robot is described in **URDF** (Unified Robot Description Format), a simpler XML dialect focused on kinematic trees rather than full simulation detail. Gazebo doesn't force a choice: it ships a URDF-to-SDF converter, so you can write your robot once in URDF (which the rest of the ROS ecosystem — `robot_state_publisher`, `tf2`, MoveIt — also consumes) and let Gazebo translate it internally when it's spawned. The practical rule of thumb: use URDF for the robot itself so it stays portable across tools, and reach for raw SDF only for simulation-only content (worlds, static props, sensors with physics quirks that URDF can't express cleanly) — you'll do exactly that in Unit 4.

## Creating a Mobile Robot: Links and Joints

A URDF is a tree of `<link>` elements (rigid bodies) connected by `<joint>` elements (how one body can move relative to its parent). Start with a chassis:

```xml
<link name="base_link">
  <visual>
    <geometry><box size="0.4 0.3 0.1"/></geometry>
  </visual>
  <collision>
    <geometry><box size="0.4 0.3 0.1"/></geometry>
  </collision>
  <inertial>
    <mass value="2.0"/>
    <inertia ixx="0.01" ixy="0" ixz="0" iyy="0.02" iyz="0" izz="0.02"/>
  </inertial>
</link>
```

Unlike pure visualization in RViz, Gazebo actually integrates physics over these bodies, so `<inertial>` is not optional here — a link with zero or missing mass/inertia will either be treated as immovable or make the physics engine unstable. Keep `<collision>` geometry simple (boxes, cylinders) even when `<visual>` uses a detailed mesh; collision checking runs every physics step, so complexity there is a direct performance cost.

## Wheel Definition

Each wheel is its own link, attached with a `continuous` joint (unlimited rotation) around its axle axis:

```xml
<joint name="left_wheel_joint" type="continuous">
  <parent link="base_link"/>
  <child link="left_wheel"/>
  <origin xyz="0 0.2 -0.05" rpy="-1.5708 0 0"/>
  <axis xyz="0 0 1"/>
</joint>
```

Note the `rpy` rotation: a cylinder's default axis is its own Z, so it needs rotating 90° to lie flat as a wheel. Give wheels a reasonably high friction coefficient later (Unit 3 covers Gazebo's `<gazebo>` friction tags) or they'll skate instead of roll.

## Complete the Robot, and Meshes

Repeat the pattern for the second drive wheel and a free-spinning caster (a `fixed` or small sphere link) for a stable three-point stance. Once the kinematic skeleton works with simple box/cylinder geometry, swap `<visual>` (never `<collision>`, for performance reasons) to reference real meshes for a presentable look:

```xml
<visual>
  <geometry>
    <mesh filename="package://my_robot_description/meshes/chassis.dae"/>
  </geometry>
</visual>
```

Gazebo resolves `package://` URIs the same way `rviz2` does, provided your package is on the ROS package path — no extra configuration needed.

## Spawn the Robot in Gazebo

With a `gzserver` (or a full `gazebo`) running, spawn the URDF via the ROS-Gazebo bridge rather than editing the world file by hand — this is the same mechanism a launch file uses under the hood:

```bash
ros2 run gazebo_ros spawn_entity.py -entity my_robot -topic robot_description -x 0 -y 0 -z 0.1
```

(The ROS 1 equivalent is `rosrun gazebo_ros spawn_model -urdf -param robot_description -model my_robot`.) The `-topic robot_description` flag tells the spawner to read the URDF/XACRO XML that `robot_state_publisher` published, keeping one single source of truth for the robot description.

## Applying Force/Torque

To sanity-check that your links and joints actually respond to physics before writing any controller, you can nudge a link directly through Gazebo's ROS service interface:

```bash
ros2 service call /apply_body_wrench gazebo_msgs/srv/ApplyBodyWrench \
  "{body_name: 'my_robot::base_link', wrench: {force: {x: 5.0}}, duration: {sec: 1}}"
```

If the chassis slides forward for one second and stops, your inertial and collision setup is sane; if it flips or vibrates, revisit mass/inertia values before moving on.

## Try it yourself

Add a second, independent wheel pair (four-wheel skid-steer instead of two-wheel differential) to a fresh URDF, spawn it, and use `apply_body_wrench` on a single wheel link to confirm it spins freely around its joint axis without dragging the whole chassis with it.
