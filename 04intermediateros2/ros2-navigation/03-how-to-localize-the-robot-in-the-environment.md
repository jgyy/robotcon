# ROS2 Navigation — Unit 3: How to Localize the Robot in the Environment

A saved map is only useful once the robot can figure out where it sits inside it. This unit covers AMCL, the probabilistic localizer Nav2 uses by default, how to launch and tune it, and the three ways to tell it where the robot starts.

## AMCL: adaptive Monte Carlo localization

AMCL is a **particle filter** localizer. It represents "where the robot might be" as a cloud of thousands of weighted pose hypotheses (particles), each a guess at `(x, y, θ)`. On every odometry update, every particle is moved by the same estimated motion (plus injected noise, since odometry drifts). On every laser scan, each particle's hypothesis is scored by how well the scan would match the map *if the robot were really there* — particles that predict the scan well get higher weight. Particles are then resampled proportional to weight, so the cloud converges around the poses that best explain both the motion history and the sensor data. "Adaptive" refers to AMCL dynamically shrinking or growing the number of particles based on how confident (converged) the estimate currently is, trading accuracy for compute.

The output is `amcl_pose` (a pose with covariance) and, critically, the `map → odom` TF transform — the correction that reconciles the drifting `odom` frame with the ground-truth `map` frame.

## Launching and configuring AMCL

AMCL is started like any other Nav2 lifecycle node, normally via `nav2_bringup`'s localization launch file, pointed at your saved map:

```bash
ros2 launch nav2_bringup localization_launch.py map:=/path/to/my_map.yaml
```

Key parameters (set in your Nav2 params YAML under the `amcl` node) worth knowing by name:
- `min_particles` / `max_particles` — bounds on the adaptive particle count.
- `alpha1`–`alpha4` — odometry noise model coefficients (how much you trust wheel odometry rotation vs. translation).
- `laser_max_range`, `laser_model_type` — how the laser scan is scored against the map.
- `update_min_d`, `update_min_a` — minimum distance/angle the robot must move before AMCL bothers re-localizing (saves CPU when stationary).

## Setting the robot's initial pose

AMCL needs a rough starting guess — without one, its particle cloud starts uniformly spread across the entire map and takes a long time (and a lot of driving) to converge. There are three ways to seed it:

**From a config file**, by setting the `initial_pose` parameters in your params YAML so AMCL seeds itself automatically on startup:

```yaml
amcl:
  ros__parameters:
    initial_pose:
      x: 0.0
      y: 0.0
      z: 0.0
      yaw: 0.0
```

**From the command line**, by publishing directly to `/initialpose` (also exactly what RViz's "2D Pose Estimate" tool does under the hood):

```bash
ros2 topic pub -1 /initialpose geometry_msgs/msg/PoseWithCovarianceStamped \
  "{header: {frame_id: 'map'}, pose: {pose: {position: {x: 0.0, y: 0.0, z: 0.0}, orientation: {w: 1.0}}}}"
```

**Programmatically**, from a ROS 2 node, by creating a publisher on `/initialpose` with the same message type and QoS as above and publishing once you know the robot's actual starting pose (useful when a robot always docks at a known charging station, for instance).

## Global localization

Sometimes you genuinely don't know where the robot started — no config default applies and no operator is present to click a 2D Pose Estimate. **Global localization** handles this by spreading particles uniformly across every free cell in the map and letting the robot's early motion and scans disambiguate the true pose through the normal filtering process; multiple pose hypotheses can survive simultaneously until enough evidence rules the wrong ones out. This is triggered via AMCL's `global_localization` service:

```bash
ros2 service call /reinitialize_global_localization std_srvs/srv/Empty
```

It's slower to converge than a seeded pose and can fail in highly symmetric environments (a long, feature-less corridor gives the filter nothing to disambiguate on), so use it as a fallback, not a default.

## Try it yourself

Launch AMCL against a map you built in Unit 2, deliberately give it a *wrong* initial pose (off by a couple of meters), and drive the robot manually for a short distance while watching the particle cloud in RViz (`Add → PoseArray`, topic `/particlecloud`). Note how many meters of driving it takes for the cloud to collapse onto the correct pose. Then repeat starting from the correct pose and compare convergence time — this is the clearest way to feel why a good initial pose estimate matters.
