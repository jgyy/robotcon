# URDF for Robot Modeling — Unit 5: XACRO Basics

Gurdy's three hand-copied legs in Unit 4 already felt repetitive with just two joints per leg — real robots have far more repeated structure than that. XACRO (XML Macros) is a preprocessor for URDF that adds variables, math, and reusable templates, and this unit teaches the basics you need to make Gurdy's legs maintainable.

## Why XACRO: the problem of repetition
Plain URDF has no notion of "repeat this with different numbers." Every leg, every wheel, every finger on a gripper has to be spelled out link-by-link and joint-by-joint. That means: fixing a bug (wrong collision size, wrong mass) requires editing it in every copy, and there's no single source of truth for "what does one leg look like." XACRO solves this the same way a function solves repeated code in a normal program — write the pattern once, parameterize what changes, instantiate it as many times as you need.

A XACRO file is still XML, using the `.urdf.xacro` extension by convention, with an extra namespace declaration:

```xml
<?xml version="1.0"?>
<robot name="gurdy" xmlns:xacro="http://www.ros.org/wiki/xacro">
  ...
</robot>
```

## Properties and math expressions
`<xacro:property>` defines a named constant you can reuse and do arithmetic with via `${...}`:

```xml
<xacro:property name="leg_length" value="0.08"/>
<xacro:property name="hip_radius" value="0.1"/>

<origin xyz="${hip_radius} 0 0" rpy="0 0 0"/>
<geometry><box size="0.02 0.02 ${leg_length}"/></geometry>
```

This alone removes a whole class of bugs: change `leg_length` once, and every reference updates, instead of hunting down every hardcoded `0.08` in the file.

## Macros: `xacro:macro` and parameters
`<xacro:macro>` is the real payoff — a reusable block of URDF that takes parameters, including an angle for leg placement:

```xml
<xacro:macro name="leg" params="prefix angle_deg">
  <joint name="${prefix}_hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="${prefix}_upper"/>
    <origin xyz="${hip_radius * cos(angle_deg * pi / 180)} ${hip_radius * sin(angle_deg * pi / 180)} 0" rpy="0 0 ${angle_deg * pi / 180}"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.6" upper="0.6" effort="5" velocity="1.0"/>
  </joint>
  <link name="${prefix}_upper">
    <visual><geometry><box size="0.02 0.02 ${leg_length}"/></geometry></visual>
    <collision><geometry><box size="0.02 0.02 ${leg_length}"/></geometry></collision>
    <inertial>
      <mass value="0.05"/>
      <inertia ixx="1e-5" ixy="0" ixz="0" iyy="1e-5" iyz="0" izz="1e-6"/>
    </inertial>
  </link>
  <!-- knee joint and lower leg link would continue the same pattern -->
</xacro:macro>

<xacro:leg prefix="leg1" angle_deg="0"/>
<xacro:leg prefix="leg2" angle_deg="120"/>
<xacro:leg prefix="leg3" angle_deg="240"/>
```

Three lines now generate what took three full hand-written blocks in Unit 4, and the trigonometry means you never hand-derive an `<origin>` for a rotated leg again — you can even change the number of legs by adding one more `xacro:leg` call. For splitting large files, `<xacro:include filename="..."/>` pulls in macros and properties defined in another file, the same way you'd split a large program across modules.

## Converting and using XACRO files
XACRO files aren't loaded directly by `robot_state_publisher` — they're expanded into plain URDF/XML first, either from the command line for inspection:

```bash
xacro gurdy.urdf.xacro > gurdy.urdf
check_urdf gurdy.urdf
```

or inline in a launch file, which typically calls the `xacro` processor on the file and feeds the resulting XML straight into the `robot_description` parameter — so day-to-day you rarely look at the expanded file at all, but it's worth generating it once to sanity-check what your macros actually produce.

## Try it yourself
Refactor the Gurdy legs you hand-wrote in Unit 4 into a `xacro:macro` parameterized by `prefix` and `angle_deg` as shown above, extend it to include the knee joint and lower-leg link, then instantiate it three times. Run `xacro` on the file and diff the expanded output against your original hand-written URDF from Unit 4 to confirm they produce an equivalent robot.
