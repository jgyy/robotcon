# ROS RViz Advanced Markers — Unit 3: RvizMarkers Unit 2: BoundingBoxes, RobotFootsteps, PolygonArray, Ocupancy grids, Pictograms

With the basic `Marker` message under your belt, this unit walks through five visualization patterns that show up constantly in real robotics stacks: perception bounding boxes, footstep planning, region polygons, occupancy grids, and icon-based pictograms.

## Dynamic bounding box arrays
Object detectors and 3D perception pipelines typically output a list of boxes that changes every frame. Rather than a solid `CUBE` (which occludes what's inside it), draw each box as a `LINE_LIST` wireframe so you can still see the point cloud or mesh inside:

```python
def wireframe_box(marker_id, center, size, frame_id='map'):
    m = Marker(type=Marker.LINE_LIST, action=Marker.ADD, id=marker_id)
    m.header.frame_id = frame_id
    m.scale.x = 0.02  # line width
    m.color.r, m.color.g, m.color.b, m.color.a = 1.0, 0.2, 0.2, 1.0
    cx, cy, cz = center
    sx, sy, sz = [s / 2 for s in size]
    corners = [(cx+dx*sx, cy+dy*sy, cz+dz*sz)
               for dx in (-1, 1) for dy in (-1, 1) for dz in (-1, 1)]
    edges = [(0,1),(0,2),(0,4),(3,1),(3,2),(3,7),
             (5,1),(5,4),(5,7),(6,2),(6,4),(6,7)]
    for a, b in edges:
        m.points.append(Point(x=corners[a][0], y=corners[a][1], z=corners[a][2]))
        m.points.append(Point(x=corners[b][0], y=corners[b][1], z=corners[b][2]))
    return m
```

Publish one such marker per detection inside a `MarkerArray`, using the detection's tracking ID as the marker `id` so a box updates in place frame-to-frame instead of flickering as new/deleted markers. Some perception stacks use dedicated array messages (e.g. `jsk_recognition_msgs/BoundingBoxArray`, historically from ROS 1 with community ROS 2 ports) that carry per-box metadata like class label and confidence — but under the hood they still render as marker wireframes plus text labels.

## Robot footstep trails
For legged or wheeled robots, visualizing where the robot has been (or plans to step) is a `LINE_STRIP` for the path plus small `ARROW` or flattened `CUBE` markers for each individual footprint/waypoint, colored by leg (left/right) or by recency:

```python
def footstep_marker(marker_id, pose, is_left_foot):
    m = Marker(type=Marker.CUBE, action=Marker.ADD, id=marker_id)
    m.header.frame_id = 'odom'
    m.pose = pose
    m.scale.x, m.scale.y, m.scale.z = 0.25, 0.12, 0.02
    m.color.b, m.color.a = (1.0, 1.0) if is_left_foot else (0.0, 1.0)
    m.color.r = 0.0 if is_left_foot else 1.0
    return m
```

Keep a rolling window of the last N footsteps (e.g. delete markers older than N steps with `action = Marker.DELETE`) so the trail doesn't grow forever and slow RViz down.

## Polygon arrays for regions and convex hulls
`geometry_msgs/PolygonStamped` represents a single closed 2D/3D polygon — useful for a costmap inflation boundary, a safety zone, or a convex hull around a cluster of points. To render one, close the loop and draw it as a `LINE_STRIP` (add the first point again at the end):

```python
m = Marker(type=Marker.LINE_STRIP, action=Marker.ADD, id=0)
m.header.frame_id = 'map'
m.scale.x = 0.05
m.points = [Point(x=x, y=y, z=0.0) for x, y in polygon_vertices]
m.points.append(m.points[0])  # close the loop
```

When you have several regions at once (e.g. one polygon per detected obstacle cluster), publish them as separate marker IDs within one `MarkerArray`, following the same "array of the base type" pattern you saw with bounding boxes.

## Occupancy grids from live data
`nav_msgs/OccupancyGrid` is the standard message for 2D costmaps and static maps, and RViz has a built-in `Map` display for it — you don't need a custom `Marker` for the grid itself. Each cell holds a probability 0–100 (unknown is -1), and the message carries its own resolution and origin pose, so RViz places it correctly without extra TF work as long as `header.frame_id` is set:

```bash
ros2 topic echo /map --once   # inspect a running grid's info.resolution and info.origin
```

Add a `Map` display in RViz, point it at your occupancy grid topic, and tune the **Alpha** and **Color Scheme** display options to overlay it legibly on top of other markers rather than obscuring them.

## Pictograms: FontAwesome icons in 3D space
For semantic, at-a-glance labeling (a warning triangle over a hazard, a person icon over a detected pedestrian) plain text labels are often less readable than icons. Community packages such as the jsk_visualization suite expose a `Pictogram`/`PictogramArray` message that renders FontAwesome glyphs as billboards in the 3D scene, driven by a string like `"fa-exclamation-triangle"` plus a pose, size and color — conceptually the same idea as `TEXT_VIEW_FACING` markers but backed by an icon font instead of literal text. If such a plugin isn't available for your ROS distribution, you can approximate the same effect with a `MESH_RESOURCE` marker pointing at a small icon-shaped mesh, or a `TEXT_VIEW_FACING` marker using a Unicode symbol.

## Try it yourself
Simulate three "detected objects" with randomly walking positions, and publish, every 0.2 s: a wireframe bounding box, a `TEXT_VIEW_FACING` label showing an object ID, in a single combined `MarkerArray` on one topic. Watch them track correctly in RViz with no ghost markers left behind when an object's ID disappears from your simulated detections (send `DELETE` for its `ns`/`id` when that happens).
