# Intermediate ROS2 (C++) — Unit 2: Advanced Launch Files

A single `ros2 launch` file for a whole robot quickly turns into an unreadable wall of nodes, remappings, and hardcoded values. This unit covers the two techniques that keep launch files manageable as a system grows: composing them out of smaller reusable pieces, and driving their behavior with arguments instead of literals.

## Why launch files get complex

A real robot brings up perception nodes, drivers, controllers, and a navigation stack, often with slightly different configuration per robot variant or per environment (simulation vs. real hardware). If you write that all as one flat `LaunchDescription`, every variant means duplicating and hand-editing the whole file. The fix mirrors how you already avoid duplication in code: extract shared pieces into their own files and parameterize the differences.

## Nested and modular launch files

`IncludeLaunchDescription` lets one launch file pull in another, the same way a top-level CMake project includes subdirectories. This turns a monolithic launch file into a tree: a top-level file per robot or per deployment, including shared per-subsystem files.

```python
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    driver_launch = os.path.join(
        get_package_share_directory('my_robot_bringup'), 'launch', 'driver.launch.py')

    return LaunchDescription([
        IncludeLaunchDescription(
            PythonLaunchDescriptionSource(driver_launch)
        ),
    ])
```

Each included file stays independently testable — you can `ros2 launch my_robot_bringup driver.launch.py` on its own while developing the driver, then include it unchanged from the full system launch file. Group related nodes (e.g. everything for one sensor) into one file, and keep the top-level file as a short table of contents.

## Passing parameters and arguments into included launch files

Nesting is only useful if the included file can be configured from outside. `DeclareLaunchArgument` defines a launch-time input; `LaunchConfiguration` reads it back, including from the parent file via `launch_arguments`:

```python
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration

def generate_launch_description():
    use_sim_time_arg = DeclareLaunchArgument(
        'use_sim_time', default_value='false',
        description='Use simulation clock if true')

    driver_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(driver_launch_path),
        launch_arguments={'use_sim_time': LaunchConfiguration('use_sim_time')}.items()
    )

    return LaunchDescription([use_sim_time_arg, driver_launch])
```

From the command line, that argument becomes a plain `key:=value` pair:

```bash
ros2 launch my_robot_bringup bringup.launch.py use_sim_time:=true
```

The same `LaunchConfiguration` can also feed directly into a `Node` action's `parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}]`, so one command-line flag can flow all the way down to a parameter on a node three files deep.

## Try it yourself

Split an existing single-file launch setup (or a small two-node system you write for this exercise) into a `sensor.launch.py` and a `bringup.launch.py` that includes it. Add a `DeclareLaunchArgument` for a topic name or rate in `sensor.launch.py`, pass it through from `bringup.launch.py` using `launch_arguments`, and confirm with `ros2 param get` or `ros2 topic echo` that the value you passed on the command line actually reached the node.
