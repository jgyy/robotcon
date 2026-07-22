# URDF for Robot Modeling in ROS2 — Unit 7: Xacro Basics

By now your URDF files are getting long and repetitive — two wheels defined almost identically, inertia formulas typed out by hand, sensor blocks duplicated with only a name changed. Xacro (XML Macros) is the templating layer that fixes this, and it's what real-world robot descriptions are almost always written in rather than raw URDF.

## Basics of using Xacro

Xacro is a preprocessor: you write a `.urdf.xacro` file using an extended XML vocabulary (properties, macros, conditionals, math expressions), and a Xacro processor expands it into plain URDF before anything else (RViz2, `robot_state_publisher`, Gazebo) ever sees it. Nothing downstream needs to know Xacro exists — it only ever consumes the final expanded URDF.

## Manually generating URDF from Xacro

You can run the expansion yourself from the command line, which is useful for debugging what a Xacro file actually produces:

```bash
xacro my_robot.urdf.xacro > my_robot.urdf
check_urdf my_robot.urdf
```

## Processing Xacro inside launch files

In practice you rarely generate a static `.urdf` file at all — launch files typically call the Xacro processor at launch time and feed the result straight into `robot_state_publisher`'s `robot_description` parameter, so edits to the `.xacro` source take effect on the next launch with no manual regeneration step:

```python
robot_description = Command(['xacro ', xacro_file_path])
robot_state_publisher_node = Node(
    package='robot_state_publisher',
    executable='robot_state_publisher',
    parameters=[{'robot_description': robot_description}],
)
```

## Properties, macros, and conditionals

**Properties** are named constants you can reuse and reference by expression instead of duplicating magic numbers across the file:

```xml
<xacro:property name="wheel_radius" value="0.1"/>
<cylinder radius="${wheel_radius}" length="0.05"/>
```

**Macros** are the real payoff — a reusable template you define once and instantiate with different parameters, eliminating the copy-pasted left/right wheel problem entirely:

```xml
<xacro:macro name="wheel" params="prefix reflect">
  <link name="${prefix}_wheel">
    <visual><geometry><cylinder radius="${wheel_radius}" length="0.05"/></geometry></visual>
  </link>
  <joint name="${prefix}_wheel_joint" type="continuous">
    <parent link="base_link"/><child link="${prefix}_wheel"/>
    <origin xyz="0 ${reflect*0.2} 0" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
  </joint>
</xacro:macro>

<xacro:wheel prefix="left" reflect="1"/>
<xacro:wheel prefix="right" reflect="-1"/>
```

**Conditional blocks** (`<xacro:if value="...">` / `<xacro:unless>`) let a single Xacro file produce different URDF depending on an argument — for example, including a lidar sensor block only when a `has_lidar` property is true, so one file serves both a base and a sensor-equipped robot variant.

## Splitting files and spawning multiple robots

Large robots are usually split across several `.xacro` files by concern — one for the chassis, one for a sensor suite, one for a gripper — and combined with `<xacro:include filename="..."/>` in a top-level file, the same way you'd split a large codebase into modules. This also makes multi-robot simulation manageable: since each spawned robot needs uniquely-named links, joints, and topics, a macro-based Xacro file can take a `robot_name` (or namespace) parameter and generate a fully prefixed model per instance, letting you spawn several copies of the same robot design into one Gazebo Sim world without name collisions.

## Try it yourself

Refactor your two-wheeled robot's URDF into Xacro: define a `wheel` macro parameterized by prefix and Y-offset sign (as above), a `wheel_radius` property used both in the macro and in your differential-drive plugin's `<wheel_radius>` tag, and confirm `xacro` expansion followed by `check_urdf` produces the same link/joint tree as your original hand-written file.
