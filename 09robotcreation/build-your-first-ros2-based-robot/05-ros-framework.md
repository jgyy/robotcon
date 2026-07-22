# Build Your First ROS2 Based Robot — Unit 5: ROS Framework

This is where the robot becomes software-controllable: you'll create a proper ROS 2 workspace, write the packages that turn velocity commands into wheel motion, and wrap it all in a single bringup entry point.

## ROS 2 workspace
ROS 2 code lives in a *workspace* — a directory tree that `colcon` (the standard ROS 2 build tool) knows how to build and that, once built, gets *sourced* to put its packages on your ROS 2 environment path.
```bash
mkdir -p ~/robot_ws/src
cd ~/robot_ws
colcon build --symlink-install   # symlink-install: Python edits take effect without rebuilding
source install/setup.bash
```
Everything you write for the rest of the course goes under `~/robot_ws/src` as one or more packages. Add `source ~/robot_ws/install/setup.bash` to your `~/.bashrc` (after the ROS 2 base `setup.bash`) so every new shell has your robot's packages available automatically.

## ROS 2 motor driver package
Create a package to hold the node(s) that turn ROS 2 velocity commands into per-wheel targets:
```bash
cd ~/robot_ws/src
ros2 pkg create --build-type ament_python motor_driver --dependencies rclpy geometry_msgs
```
The core logic here is differential-drive kinematics: a `Twist` message on `/cmd_vel` carries a linear velocity `v` and an angular velocity `ω`, which convert to left/right wheel speeds via:
```python
def twist_to_wheel_speeds(v: float, omega: float, wheel_separation: float) -> tuple[float, float]:
    v_left = v - (omega * wheel_separation / 2.0)
    v_right = v + (omega * wheel_separation / 2.0)
    return v_left, v_right
```
This function is the mathematical heart of the whole drivetrain — everything upstream (navigation, teleop) only ever needs to think in terms of `v` and `ω`, never in terms of individual wheels.

## Serial motor driver node
Wrap that math in a node that subscribes to `/cmd_vel`, computes wheel speeds, and writes them out over the serial link from Unit 2:
```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import serial

class MotorDriverNode(Node):
    def __init__(self):
        super().__init__('motor_driver_node')
        self.declare_parameter('wheel_separation', 0.20)
        self.declare_parameter('serial_port', '/dev/ttyUSB0')
        port = self.get_parameter('serial_port').value
        self.ser = serial.Serial(port, baudrate=115200, timeout=0.1)
        self.create_subscription(Twist, '/cmd_vel', self.cmd_vel_callback, 10)

    def cmd_vel_callback(self, msg: Twist):
        sep = self.get_parameter('wheel_separation').value
        v_left = msg.linear.x - (msg.angular.z * sep / 2.0)
        v_right = msg.linear.x + (msg.angular.z * sep / 2.0)
        self.ser.write(f"L:{v_left:.3f},R:{v_right:.3f}\n".encode())

def main():
    rclpy.init()
    node = MotorDriverNode()
    rclpy.spin(node)

if __name__ == '__main__':
    main()
```
Note the `declare_parameter` calls — hardcoding the serial port or wheel separation makes the package unreusable the moment your wiring or chassis changes; parameters let you override them at launch time instead.

## Bringup package
Rather than running each node by hand every time, create a dedicated `bringup` package whose only job is composing everything into one launch file:
```python
# bringup/launch/robot.launch.py
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(package='motor_driver', executable='motor_driver_node',
             parameters=[{'wheel_separation': 0.20, 'serial_port': '/dev/ttyUSB0'}]),
        # LiDAR, camera, and robot_state_publisher nodes join this list in later units
    ])
```
```bash
ros2 launch bringup robot.launch.py
```
Keeping bringup in its own package (rather than in `motor_driver`) matters because later units will add more nodes to this same launch file without touching driver code at all — bringup is where the *whole robot* gets assembled, one launch action at a time.

## Conclusion
You now have a ROS 2 workspace, a motor driver that turns `/cmd_vel` into real wheel motion over serial, and a single command that starts the robot's software stack. Every unit from here forward adds another `Node(...)` entry to `bringup` rather than inventing a new way to start things.

## Try it yourself
Publish a test velocity command from the command line and confirm your node reacts (check with a serial monitor, or add a log line in the callback if hardware isn't wired yet):
```bash
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}, angular: {z: 0.0}}"
```
