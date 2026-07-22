# Basics of Robotics with LIMO — Unit 3: Robot Frames

Every sensor reading and every command you issue is only meaningful relative to some coordinate frame — "0.5 meters forward" is meaningless until you say forward *relative to what*. This unit covers how ROS represents multiple, moving coordinate frames at once and how to reason with them.

## Why one global frame isn't enough

A robot has several frames that all matter simultaneously and move relative to each other: a frame fixed to the lidar (where scan points are naturally expressed), a frame fixed to the camera, a frame fixed to the robot's chassis (`base_link`), and a frame fixed to the world (`odom` or `map`). A point detected by the lidar needs to be reasoned about in the robot's frame to plan a path, and in the world frame to be placed on a persistent map. Doing this transformation by hand with rotation matrices everywhere would be tedious and error-prone at scale — this is exactly the problem `tf2` solves.

## tf2: the transform tree

`tf2` maintains a tree of coordinate frames, where each edge is a transform (translation + rotation) from a parent frame to a child frame, published continuously over time. A typical LIMO tree looks like:

```
map -> odom -> base_link -> base_scan
                          -> base_camera
                          -> (arm links, if equipped)
```

Static relationships (lidar bolted to the chassis) are published once via a static transform publisher; dynamic ones (`odom -> base_link`, representing the robot's estimated motion) are published continuously by the odometry source. You can inspect the whole tree at any time:

```bash
ros2 run tf2_tools view_frames
ros2 run tf2_ros tf2_echo base_link base_scan
```

`view_frames` renders the entire tree to a PDF so you can sanity-check that nothing is missing or duplicated; `tf2_echo` prints the live transform between any two named frames, which is invaluable for confirming a sensor's mounting offset is correct.

## Looking up and using transforms

In code, you don't compute chained transforms yourself — you ask `tf2` to look up the net transform between any two frames in the tree, and it walks the tree for you:

```python
from tf2_ros import Buffer, TransformListener
from rclpy.duration import Duration

tf_buffer = Buffer()
tf_listener = TransformListener(tf_buffer, node)

# later, inside a callback or timer:
transform = tf_buffer.lookup_transform(
    'base_link', 'base_scan', rclpy.time.Time(), Duration(seconds=1.0))
```

This returns the pose of `base_scan` expressed in `base_link`, computed automatically even if there are several hops between them. The same buffer can also directly transform a point, a pose, or a whole point cloud between frames using `tf2_geometry_msgs`, which is the pattern you'll use constantly once perception and navigation enter the picture.

## Wheeled vs. arm frame conventions

For a wheeled base like LIMO, the frame tree is shallow — base plus a handful of sensor frames. Attach an arm, and the tree grows one frame per joint, each transform parameterized by that joint's current angle (published via `robot_state_publisher` from `/joint_states` and the robot's URDF). This is the mechanical link between Unit 1's "actuators" and the frame tree: moving a joint doesn't just change a motor's position, it changes the transform of every frame downstream of that joint, and therefore the interpreted position of anything attached further out (a gripper, a mounted camera).

## Try it yourself

Run `ros2 run tf2_tools view_frames` against a running LIMO (real or simulated) and open the resulting PDF. Identify `map`, `odom`, `base_link`, and at least one sensor frame, then use `tf2_echo` to print the static transform from `base_link` to your lidar's frame — does the reported offset match where the sensor is physically mounted on the chassis?
