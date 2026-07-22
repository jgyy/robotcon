# Introduction to Gazebo Sim with ROS2 — Unit 4: Build a World

Having built and connected a robot, this final unit turns to the environment you drop it into — SDF world syntax, physics and environmental settings, populating a scene with models and actors, and extending it all with plugins.

## SDF and the Anatomy of a <world> Element
SDFormat is the XML schema underneath everything Gazebo Sim loads — recall from Unit 2 that even a URDF robot gets silently converted to SDF before it's spawned. A world file's top level is `<sdf version="1.9"><world name="my_world">...</world></sdf>`, and every other concept in this unit — models, lights, physics, plugins, gravity — is a sibling element inside that `<world>` tag.

```xml
<sdf version="1.9">
  <world name="my_world">
    <include><uri>model://ground_plane</uri></include>
    <include><uri>model://sun</uri></include>
  </world>
</sdf>
```

```bash
gz sim my_world.sdf
```

A **ground plane** is almost always brought in this way, as an `<include>` of a prebuilt model, rather than hand-authored — a large static box with reasonable friction is a common enough need that reinventing it per-project is wasted effort.

## Physics and Environmental Properties
The `<physics>` tag controls simulation step size and target speed:

```xml
<physics name="1ms" type="ode">
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
</physics>
```

A smaller `max_step_size` gives a more numerically accurate (but slower) simulation; `real_time_factor` sets the target speed relative to the wall clock — `1.0` tries to match real time, `0` removes the cap entirely and lets the sim run as fast as the machine allows, which matters for things like reinforcement-learning training runs.

Other environmental tags shape what your robot's sensors actually perceive: `<gravity>0 0 -9.8</gravity>` sets the obvious; `<magnetic_field>` matters if you're simulating a magnetometer; `<atmosphere type="adiabatic"/>` affects any barometric-pressure sensor. A `<light type="directional">` (or `point`/`spot`) with `<diffuse>`, `<specular>`, and `<direction>` sub-tags drives shading — this matters more for camera-based perception pipelines than for physics, but it's easy to get reasonable results for free by including the bundled `sun` model as shown above.

## Populating the World: Models and Actors
**Adding models** most often means `<include>`-ing something from a local resource path or Gazebo's Fuel library, then positioning it with `<pose>`:

```xml
<include>
  <uri>model://table</uri>
  <pose>1 0 0 0 0 0</pose>
</include>
```

Point the `GZ_SIM_RESOURCE_PATH` environment variable at your own models directory so custom `model://` URIs resolve the same way the built-in ones do. For something not available as a reusable model, an inline `<model>` definition with your own `<link>`s works exactly like it does in a robot's URDF/SDF.

**Adding actors** is different: an `<actor name="walking_person">` is an animated, mesh-driven entity — usually skeleton-animated or following a scripted `<trajectory>` of waypoints — that moves through the world without being physically simulated like a rigid body. Actors are the standard way to add pedestrians or other dynamic obstacles when you're testing perception or navigation and don't need (or want the cost of) full physics on that entity.

## Extending Worlds with Plugins
**World plugins** attach system-level behavior to the entire world rather than to one model — the physics engine, the sensor system, and a custom "spawn an obstacle every 30 seconds" script are all examples — and are declared as `<plugin>` children of `<world>` directly. **GUI plugins** are a different thing entirely: declared inside a `<gui>` block, they extend only the GUI client — adding a teleop panel, a custom stats widget, or similar — and have zero effect when the world is run headless with `gz sim -s`, since there's no GUI client to load them into.

## Try it yourself
Starting from the minimal world above, add a `<physics>` block with a 2 ms step size, `<include>` two different models positioned a meter apart, and add a directional light angled away from straight-down — then load it with `gz sim -v 4 my_world.sdf` and check that shading and collisions look right before spawning your Unit 2/3 robot into it.
