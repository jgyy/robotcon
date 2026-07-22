# URDF for Robot Modeling — Unit 6: Project: Advanced XACRO and Create your own Boxing Robot

This capstone unit adds a few more XACRO tools beyond basic macros — conditionals and mirrored macro reuse — and applies everything from the course to a robot you design yourself: a "Boxing Robot" with a torso and two punching arms.

## Advanced XACRO: conditionals
`xacro:if` and `xacro:unless` let a macro emit different XML depending on a parameter, which is useful for things like left/right mirroring or optional attachments (a gripper only on one arm, say):

```xml
<xacro:macro name="arm" params="side reflect">
  <joint name="${side}_shoulder_joint" type="revolute">
    <parent link="torso"/>
    <child link="${side}_upper_arm"/>
    <origin xyz="0 ${reflect * 0.15} 0.2" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-2.0" upper="0.3" effort="15" velocity="2.0"/>
  </joint>
  <link name="${side}_upper_arm">
    <visual><geometry><cylinder radius="0.03" length="0.18"/></geometry></visual>
    <collision><geometry><cylinder radius="0.03" length="0.18"/></geometry></collision>
    <inertial>
      <mass value="0.3"/>
      <inertia ixx="8e-4" ixy="0" ixz="0" iyy="8e-4" iyz="0" izz="1.5e-4"/>
    </inertial>
  </link>
  <xacro:if value="${side == 'left'}">
    <!-- left-arm-only extras, e.g. a different colored glove, go here -->
  </xacro:if>
</xacro:macro>

<xacro:arm side="left" reflect="1"/>
<xacro:arm side="right" reflect="-1"/>
```

The `reflect` parameter (`1`/`-1`) is a common trick for mirroring position offsets across the robot's centerline without writing the geometry twice — combined with `${side}` for naming, one macro call per side produces a fully symmetric pair of arms.

## Designing the Boxing Robot structure
Plan the tree before writing XACRO, the same way you did for Gurdy: a `base_link` (feet/stand), a `torso` connected by a `fixed` or `revolute` waist joint, two arms (shoulder -> forearm -> fist) attached to the torso via the mirrored macro above, and optionally a `head`. Decide early which joints actually need to move for "boxing" — shoulders and elbows at minimum — versus which can be `fixed` to keep the model manageable for a first pass.

## Assembling with macros for symmetry
Extend the `arm` macro to include an elbow joint and a `fist` link, following the same pattern as Gurdy's hip-and-knee leg macro from Unit 5. Keep the macro's parameters minimal (`side`, `reflect`, and maybe a `has_glove` boolean) — the goal is one macro instantiated twice, not two near-duplicate macros. If you want a swinging punch motion, give the elbow a wide `<limit>` range and check it visually with `joint_state_publisher_gui` before moving to simulation.

## Final integration checklist
Before calling the model done, run through the same verification pipeline from every prior unit, now on the full robot:

1. `xacro boxing_robot.urdf.xacro > boxing_robot.urdf` then `check_urdf` — confirms the tree is well-formed with no duplicate or dangling links.
2. `urdf_to_graphiz` — visually confirm the torso branches into exactly two symmetric arm chains.
3. RViz with `robot_state_publisher` + `joint_state_publisher_gui` — every joint moves in the expected direction, and left/right arms mirror each other correctly.
4. Spawn in your simulator — collision and inertial values are present on every link, the robot doesn't collapse or fall through the floor under gravity.

## Try it yourself
Design and build your own Boxing Robot end to end: a torso, two mirrored arms built from a single parameterized `xacro:macro` (shoulder + elbow + fist), full visual/collision/inertial tags on every link, and a `<gazebo>` friction tag on the fists. Take it through the full checklist above, and confirm both arms move symmetrically when driven from the same joint angle with opposite sign.
