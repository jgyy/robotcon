# URDF for Robot Modeling — Unit 1: URDF Introduction

Every simulated or real robot in ROS needs a machine-readable description of its own body before anything else — TF, RViz, motion planning, and physics simulation all read from it. This unit introduces that description format, URDF, and previews the two robots you'll build over the rest of the course.

## What URDF actually is
URDF (Unified Robot Description Format) is an XML dialect for describing a robot as a tree of rigid bodies connected by joints. It is not a simulator, a renderer, or a physics engine — it's just data. Other tools (RViz, Gazebo, `robot_state_publisher`, MoveIt) all read the same URDF and interpret it for their own purpose: RViz draws the meshes, Gazebo adds physics to them, `robot_state_publisher` turns it into a live TF tree.

A minimal, complete URDF file looks like this:

```xml
<?xml version="1.0"?>
<robot name="minimal_bot">
  <link name="base_link"/>
</robot>
```

That's a valid robot — one link, no joints, nothing visible. Everything you'll learn in this course is about filling in that skeleton: adding more links, connecting them with joints, and giving them shape.

## Links and joints: the core vocabulary
Two elements do almost all the work in URDF:

- **`<link>`** — a rigid body. A wheel, a forearm, a sensor housing. Each link can carry visual geometry (what it looks like), collision geometry (what it collides with in simulation), and inertial properties (mass, center of mass, inertia tensor).
- **`<joint>`** — the connection between exactly one parent link and one child link, plus a type that constrains how the child can move relative to the parent (fixed, revolute, continuous, prismatic, and a few others).

Because every joint has exactly one parent and one child, the whole robot forms a tree rooted at one link (by convention often called `base_link` or `base_footprint`). There is no cycle — if you need a closed kinematic loop (like a four-bar linkage), URDF alone can't express it and you'd reach for extensions or a different tool.

## The robots you'll build in this course
Rather than working with toy one-link examples the whole way through, this course builds two real models:

- A **"PixarLike" desk-lamp robot** (units 2-3) — a simple articulated arm on a base, small enough to learn the full visual/collision/inertial/Gazebo workflow without getting lost in scale.
- A **three-legged "Gurdy" robot** (unit 4) — a symmetric multi-legged platform that forces you to deal with repeated substructures, which is exactly the pain XACRO (units 5-6) exists to solve.

By the end of unit 6 you'll also design a "Boxing Robot" of your own as a capstone project.

## How URDF fits into the wider ROS pipeline
On its own, a URDF file is just text sitting on disk. It becomes useful once something loads it:

- `robot_state_publisher` reads the URDF (usually via a `robot_description` parameter) and, combined with live joint angles on `/joint_states`, publishes the full TF tree for every link.
- RViz uses the same URDF to draw the robot's meshes at the poses TF reports.
- Gazebo (or another physics simulator) uses the collision and inertial tags to simulate contacts, gravity, and dynamics.
- MoveIt and other planning stacks use the joint limits and kinematic tree to plan motion.

You will see this pattern — "one URDF, many consumers" — repeatedly for the rest of the course.

## Try it yourself
Without writing any XML yet, sketch on paper the link tree you'd expect for a simple desk lamp with a fixed base, one rotating shoulder joint, one rotating elbow joint, and a lamp head at the end. Name each link and note which joint type (fixed, revolute, continuous, prismatic) connects each pair. You'll turn this sketch into real URDF in Unit 2.
