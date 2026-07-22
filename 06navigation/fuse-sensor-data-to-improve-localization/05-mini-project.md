# Fuse Sensor Data to Improve Localization — Unit 5: Mini Project

This closing unit asks you to assemble everything from Units 2-4 into one working localization stack and to actually validate that it performs better than any single sensor alone — proving the fusion, not just wiring it up.

## Project brief and success criteria

Build a localization pipeline for a simulated (or real) robot with at minimum: wheel odometry, an IMU, and one global reference (AMCL, GPS, or both). Success means:
1. The `odom → base_link` transform is smooth and jump-free even while the global reference updates.
2. The `map → odom` transform absorbs global corrections without disturbing local control.
3. The fused pose visibly tracks better (less drift, faster recovery from disturbance) than wheel odometry alone over a multi-minute run.

## Architecture: assembling the pipeline

Bring together the pieces from the previous three units into one system:

```
sensors:  wheel encoders, IMU, (laser+map for AMCL) and/or (GPS receiver)

ekf_filter_node (local)   world_frame: odom   -> publishes odom -> base_link
  inputs: odom0 (wheel), imu0

ekf_filter_node_map (global)   world_frame: map   -> publishes map -> odom
  inputs: odom0 (wheel), imu0, pose0 (amcl_pose) and/or odom1 (odometry/gps)

navsat_transform_node   (only if using GPS)
  inputs: /fix, /odometry/filtered (local EKF output), /imu/data
  outputs: /odometry/gps  -> feeds ekf_filter_node_map as odom1
```

Two EKF instances means two separate YAML files (or one file with two clearly-named parameter namespaces) and two `ekf_node` executables launched with distinct node names and remapped topics — a common beginner mistake is launching both with default names and having them collide.

## Launch file organization

Keep the pipeline legible by giving each node its own launch file argument group: sensor drivers, the local EKF, the global EKF, AMCL/navsat_transform. A skeleton in a `ros2 launch` Python launch file:

```python
Node(
    package='robot_localization', executable='ekf_node', name='ekf_filter_node_local',
    output='screen', parameters=['config/ekf_local.yaml'],
    remappings=[('odometry/filtered', 'odometry/filtered/local')]
),
Node(
    package='robot_localization', executable='ekf_node', name='ekf_filter_node_map',
    output='screen', parameters=['config/ekf_global.yaml'],
    remappings=[('odometry/filtered', 'odometry/filtered/global')]
),
Node(
    package='robot_localization', executable='navsat_transform_node', name='navsat_transform',
    output='screen', parameters=['config/navsat.yaml']
),
```

Launching everything together lets you bring up the full stack with one command and iterate on individual YAML files without touching launch structure.

## Validating your fused estimate

Don't just eyeball it — measure it:
- Log `/odometry/filtered/local`, the raw wheel odometry, and (if available) a ground-truth pose (simulator ground truth topic, or a fixed known endpoint for a real-robot loop-closure test) with `ros2 bag record`.
- Plot both trajectories in `rqt_plot`/`PlotJuggler` or post-process the bag in Python/pandas and compute position error over time — the fused estimate's error growth rate should be visibly lower than raw odometry's.
- Deliberately inject a disturbance (nudge the robot, or briefly cover the GPS antenna / occlude the laser for AMCL) and confirm the filter recovers smoothly rather than diverging or jumping.
- Confirm with `ros2 run tf2_ros tf2_echo map base_link` that the full transform chain resolves with no TF errors for the whole duration of the run.

## Try it yourself

Run your assembled pipeline for at least two minutes with a fixed, repeatable path (a square loop is a good choice), then produce one plot overlaying raw wheel odometry against your fused `map`-frame estimate for that same run. Write two sentences: where do they diverge, and does that match what you'd predict from each sensor's known weaknesses?
