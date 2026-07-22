# Basics of Robotics with LIMO — Unit 5: Odometry

Odometry answers the question every autonomous robot needs answered continuously: "where am I, relative to where I started?" This closing unit ties together sensors (Unit 2), frames (Unit 3), and kinematics (Unit 4) into the estimate that makes navigation possible, and is also the subject of this course's final project.

## What odometry is and why it drifts

Odometry is the estimated pose (position + orientation) of the robot over time, computed by integrating motion measurements rather than by any absolute external reference. Because it's an integral, small measurement errors accumulate — a slightly worn wheel, a moment of slip on a smooth floor, sensor noise — and the estimate's error grows without bound the further and longer the robot travels. This is the single most important fact about odometry: it is *locally* accurate (good over the next second) and *globally* unreliable (bad over the next ten minutes), which is precisely why localization systems later in a robotics curriculum fuse it with absolute references like a lidar-matched map or GPS.

## Computing odometry from wheel encoders

For a differential-drive robot, the classic approach integrates the two wheel velocities into a pose update at each timestep. Given left/right wheel velocities `v_l`, `v_r`, wheel separation `L`, and timestep `dt`:

```python
def integrate_odometry(x, y, theta, v_l, v_r, L, dt):
    v = (v_l + v_r) / 2.0
    omega = (v_r - v_l) / L

    x += v * math.cos(theta) * dt
    y += v * math.sin(theta) * dt
    theta += omega * dt

    return x, y, theta
```

This is Euler integration of the unicycle model from Unit 4 — simple, cheap, and the standard starting point. Over short intervals it's accurate enough for most control loops; the drift problem above is about accumulation over many such steps, not about this formula being wrong.

## Publishing odometry the ROS way

Rather than keeping `x, y, theta` as bare variables, odometry is published as a `nav_msgs/msg/Odometry` message, which bundles pose, velocity, and (importantly) covariance — an estimate of how uncertain the pose is, which downstream consumers like sensor-fusion or navigation nodes use to weigh this source against others:

```python
from nav_msgs.msg import Odometry
from tf_transformations import quaternion_from_euler

odom = Odometry()
odom.header.frame_id = 'odom'
odom.child_frame_id = 'base_link'
odom.pose.pose.position.x = x
odom.pose.pose.position.y = y
q = quaternion_from_euler(0, 0, theta)
odom.pose.pose.orientation.x, odom.pose.pose.orientation.y, \
    odom.pose.pose.orientation.z, odom.pose.pose.orientation.w = q
odom_pub.publish(odom)
```

Note the frame naming from Unit 3: this message *is* the definition of the `odom -> base_link` transform, and the same node publishing it typically also broadcasts that transform via `tf2` so the rest of the tree stays consistent with what odometry believes.

## Beyond wheels: visual and IMU-aided odometry

Wheel odometry fails outright when wheels slip (loose ground, obstruction) or don't exist (legged/aerial robots). Two common alternatives you'll encounter later: **visual odometry**, which estimates motion by tracking features between consecutive camera frames, and **IMU-aided odometry**, which integrates accelerometer/gyroscope readings to fill in between wheel updates and correct for slip. In practice, production systems rarely trust one source alone — they fuse wheel, IMU, and sometimes visual odometry in a filter (commonly an Extended Kalman Filter, e.g. via the `robot_localization` package) to get a smoother, more robust estimate than any single source provides.

## Try it yourself — final project

Drive LIMO (real or simulated) in a small loop using teleop, logging `/odom` and raw `/scan` data as you go. Afterward, write a Python script that replays the logged data offline and: (1) re-derives the trajectory by integrating wheel velocities yourself using the formula above, (2) plots it against the `/odom` topic's own reported trajectory, and (3) plots the lidar points from the final scan transformed into the `odom` frame using the final pose. Compare your manually integrated path to the robot's own odometry — do they diverge, and does the amount of divergence match what you'd expect from the drift discussion above?
