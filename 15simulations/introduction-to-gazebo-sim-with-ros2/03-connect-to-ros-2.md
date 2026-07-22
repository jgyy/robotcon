# Introduction to Gazebo Sim with ROS2 — Unit 3: Connect to ROS 2

This unit is the technical core of the course: bridging topics and services between Gazebo Sim's own transport layer and ROS 2, then using Gazebo plugins so your URDF robot actually drives, senses, and reports data like a real ROS 2 node.

## The ros_gz_bridge: Connecting Two Worlds
Gazebo Sim doesn't speak ROS 2 natively. It has its own pub/sub layer, `gz-transport`, and its own message definitions, `gz.msgs`. The `ros_gz_bridge` package translates between the two for message types that have a known mapping (odometry, laser scans, IMU readings, twist commands, clock, and more — see the `ros_gz_bridge` package documentation for the full table). You launch one bridge per topic using a compact syntax: `<topic>@<ros_type>@<gz_type>`, where the middle character controls direction:

- `@` — bidirectional
- `[` — Gazebo → ROS 2 only
- `]` — ROS 2 → Gazebo only

```bash
# sensor data flowing out of the simulator
ros2 run ros_gz_bridge parameter_bridge /lidar@sensor_msgs/msg/LaserScan[gz.msgs.LaserScan

# velocity commands flowing into the simulator
ros2 run ros_gz_bridge parameter_bridge /cmd_vel@geometry_msgs/msg/Twist]gz.msgs.Twist

# sim clock, bidirectional in principle but normally only published gz -> ROS
ros2 run ros_gz_bridge parameter_bridge /clock@rosgraph_msgs/msg/Clock[gz.msgs.Clock
```

For more than a couple of topics, list them in a YAML file and pass it with `parameter_bridge --ros-args -p config_file:=bridge.yaml` instead of stacking arguments — much easier to maintain alongside a launch file.

## Calling Gazebo Services from ROS 2
Not everything is a stream. Spawning an entity, deleting one, or teleporting a model to a new pose are one-shot **services** in gz-transport, not topics, and the bridge above doesn't cover them. You already used one such service in Unit 2 through the `ros_gz_sim create` helper, which wraps a call to `/world/<world>/create`. For services without a dedicated ROS 2 wrapper, call gz-transport directly with the `gz service` CLI:

```bash
gz service -l                          # list every service the running server exposes
gz service --service /world/default/set_pose \
  --reqtype gz.msgs.Pose --reptype gz.msgs.Boolean --timeout 1000 \
  --req 'name: "my_robot", position: {x: 1, y: 0, z: 0.5}'
```

If a ROS 2 node needs to trigger one of these and no bridge exists yet, shelling out to `gz service` (or using `gz-transport`'s Python/C++ bindings directly) is a normal, sanctioned workaround.

## Configuring Sensors and Actuators via <gazebo> Tags
URDF has no native concept of a Gazebo plugin or sensor, so it's extended with a `<gazebo>` tag that carries simulator-only configuration. This is how a plain differential-drive URDF becomes a robot that actually responds to `/cmd_vel`:

```xml
<gazebo>
  <plugin filename="gz-sim-diff-drive-system" name="gz::sim::systems::DiffDrive">
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <wheel_separation>0.3</wheel_separation>
    <wheel_radius>0.05</wheel_radius>
    <topic>cmd_vel</topic>
  </plugin>
</gazebo>
```

Sensors attach to a specific link with `<gazebo reference="...">` instead of a bare `<gazebo>` block. A lidar:

```xml
<gazebo reference="lidar_link">
  <sensor name="lidar" type="gpu_lidar">
    <topic>lidar</topic>
    <update_rate>10</update_rate>
    <ray>
      <scan><horizontal><samples>360</samples><min_angle>-3.14159</min_angle><max_angle>3.14159</max_angle></horizontal></scan>
      <range><min>0.1</min><max>10.0</max></range>
    </ray>
  </sensor>
</gazebo>
```

An IMU needs no extra plugin — it's a built-in sensor type, so `<sensor name="imu" type="imu"><topic>imu</topic></sensor>` inside a `<gazebo reference="imu_link">` block is enough; the simulator's built-in IMU system reads it automatically.

## Xacro: Keeping URDF DRY
Once you have four wheels, several sensors, and a `<gazebo>` block for each, raw URDF gets repetitive and error-prone fast. **Xacro** (XML + macro) extends URDF with `<xacro:property>` values, `<xacro:macro>` definitions, and simple math, so a wheel or sensor can be defined once and instantiated per-side:

```xml
<xacro:macro name="wheel" params="prefix reflect">
  <link name="${prefix}_wheel">...</link>
  <joint name="${prefix}_wheel_joint" type="continuous">
    <origin xyz="0 ${reflect * 0.2} 0" rpy="1.5708 0 0"/>
    ...
  </joint>
</xacro:macro>
<xacro:wheel prefix="left" reflect="1"/>
<xacro:wheel prefix="right" reflect="-1"/>
```

Xacro files aren't consumed directly by `robot_state_publisher` — they're expanded to plain URDF first, either on the command line (`xacro robot.urdf.xacro > robot.urdf`) or inline in a launch file via a `Command(['xacro ', xacro_path])` substitution, as shown in Unit 2.

## Try it yourself
Take the differential-drive robot from Unit 2, add a `<gazebo>` DiffDrive plugin and a lidar sensor tag to it, bridge `/cmd_vel` and the lidar topic with `ros_gz_bridge`, then drive the robot with `ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.3}}"` while watching `ros2 topic echo /lidar` to confirm scan data updates as it moves.
