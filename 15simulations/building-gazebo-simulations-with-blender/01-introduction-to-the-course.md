# Building Gazebo Simulations with Blender — Unit 1: Introduction to the course

This unit sets the stage for the whole course: why a 3D content-creation tool like Blender matters for robotics simulation, how Blender fits into the Gazebo workflow, and what you'll have built by the end.

## Why Blender for robotics simulation

Gazebo (both Classic and Sim/Ionic-Harmonic-era "Gz Sim") ships with a handful of primitive shapes and a small library of stock models, but real robotics work quickly demands custom geometry: a warehouse shelf with the exact dimensions of your client's racking, a sensor mount that matches your actual 3D-printed bracket, or an environment that visually resembles a target deployment site for photorealistic synthetic-data generation. Blender is a free, open-source, full-featured 3D content creation suite (modeling, texturing, rigging, animation, rendering) that exports to formats Gazebo can consume — primarily COLLADA (`.dae`) and glTF (`.gltf`/`.glb`), with OBJ/STL useful for simpler collision geometry.

The division of labor is: **Blender is where you author geometry and visuals**, **Gazebo is where physics, sensors, and robot behavior live**. You are not replacing URDF/SDF with Blender — you are feeding Blender-authored meshes into the visual and (sometimes) collision elements of SDF/URDF links.

## Course roadmap

- Unit 2 gets you comfortable in Blender's interface and the modeling primitives you'll reuse constantly.
- Unit 3 covers materials, textures, and UV mapping — the difference between a gray blob and something that reads as "concrete floor" or "brushed aluminum."
- Unit 4 puts a robot together: an articulated arm and a mobile base, both with real joints.
- Unit 5 introduces Gazebo Sim's animation support, which Gazebo Classic never had.
- Unit 6 is a capstone: a full custom world, a robot, and animation, assembled into one simulation.

By the end you'll be able to take a rough idea for an environment or a robot, build it in Blender, and get it moving inside a physics-simulated world.

## Setting up your environment

Before the hands-on units, get the toolchain in place:

```bash
# Blender (use the official tarball or your distro's package; snap/flatpak also work)
sudo apt install blender    # Debian/Ubuntu-family; check `blender --version` for 4.1+

# Gazebo — install one of the two lines depending on which track you're following
sudo apt install gz-sim-harmonic     # Gazebo Sim (Harmonic LTS)
# or, for Gazebo Classic:
sudo apt install gazebo11
```

Verify Blender's version explicitly, since the exporters and UI referenced in this course assume 4.1 or newer:

```bash
blender --version
```

If you're on a distro without a packaged 4.1+ build, download the official tarball from blender.org and run it directly — no system install required.

## Try it yourself

Install Blender and one Gazebo variant (Classic or Sim), then launch Blender and export the default cube as a `.dae` file (`File > Export > Collada`). Note where the exporter puts materials and textures relative to the mesh — you'll need that layout in Unit 2 when you bring a model into Gazebo for the first time.
