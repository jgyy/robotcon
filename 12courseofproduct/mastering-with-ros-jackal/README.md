# Mastering with ROS: Jackal

This course builds real-world autonomy on Clearpath Robotics' Jackal UGV: understanding the platform and its sensors, navigating indoors with a self-built map, navigating outdoors with GPS, detecting and localizing people with both the laser and the stereo camera, and finally combining all of it into a reactive patrol robot. Work through the units in order — each one leans on interfaces and code introduced in the units before it.

1. [Unit 0: Introducing ClearPath Jackal Robot](01-unit-0-introducing-clearpath-jackal-robot.md) — Jackal's hardware, sensors, ROS topics/TFs, and safe simulation-first operating basics.
2. [Unit 1: Navigation Indoor](02-unit-1-navigation-indoor.md) — Build a map with SLAM, configure costmaps, localize with AMCL, and send navigation goals.
3. [Unit 2: Set Outdoors Navigation](03-unit-2-set-outdoors-navigation.md) — Fuse GPS, IMU, and odometry to navigate outdoors from raw GPS waypoints.
4. [Unit 3: Detect and localise a person](04-unit-3-detect-and-localise-a-person.md) — Detect people with the laser and the stereo camera, build point clouds, and localize detections in the world.
5. [Patrol with Jackal Micro Project](05-patrol-with-jackal-micro-project.md) — Combine waypoint patrol and person detection into one reactive state machine.
6. [I have finished, now what?](06-i-have-finished-now-what.md) — Bridge the sim-to-real gap and plan next steps beyond this course.
