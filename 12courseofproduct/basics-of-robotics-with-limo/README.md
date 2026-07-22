# Basics of Robotics with LIMO

This course is the on-ramp to robotics programming for someone who already codes: it takes the LIMO wheeled robot apart conceptually and puts it back together piece by piece, from the physical components and sensors that feed data into the system, through the coordinate-frame math needed to make sense of that data, into the kinematics that govern how the robot can actually move, and finally into odometry — the fused estimate of where the robot is that everything else in robotics builds on. By the end you can read a robot's sensor and command topics fluently and compute its position from raw wheel and lidar data yourself.

1. [Anatomy of a Robot](01-anatomy-of-a-robot.md) — The sense-think-act loop and the hardware/software components that make up LIMO.
2. [Sensors](02-sensors.md) — The most common robot sensors — lidar, encoders, cameras, IMUs — and the ROS messages that carry their data.
3. [Robot frames](03-robot-frames.md) — What coordinate frames are, how `tf2` tracks them, and how to use them in code.
4. [Introduction to robot kinematics](04-introduction-to-robot-kinematics.md) — How a `Twist` command becomes motion under differential, Ackermann, omnidirectional, and track drive.
5. [Odometry](05-odometry.md) — What odometry is, why it drifts, how to compute it, and the course's final project.
