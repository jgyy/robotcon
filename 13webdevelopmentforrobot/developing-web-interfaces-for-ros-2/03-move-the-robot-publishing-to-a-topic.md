# Developing Web Interfaces for ROS 2 — Unit 3: Move the Robot! Publishing to a topic!

This is the unit where your page stops being static and starts controlling a real robot: connecting to rosbridge, reacting to user input, and publishing `Twist` messages onto `/cmd_vel`.

## The page lifecycle and connecting to rosbridge
A web page goes through a predictable sequence: the HTML parses, the DOM becomes available, linked scripts execute, and only then is it safe to touch elements or open connections. Opening your `ROSLIB.Ros` WebSocket connection too early (before the DOM exists) or too late (after the user has already tried to click a button) causes exactly the kind of bugs Unit 2's DevTools skills are for. The safe place to initialize the connection is once the DOM is ready:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
  ros.on('connection', () => console.log('Connected to rosbridge'));
  ros.on('error', (err) => console.error('rosbridge error:', err));
  ros.on('close', () => console.log('Connection to rosbridge closed'));
});
```

Those three event handlers — `connection`, `error`, `close` — are worth wiring on every page you build in this course; they're your first line of defense when something isn't working and the browser console is silent.

## Handling events of the page
DOM event handling is standard JavaScript, but it's worth being deliberate about *which* events you attach ROS publishing to. A single click (`onclick`) suits a one-shot command like "stop"; `mousedown`/`mouseup` suit a "press and hold to move" control, since you want movement to start on press and stop the instant the user releases:

```javascript
const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', () => publishTwist(0, 0));

const forwardBtn = document.getElementById('forward');
forwardBtn.addEventListener('mousedown', () => publishTwist(0.2, 0));
forwardBtn.addEventListener('mouseup', () => publishTwist(0, 0));
```

## Publishing cmd_vel from buttons
Wiring a button to `/cmd_vel` combines a `ROSLIB.Topic` handle with a `ROSLIB.Message` payload:

```javascript
const cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: '/cmd_vel',
  messageType: 'geometry_msgs/msg/Twist'
});

function publishTwist(linearX, angularZ) {
  const twist = new ROSLIB.Message({
    linear: { x: linearX, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: angularZ }
  });
  cmdVel.publish(twist);
}
```

Note that `ROSLIB.Topic` doesn't open a new connection — it's a lightweight descriptor bound to the shared `ros` object, so you can create as many topic handles as you need (one per topic name/type pair) without extra connection overhead.

## Adding a virtual joystick
Buttons give you discrete commands, but continuous, proportional control — the kind you want for careful teleoperation — is better served by a joystick widget that reports an (x, y) offset from center as the user drags. Whatever joystick library you choose, the ROS-facing code is unchanged: on every move event, scale the joystick's normalized offset into linear/angular velocity and publish it, typically throttled so you're not flooding the topic on every pixel of mouse movement.

```javascript
function onJoystickMove(x, y) {           // x, y in range [-1, 1]
  publishTwist(y * 0.3, -x * 1.0);        // forward speed, turn rate
}
```

## Try it yourself
Add two buttons — "Turn Right" and "Stop" — to the page from Unit 1's layout, wired to publish appropriate `Twist` messages. Then replace the directional buttons with a virtual joystick and confirm the robot responds proportionally to how far you drag it from center, not just on/off.
