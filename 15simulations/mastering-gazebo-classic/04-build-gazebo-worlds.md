# Mastering Gazebo Classic — Unit 4: Build Gazebo Worlds

So far you've dropped a robot into someone else's empty world. This unit flips that around: you'll build the environment itself, from a bare SDF file to a populated, realistically-terrained scene.

## Building a World From Scratch

A world file is plain SDF with `<world>` as its root. The fastest path is rarely a blank file — start from the built-in `worlds/empty.world` (or `worlds/ground.world`) and layer content in, since the empty world already gets physics, a sun, and a ground plane right:

```xml
<sdf version="1.7">
  <world name="warehouse">
    <include><uri>model://sun</uri></include>
    <include><uri>model://ground_plane</uri></include>
    <scene>
      <ambient>0.4 0.4 0.4 1</ambient>
      <shadows>true</shadows>
    </scene>
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_update_rate>1000</real_time_update_rate>
    </physics>
  </world>
</sdf>
```

Launch it directly to iterate quickly: `gazebo worlds/warehouse.world`. The GUI's Edit > Building Editor and Edit > Model Editor tools can also generate walls and simple structures interactively and export straight to SDF, which is often faster than hand-authoring geometry for a large static structure.

## Gazebo Models: Using Pre-Defined Ones

The Insert tab (Unit 1) and `<include><uri>model://name</uri></include>` both pull from your `GAZEBO_MODEL_PATH`. Gazebo's official model database, [Fuel](https://app.gazebosim.org/fuel/models), hosts thousands of ready-made models (furniture, robots, sensors, terrain props) you can download once and reuse across every world:

```bash
gz fuel download -m "Cardboard Box" -e
```

## Creating Gazebo Models

A custom model is just a folder with two files: `model.config` (name, author, description — metadata) and `model.sdf` (a `<model>` root element with links, collisions, and optionally plugins, structurally identical to what you'd embed directly in a world).

```
my_cone/
├── model.config
└── model.sdf
```

Once that folder sits on `GAZEBO_MODEL_PATH`, it's referenceable from any world via `model://my_cone` — exactly the same mechanism as the official models, which is precisely why organizing reusable props as models (rather than pasting SDF into every world) pays off.

## Digital Elevation Models

Flat ground planes are fine for indoor robots but unrealistic for anything outdoors. A **heightmap** lets Gazebo generate rugged terrain from a grayscale image, where pixel brightness maps to elevation:

```xml
<link name="terrain">
  <collision name="collision">
    <geometry>
      <heightmap>
        <uri>model://terrain/materials/textures/heightmap.png</uri>
        <size>500 500 50</size>
      </heightmap>
    </geometry>
  </collision>
  <visual name="visual">
    <geometry>
      <heightmap>
        <uri>model://terrain/materials/textures/heightmap.png</uri>
        <size>500 500 50</size>
      </heightmap>
    </geometry>
  </visual>
</link>
```

`<size>` sets the terrain's real-world footprint in X/Y and the maximum elevation range in Z; a heightmap image can come from real-world DEM data (e.g. exported from GIS tools) for geographically accurate outdoor testing.

## Population of Models

For scattering many instances of the same object (crates in a warehouse, trees in a field) without hand-placing each one, Gazebo's `<population>` tag procedurally distributes copies of a model across a region:

```xml
<population name="crate_population">
  <model name="crate"><include><uri>model://cardboard_box</uri></include></model>
  <pose>5 5 0 0 0 0</pose>
  <box><size>10 10 0</size></box>
  <model_count>20</model_count>
  <distribution><type>random</type></distribution>
</population>
```

This is far more maintainable than 20 hand-copied `<include>` blocks, and re-running the simulation with `<distribution><type>random</type></distribution>` gives you a fresh layout each time — useful for testing perception and navigation robustness against clutter.

## Try it yourself

Build a small world with a heightmap terrain patch and a `<population>` of at least 10 rock or tree models scattered across it, then spawn your Unit 2 robot at the edge and drive it partway up the slope to confirm the terrain collision geometry actually constrains the robot's motion.
