# Debug Cases — Unit 1: Case 1 Part 1. ROS Topics and Messages

This unit is the first of a two-part case study built around the most common ROS debugging scenario you will face: a topic that is publishing "something," but you don't yet know what, whether it's correct, or why a downstream node isn't reacting to it. You'll build the habit of interrogating topics and messages directly from the command line before ever touching source code.

## Reading topic data without touching code

Before opening an editor, always ask the running system what it's actually doing. The `ros2 topic` (or `rostopic` on ROS 1) family of commands is your first diagnostic layer:

```bash
ros2 topic list                     # what's actually being published right now
ros2 topic info /scan                # message type, publisher/subscriber counts
ros2 topic hz /scan                  # is it publishing at the rate you expect?
ros2 topic echo /scan --once         # one message, full contents
```

A surprisingly large fraction of "my node isn't working" bugs are actually "the topic name has a typo" or "nothing is publishing at all" bugs, caught entirely by `ros2 topic list` and `ros2 topic info`. Check publisher/subscriber counts first — zero publishers means you're debugging the wrong node.

## Inspecting message definitions

You cannot debug data you don't understand the shape of. `ros2 interface show` (or `rosmsg show`) prints the field layout of any message type without needing to find the source file:

```bash
ros2 interface show sensor_msgs/msg/LaserScan
```

Cross-reference this against `ros2 topic echo`: field names in the echoed YAML output map 1:1 to the fields in the interface definition. When a field looks empty or zero when it shouldn't be, that's your first lead — check the publishing node's code for that specific field assignment rather than re-reading the whole file.

## The LaserScan message in detail

`sensor_msgs/msg/LaserScan` is a recurring subject in this course because it has several fields whose meaning is easy to get wrong:

- `angle_min` / `angle_max` — the sweep range in radians, not degrees.
- `angle_increment` — the angular step between consecutive readings; `(angle_max - angle_min) / angle_increment` should roughly equal `len(ranges) - 1`.
- `range_min` / `range_max` — values outside this range in the `ranges` array typically mean "no return" (often reported as `inf` or `NaN`), not "distance zero."
- `ranges[i]` corresponds to angle `angle_min + i * angle_increment`.

A common bug: code that assumes `ranges[0]` is directly in front of the robot, when for many LiDAR drivers `angle_min` starts at the side or rear. Always verify orientation against `angle_min`/`angle_max` rather than assuming index 0 is "forward."

## Minimal echo-and-inspect workflow

Combine the tools above into a repeatable sequence when handed an unfamiliar topic:

```bash
ros2 topic list | grep scan
ros2 topic info /scan
ros2 interface show sensor_msgs/msg/LaserScan
ros2 topic echo /scan --once
ros2 topic hz /scan
```

If echo hangs with no output, the publisher isn't running or the topic name/namespace doesn't match — check `ros2 node info <node>` to see what that node is actually publishing under.

## Try it yourself

Launch (or connect to) any simulation that publishes a `LaserScan` topic. Without reading any of the driver's source code, use only `ros2 topic info`, `ros2 interface show`, and `ros2 topic echo --once` to answer: what is the topic's exact name and frame_id, how many range readings does one message contain, and what does `ranges[0]` correspond to physically (front, side, or rear of the robot)?
