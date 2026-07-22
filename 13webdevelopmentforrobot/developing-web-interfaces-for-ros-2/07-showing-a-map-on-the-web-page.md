# Developing Web Interfaces for ROS 2 — Unit 7: Showing a Map on the Web Page

Occupancy grid maps are just 2D arrays of cell values, but rendering them well — with correct scale, origin, and live updates — is fiddly enough that RobotWebTools built a dedicated library for it. This unit covers `ros2d.js`, roslibjs's companion for 2D visualization.

## How map rendering works
A `nav_msgs/msg/OccupancyGrid` message carries a flat array of cell values (0-100 for occupancy probability, -1 for unknown), plus metadata describing the grid's resolution (meters per cell), width/height in cells, and the pose of the grid's origin in the world frame. Rendering this by hand means allocating a canvas, mapping array indices to pixel coordinates, choosing a color for each occupancy value, and redrawing whenever the map updates — all before you've even added a robot marker on top. `ros2djs` wraps exactly this: it subscribes to the map topic for you via a `ROS2D.OccupancyGridClient`, draws it into an SVG/canvas viewer, and keeps it in sync with map updates automatically.

## Building the page template
A map viewer needs a container element with a defined size, since `ros2djs` draws into it directly:

```html
<link rel="stylesheet" href="css/bootstrap.min.css">
<div id="map" style="width: 600px; height: 600px;"></div>

<script src="js/roslib.min.js"></script>
<script src="js/easeljs.min.js"></script>
<script src="js/ros2d.min.js"></script>
```

`ros2djs` is built on `EaselJS` for 2D canvas drawing, so both libraries need to be loaded before your own script runs.

## Inserting the map element
With the container in place, connect to rosbridge as usual, then hand the viewer and the ROS connection to an `OccupancyGridClient`:

```javascript
const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

const viewer = new ROS2D.Viewer({
  divID: 'map',
  width: 600,
  height: 600
});

const gridClient = new ROS2D.OccupancyGridClient({
  ros: ros,
  rootObject: viewer.scene,
  continuous: true          // keep redrawing as the map updates, not just once
});

gridClient.on('change', () => {
  // scale the view so the whole map fits once the first message arrives
  viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
  viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
});
```

The `change` event fires once the first `OccupancyGrid` message has been received and drawn — that's your cue to fit the viewer to the map's actual dimensions, since you don't know the map size until data arrives.

## Try it yourself
Add the map viewer to your dashboard's center panel and confirm it renders your robot's `/map` topic correctly — known-free cells should render lighter, occupied cells darker, and unknown cells a distinct neutral color. Then try `continuous: false` and observe the difference: the map is drawn once and never updates again, which is a reasonable choice for a static map but wrong for one still being built by SLAM.
