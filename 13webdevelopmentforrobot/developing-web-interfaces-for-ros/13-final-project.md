# Developing Web Interfaces for ROS — Unit 13: Final Project

This capstone unit doesn't introduce new ROS-web concepts — it's where you combine everything from Units 1-12 into a single, coherent robot dashboard, which is the real test of whether the individual pieces actually compose cleanly.

## Scoping the dashboard
A realistic "operator console" for a mobile robot typically needs, at minimum: a live camera view, a teleoperation control (joystick or buttons), an odometry/pose readout, a map with the robot's position overlaid, and a way to trigger at least one service or action (e.g. "return to dock" or "navigate to goal"). That's Units 4 through 12 in one page. Treat parameter tuning (Unit 10) and full 3D visualization (Unit 11) as optional add-ons if time allows — they're valuable but not essential to a minimum viable dashboard.

## Structuring the code so it doesn't collapse into spaghetti
The biggest risk at this scale isn't any single ROS integration — it's a single `app.js` file where the camera subscriber, the map renderer, and the joystick handler all read and write the same global variables. Keep the module boundaries you started in Unit 3: one file per concern (`camera.js`, `teleop.js`, `map.js`, `telemetry.js`), each exporting a small `init(ros)` function, and a single top-level file that creates one shared `ROSLIB.Ros` connection and passes it into each module.

```javascript
// main.js
import { initCamera } from './camera.js';
import { initTeleop } from './teleop.js';
import { initMap } from './map.js';

const ros = new ROSLIB.Ros({ url: 'ws://<robot-ip>:9090' });
ros.on('connection', () => {
  initCamera(ros);
  initTeleop(ros);
  initMap(ros);
});
```

## Handling connection loss gracefully across the whole page
A production-quality dashboard has to survive the WebSocket dropping — a robot rebooting, a Wi-Fi hiccup — without leaving stale data on screen looking live. Centralize this: a single `connection`/`close`/`error` handler on your shared `ros` object that grays out or disables every panel, and attempts reconnection.

```javascript
let reconnectTimer;
ros.on('close', () => {
  document.body.classList.add('disconnected');
  reconnectTimer = setTimeout(() => ros.connect('ws://<robot-ip>:9090'), 2000);
});
ros.on('connection', () => {
  document.body.classList.remove('disconnected');
  clearTimeout(reconnectTimer);
});
```

## Performance and safety review before calling it done
Walk back through each panel with two questions: does anything publish or render faster than it needs to (check your Network/Performance dev tools tabs), and does every control that moves the robot have an unambiguous "stop" path if the connection drops or a button is released? A dashboard that looks complete but drives the robot forever if the browser tab freezes is not actually complete.

## Try it yourself
Assemble a single-page dashboard combining teleoperation (joystick or buttons), a live camera view, an odometry readout, and at least one service or action call, using the modular structure above and a centralized connection-loss handler. Deliberately kill your rosbridge server while the dashboard is running and confirm every panel visibly indicates "disconnected" rather than silently freezing on the last good frame — then restart rosbridge and confirm the page reconnects and resumes on its own.
