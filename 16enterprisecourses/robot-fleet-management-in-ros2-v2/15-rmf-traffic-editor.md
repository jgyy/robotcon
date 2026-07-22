# Robot Fleet Management in ROS2 v2 — Unit 15: RMF Traffic Editor

Every RMF deployment so far in this course has relied on a navigation graph and a simulation world — this unit covers actually authoring both, using RMF's dedicated traffic editor tool, instead of relying on the bundled demo maps.

## What the traffic editor produces

The traffic editor (`rmf_traffic_editor`) is a 2D CAD-like tool for building a building model that RMF can consume: floor polygons, walls, the navigation graph (waypoints and lanes), and placements for doors and lifts. Its output — a `.building.yaml` file — is the single source of truth that both the Gazebo/Ignition simulation generator and the fleet adapters' navigation graph reference back to.

## Launching the editor

```bash
ros2 run rmf_traffic_editor traffic_editor
```

Typical workflow inside the tool:

1. Import a floor plan image (a scanned blueprint or an exported CAD drawing) as a reference layer, and set its scale using a known real-world measurement.
2. Trace wall segments over the reference image.
3. Place vertices for the navigation graph — these become RMF waypoints — and connect them with lanes.
4. Name the waypoints you'll want to reference by name later (as you did with `pantry` and `lounge` in earlier units' loop tasks).

## From building model to simulation world

Once the building model is saved, a companion tool converts it into a Gazebo/Ignition-compatible world:

```bash
ros2 run rmf_building_map_tools building_map_generator gazebo \
  my_building.building.yaml my_building_world/ my_building_models/
```

This generates the `.world` (or `.sdf`) file plus supporting model directories, which is the same kind of world file the `office.launch.xml` demo from Unit 2 launched — meaning everything you learned about launching, verifying, and dispatching tasks in Units 2-4 applies unchanged to a map you author yourself.

## Extracting just the navigation graph

Fleet adapters don't need the full building model, only the graph portion:

```bash
ros2 run rmf_building_map_tools building_map_generator nav \
  my_building.building.yaml nav_graphs/
```

This is the `nav_graph_file` you referenced when launching fleet adapters back in Unit 4 — now generated from your own authored map instead of a bundled demo asset.

## Adding RMF-ready robots to the simulation

The traffic editor also lets you place robot spawn models on the map, tagged with the fleet name they belong to, so the generated world already positions your simulated robots at sensible starting waypoints rather than requiring you to hand-edit spawn poses in the world file afterward.

## Try it yourself

Trace a simple single-room floor plan (four walls, one door) in the traffic editor, place three navigation waypoints connected in a triangle, and generate both the Gazebo world and the nav graph from it. Launch the generated world and confirm — via `ros2 topic echo /fleet_states` and a dispatched loop task, as in Unit 2 — that a robot can navigate between your custom waypoints by name.
