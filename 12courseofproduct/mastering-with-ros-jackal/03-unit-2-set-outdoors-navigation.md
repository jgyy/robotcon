# Mastering with ROS: Jackal — Unit 3: Unit 2: Set Outdoors Navigation

Indoor navigation relies on walls to build a map against; outdoors there often aren't any. This unit switches Jackal's navigation source from laser-built maps to GPS, and shows how to fuse that global signal with the odometry and IMU you already have.

## Why Outdoor Navigation Is a Different Problem

Outdoors, laser SLAM loses most of its value — open fields and roads give the scanner little structure to match against, and a small map-frame drift that's invisible in a 4x4 metre room becomes meters of error across a 100 metre field. What you have instead is a global reference: GPS. The trade-off flips: GPS gives you drift-free *global* position but is noisy and updates slowly (often 1-10 Hz with meter-level accuracy), while odometry and the IMU give you smooth, high-rate *local* motion that drifts unbounded over time. Good outdoor navigation blends both rather than picking one.

## Fusing GPS, IMU, and Odometry

The `robot_localization` package's `navsat_transform_node` and an EKF (`ekf_localization_node` / `ekf_node`) do this fusion for you. `navsat_transform` converts raw GPS fixes into the robot's local Cartesian frame, and the EKF blends that with wheel odometry and IMU data into a single continuous, drift-corrected estimate:

```yaml
navsat_transform:
  ros__parameters:
    frequency: 30.0
    delay: 3.0
    magnetic_declination_radians: 0.0
    yaw_offset: 1.5707963
    zero_altitude: true
    broadcast_utm_transform: true
    publish_filtered_gps: true
```

```bash
ros2 launch robot_localization navsat_transform_launch.py
ros2 topic echo /gps/filtered --once
ros2 topic echo /odometry/gps --once
```

`magnetic_declination_radians` and `yaw_offset` matter more than they look — get them wrong and Jackal's fused heading will be rotated relative to true north, which shows up as the robot confidently driving in the wrong direction while insisting its GPS position is fine.

## From Latitude/Longitude to a Local Cartesian Frame

`navsat_transform_node` internally projects GPS fixes into UTM (Universal Transverse Mercator) coordinates and publishes the result as regular odometry in metres, which is what lets you feed it into the same navigation stack you used indoors. You can do the same projection yourself for waypoint files or offline planning:

```python
import utm

lat, lon = 42.36000, -71.09000
easting, northing, zone_num, zone_letter = utm.from_latlon(lat, lon)
```

The key constraint: every waypoint you convert must use the *same* UTM zone and the *same* local origin as the running `navsat_transform_node`, or your converted goals won't line up with the robot's fused odometry frame.

## Writing a GPS Waypoint Follower

Once GPS-fused odometry is flowing, sending Jackal to a GPS coordinate is just "convert to local frame, send a normal navigation goal" — the same `BasicNavigator.goToPose` pattern from the indoor unit:

```python
waypoints_gps = [(42.3601, -71.0900), (42.3603, -71.0895)]

for lat, lon in waypoints_gps:
    x, y = latlon_to_local(lat, lon, origin_easting, origin_northing)
    goal = make_pose_goal(x, y, frame_id='odom')
    nav.goToPose(goal)
    while not nav.isTaskComplete():
        pass
```

Note the goal frame is typically `odom` (or `map` if you're also running a global outdoor map/EKF), not the raw `utm` frame — the navigation stack still plans in the robot's local Cartesian frame, GPS just keeps that frame from drifting.

## Try it yourself

Record a GPS fix at your simulated or real robot's current position and a second fix a few metres away, convert both to UTM by hand, and write a short script that drives Jackal from the first point to the second using only those two raw GPS readings as input.
