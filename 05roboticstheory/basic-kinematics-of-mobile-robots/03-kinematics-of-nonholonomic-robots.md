# Basic Kinematics of Mobile Robots — Unit 3: Kinematics of Nonholonomic Robots

Most wheeled robots you'll actually work with — differential-drive bases, cars, tricycles — can't slide sideways. This unit derives the kinematic models that capture that constraint and connects them to the ROS messages and tools you'll use to drive and monitor a real robot.

## What is kinematics?
Kinematics describes motion purely in terms of position, velocity, and acceleration, with no reference to the forces or torques producing it. For a mobile robot, the central kinematic question is: given the actuator velocities (wheel spin rates, steering angle), what is the resulting body-frame velocity `(v, ω)`, and how does the pose `(x, y, θ)` evolve over time? This is exactly the "forward kinematics" problem; the inverse (given a desired `(v, ω)`, what wheel commands produce it) is what your control code sends to hardware.

## What is a model?
A model is a deliberately simplified mathematical stand-in for a real system — accurate enough to be useful, wrong in ways you've chosen to ignore. A kinematic model of a robot ignores wheel slip, motor dynamics, and terrain compliance; it assumes wheels roll without slipping. That assumption is false at high speed or on loose surfaces, but true enough at typical indoor speeds that the model's predictions match reality closely.

## What is a kinematic model?
A kinematic model maps actuator-level velocities to the robot's body velocity `(v, ω)` (and from there, via integration, to pose). It encodes the robot's **constraints** — a car can't move sideways; an omnidirectional robot can. Constraints that restrict *velocity* but not the set of *reachable positions* are called **nonholonomic** — this unit is about robots with exactly that kind of constraint.

## The unicycle robot
The simplest nonholonomic model: a single wheel that can spin forward/backward and pivot in place, characterized entirely by linear speed `v` and angular speed `ω`:

```
ẋ = v cos θ
ẏ = v sin θ
θ̇ = ω
```

This is an abstraction — no real robot is literally a unicycle — but nearly every wheeled platform's kinematics *reduce to* this model at the body-frame level, which is why it's the reference model the rest of the unit builds on.

## The differential-drive robot
Two independently-driven wheels on a common axle (the most common mobile-robot base). With wheel radius `r`, axle length `L`, and wheel angular velocities `ω_l`, `ω_r`:

```
v = r (ω_r + ω_l) / 2
ω = r (ω_r − ω_l) / L
```

which then plugs directly into the unicycle equations above. This is the forward kinematics. The inverse — given a desired `(v, ω)`, what should each wheel do — is just solving those two equations for `ω_l, ω_r`:

```python
def diff_drive_inverse(v, omega, r, L):
    w_r = (2 * v + omega * L) / (2 * r)
    w_l = (2 * v - omega * L) / (2 * r)
    return w_l, w_r
```

## The ROS Twist message
`geometry_msgs/Twist` is the standard ROS message for commanding body-frame velocity: `linear.x` (forward speed) and `angular.z` (yaw rate) for a planar robot, with the remaining four fields typically zero. It's exactly the `(v, ω)` pair from the unicycle model:

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.2}, angular: {z: 0.1}}" --once
```

Most differential-drive robot drivers subscribe to `/cmd_vel` and internally run the inverse kinematics above to produce per-wheel commands.

## Let's practice!
Given `r = 0.05` m, `L = 0.3` m, and a desired `v = 0.15` m/s, `ω = 0.5` rad/s, compute `ω_l` and `ω_r` by hand and then check with `diff_drive_inverse`. Notice `ω_r > ω_l` — the right wheel spins faster, which is what makes the robot curve left.

## The car-like robot
A car (Ackermann steering) has a fixed rear axle and a steerable front axle; it cannot pivot in place. With wheelbase `L`, speed `v`, and steering angle `φ`:

```
ẋ = v cos θ
ẏ = v sin θ
θ̇ = (v / L) tan φ
```

The `tan φ` term is the key difference from differential drive: turning rate depends on speed and steering angle jointly, and `φ` is itself bounded, which is why car-like robots need different path-planning approaches (e.g. Dubins or Reeds-Shepp paths) than differential-drive robots do.

## Canonical simplified model
Notice that the unicycle, differential-drive, and (at low speed, with `φ` as an independent control rather than a rate-limited one) car-like models all reduce to the same two equations once you have `(v, ω)`:

```
ẋ = v cos θ,  ẏ = v sin θ,  θ̇ = ω
```

This is the **canonical simplified model** for planar nonholonomic robots. Practically: write your path-following and control code once against `(v, ω)`, and keep the robot-specific forward/inverse kinematics (wheel speeds ↔ `(v, ω)`) as a thin, swappable layer underneath. This is exactly how ROS 2's `ros2_control` diff-drive and Ackermann-steering controllers are structured.

## Computing differential drive odometry using wheel encoder ticks
Real robots don't report `(v, ω)` directly — they report accumulated encoder ticks per wheel. Convert ticks to distance, then to `(v, ω)`, then integrate:

```python
def ticks_to_odometry(dticks_l, dticks_r, ticks_per_rev, wheel_radius, L, dt):
    dist_per_tick = (2 * math.pi * wheel_radius) / ticks_per_rev
    d_l = dticks_l * dist_per_tick
    d_r = dticks_r * dist_per_tick
    d_center = (d_l + d_r) / 2
    d_theta = (d_r - d_l) / L
    v = d_center / dt
    omega = d_theta / dt
    return v, omega
```

This is the measurement-side counterpart to the inverse kinematics from earlier — instead of commanding wheel speeds, you're *estimating* them from what the wheels actually did.

## The ROS odometry message
`nav_msgs/Odometry` bundles pose (`position` + `orientation` as a quaternion, per Unit 2) and body-frame velocity (a `Twist`) together with a covariance estimate, published on `/odom`:

```bash
ros2 topic echo /odom --once
```

It's the standard hand-off point between low-level wheel odometry and higher-level localization/navigation nodes.

## Visualization of odometry messages in Rviz
Rviz can render the `/odom` topic as a moving axes marker (add an "Odometry" or "TF" display) so you can watch the integrated trajectory drift over time — invaluable for sanity-checking a new odometry implementation before trusting it in a control loop. Watch specifically for two failure signatures: a straight-line drive that curves (wheel radius/axle-length calibration error) and a pure rotation that also translates (encoder tick-to-distance scale error).

## Let's practice!
Simulate 100 control ticks (`dt = 0.1` s) of constant `dticks_l = 40`, `dticks_r = 60` per tick with `ticks_per_rev = 360`, `wheel_radius = 0.033` m, `L = 0.16` m. Run each tick through `ticks_to_odometry` then `integrate_odometry` (from Unit 1) to get a final pose. You should get a large, consistent arc — check that reversing which wheel is faster reverses the turn direction.

## Conclusions
You can now derive forward and inverse kinematics for the three dominant nonholonomic wheeled platforms, convert raw encoder data into a velocity and pose estimate, and read/publish the two ROS messages (`Twist`, `Odometry`) that carry this information through a real robot's software stack. Unit 4 contrasts this with holonomic robots, which drop the nonholonomic constraint entirely.

## Try it yourself
Extend `diff_drive_inverse` with wheel-speed saturation (a max `ω_max`), and write a check that, when saturation clips one wheel, scales *both* wheels' commands down proportionally rather than just clamping the fast one — clamping only one wheel silently changes the commanded turn radius, which is a real bug you'll otherwise hit on physical hardware.
