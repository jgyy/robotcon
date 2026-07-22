# Developing Web Interfaces for ROS 2 — Unit 8: Tuning Your Robotics Algorithms! ROS Parameters!

Beyond commands and telemetry, a useful operator dashboard often needs to read and adjust a running node's configuration — a controller's max speed, a filter's threshold — without restarting anything. This unit covers ROS 2 parameters from the web side.

## ROS 2 parameters recap
Every ROS 2 node can expose named, typed parameters (int, double, string, bool, arrays) that live for the node's lifetime and can be read or changed at runtime — the same values you'd normally touch with `ros2 param get` / `ros2 param set` on the command line. From a web page, `roslibjs` exposes this through `ROSLIB.Param`, which under the hood calls the node's parameter get/set services for you, so you don't need to construct those service calls by hand.

## Reading and setting parameters from roslibjs
A `ROSLIB.Param` is scoped to a specific node and parameter name:

```javascript
const maxSpeedParam = new ROSLIB.Param({
  ros: ros,
  name: '/motion_controller/max_linear_speed'
});

maxSpeedParam.get((value) => {
  console.log('Current max speed:', value);
});

maxSpeedParam.set(0.5);
```

`.get()` is asynchronous, like a service call — always render an initial "loading" or placeholder state in your UI rather than assuming the value is available the instant the page loads. `.set()` fires and forgets from the JavaScript side; if you need confirmation it took effect, follow it with a `.get()` or subscribe to `/parameter_events` if the node publishes them.

## Practical example
A simple readout-and-editor pair for a single parameter, wired to Vue.js state:

```javascript
const { ref } = Vue;
const maxSpeed = ref(null);

maxSpeedParam.get((value) => { maxSpeed.value = value; });

function applyMaxSpeed() {
  maxSpeedParam.set(parseFloat(maxSpeed.value));
}
```

```html
<label>Max Speed (m/s)</label>
<input type="number" step="0.1" v-model="maxSpeed">
<button @click="applyMaxSpeed">Apply</button>
```

Before exercising this against a real controller, it's common in this kind of course setup to launch a small stand-in node — e.g. a fake battery/parameter-serving node — so you have something with adjustable parameters to point the page at without needing your full robot stack running.

## Try it yourself
Build a small panel with a number input and "Apply" button for a speed-limit parameter, and a second read-only field showing a simulated battery level pulled from a parameter on a stand-in node. Confirm that changing the speed limit from the page and then re-running `ros2 param get` on that node from the terminal shows the new value — proving the round trip actually reached the ROS graph, not just your page's local state.
