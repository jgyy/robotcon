# Mastering ROS: RB-Car — Unit 5: Autonomous Outdoor Navigation, Part 2 (GPS & Sensor Fusion)

Unit 3 built and used a map with LIDAR-only localization. That works well in bounded, feature-rich areas, but RB-CAR is meant to operate in open outdoor terrain where LIDAR-based localization can drift or fail. This unit fixes that by fusing GPS, IMU, and wheel odometry into a single, much more robust odometry estimate.

## The odometry drift problem outdoors

Wheel odometry alone accumulates error from wheel slip, uneven terrain, and integration drift — the longer RB-CAR drives, the further its believed position wanders from its true position, with no way to self-correct. Indoors, AMCL corrects this drift by matching LIDAR scans against a map. Outdoors, especially in open or repetitive terrain, scan matching can be ambiguous or simply unavailable. GPS gives you the opposite trade-off: it's globally accurate (no long-term drift) but noisy and low-rate compared to wheel/IMU data, and it can degrade or drop out entirely near buildings, trees, or bridges. The fix used throughout the ROS ecosystem is to fuse all three sources — wheel odometry, IMU, and GPS — so each compensates for the others' weaknesses.

## Fusing GPS, IMU, and wheel odometry with an EKF

The standard tool for this is the `robot_localization` package, which runs an Extended (or Unscented) Kalman Filter over an arbitrary number of odometry, IMU, and pose sources. A typical RB-CAR setup runs two EKF instances: one fusing only wheel odometry + IMU into a continuous, drift-prone-but-smooth `odom` frame, and a second fusing that result with GPS into a globally-accurate `map` frame.

```yaml
# ekf_odom.yaml — wheel odometry + IMU, publishes odom -> base_link
ekf_filter_node_odom:
  ros__parameters:
    frequency: 30.0
    odom0: /rbcar/odom
    odom0_config: [true,  true,  false,
                   false, false, true,
                   true,  true,  false,
                   false, false, true,
                   false, false, false]
    imu0: /rbcar/imu/data
    imu0_config: [false, false, false,
                  true,  true,  true,
                  false, false, false,
                  true,  true,  true,
                  true,  true,  false]
    world_frame: odom
```

Each `*_config` array selects which of the 15 state variables (x, y, z, roll, pitch, yaw, and their derivatives) that sensor is allowed to contribute — a wheel encoder shouldn't be trusted for roll/pitch on rough terrain, for instance, so those stay `false`.

## Converting GPS fixes into the map frame

GPS reports latitude/longitude, not the Cartesian `map`-frame coordinates the navigation stack expects. The `navsat_transform_node` (also part of `robot_localization`) handles this conversion, projecting GPS fixes into a local UTM-based Cartesian frame anchored at the robot's starting position:

```bash
ros2 run robot_localization navsat_transform_node --ros-args \
  -r /gps/fix:=/rbcar/gps/fix \
  -r /imu/data:=/rbcar/imu/data \
  -r /odometry/filtered:=/odometry/filtered_odom \
  -r /odometry/gps:=/odometry/gps
```

Feed `/odometry/gps` into the second, global EKF instance as an additional odometry source alongside the first EKF's output, and that EKF's output becomes your `map -> odom` correction — the same role AMCL played in Unit 3, but grounded in GPS instead of scan matching.

## Validating the fused odometry

Before trusting this for navigation, sanity-check it directly: drive RB-CAR in a large loop back to its starting point and compare the raw wheel odometry's reported drift against the fused estimate's.

```bash
ros2 topic echo /rbcar/odom              # raw — expect visible drift after a long loop
ros2 topic echo /odometry/filtered_map   # fused — should return close to the start pose
```

If the fused estimate is *worse* than raw odometry, the most common culprits are a misconfigured `*_config` matrix (two sources fighting over the same state variable with very different confidence) or a GPS covariance that isn't being reported/trusted correctly.

## Try it yourself

Configure the two-EKF setup above against your simulated or real RB-CAR, drive a large outdoor loop of at least 50-100 meters, and plot both the raw and fused odometry paths (e.g. with `rqt_plot` or by logging to a CSV and plotting offline). Quantify the closing error — the distance between the start pose and the end pose — for each, and confirm the fused result closes noticeably tighter than raw wheel odometry.
