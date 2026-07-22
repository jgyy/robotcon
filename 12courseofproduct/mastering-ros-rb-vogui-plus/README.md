# Mastering ROS : RB-Vogui+

This course walks through Robotnik's RB-Vogui+ mobile platform end to end: getting to know its hardware and ROS interface, navigating it both indoors (map-and-lidar based) and outdoors (GPS-fused, waypoint-based), and using perception together with MoveIt to grasp an object from its payload deck. It closes with a small integration project that chains navigation and manipulation into a single fetch-style mission, which is where the platform's defining indoor/outdoor, navigate-and-manipulate design actually gets exercised together.

1. [Unit 0: Robotniks Vogui PLUS platform](01-unit-0-robotniks-vogui-plus-platfrom.md) — Intro and demo of the RB-Vogui+ hardware, its ROS topic/TF layout, and a first teleop checkpoint.
2. [Unit 1 Part 1: Indoor navigation](02-unit-1-part1-indoor-navigation.md) — Learn how to navigate both indoor and outdoors, starting with SLAM/AMCL localization, costmaps, and sending Nav2 goals indoors.
3. [Unit 1 Part 2: Outdoor navigation and waypoints](03-unit-1-part2-outdoor-navigation-and-waypoints.md) — Outdoor navigation with GPS and waypoints use, fusing GPS/IMU/odometry and following GPS waypoint sequences.
4. [Unit 2: Grasping and perception](04-unit2-grasping-and-perception.md) — Learn how to use perception and MoveIt to grasp an object, from point cloud to a planned and executed grasp.
5. [Unit Project](05-unit-project.md) — Tiny project to practice all you learned, chaining indoor navigation, outdoor navigation, and grasping into one mission.
