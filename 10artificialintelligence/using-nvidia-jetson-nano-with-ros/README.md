# Using NVIDIA Jetson Nano with ROS

This course is about putting deep learning directly onto a mobile robot instead of treating perception as something that happens off-board. Using the NVIDIA Jetson Nano and a JetBot-style two-wheeled robot ("Ignisbot") as the running example, you'll go from flashing the board and confirming CUDA/ROS both work, through driving the robot over ROS topics, training and deploying a collision-avoidance classifier, rosifying a person detector into a follower behavior, and finally integrating all of it into one robot that can search for a person, follow them, and avoid obstacles along the way — in simulation first, then on physical hardware.

1. [Introduction Demo to NVIDIA Jetson Nano DeepLearning](01-introduction-demo-to-nvidia-jetson-nano-deeplearning.md) — Flash and verify the Jetson Nano, confirm CUDA/TensorRT are working, and connect it into a ROS network.
2. [Basics - Move Ignisbot](02-basics-move-ignisbot.md) — Use the JetBot API to move a two-wheeled robot, wrapped as a ROS driver node that works in both simulation and on hardware.
3. [Basics - Collision Avoidance with DeepLearning](03-basics-collision-avoidance-with-deeplearning.md) — Train Ignisbot to navigate a known environment while avoiding obstacles, using a transfer-learned classifier optimized with TensorRT.
4. [Create the People Follower ROS Script](04-create-the-people-follower-ros-script.md) — Rosify a person detector so any ROS node can consume its detections, and build a follower behavior on top of that data.
5. [Ignisbot Mini Project](05-ignisbot-mini-project.md) — Combine movement, collision avoidance, and person-following into one robot that searches for, follows, and safely navigates around people.
