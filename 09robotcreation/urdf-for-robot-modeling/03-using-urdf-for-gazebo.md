# URDF for Robot Modeling — Unit 3: Using URDF for Gazebo

A URDF that only has `<visual>` tags looks correct in RViz but is invisible to physics: nothing collides, nothing has mass, and a simulator has no idea how the robot should fall, balance, or push against the world. This unit adds what's missing so your lamp robot can be spawned into Gazebo (or any URDF-consuming simulator) as a physical object.

## Why visual geometry isn't enough for simulation
Simulators need a separate, usually simpler, geometry to run contact and collision checks against — recomputing collisions against a detailed mesh every physics step is expensive and can be numerically unstable. That's what `<collision>` is for: it lives alongside `<visual>` inside a `<link>` and is often a cruder shape (a box or cylinder standing in for a detailed mesh):

```xml
<link name="upper_arm">
  <visual>
    <geometry><mesh filename="package://my_robot/meshes/upper_arm.dae"/></geometry>
  </visual>
  <collision>
    <geometry><cylinder radius="0.03" length="0.15"/></geometry>
  </collision>
  ...
</link>
```

A link with `<visual>` but no `<collision>` renders fine but simply passes through everything else in simulation.

## Inertial properties: mass and inertia tensors
Physics also needs mass and how that mass is distributed — the `<inertial>` block:

```xml
<inertial>
  <mass value="0.4"/>
  <origin xyz="0 0 0.075" rpy="0 0 0"/>
  <inertia ixx="0.001" ixy="0" ixz="0" iyy="0.001" iyz="0" izz="0.0002"/>
</inertial>
```

`mass` is in kilograms, and `<inertia>` is the 3x3 inertia tensor (symmetric, so only six values are needed). You don't have to derive these by hand for every link — for simple primitive shapes there are standard closed-form formulas (a solid cylinder, box, sphere), and CAD tools can compute them directly from a mesh. What matters early on is *not leaving them at zero*: a zero or missing inertia tensor is one of the most common reasons a simulated robot behaves erratically or Gazebo refuses to load it.

## Gazebo-specific tags
Some information belongs to the simulator, not to the robot's physical description, and URDF has an escape hatch for that: the `<gazebo>` tag, which can either wrap simulator-only additions or reference an existing link/joint by name to attach extra properties (friction coefficients, sensor plugins, colors that only Gazebo understands):

```xml
<gazebo reference="upper_arm">
  <mu1>0.8</mu1>
  <mu2>0.8</mu2>
</gazebo>
```

This is also where simulated sensors (cameras, lidars, IMUs) and control plugins get attached, though that's covered in more depth in later ROS control and simulation material — for this course, focus on getting friction and basic physical realism right.

## Spawning the robot in Gazebo
Once visual, collision, and inertial tags are filled in, the usual pattern is: publish `robot_description` (your URDF as a parameter), start Gazebo, and spawn an entity that reads that parameter — commonly via a launch file that calls a spawn tool such as `ros_gz_sim create` (or the equivalent `spawn_entity.py`-style tool for your ROS/Gazebo combination). Watch the terminal output — a missing inertia or an invalid collision mesh usually surfaces here as a spawn failure or a robot that instantly falls through the floor.

## Try it yourself
Take the lamp URDF from Unit 2 and add `<collision>` and `<inertial>` blocks to every link (use simple primitive shapes for collision, and reasonable made-up mass/inertia values — they don't need to be perfectly accurate yet). Spawn it in your simulator of choice and confirm it stays upright under gravity instead of falling apart or sinking through the ground plane.
