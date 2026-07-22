# ROS2 Navigation — Unit 6: Multi-Robot Navigation

Everything so far assumed exactly one robot. This unit covers what changes — and what doesn't — when you have a fleet, closing out the course by extending the single-robot Nav2 stack you've built to run several instances side by side.

## Multi-robot setup: namespacing and TF

The core trick for running multiple independent Nav2 stacks on one ROS 2 system is **namespacing**. Every node, topic, and TF frame for a given robot gets prefixed with a unique robot name, so `robot1`'s `/scan` and `robot2`'s `/scan` become `/robot1/scan` and `/robot2/scan`, and their `base_link` frames become `robot1/base_link` and `robot2/base_link`. This is essential for TF in particular — TF frame IDs are global by default, so two robots both publishing an unprefixed `base_link` would collide and corrupt each other's transform tree. Nav2's launch files accept a `namespace` argument for exactly this purpose:

```bash
ros2 launch nav2_bringup bringup_launch.py namespace:=robot1 use_namespace:=true map:=shared_map.yaml
ros2 launch nav2_bringup bringup_launch.py namespace:=robot2 use_namespace:=true map:=shared_map.yaml
```

Each robot then gets its own full set of lifecycle-managed nodes, costmaps, and action servers (e.g. `/robot1/navigate_to_pose`, `/robot2/navigate_to_pose`), completely independent of the other's.

## Mapping with multiple robots

Mapping doesn't fundamentally change with multiple robots — SLAM (Unit 2) is still typically run by one robot at a time, or one designated robot, to build a single shared map that every robot in the fleet will localize against afterward. Multi-robot SLAM (where robots simultaneously explore and merge their observations into one map collaboratively) exists as a research and tooling area but is a meaningfully harder problem — for a first fleet, build one good map conventionally and share the resulting `.yaml`/`.pgm` files to every robot's `map_server`.

## Localization with multiple robots

Because each robot's Nav2 stack is fully namespaced, each one runs its own independent `amcl` instance against the shared map, maintaining its own particle cloud and its own `robotN/map → robotN/odom` correction. Each robot is localized entirely independently of the others — `robot1`'s AMCL has no idea `robot2` exists, and that's fine, because each robot only needs to know its own pose in the shared map frame to plan and drive. What differs from single-robot localization is only bookkeeping: giving each robot a distinct, correctly-namespaced initial pose (Unit 3), since they don't start from the same physical location.

## Path planning with multiple robots

Individual path planning per robot is unchanged from Unit 4 — each robot's `planner_server` and `controller_server` compute paths and control commands exactly as before, oblivious to any other robot's plan by default. The part that's new is **inter-robot collision avoidance**: robot1's costmap doesn't automatically know robot2 is a moving obstacle unless robot2 is visible to robot1's own sensors (e.g. as a blob in its laser scan, picked up by its obstacle layer) or is explicitly published into robot1's costmap as an obstacle source. Common approaches include letting each robot's local costmap detect the others via shared sensor visibility (works well when robots are usually in each other's sensor range) or introducing a higher-level fleet coordinator that reserves regions of the map for one robot at a time (needed when robots regularly can't see each other, e.g. around corners).

## Single launch file for the fleet

Just as Unit 5 combined one robot's servers into a single launch file, a fleet launch file combines *N* namespaced copies of that same bringup, usually via a loop over robot names/namespaces inside a Python launch file, each with its own `namespace` argument and (if robots start at different physical locations) its own initial pose parameters:

```python
for robot_name, (x, y, yaw) in robots.items():
    ld.add_action(
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(bringup_launch_path),
            launch_arguments={
                'namespace': robot_name,
                'use_namespace': 'true',
                'map': shared_map_yaml,
            }.items(),
        )
    )
```

Each robot gets its own lifecycle manager instance too, since lifecycle managers operate on a fixed, namespaced list of node names.

## Try it yourself

Bring up two instances of the same simulated robot in the same world with distinct namespaces and a shared map, give each a correctly namespaced initial pose, and send both a `navigate_to_pose` goal that would send them past each other in a corridor. Watch whether they avoid each other via their local costmaps (they should slow or reroute if each is visible in the other's laser scan) or whether they collide — and use that observation to decide, for your own fleet designs, whether sensor-based avoidance alone is enough or whether you'd need a coordinator layer.
