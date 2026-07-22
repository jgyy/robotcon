# Debug Cases — Unit 4: Case 3: ROS TF's

The transform system (`tf2`) is one of the most common sources of confusing, hard-to-reproduce robotics bugs: a robot that "jumps," sensor data that appears in the wrong place, or a planner that silently refuses to run because a frame doesn't exist yet. This unit builds a systematic approach to inspecting and debugging the transform tree instead of guessing at frame math.

## Visualizing the frame tree

Before debugging any specific transform, get the whole picture. `tf2_tools`/`tf2_ros` ships a tool that renders the entire tree of frames and how they connect:

```bash
ros2 run tf2_tools view_frames
```

This produces a PDF showing every frame, its parent, and how recently it was published. A frame with no connection to your robot's root frame (commonly `base_link` or `map`), or one that stopped updating minutes ago, is immediately visible here — often faster than reading launch files to reconstruct the tree by hand.

## Querying a specific transform

Once you know the tree shape, check individual transforms directly:

```bash
ros2 run tf2_ros tf2_echo map base_link
```

This continuously prints the translation and rotation from `map` to `base_link` as it updates. If it prints nothing and eventually times out with "could not find a connection," the two frames aren't linked — either a static transform publisher isn't running, or a dynamic one (e.g. from a localization node) hasn't started publishing yet.

## Generating transforms yourself

For fixed offsets (e.g. a sensor mounted rigidly on the chassis), publish a static transform rather than hand-rolling a node:

```bash
ros2 run tf2_ros static_transform_publisher \
  --x 0.1 --y 0 --z 0.2 --roll 0 --pitch 0 --yaw 0 \
  --frame-id base_link --child-frame-id lidar_link
```

For dynamic transforms (odometry, localization output), a node broadcasts continuously via a `TransformBroadcaster`:

```python
from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped

t = TransformStamped()
t.header.stamp = self.get_clock().now().to_msg()
t.header.frame_id = 'odom'
t.child_frame_id = 'base_link'
t.transform.translation.x = x
t.transform.rotation.z = qz
t.transform.rotation.w = qw
self.tf_broadcaster.sendTransform(t)
```

A frequent bug here: forgetting to stamp `header.stamp` with the current time, which causes consumers doing time-aware lookups to reject the transform as "too old" or "in the future."

## Diagnosing frame name mismatches

The single most common TF bug is a string mismatch — `"laser"` vs `"laser_link"` vs `"base_laser"` — between what a sensor driver stamps into its message headers and what the URDF/static transform tree actually defines. Cross-check with:

```bash
ros2 topic echo /scan --field header.frame_id
ros2 run tf2_ros tf2_echo map <that_exact_frame_id>
```

If `tf2_echo` can't find the frame, it doesn't exist anywhere in the published tree — fix the driver's frame_id parameter or add the missing static transform, whichever is actually wrong.

## Try it yourself

Pick two frames in your simulated robot's tree that are not directly connected (e.g. a sensor frame and `map`). Use `view_frames` to find the chain of parent/child links between them, then use `tf2_echo` to confirm the end-to-end transform resolves. Deliberately typo one frame_id in a static transform publisher and observe how `tf2_echo` reports the break.
