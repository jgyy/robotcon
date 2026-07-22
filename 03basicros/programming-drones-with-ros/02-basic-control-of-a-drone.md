# Programming Drones with ROS — Unit 2: Basic Control of a Drone

Before you can map an environment or plan a 3D path through it, you need reliable low-level control: getting the drone off the ground, holding it steady, moving it deliberately, and bringing it back down. This unit covers the command and telemetry interface every later unit builds on.

## Flight states and the takeoff/land/reset interface
A drone driver typically exposes three simple actions as topics or services:
- **Takeoff** — arms the motors and climbs to a default hover altitude.
- **Land** — descends and disarms.
- **Reset/emergency** — cuts motors immediately; used to clear an emergency-stop state.

These map onto internal flight states (landed → taking off → hovering/flying → landing) that the driver tracks for you. In ROS these are usually plain empty-message topics:

```bash
ros2 topic pub -1 /drone/takeoff std_msgs/msg/Empty {}
sleep 3
ros2 topic pub -1 /drone/land std_msgs/msg/Empty {}
```

Always check the drone's reported state before sending velocity commands — a command sent while the drone is still "landed" is usually just ignored, which is a common source of "my code doesn't work" confusion for beginners.

## Sending velocity commands
Once flying, you control the drone the same way you'd control any ROS-driven mobile base: by publishing `geometry_msgs/Twist` on a `cmd_vel`-style topic. For a quadrotor, the fields map to:
- `linear.x` / `linear.y` — forward/back and left/right speed (body frame)
- `linear.z` — climb/descend rate
- `angular.z` — yaw rotation rate
- `angular.x` / `angular.y` — usually ignored on a stabilized drone; the flight controller handles roll/pitch internally to achieve the requested linear velocity

```python
from geometry_msgs.msg import Twist

cmd = Twist()
cmd.linear.x = 0.3   # move forward at 0.3 m/s
cmd.linear.z = 0.0   # hold altitude
cmd.angular.z = 0.2  # yaw slowly to the left
cmd_vel_pub.publish(cmd)
```

A drone with no incoming velocity commands should be programmed (by the driver) to auto-hover, not drift — but don't rely on that as your only safety net. Always publish an explicit zero-`Twist` when you want the drone to stop, and consider a watchdog timer that zeroes the command if your control loop stalls.

## Reading telemetry
Three topics matter most for basic control:
- **Odometry** (`nav_msgs/Odometry`) — estimated pose and velocity, usually fused from IMU and downward-camera optical flow.
- **IMU** (`sensor_msgs/Imu`) — raw orientation, angular velocity, linear acceleration.
- **Battery/status** — driver-specific message reporting battery percentage and flight state.

```bash
ros2 topic echo /drone/odom
ros2 topic hz /drone/imu   # confirm the sensor is actually publishing, and at what rate
```

Reading these before acting is what turns "blind" open-loop commands into a real control loop — e.g., stop climbing once altitude in `odom.pose.pose.position.z` crosses a threshold, instead of climbing for a fixed, guessed duration.

## Try it yourself
Write a short node that: takes off, publishes a forward `Twist` until the drone's odometry reports it has traveled 1 meter in x, publishes a zero `Twist` to stop, then lands. Compare the distance you asked for against what the odometry actually reported at the end — the gap is your first hands-on look at drift.
