# ROS Autonomous Vehicles 101

An introduction to programming autonomous cars in ROS at SAE Level 3 (conditional automation): the vehicle drives itself under known conditions but must be able to hand control back to a human when it can't. This course walks through the sensor suite an autonomous car needs and how to read it in ROS, using GPS for navigation, detecting and avoiding obstacles, and finally interfacing ROS with a real vehicle's electronics over CAN-Bus and a Drive-By-Wire (DBW) interface — closing with a small mission that ties all four pieces together.

1. [Unit 0: Introduction](01-unit-0-introduction.md) — What Level 3 autonomy commits you to, a tour of the car's ROS stack, and driving it manually before anything autonomous.
2. [Unit 1: Sensors](02-unit-1-sensors.md) — The camera/LiDAR/GPS/IMU/odometry sensor suite, their ROS message types, and visualizing them in RViz.
3. [Unit 2: GPS Navigation](03-unit-2-gps-navigation.md) — Reading NavSatFix, converting GPS to local coordinates, fusing it with odometry, and following a waypoint.
4. [Unit 3: Obstacles and Security](04-unit-3-obstacles-and-security.md) — Detecting obstacles from laser scans, a reactive avoider, and the emergency-stop/watchdog systems a Level 3 car needs.
5. [Unit 4: CAN-Bus](05-unit-4-can-bus.md) — What CAN-Bus and Drive-By-Wire are, and bridging ROS commands (and GPS data) onto a real vehicle's CAN network.
6. [Unit 5: Microproject](06-unit-5-microproject.md) — Combining sensing, GPS navigation, obstacle avoidance, and CAN actuation into one mission: drive to the gas station.
7. [Final Recommendations](07-final-recommendations.md) — Where to go next: Nav2, richer perception, full AV stacks, real-world safety considerations, and turning the microproject into a portfolio piece.
