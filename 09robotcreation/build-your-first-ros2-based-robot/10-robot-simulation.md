# Build Your First ROS2 Based Robot — Unit 10: Robot Simulation

Real hardware is expensive to break and slow to iterate on; this unit gets your robot running in a physics simulator, driven by the same ROS 2 nodes and launch files you've already built, so you can develop and test without touching the physical robot.

## Adapt URDF for Gazebo
The URDF you wrote in Unit 7 (or exported from your Onshape/CAD assembly) describes visual and collision geometry, but a physics simulator like Gazebo needs more to actually simulate the robot realistically: correct `<inertial>` values on every link (not just the base), and typically some simulator-specific tags. Two additions matter most:
```xml
<link name="left_wheel_link">
  ...
  <inertial>
    <mass value="0.05"/>
    <inertia ixx="0.00002" ixy="0" ixz="0" iyy="0.00002" iyz="0" izz="0.00003"/>
  </inertial>
</link>

<gazebo reference="left_wheel_link">
  <mu1>1.0</mu1>   <!-- friction coefficient: too low and the robot's wheels slip in place -->
  <mu2>1.0</mu2>
</gazebo>
```
If your URDF was auto-exported from CAD, double check that every link (not just the ones you hand-wrote) has a non-zero, physically plausible `<inertial>` block — a link with zero or missing mass/inertia is a common cause of a simulated robot that flies apart or falls through the floor the instant physics starts running.

## Gazebo plugins
Plugins are what connect the simulator's physics to ROS 2 topics — without them, your URDF is just a shape sitting in empty space with no way to receive commands or report sensor data. A differential-drive plugin, for example, subscribes to `/cmd_vel` (the same topic your real motor driver node from Unit 5 subscribes to) and applies the corresponding forces to the simulated wheel joints, while a LiDAR/camera sensor plugin publishes simulated `LaserScan`/`Image` messages on the same topics your real drivers use:
```xml
<gazebo>
  <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <wheel_separation>0.20</wheel_separation>
    <wheel_diameter>0.06</wheel_diameter>
  </plugin>
</gazebo>
```
This is the key idea behind simulating with ROS 2 specifically: because the plugin speaks the same topics as your real hardware nodes, everything you built in Units 5, 8, and 9 — the same `/cmd_vel` subscriber, the same `/scan` and `/image_raw` consumers — works against the simulated robot with zero code changes. Only the source of those topics changes, from real hardware drivers to simulated ones.

## Simulation launch files
Bring the simulator up alongside your existing bringup structure rather than replacing it — spawn the world, spawn your robot's URDF into it, and start `robot_state_publisher` exactly as you would on real hardware:
```python
# bringup/launch/sim.launch.py
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # 1. Start the simulator with an empty (or test) world
        # 2. Spawn the robot's URDF/xacro into that world at a starting pose
        Node(package='robot_state_publisher', executable='robot_state_publisher',
             parameters=[{'robot_description': open('fastbot.urdf').read()}]),
        # Note: no motor_driver or LiDAR/camera driver nodes here — the
        # simulator's plugins publish those topics instead.
    ])
```
```bash
ros2 launch bringup sim.launch.py
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}}"   # drive the simulated robot
```
Keeping `sim.launch.py` separate from your real-hardware `robot.launch.py` (rather than one launch file with conditionals scattered everywhere) makes it obvious at a glance which one you're running, and keeps hardware-specific parameters (serial ports, camera device paths) out of a file that never touches real hardware.

## Conclusion
You can now develop and test against a simulated FastBot that responds to the exact same topics as the real one — useful for iterating on navigation or perception logic, running regression checks before deploying to the physical robot, or simply testing when the hardware is elsewhere or being repaired.

## Try it yourself
Launch your simulation, publish a `/cmd_vel` command, and confirm the simulated robot moves in Gazebo while `ros2 topic echo /scan` (from the simulated LiDAR plugin) shows changing range values as it approaches an obstacle in the simulated world.
