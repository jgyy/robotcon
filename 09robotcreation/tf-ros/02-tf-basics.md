# TF ROS — Unit 2: TF Basics

Here you get hands-on with an existing TF tree: how frames and transforms are represented, and the command-line and visual tools you'll reach for constantly for the rest of the course.

## Frames, transforms, and the `/tf` and `/tf_static` topics
Every transform in ROS is a `parent_frame -> child_frame` relationship carrying a translation (x, y, z) and a rotation, usually expressed as a quaternion (x, y, z, w) to avoid gimbal lock. Moving relationships (a wheel spinning, a robot driving) are published on the `/tf` topic as a stream over time; relationships that never change (a lidar bolted to the chassis) go on `/tf_static`, published once (with transient-local QoS) rather than repeatedly. Both topics carry the same message type, a list of stamped transforms — the split is purely a bandwidth/efficiency optimization, not a difference in meaning.

## Inspecting the tree: `tf2_echo` and `view_frames`
Two tools you'll use constantly:

```bash
# Print the transform between two named frames, updating live
ros2 run tf2_ros tf2_echo base_link lidar_link

# Generate a PDF diagram of the entire currently-active TF tree
ros2 run tf2_tools view_frames
# produces frames_<timestamp>.pdf in the current directory
```

`tf2_echo` is your go-to for "is this specific transform actually being published, and what does it currently say?" — useful when debugging why a sensor's data seems to land in the wrong place. `view_frames` answers a different question: "what does the whole tree look like right now, and is anything disconnected or missing?" Read the PDF's timestamps too — a frame with a stale "last published" time is often the actual bug.

## Visualizing frames in RViz
Add a `TF` display in RViz and every published frame appears as a small axis triad (red = X, green = Y, blue = Z) with its name labeled. This is the fastest way to sanity-check orientation conventions — e.g. confirming a camera's optical frame really points along +Z as expected, or that a wheel frame rotates the way you think it should as the robot drives. Toggle "Show Names" and "Show Axes" and reduce "Marker Scale" once the tree gets busy.

## Querying transforms programmatically
The same lookups the CLI tools do are available from code via the `tf2_ros.Buffer` / `TransformListener` pair (Python and C++ both), which you'll use starting in Unit 3:

```python
from tf2_ros import Buffer, TransformListener

tf_buffer = Buffer()
tf_listener = TransformListener(tf_buffer, node)
# later, once transforms have started arriving:
tf = tf_buffer.lookup_transform('base_link', 'lidar_link', rclpy.time.Time())
```

## Try it yourself
Launch any TF-publishing demo you have available (or a robot's navigation/simulation stack if you already have one installed), then run `ros2 run tf2_tools view_frames` and open the resulting PDF. Identify the root frame, count how many levels deep the tree goes, and run `tf2_echo` between the root and the deepest leaf frame to confirm you get a sensible, non-zero transform back.
