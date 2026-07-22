# Developing Web Interfaces for ROS — Unit 2: Setting up our development environment (Part 1)

Everything in this course depends on one running piece of infrastructure: the rosbridge WebSocket server. This unit gets it installed, launched, and verified so that later units can focus purely on the web side.

## Installing rosbridge_suite
`rosbridge_suite` ships as a standard ROS package and is available through your distro's package manager on both ROS 1 and ROS 2:

```bash
# Debian/Ubuntu, ROS 2 (replace <distro> with your installed distro, e.g. humble, jazzy)
sudo apt install ros-<distro>-rosbridge-suite

# ROS 1 equivalent
sudo apt install ros-<distro>-rosbridge-server
```

If a packaged version isn't available for your platform, cloning `rosbridge_suite` into a workspace `src/` directory and building it with `colcon build` (ROS 2) or `catkin build` (ROS 1) works identically.

## Launching the bridge
Start the WebSocket server with the provided launch file:

```bash
# ROS 2
ros2 launch rosbridge_server rosbridge_websocket_launch.xml

# ROS 1
roslaunch rosbridge_server rosbridge_websocket.launch
```

By default this opens a WebSocket endpoint at `ws://<host>:9090`. Watch the terminal output — it logs every client connect/disconnect and, at higher log levels, every message that crosses the bridge, which is invaluable for debugging later units.

## Verifying the bridge is reachable
Before writing any JavaScript, confirm the server is actually listening:

```bash
ss -tlnp | grep 9090        # confirm the port is open
```

A quick sanity check without a browser at all is to use a WebSocket CLI client such as `websocat` or `wscat`:

```bash
websocat ws://localhost:9090
# then paste a rosbridge protocol message and press enter:
{"op":"subscribe","topic":"/rosout"}
```

If ROS log messages start streaming back as JSON, the bridge is healthy end-to-end.

## Network and firewall considerations
If your robot and your browser are on different machines (the normal case — a laptop or tablet talking to a robot's onboard computer), make sure port 9090 is reachable across that network path: check firewall rules (`ufw status`, `iptables -L`), confirm both machines are on the same subnet or that routing/port-forwarding is set up, and use the robot's real IP address (not `localhost`) in the browser's connection URL. This is the single most common source of "it works when I test locally but not from my laptop" bugs in web-ROS projects.

## Try it yourself
Launch rosbridge on your machine, then use `websocat` (or `wscat`) to subscribe to `/rosout` and to a topic you know is publishing (e.g. `/clock` in simulation, or any sensor topic on a real robot). Confirm you see JSON messages arrive in your terminal before moving on to Unit 3.
