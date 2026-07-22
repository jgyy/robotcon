# Intermediate ROS2 — Unit 7: Quality of Service

Every ROS 2 topic, service, and action connection has a Quality of Service (QoS) profile attached to it — a set of policies governing how the underlying middleware handles delivery, buffering, and reliability. ROS 1 didn't expose this; ROS 2 does, because it's built on DDS (next unit), which was designed for exactly this kind of tunable, real-time-aware networking. Getting QoS wrong is the single most common reason two ROS 2 nodes that should be talking to each other simply aren't.

## The policies that matter most

Two policies cause the vast majority of real problems:

- **Reliability**: `RELIABLE` (every message is guaranteed delivered, with retries) vs. `BEST_EFFORT` (no retries, drop on network loss). Sensor streams like laser scans or camera images typically use `BEST_EFFORT` — a stale scan is worthless, so why pay for a retry — while commands and configuration typically need `RELIABLE`.
- **Durability**: `VOLATILE` (only messages published after a subscriber connects are delivered) vs. `TRANSIENT_LOCAL` (late-joining subscribers receive the last N published messages, replayed from a cache). Map data and static transforms use `TRANSIENT_LOCAL` specifically so a node that starts up after the map was published still gets it.

Other policies exist — `History` (keep last N vs. keep all), `Deadline`, `Lifespan`, `Liveliness` — but reliability and durability are what you'll hit first and most often.

## Setting QoS explicitly

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy, HistoryPolicy

sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=5,
)
self.create_subscription(LaserScan, 'scan', self.scan_cb, sensor_qos)

map_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    depth=1,
)
self.create_publisher(OccupancyGrid, 'map', map_qos)
```

`rclpy` also ships convenience presets — `qos_profile_sensor_data` and `qos_profile_system_default` — that encode these common choices so you don't have to spell every field out by hand for the standard cases.

## Diagnosing QoS mismatches

A publisher and subscriber with **incompatible** QoS (e.g. a `RELIABLE` subscriber trying to connect to a `BEST_EFFORT` publisher) simply never connect — no error, no exception, just silence. This is the QoS failure mode you'll hit most: everything looks fine in `ros2 topic list`, but no messages ever arrive.

```bash
ros2 topic info /scan --verbose
ros2 topic echo /scan --qos-reliability best_effort
```

`topic info --verbose` shows the QoS profile each publisher and subscriber on a topic is actually using — when messages mysteriously aren't flowing, this is the first command to run, before suspecting your callback logic at all.

## Choosing QoS for your own topics

A rough rule of thumb: high-rate sensor data defaults to `BEST_EFFORT`/`VOLATILE` (favor freshness over completeness); commands, configuration, and anything safety-relevant default to `RELIABLE`; anything a late-joining node needs a snapshot of (maps, static transforms, robot description) uses `TRANSIENT_LOCAL`. When in doubt, match whatever QoS the message type's standard producers in your ecosystem already use — inventing a new profile for a well-established topic name is a common source of the silent-mismatch problem above.

## Try it yourself

Create a publisher with `RELIABLE` QoS and a subscriber with `BEST_EFFORT` QoS on the same topic, and confirm messages never arrive despite both nodes showing up in `ros2 topic list` and no errors appearing anywhere. Then run `ros2 topic info <topic> --verbose` to see the mismatch reported directly, and fix it by aligning both sides.
