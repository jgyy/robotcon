# URDF for Robot Modeling — Unit 4: Create the URDF files for a Gurdy Robot from scratch

Everything so far used a single-chain arm — one link leads to the next in a straight line. A real robot is rarely that simple: this unit builds "Gurdy," a three-legged robot where the base branches into three identical leg chains, forcing you to plan a tree with multiple branches and handle the repetition that comes with it (a preview of why Unit 5 introduces XACRO).

## Planning the kinematic tree for a multi-legged robot
Before writing any XML, draw the tree. Gurdy's shape is: one central `base_link`, with three legs attached at 120° around it, and each leg made of an upper segment and a lower segment ending in a foot:

```
base_link
 ├── leg1_upper -- leg1_lower -- leg1_foot
 ├── leg2_upper -- leg2_lower -- leg2_foot
 └── leg3_upper -- leg3_lower -- leg3_foot
```

Unlike the lamp's single chain, `base_link` here has three children, meaning three separate joints all with `base_link` as their `parent`. Decide the coordinate convention up front — which axis is "up," how the legs are angled around the base — before you start placing `<origin>` offsets, or you'll be fighting sign errors the whole way through.

## Modeling one leg
Build and fully verify a single leg first, in isolation, before replicating it. A typical hip-to-foot chain uses two revolute joints (hip and knee):

```xml
<joint name="leg1_hip_joint" type="revolute">
  <parent link="base_link"/>
  <child link="leg1_upper"/>
  <origin xyz="0.1 0 0" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>
  <limit lower="-0.6" upper="0.6" effort="5" velocity="1.0"/>
</joint>

<link name="leg1_upper">
  <visual><geometry><box size="0.02 0.02 0.08"/></geometry></visual>
  <collision><geometry><box size="0.02 0.02 0.08"/></geometry></collision>
  <inertial>
    <mass value="0.05"/>
    <inertia ixx="1e-5" ixy="0" ixz="0" iyy="1e-5" iyz="0" izz="1e-6"/>
  </inertial>
</link>
```

Load this one leg (attached to a placeholder base) in RViz with `joint_state_publisher_gui` and confirm the hip and knee move the way you expect before you copy anything.

## Replicating legs with consistent naming and symmetry
Once leg 1 works, legs 2 and 3 are the same structure rotated 120° and 240° around the base. Two things matter here: consistent naming (`leg2_upper`, `leg2_hip_joint`, ...) so tools and later code can address any leg programmatically, and correctly recomputed `<origin>` values for each leg's attachment point and orientation — copy-pasting the leg's *internal* geometry is fine, but the hip joint's origin relative to `base_link` must change for each leg. This hand-copying is tedious and error-prone on purpose — it's the exact pain that motivates XACRO macros in the next unit.

## Testing the full model
With all three legs in place, validate structurally first (`check_urdf`, `urdf_to_graphiz` — confirm you see three branches, not a tangled or disconnected tree), then behaviorally: load the full robot with `robot_state_publisher` and RViz, move each joint with `joint_state_publisher_gui`, and check the TF tree (`ros2 run tf2_tools view_frames` or your distro's equivalent) shows all nine leg-related frames branching correctly off `base_link`.

## Try it yourself
Build leg 1 of Gurdy fully (hip + knee joints, both links with visual/collision/inertial) and get it moving correctly in RViz. Then hand-derive the hip joint `<origin>` values for legs 2 and 3 (rotated 120° and 240° around the base) and add them, without yet worrying about reducing duplication — you'll refactor this exact model with XACRO in Unit 5.
