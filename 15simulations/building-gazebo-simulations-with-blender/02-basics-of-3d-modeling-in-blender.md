# Building Gazebo Simulations with Blender — Unit 2: Basics of 3D Modeling in Blender

Before you can build anything useful for a simulation, you need enough fluency in Blender's interface and modeling tools to go from "empty scene" to "exportable mesh." This unit covers navigation, primitive-based modeling, and the export settings that matter for Gazebo.

## Navigating the interface

Blender's default layout has a 3D viewport, an outliner (scene hierarchy) top-right, and a properties panel bottom-right. The controls that matter immediately:

- Middle-mouse-drag to orbit, scroll to zoom, Shift+middle-drag to pan.
- `Tab` toggles between Object Mode (move/scale/rotate whole objects) and Edit Mode (move individual vertices/edges/faces).
- `N` opens the side panel showing precise transform values — use this instead of eyeballing drags when a dimension matters (e.g., a wheel radius that must match your URDF).
- The 3D cursor (`Shift+Right-click` to place it) determines where new objects spawn and where the origin of an object sits by default — get in the habit of setting it before adding geometry, since a mesh's origin becomes its link frame origin in Gazebo.

## Building with primitives

`Shift+A` in Object Mode opens the Add menu: cubes, cylinders, spheres, cones, and a plane cover a surprising amount of robotics geometry — cylinders for wheels and arm links, cubes for chassis and boxes, planes for ground and walls. Modeling for simulation should stay low-poly wherever possible; you're not making a film render, you're making something a physics engine and a real-time renderer both have to handle every frame.

Key edit-mode operations:

```
Extrude (E)      — pull a face/edge out to add geometry
Loop Cut (Ctrl+R) — add an edge loop to control where a mesh bends/holds shape
Bevel (Ctrl+B)    — round a hard edge, useful for visual realism without much poly cost
Boolean modifier  — cut/join meshes (e.g., punch a mounting hole through a plate)
```

Use modifiers (Mirror, Array, Solidify) instead of manually duplicating geometry when a part is symmetric or repeated — it keeps the mesh editable and keeps triangle counts sane.

## Scale, units, and orientation

Gazebo works in meters with a Z-up, right-handed coordinate frame. Blender defaults to meters too, but always double check `Scene Properties > Units` is set to Metric with a unit scale of 1.0 — a model authored at the wrong scale is the single most common reason a "correctly built" robot behaves strangely once dropped into a physics simulation (falls through the floor, explodes on contact, etc.). Also confirm your model's forward axis matches what you intend for the robot's front in URDF/SDF; Blender's default "up" is Z, matching Gazebo, but exporters sometimes offer axis-remap options — leave them at the Gazebo-compatible default unless you have a specific reason not to.

## Exporting for Gazebo

```
File > Export > Collada (.dae)     — widely supported, keeps material references
File > Export > glTF 2.0 (.glb/.gltf) — modern, compact, preferred by Gazebo Sim
```

Export with "Selection Only" checked once you're exporting individual robot links rather than a whole scene, and keep textures in a `meshes/` or `materials/textures/` folder alongside the mesh so relative paths resolve correctly when referenced from an SDF `<mesh><uri>` tag.

## Try it yourself

Model a simple wheel: a cylinder scaled to a real wheel's proportions (say, 0.1 m radius, 0.04 m width), with a bevel on the outer rim edges. Set its origin to the cylinder's center using `Object > Set Origin > Origin to Geometry`, then export it as glTF. Confirm in the export dialog that the mesh's dimensions in meters match what you intended by re-importing it or checking the `N`-panel dimensions before export.
