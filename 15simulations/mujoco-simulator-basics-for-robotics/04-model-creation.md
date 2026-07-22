# MuJoCo Simulator Basics for Robotics — Unit 4: Model Creation

Where Unit 3 built a static environment, this unit covers the pieces that make something *move*: bodies, joints, geoms, and mass properties. Every robot you build later is just a structured composition of these four primitives.

## Bodies and the Kinematic Tree
A `<body>` is a coordinate frame that can hold geoms, joints, and child bodies. Nesting bodies inside each other defines a kinematic tree, exactly like a robot's link hierarchy:

```xml
<worldbody>
  <body name="link1" pos="0 0 1">
    <joint name="joint1" type="hinge" axis="0 0 1"/>
    <geom type="cylinder" size="0.05 0.3"/>
    <body name="link2" pos="0 0 0.3">
      <joint name="joint2" type="hinge" axis="0 1 0"/>
      <geom type="cylinder" size="0.05 0.3"/>
    </body>
  </body>
</worldbody>
```

A body with no `<joint>` is rigidly welded to its parent — this is how you attach a fixed sensor mount or a static decoration without it becoming an independent degree of freedom. `pos` on a body is relative to its parent frame, not the world, so moving a parent moves everything beneath it automatically.

## Joints
The `<joint>` element is what turns a rigid weld into a degree of freedom. The four types you will use constantly:
- `hinge` — 1 rotational DOF around `axis` (most robot revolute joints)
- `slide` — 1 translational DOF along `axis` (prismatic joints, linear rails)
- `ball` — 3 rotational DOFs, no translation (shoulders, wrists)
- `free` — 6 DOFs, full 3D translation + rotation (only valid on a body with no parent joint chain above it — used for objects that tumble freely, or a mobile robot's base)

Joints also carry limits and dynamics: `<joint type="hinge" axis="0 0 1" range="-90 90" damping="0.1" stiffness="0"/>` restricts motion to ±90° and adds passive damping, which is often what makes a simulated joint behave believably instead of oscillating forever.

## Geoms and Collision
A `<geom>` gives a body visual shape and, unless explicitly excluded, a collision volume. Primitive types (`sphere`, `box`, `cylinder`, `capsule`, `plane`) are cheap to simulate and collide against each other analytically; `mesh` geoms (referencing an asset loaded from an OBJ/STL file) are visually accurate but more expensive and, for collision, are best paired with a simplified primitive or convex-hull approximation for performance.

Every geom belongs to a `contype`/`conaffinity` bitmask pair that controls which other geoms it can collide with — useful for deliberately disabling self-collision between adjacent links that would otherwise always be touching at a joint.

## Mass and Inertial Properties
By default MuJoCo infers a body's mass and inertia tensor from its geoms' shape and a configurable density, which is good enough for early prototyping. For an accurate robot model you will eventually specify `<inertial pos="..." mass="..." diaginertia="..."/>` explicitly, sourced from CAD or a manufacturer's datasheet — inaccurate inertia is a common cause of a simulated robot that "feels" floaty or unrealistically sluggish compared to the real hardware.

## Try it yourself
Extend the `scene.xml` from Unit 3 with a two-link pendulum: a body with a `hinge` joint hanging from a fixed anchor point, and a second body with another `hinge` joint attached to the first. Run it in the viewer and confirm it swings under gravity with the two links interacting realistically.
