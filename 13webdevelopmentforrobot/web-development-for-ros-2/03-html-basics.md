# Web Development for ROS 2 — Unit 3: HTML Basics

HTML is the structural language every browser reads — the skeleton that CSS later styles and JavaScript later animates. This unit covers the elements you'll actually use to lay out a robot control panel, and gets your very first Rosbridge connection working.

## What is HTML?
HTML (HyperText Markup Language) describes a document as a tree of nested elements, each tagged with what it *is* — a heading, a paragraph, a button, a list — rather than how it should look. That separation of concerns (structure in HTML, appearance in CSS, behavior in JavaScript) is deliberate and worth internalizing now: it's what lets you restyle an entire robot panel in Unit 5 without touching a single tag here.

## The Basic HTML structure
Every HTML document follows the same skeleton:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Robot Panel</title>
</head>
<body>
  <h1>Robot Panel</h1>
</body>
</html>
```

`<!doctype html>` tells the browser to render in standards mode. `<head>` holds metadata and resource links (stylesheets, later a `<script>` tag) that aren't themselves visible content; `<body>` holds everything the user actually sees.

## HTML elements
The elements you'll reach for constantly in a robot panel:

```html
<h1>Robot Panel</h1>
<p>Status: <span id="status">disconnected</span></p>

<button id="forward">Forward</button>
<button id="stop">Stop</button>

<table>
  <tr><th>Topic</th><th>Value</th></tr>
  <tr><td>/battery_state</td><td id="battery">--</td></tr>
</table>

<ul>
  <li>Laser range: <span id="range">--</span> m</li>
</ul>
```

Note the `id` attributes — they're not for styling, they're hooks so JavaScript can find and update these exact elements later (Unit 7 onward). Get in the habit of adding an `id` to any element whose content will change dynamically.

## HTML Display
Some elements are block-level (`<h1>`, `<p>`, `<table>`, `<div>`) and take up their own line by default; others are inline (`<span>`, `<button>`, `<a>`) and sit within surrounding text. This distinction matters once CSS enters the picture in Unit 5 — it's why `<span>` is the natural choice for a value that lives inline next to a label, while `<div>` is the natural choice for a whole panel section.

## Time to practice!
Build a static page with a heading, a status paragraph, two buttons (`Forward`, `Stop`), and a small table of two or three sensor readings with placeholder `--` values. Save it as `panel.html` and view it through your Unit 2 HTTP server.

## Practice/Demo - Moving a robot!
Rosbridge is what turns your buttons into real robot commands: it runs a WebSocket server (default port 9090) that accepts JSON messages describing ROS 2 publish/subscribe/service calls, using the same topic names and message types you'd use from `rclpy` or `rclcpp`. Launch it alongside your robot:

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

Then, from your browser's developer console (on the page you just built), open a raw WebSocket and publish one velocity command by hand:

```javascript
const ros = new WebSocket('ws://localhost:9090');
ros.onopen = () => {
  ros.send(JSON.stringify({
    op: 'publish',
    topic: '/cmd_vel',
    msg: { linear: { x: 0.2, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } }
  }));
};
```

If your robot or simulation moves forward, you've just sent your first web-to-ROS 2 command — every later unit refines this exact mechanism.

## Conclusions
You can now structure a page and you've proven, by hand, that a browser can command a ROS 2 robot through Rosbridge. Units 4-6 flesh out this page's structure and appearance; Unit 7 replaces the raw WebSocket calls above with proper JavaScript.
