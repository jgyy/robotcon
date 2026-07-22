# URDF for Robot Modeling in ROS2 — Unit 4: Using URDF for Gazebo Sim

So far your robot has only existed as a visual/kinematic model in RViz2 — nothing has mass, nothing collides, nothing responds to gravity. This unit takes the same URDF into a physics simulator so it becomes a robot that can actually be dropped into a world and act like a physical object.

## Starting Gazebo Sim and building a world

Gazebo Sim (the modern successor to the classic "Gazebo") separates the **world** — terrain, lighting, static obstacles, physics parameters — from the **robot model** you spawn into it. You typically start from an empty or mostly-empty world SDF file and launch it with:

```bash
gz sim my_world.sdf
```

or, more commonly in a ROS2 workflow, via a launch file that starts Gazebo Sim as a subprocess and bridges its topics to ROS2 using `ros_gz_bridge`. Building your own minimal world (a ground plane, a light source, maybe a wall or two) rather than always using the stock empty world gives you a repeatable, version-controlled environment to test your robot in.

## Adapting a robot model for Gazebo Sim

A URDF written purely for RViz2 visualization is usually incomplete for simulation. Two things almost always need adding:

- **Inertial properties on every link that should be affected by physics.** A link with no `<inertial>` block (or a zero mass) is often treated as effectively massless or infinitely rigid, which produces unstable or nonsensical simulation behavior — chassis flying off, joints locking, etc.
- **Gazebo-specific tags**, wrapped in `<gazebo>` elements alongside the standard URDF, to configure things Gazebo needs that plain URDF has no vocabulary for: friction coefficients, sensor and plugin attachments, and material references in Gazebo's own format.

```xml
<gazebo reference="left_wheel">
  <mu1>1.0</mu1>
  <mu2>1.0</mu2>
</gazebo>
```

## Completing the robot: collisions and inertias

"Complete" here means every link that participates in physics has a sane `<collision>` geometry (simple shapes, not necessarily identical to the `<visual>` mesh) and a plausible `<inertial>` block. For simple primitive shapes, the inertia tensor has a well-known closed form (a solid box's or cylinder's moment of inertia is a standard formula), so you rarely need to hand-derive it from scratch — you compute it from the shape's dimensions and mass. Getting this step wrong is one of the most common sources of "my robot explodes in simulation" bug reports.

## Spawning the robot and physical properties

With the URDF complete, a launch file typically does three things in sequence: start Gazebo Sim with your world, publish the robot description (via `robot_state_publisher`, exactly as in Unit 2), and call the spawn service/entity-creation tool to instantiate the robot inside the running simulation, e.g.:

```bash
ros2 run ros_gz_sim create -topic robot_description -name my_box_bot -x 0 -y 0 -z 0.2
```

Once spawned, physical properties like friction, damping, and gravity now actually apply — this is the point where you'll notice, for example, a wheel with `mu1`/`mu2` set too low sliding instead of rolling.

## Try it yourself

Take the two-wheeled robot from Unit 3, add inertial blocks to every link, wrap the wheel links in `<gazebo>` tags with a reasonable friction value, and spawn it into an empty Gazebo Sim world. Confirm it settles onto the ground plane under gravity without jittering or sinking through the floor — if it does either, that's your cue to revisit the inertia values or collision geometry.
