# ROS Basics in 5 Days (Python) — Unit 2: ROS Basic Concepts

This is where you stop reading about ROS and start running it. By the end of this unit you'll have moved a simulated robot from the command line, created your own ROS package, and written and built your first ROS program.

## Move a robot with ROS

The fastest way to build intuition is to control something before you understand all the machinery underneath it. With a simulated mobile robot running, you can drive it entirely from the terminal:

```bash
# list the topics the robot exposes
ros2 topic list

# publish a one-off velocity command
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.3}, angular: {z: 0.5}}"

# watch the robot's odometry stream as it moves
ros2 topic echo /odom
```

Nothing here required you to write a program — `ros2 topic pub` and `ros2 topic echo` are generic CLI tools that work with *any* topic, because ROS standardizes how data is described (message types) independently of who's producing or consuming it. That standardization is the whole point of the framework, and it's why the rest of this unit focuses on the plumbing that makes it work.

## Packages, workspaces, and launch files

A **ROS package** is the basic unit of software distribution in ROS: a directory with a manifest (`package.xml`) declaring its dependencies, plus source code, message definitions, and configuration. Packages live inside a **workspace** — typically `~/ros2_ws/src/` — which `colcon` (ROS 2's build tool) compiles as a whole.

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_first_pkg \
  --dependencies rclpy std_msgs
```

This scaffolds a Python package with a `setup.py`, a `package.xml`, and a folder for your node source files. A **launch file** is a Python (or XML/YAML) script that starts several nodes together with a shared configuration, instead of you opening five terminals and running five `ros2 run` commands by hand:

```python
# my_first_pkg/launch/demo.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='my_first_pkg', executable='talker', name='talker'),
        Node(package='my_first_pkg', executable='listener', name='listener'),
    ])
```

## Your first ROS program and compiling a package

A minimal node is just a Python class that inherits from `rclpy.node.Node`:

```python
# my_first_pkg/my_first_pkg/hello_node.py
import rclpy
from rclpy.node import Node

class HelloNode(Node):
    def __init__(self):
        super().__init__('hello_node')
        self.get_logger().info('Hello from my first ROS node!')

def main():
    rclpy.init()
    node = HelloNode()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

Register it as an entry point in `setup.py`, then build the workspace with `colcon build` (from the workspace root, not inside `src/`), source the resulting `install/setup.bash`, and run it with `ros2 run my_first_pkg hello_node`. Two common first-run issues: forgetting to `source` the workspace overlay after building (so `ros2 run` can't find your package), and forgetting to make the Python file executable / register it correctly in `setup.py` — both produce a "package not found" or "executable not found" error that's fixed by re-checking those two steps.

## Nodes, roscore, the parameter server, and environment variables

A **node** is a single running process that does one job — reading a sensor, computing a control signal, driving a wheel motor. Keeping nodes small and single-purpose is idiomatic ROS design: it makes each piece independently testable and reusable. In ROS 1, a central `roscore` process had to be running before any node could start, acting as the naming service that let nodes find each other; ROS 2 removed that single point of failure in favor of a decentralized discovery protocol (DDS), so there's no `roscore` step at all — nodes discover each other automatically as long as they're on the same network/domain.

The **parameter server** (per-node parameters in ROS 2) holds configuration values — thresholds, robot names, tunable gains — that you want to change without editing and recompiling code:

```bash
ros2 param list /hello_node
ros2 param get /hello_node use_sim_time
ros2 param set /hello_node use_sim_time true
```

**Environment variables** control how the ROS middleware behaves system-wide. The two you'll touch constantly:

```bash
echo $ROS_DOMAIN_ID   # isolates groups of ROS nodes on a shared network
echo $ROS_DISTRO       # which ROS 2 distribution is currently sourced
```

## Try it yourself

Create a package called `unit2_playground` with `ros2 pkg create`, add a node that logs your name and the current `ROS_DISTRO` environment variable on startup, build it with `colcon build`, and run it with `ros2 run`. Then add one parameter to the node (e.g. a `greeting` string) and change it at runtime with `ros2 param set` without restarting the node — confirm the change by re-running `ros2 param get`.
