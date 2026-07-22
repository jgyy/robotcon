# ROS Basics in 5 Days (Python)

This course takes an experienced programmer with no robotics background from zero to writing real ROS 2 nodes in Python. It follows a "ROS Deconstruction" method: rather than covering ROS's sprawling ecosystem, it isolates the small set of ideas every ROS system is built from — nodes, packages, topics, services, and actions — and drills each one with working code against a simulated robot before moving to the next, finishing with the debugging tools (logging, `rqt`, `rosbag`, RViz) you'll need once things stop working as expected.

1. [Course Introduction](00-course-introduction.md) — Orientation to the course: why robotics programming matters, how this course teaches ROS, and a first hands-on taste of controlling a simulated robot.
2. [ROS Deconstruction](01-ros-deconstruction.md) — The roadmap of everything you need to learn (concepts, topics, services, actions, debugging) and the two-pronged theory-plus-practice teaching method used throughout.
3. [ROS Basic Concepts](02-ros-basic-concepts.md) — Nodes, packages, workspaces, launch files, building with colcon, the parameter server, and environment variables, through your first working ROS program.
4. [Understanding ROS Topics - Publishers](03-understanding-ros-topics-publishers.md) — What a topic and a publisher are, ROS message types, and writing your first publisher node.
5. [Understanding ROS Topics - Subscribers](04-understanding-ros-topics-subscribers.md) — Writing subscriber callbacks and defining your own custom topic message types.
6. [Understanding ROS Services - Clients](05-understanding-ros-services-clients.md) — Topics vs. services vs. actions, calling services from the CLI, and writing an asynchronous service client.
7. [Understanding ROS Services - Server](06-understanding-ros-services-server.md) — Implementing a service server and defining custom service message types.
8. [Using Python Classes in ROS](07-using-python-classes-in-ros.md) — Why `rclpy` nodes are built as classes, and how to combine multiple publishers, subscribers, and services in one class using shared state.
9. [Understanding ROS Actions - Clients](08-understanding-ros-actions-clients.md) — What actions are and when to use them over topics/services, writing an action client, handling feedback, and preempting goals, using a simulated quadrotor.
10. [Understanding ROS Actions - Servers](09-understanding-ros-actions-servers.md) — Implementing an action server with feedback, cancellation, and results, plus defining custom action message types.
11. [How to Debug ROS Programs](10-how-to-debug-ros-programs.md) — Log levels, Rqt Console, Rqt Plot, Rqt Graph, recording/replaying data with rosbag, and visualizing robot state in RViz.
