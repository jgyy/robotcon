# Developing Web Interfaces for ROS 2 — Unit 9: 3D Visualization for Robots on Webpages

The course closes with the most visually impressive widget: a full 3D rendering of the robot itself, posed and moving in real time inside the browser, using `ros3djs`.

## How ros3djs works
`ros3djs` is the 3D counterpart to `ros2djs`, built on top of the general-purpose WebGL library `three.js` instead of a 2D canvas library. Rather than drawing shapes from scratch, it knows how to interpret the same description ROS already uses for a robot's geometry — the URDF (Unified Robot Description Format), the mesh files it references, and the live transform tree (`/tf`) — and turn all three into a moving 3D scene. Concretely, it subscribes to the robot's transforms via a `ROSLIB.TFClient`, loads the URDF's link geometry (boxes, cylinders, or mesh files) through a `ROS3D.UrdfClient`, and re-poses each link every time a new transform arrives, so the on-screen model tracks the real robot's joints and base pose continuously.

## Setting up a 3D viewer
Like the map viewer, `ros3djs` needs a sized container and its supporting libraries loaded first:

```html
<div id="viewer3d" style="width: 640px; height: 480px;"></div>

<script src="js/roslib.min.js"></script>
<script src="js/three.min.js"></script>
<script src="js/ros3d.min.js"></script>
```

```javascript
const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

const viewer = new ROS3D.Viewer({
  divID: 'viewer3d',
  width: 640,
  height: 480,
  antialias: true,
  cameraPose: { x: 3, y: 3, z: 3 }
});

viewer.addObject(new ROS3D.Grid());   // a ground-plane grid for spatial reference
```

## Practical example: visualizing the robot model
With the base viewer running, a `TFClient` and `UrdfClient` bring the robot itself into the scene:

```javascript
const tfClient = new ROSLIB.TFClient({
  ros: ros,
  fixedFrame: 'base_link',
  angularThres: 0.01,
  transThres: 0.01
});

const urdfClient = new ROS3D.UrdfClient({
  ros: ros,
  tfClient: tfClient,
  path: 'http://localhost:8000/',   // base path where mesh files are served from
  rootObject: viewer.scene,
  loader: ROS3D.COLLADA_LOADER
});
```

The `fixedFrame` you choose matters: setting it to `base_link` keeps the robot centered and stationary on screen while the world moves around it; setting it to `odom` or `map` instead makes the robot move through a fixed scene — pick whichever framing suits the dashboard you're building. Mesh files referenced by the URDF need to be reachable over HTTP at `path`, which is why a local static file server (from Unit 1) is doing double duty here.

## Try it yourself
Get your robot's URDF rendering in the 3D viewer and confirm that moving the robot in simulation (or physically) updates the model's pose live. Then try switching `fixedFrame` from `base_link` to `odom` and describe, in a short note to yourself, the visual difference — this distinction (robot-centered vs. world-centered view) is the same choice you'll face designing any future ROS dashboard beyond this course.
