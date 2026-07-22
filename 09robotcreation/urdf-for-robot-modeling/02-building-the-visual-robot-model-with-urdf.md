# URDF for Robot Modeling — Unit 2: Building the Visual Robot Model with URDF

This unit turns the link/joint sketch from Unit 1 into real XML: the tags that give a link a visible shape, the tags that connect links into a moving tree, and the tools that let you check your work without waiting until Gazebo to find out you got it wrong.

## Anatomy of a `<link>`
A link's visible appearance lives in its `<visual>` block, which itself contains `<geometry>`, an `<origin>`, and optionally a `<material>`:

```xml
<link name="lamp_head">
  <visual>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
    <geometry>
      <cylinder radius="0.04" length="0.10"/>
    </geometry>
    <material name="yellow">
      <color rgba="0.9 0.8 0.1 1.0"/>
    </material>
  </visual>
</link>
```

`<geometry>` accepts primitives (`box`, `cylinder`, `sphere`) or a `<mesh filename="...">` pointing at an STL or DAE file. Primitives are fine for early prototyping; meshes are what you'll use once you want a robot that actually looks like something. `<origin>` positions and orients the geometry *relative to the link's own frame* — it does not move the link itself, only where the shape sits inside it.

## Connecting links with `<joint>`
A `<joint>` names its `parent` link and `child` link, a `type`, an `<origin>` (where the child's frame sits relative to the parent's), and — for moving joints — an `<axis>` and `<limit>`:

```xml
<joint name="shoulder_joint" type="revolute">
  <parent link="base_link"/>
  <child link="upper_arm"/>
  <origin xyz="0 0 0.1" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
</joint>
```

The joint types you'll use constantly:

- `fixed` — no motion, rigidly welded (sensor mounts, decorative parts). No `<axis>` or `<limit>` needed.
- `revolute` — rotates about `<axis>` within `<limit>` bounds (a shoulder, an elbow).
- `continuous` — rotates about `<axis>` with no limit (a wheel).
- `prismatic` — slides along `<axis>` within `<limit>` bounds (a linear rail).

## Building the tree from scratch
Assemble the lamp from Unit 1's sketch by chaining joints: `base_link -> shoulder_joint -> upper_arm -> elbow_joint -> lamp_head`. Each joint's `<origin>` offsets the child relative to where the parent joint left off, so the chain visually stacks even though every link is defined in its own local frame. Keep names descriptive and consistent (`*_link` for links, `*_joint` for joints) — it pays off the moment you're debugging a 20-link Gurdy robot in Unit 4.

## Validating and visualizing
Don't hand-parse your own XML for mistakes — use the tools:

```bash
check_urdf lamp.urdf                 # reports the parsed link/joint tree, or the first XML error
urdf_to_graphiz lamp.urdf            # writes a .pdf/.dot diagram of the link tree
```

To actually see the model move, publish it and load it in RViz: `robot_state_publisher` turns the URDF plus `/joint_states` into TF, and `joint_state_publisher_gui` gives you sliders to drive each non-fixed joint by hand — an easy way to catch a wrong axis or a flipped limit before anything touches physics.

## Try it yourself
Write the full URDF for the desk-lamp robot you sketched in Unit 1: a fixed `base_link`, a `revolute` shoulder joint, an `upper_arm` link, a `revolute` elbow joint, and a `lamp_head` link with a visible geometry and color. Run `check_urdf` on it, then load it with `robot_state_publisher` + `joint_state_publisher_gui` + RViz and confirm you can move both joints with the sliders.
