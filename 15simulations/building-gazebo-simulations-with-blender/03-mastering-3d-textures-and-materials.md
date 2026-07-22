# Building Gazebo Simulations with Blender — Unit 3: Mastering 3D Textures and Materials

A well-modeled but untextured robot looks like gray plastic in every render. This unit covers materials, UV mapping, and texturing well enough to make your models read as the real-world objects they represent, plus the export pitfalls that break textures once they leave Blender.

## Materials and the shader basics

Blender's Shading workspace uses node-based materials built around the Principled BSDF shader, which maps closely onto physically-based rendering (PBR) properties that most modern renderers — including Gazebo Sim's Ogre2-based rendering — understand: Base Color, Roughness, Metallic, Normal. For robotics work you rarely need exotic shader graphs; setting Base Color to an image texture, tuning Roughness (0 = mirror, 1 = fully matte), and toggling Metallic for metal parts covers most cases.

```
Shading tab > select object > New material
  Base Color   -> Image Texture node (your diffuse/albedo map)
  Roughness    -> Image Texture node (grayscale roughness map) or a constant value
  Normal       -> Normal Map node <- Image Texture (tangent-space normal map)
```

## UV mapping

A UV map tells Blender (and later Gazebo's renderer) how to wrap a flat 2D image texture onto a 3D mesh's surface. Without a sane UV layout, textures stretch, tile incorrectly, or seam visibly.

Workflow:

1. Select the mesh, enter Edit Mode (`Tab`), select all (`A`).
2. Mark seams (`Ctrl+E > Mark Seam`) along edges where you're willing to accept a visible cut — think of it like unfolding a cardboard box.
3. `U > Unwrap` to generate the UV layout.
4. Open the UV Editor to inspect the result — overlapping islands or wildly uneven scaling both cause visible artifacts.

For simple robotics parts (boxes, cylinders), Blender's `U > Cube Project` or `U > Cylinder Project` often gets you a usable UV layout in one step without manual seam marking.

## Texturing workflow

Textures typically come as a set of image maps sharing the same UV layout: a color/albedo map, a roughness or specular map, and optionally a normal map for surface detail (rivets, panel lines) without added geometry. You can paint these directly in Blender's Texture Paint mode, generate them procedurally with node-based procedural textures (noise, Voronoi, brick patterns), or source them from a texture library and adapt the UVs to fit.

Keep texture resolution proportional to how close the camera/sensor will ever get in simulation — a background wall rarely needs a 4K texture, but a robot's control panel that a simulated camera inspects up close might.

## Troubleshooting common issues

- **Textures show as pink/magenta in Gazebo**: the texture file path didn't resolve — check that image files are copied alongside the mesh and referenced with relative paths, not absolute paths pointing to your Blender project folder.
- **Textures appear stretched or tiled oddly**: revisit the UV unwrap; uneven UV island scaling is the usual cause.
- **Material looks different in Gazebo than in Blender's render preview**: Gazebo's real-time renderer doesn't replicate every Blender shader node — stick to the Principled BSDF's core PBR inputs (Base Color, Roughness, Metallic, Normal) for predictable results, and preview using Blender's "Material Preview" or "Rendered" viewport shading rather than complex node graphs you haven't verified export correctly.
- **Backfacing/inverted normals** show up as dark or missing faces — select the mesh, `Shift+N` (Recalculate Normals) in Edit Mode fixes most cases.

## Try it yourself

Take the wheel you modeled in Unit 2, UV-unwrap it with cylinder projection, and apply a two-tone material: a dark rubber-like tire (high roughness, non-metallic) and a lighter metallic hub (low roughness, metallic). Export it and inspect the result in Gazebo, fixing any pink/missing-texture issues by checking your relative file paths.
