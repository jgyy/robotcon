# Developing Web Interfaces for ROS — Unit 11: 3D Visualization for Robots on Webpages

Everything so far has been 2D (canvas maps, text readouts). This unit brings a real 3D robot model into the browser — loading its URDF, animating its joints live, and rendering the TF tree, the browser equivalent of what RViz gives you on the desktop.

## Three.js as the rendering engine
Under the hood, browser 3D graphics run on WebGL, and `three.js` is the standard library for working with it at a reasonable level of abstraction (scenes, cameras, meshes, lighting) instead of raw shaders. The ROS-specific 3D tooling in this ecosystem (`ros3djs`) is built on top of three.js, so a basic scene looks like ordinary three.js code:

```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

## Loading a URDF into the scene
`ros3djs` provides a `ROS3D.UrdfClient` that fetches a robot's URDF (typically served from the `/robot_description` parameter via rosbridge) and its mesh files, then builds a live three.js object graph out of the robot's links and joints:

```javascript
const urdfClient = new ROS3D.UrdfClient({
  ros: ros,
  tfClient: tfClient,          // see below
  path: 'http://<host>:8080',  // where mesh files are served from
  rootObject: scene,
  loader: ROS3D.COLLADA_LOADER
});
```

Mesh files referenced by the URDF (`.dae`, `.stl`) need to be reachable over plain HTTP, so this typically runs alongside a simple static file server pointed at your robot description package's `meshes/` directory.

## Following the TF tree
A robot model is only correctly posed if each link tracks its live transform. `ROS3D.TFClient` subscribes to `/tf` and `/tf_static` and keeps the scene graph updated automatically once wired to the URDF client:

```javascript
const tfClient = new ROS3D.TFClient({
  ros: ros,
  angularThres: 0.01,
  transThres: 0.01,
  rate: 10.0,
  fixedFrame: 'base_link'
});
```

The `fixedFrame` you choose is the reference frame everything else is drawn relative to — `base_link` for a robot-centric view, `map` or `odom` if you want the robot to move through a static world instead of staying fixed at the origin.

## Adding sensor overlays
Once the base scene and TF are working, `ros3djs` includes helpers for common sensor visualizations layered into the same scene — point clouds (`ROS3D.PointCloud2`), laser scans (`ROS3D.LaserScan`), and interactive markers — each following the same "give it a `ros`, a `tfClient`, and a topic name" constructor pattern as the URDF client above.

## Try it yourself
Serve your robot's URDF and meshes locally, load them with `ROS3D.UrdfClient` against a `ROS3D.TFClient`, and confirm the model's joints move in the browser when you actuate them (via a joint state publisher, simulator, or the real robot). Then add a `ROS3D.LaserScan` overlay on top and confirm the scan points line up spatially with the model's sensor mount location.
