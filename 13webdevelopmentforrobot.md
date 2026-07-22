# 13 Web Development for Robots

## Why this matters
A browser is the cheapest, most portable operator interface you'll ever have: no app to install, works on a phone, tablet, or laptop, and it can be handed to someone who has never touched ROS. Bridging ROS/ROS2's pub-sub graph out to HTTP/WebSocket also lets you plug robots into ordinary web stacks — dashboards, fleet consoles, remote-monitoring tools — written by people who don't know ROS at all. The tradeoffs (latency, bandwidth, security) are different from talking to a robot over its native middleware, and worth understanding deliberately rather than discovering in production.

## Core concepts
- **rosbridge protocol** — a JSON-over-WebSocket wire protocol that exposes topic pub/sub, service calls, and (in newer versions) actions and parameters to any client that isn't a ROS node.
- **rosbridge_suite** — the reference server implementing that protocol, launched on the robot (or a gateway machine) to open a WebSocket port onto the ROS graph; supports both ROS 1 and ROS 2, check which distro/branch matches your setup.
- **roslibjs** — the JavaScript client library for the rosbridge protocol; runs in the browser to subscribe to topics, publish commands, call services, and interact with actions.
- **roslibpy** — the same idea from Python: a rosbridge client (not a ROS node) useful for writing server-side bridges, scripts, or non-ROS-machine integrations without a full ROS install.
- **Teleoperation UI basics** — mapping browser input (on-screen buttons, a virtual joystick widget, keyboard, or gamepad API) to velocity commands (e.g. `geometry_msgs/Twist`), including publish-rate throttling and a "dead man's switch" so the robot stops if the browser tab loses connection.
- **Streaming video/camera feeds** — options range from `web_video_server` (serves an image topic as MJPEG over plain HTTP, easy but bandwidth-heavy) to WebRTC (lower latency, more setup) to decoding raw image messages in a canvas via roslibjs.
- **2D/3D visualization in-browser** — libraries like ros2djs (canvas-based 2D, e.g. occupancy grid maps) and ros3djs (three.js-based 3D, e.g. URDF models driven by live TF) render robot state without a desktop RViz install.
- **Foxglove** — a general-purpose robotics visualization/dashboarding tool (successor to "Foxglove Studio") that connects live to a robot via its own WebSocket protocol (`foxglove_bridge`) or via rosbridge, and can also replay recorded bag files; supports custom panels and layouts, useful both for debugging and as an operator dashboard.
- **rerun** — a separate, ROS-agnostic SDK for logging and visualizing multimodal, time-varying data (images, point clouds, transforms) from your own code, with a browser-based viewer; worth comparing against Foxglove/rosbridge when you're instrumenting an algorithm rather than exposing a whole robot.
- **rosboard** — a minimal, single-purpose alternative: point a browser at the robot's IP and get live topic plots/visualizations with essentially zero UI code of your own, handy for quick inspection versus building a bespoke dashboard.
- **REST vs. WebSocket bridging** — WebSocket (rosbridge, foxglove_bridge) suits continuous, low-latency streaming; a REST wrapper (e.g. a small Flask/FastAPI service calling ROS services or reading the latest cached message) suits request/response integrations with external systems, polling-style dashboards, or clients that can't hold a persistent socket.
- **Security and network exposure** — rosbridge has no built-in authentication or authorization; it should sit behind a reverse proxy with TLS (`wss://`) and access control, or stay on a private network/VPN — never expose it directly to the open internet.
- **Bandwidth and serialization tradeoffs** — JSON is verbose and CPU-costly at high message rates; large or fast topics (images, point clouds, laser scans) usually need throttling, downsampling, or a binary encoding (e.g. CBOR, or Foxglove's protocol) rather than raw rosbridge JSON.
- **Deployment patterns** — running the dashboard's static files on the robot itself (onboard web server alongside rosbridge) versus serving it from a laptop or cloud host that connects out to the robot's WebSocket port; each has different implications for latency, offline use, and firewall/NAT traversal.

## Resources
- rosbridge_suite — official repo and README: github.com/RobotWebTools/rosbridge_suite (see the `ros1` and `ros2` branches for the version matching your distro)
- roslibjs — github.com/RobotWebTools/roslibjs (JS rosbridge client, with examples)
- roslibpy — github.com/gramaziokohler/roslibpy, full docs on Read the Docs (search "roslibpy readthedocs")
- Robot Web Tools project (umbrella for roslibjs, ros2djs, ros3djs, and related tools) — robotwebtools.github.io, and github.com/RobotWebTools
- ros2djs — github.com/RobotWebTools/ros2djs (2D canvas visualization)
- ros3djs — github.com/RobotWebTools/ros3djs (3D visualization built on three.js; see its README for the three.js version it expects)
- web_video_server — ROS package docs, search "web_video_server" on index.ros.org or wiki.ros.org
- Foxglove docs — docs.foxglove.dev, including the "ROS Foxglove Bridge" getting-started guide
- foxglove_bridge — github.com/foxglove/ros-foxglove-bridge (ROS 1) and its ROS 2 successor referenced from the Foxglove docs; also packaged and documented on docs.ros.org for current distros
- rerun — rerun.io/docs and github.com/rerun-io/rerun
- rosboard — github.com/dheera/rosboard
- three.js documentation — threejs.org/docs, useful background if you extend ros3djs scenes yourself
- ROS wiki page for rosbridge_suite and the rosbridge v2 protocol spec — search "rosbridge_suite" on wiki.ros.org for the ROS 1 reference material and protocol details that still apply conceptually to ROS 2 use

## Hands-on checkpoints
- [ ] Launch rosbridge_suite against a running robot or simulation and confirm you can see it accept a WebSocket connection (e.g. with a simple `wscat` or browser dev-console test).
- [ ] Write a minimal HTML + roslibjs page that subscribes to a topic (e.g. `/odom` or a sim's pose topic) and prints live values to the page.
- [ ] Add a publish path: on-screen buttons or a virtual joystick that publish `Twist` messages to drive the robot, including a stop-on-disconnect safeguard.
- [ ] Embed a live camera feed using `web_video_server`, and separately try decoding the same topic manually via roslibjs to see the tradeoffs.
- [ ] Render a 2D map or a 3D URDF model of the robot in-browser using ros2djs/ros3djs, driven by live TF data.
- [ ] Connect Foxglove to the same robot (via rosbridge or foxglove_bridge) and rebuild your dashboard as a custom layout instead of hand-written HTML; compare effort and capability against your roslibjs page.
- [ ] Put a small REST endpoint in front of one ROS service (e.g. using Flask or FastAPI plus roslibpy) so a non-ROS script or curl call can trigger it.
- [ ] Put the whole teleop page behind a reverse proxy with TLS and basic auth, and test that rosbridge is unreachable without going through it.
