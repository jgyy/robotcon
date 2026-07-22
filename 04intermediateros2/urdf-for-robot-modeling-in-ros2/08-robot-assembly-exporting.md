# URDF for Robot Modeling in ROS2 — Unit 8: Robot Assembly Exporting

Hand-writing every dimension and joint origin is fine for simple robots, but real hardware is usually designed in CAD first. This unit covers going from a CAD assembly to a working URDF instead of typing geometry by hand — using Onshape, a browser-based CAD tool with a documented export path to URDF, as the concrete example.

## Onshape and account setup

Onshape is a cloud-based CAD platform; because the whole assembly lives online rather than in a local file, exporting from it is done through its API rather than a local "File > Export" menu. Getting started requires creating an Onshape account and, since this course's export tooling doesn't require a local installation, most of the workflow happens through the browser and API keys rather than desktop software.

## Getting API keys and preconfiguring the assembly

Onshape's API is authenticated with an access key and secret key pair generated from your account's developer settings; treat these like any other API credential — never commit them into a URDF package's version control. Before exporting, the CAD assembly itself typically needs some light preconfiguration: mates (Onshape's term for joint-like constraints between parts) need to correspond cleanly to the joint types URDF supports (revolute, continuous, prismatic, fixed), and part names should be sensible since they usually become link names in the exported file.

## Exporting the model

With keys configured and the assembly prepared, the export step calls Onshape's URDF exporter (a tool built specifically for this conversion) against the assembly, which walks the mates and parts and produces a `.urdf` file plus a folder of mesh files (one STL/OBJ per part) referenced from it — this is why CAD-exported URDFs almost always use `<mesh>` visual geometry rather than the boxes/cylinders/spheres you've been hand-writing so far.

## Post-export corrections

Automated exports are a strong starting point, not a finished product. Common fixes needed afterward:

- Joint axes or limits that don't match what you intended, because a mate's constraint direction in CAD doesn't always translate to the axis convention URDF expects.
- Missing or wrong `<inertial>` blocks — some exporters carry mass properties from the CAD assembly, others don't, so this is worth double-checking against Unit 4's inertia formulas.
- Mesh files that are far higher resolution (and therefore slower to load/collide) than needed for simulation, often worth decimating or replacing with primitive collision geometry even when you keep the detailed mesh for `<visual>`.

## ROS 2 launch

Once corrected, an exported model is used exactly like any other URDF or Xacro file from this course: reference it from a `robot_state_publisher` launch file, visualize it in RViz2, and (if it passes the same inertia/collision checks from Unit 4) spawn it into Gazebo Sim. The CAD export changes how the geometry was produced, not how ROS2 consumes it — the rest of the pipeline you built over the previous seven units is unchanged.

## When a CAD export is (and isn't) worth it

For a robot you're actively machining or 3D-printing, exporting from CAD keeps the URDF's geometry in lockstep with the physical build — no risk of the hand-written model drifting out of sync with a design that gets revised in Onshape. For a quick simulation prototype or a robot that only exists conceptually, hand-writing primitives (as in Units 2–3) is usually faster and easier to reason about than standing up a CAD assembly purely to export it. Knowing when to reach for each approach is as much a part of this skill as knowing how to run the export itself.

## Try it yourself

If you have access to (or can build) a simple Onshape assembly with two or three mated parts, walk it through the export process end to end and diff the resulting URDF against a hand-written model of similar complexity from Unit 3 — note which details (mesh geometry, exact origins) the export handled better and which (inertial realism, joint limits) still needed manual correction.
