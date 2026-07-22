# Web Development for Robotics — Unit 2: HTTP Server

Before you can view a page the way a browser really sees it — with correct relative paths, CORS behavior, and the ability to fetch data over the network — you need to serve it over HTTP instead of opening it as a local file. This unit sets up that development environment.

## file:// vs http://
Opening `index.html` by double-clicking it loads it via the `file://` protocol. That works for the simplest pages, but it breaks down fast: browsers block many `fetch()` calls, WebSocket connections, and ES module imports from `file://` origins for security reasons, and relative paths behave inconsistently. A local HTTP server puts you in the same conditions your page will run in once deployed on the robot or on a lab machine, so bugs you catch now are real bugs.

## Quick servers for development
You don't need a full production server to iterate on a page. Any of these serve the current directory on `http://localhost:PORT`:

```bash
# Python (already on most robotics dev machines)
python3 -m http.server 8000

# Node.js, no install if npx is available
npx http-server -p 8000

# VS Code users: "Live Server" extension does this with auto-reload
```

Visit `http://localhost:8000/index.html` in your browser. Every file in that folder is now reachable by a URL, and your browser's dev tools (F12 → Network tab) will show you every request the page makes — invaluable once you start talking to Rosbridge or a REST API later in this specialization.

## Serving alongside ROS 2
On a robot, you'll often want the dashboard served from the same machine that's running your ROS 2 nodes, sometimes launched together. A minimal pattern is a dedicated `www/` directory served by any of the tools above, started from a shell script or a `ros2 launch` `ExecuteProcess` action so the web server comes up with the rest of the stack:

```python
# In a ROS 2 launch file
from launch import LaunchDescription
from launch.actions import ExecuteProcess

def generate_launch_description():
    return LaunchDescription([
        ExecuteProcess(
            cmd=['python3', '-m', 'http.server', '8000'],
            cwd='/home/robot/www'
        ),
    ])
```

This keeps "start the robot" and "start its web dashboard" as one command during development.

## Ports, hosts, and reachability
`localhost` (127.0.0.1) only answers your own machine. To reach the page from another device on the network — say, a tablet on the same Wi-Fi as the robot — bind to `0.0.0.0` and use the robot's LAN IP:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
# then from another device: http://<robot-ip>:8000/
```

Be deliberate about which ports you expose this way outside of a trusted lab network — a development server has no authentication.

## Try it yourself
Serve the `index.html` from Unit 1 with `python3 -m http.server 8000`, load it in your browser, and open the Network tab in dev tools. Reload the page and confirm you see two requests: one for `index.html` and one for `app.js` (or whatever files it references), each with a `200 OK` status.
