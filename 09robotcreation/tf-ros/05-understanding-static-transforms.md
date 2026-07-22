# TF ROS — Unit 5: Understanding Static Transforms

Not every frame relationship changes over time. This unit covers the tool built specifically for the frames that never move, and the two common ways to publish them.

## Why static transforms are their own thing
A lidar bolted to a chassis, a camera mounted on a fixed bracket, or the offset between a robot's `base_link` and `base_footprint` never changes for the lifetime of the run. Publishing that relationship over and over on `/tf` at, say, 50 Hz wastes bandwidth and CPU for no benefit. `/tf_static` exists for exactly this: the publisher sends the transform once, using "transient local" QoS, and any listener that subscribes later — even long after the message was sent — still receives it, because the middleware retains the last sample for late joiners. Everything else about a static transform (translation, rotation, parent/child naming) is identical to a normal one; only the publishing pattern differs.

## Publishing from the command line
For quick tests, prototyping, or fixed sensor mounts you don't want to wire into a launch file yet, `static_transform_publisher` can be run directly:

```bash
# x y z yaw pitch roll parent_frame child_frame  (older argument order)
ros2 run tf2_ros static_transform_publisher \
  0.2 0.0 0.15 0 0 0 base_link lidar_link
```

Recent versions also accept explicit flags (`--x --y --z --roll --pitch --yaw --frame-id --child-frame-id`, or `--qx --qy --qz --qw` for a quaternion) — check `--help` on your installed version, since the positional argument order has changed across releases and is a common source of "why is my transform flipped" confusion.

## Publishing from a launch file
In practice, static transforms for a real robot are almost always declared in the launch file alongside the rest of the bring-up, so they start automatically and consistently every run rather than depending on someone remembering a manual command:

```python
from launch_ros.actions import Node

Node(
    package='tf2_ros',
    executable='static_transform_publisher',
    arguments=['0.2', '0', '0.15', '0', '0', '0', 'base_link', 'lidar_link'],
)
```

Multiple sensors mean multiple such `Node` entries — one static transform publisher instance per fixed relationship, or a single node fed a list of transforms depending on how your tooling is set up.

## When *not* to use a static transform
If a relationship changes even occasionally — a pan-tilt camera mount, a sensor on a moving arm joint — it belongs on regular `/tf` via a dynamic broadcaster (or, better, as part of the URDF-driven tree from Unit 4), not `/tf_static`. Publishing a moving relationship as "static" means every listener keeps using the first value forever, which is a subtle and painful bug to track down.

## Try it yourself
Measure (roughly, with a ruler is fine) the offset from the center of your desk to your keyboard's top-left corner. Write a `static_transform_publisher` command that publishes that offset as `desk_center -> keyboard_corner`, run it, and confirm with `tf2_echo desk_center keyboard_corner` that the values you get back match what you measured.
