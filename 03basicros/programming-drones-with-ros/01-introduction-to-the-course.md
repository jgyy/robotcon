# Programming Drones with ROS — Unit 1: Introduction to the Course

This unit previews the whole course: the platform you'll be flying, the software stack you'll assemble around it, and how the next three units build on each other — from raw velocity commands, to mapping and 2D navigation, to full 3D motion planning.

## Why a drone, and why the Parrot AR Drone specifically
The Parrot AR Drone is a quadrotor that was cheap, crash-tolerant, and — critically for this course — controllable entirely over Wi-Fi using a lightweight UDP/AT-command protocol, with no flight controller SDK lock-in. That makes it a good teaching platform: a ROS driver node can sit between your code and the aircraft, exposing takeoff/land/velocity control as ordinary topics and services instead of a proprietary API. Everything you learn here — command interfaces, sensor topics, SLAM, planning — transfers to other multirotor platforms (PX4- or ArduPilot-based drones, other ROS-driven UAVs); the AR Drone just keeps the hardware/firmware complexity out of your way.

The airframe carries a front-facing camera, a downward-facing camera (used for optical-flow-based velocity estimation), an ultrasonic altimeter, and an IMU. That sensor set is exactly what you need for the mapping and navigation units later in the course.

## The software stack you're building toward
Across the four units you will layer:
1. **A driver/bridge node** — wraps the drone's native protocol and publishes/subscribes standard ROS message types (`geometry_msgs/Twist` for velocity, `sensor_msgs/Image` for camera feeds, `nav_msgs/Odometry` for pose estimates).
2. **A simulator** — before you risk real hardware, you'll fly a simulated model of the same drone in a 3D physics simulator, so your control and navigation code can be developed and debugged safely.
3. **A SLAM/mapping package (RTABMap)** — turns the camera stream into a 3D map with loop closure, which you then use for 2D navigation.
4. **A motion planning framework (MoveIt)** — used here in an unusual way: not for a robot arm, but to plan collision-free 3D paths for the drone itself.

Each later unit assumes the driver and simulator from this unit are already running — get comfortable with them now.

## Setting up your workspace
You'll work inside a standard ROS workspace. The exact package names depend on which driver/simulator your course environment ships, but the pattern is always the same:

```bash
mkdir -p ~/drone_ws/src
cd ~/drone_ws/src
# clone the drone driver and simulation packages provided for this course
git clone <drone-driver-repo>
git clone <drone-simulator-repo>
cd ~/drone_ws
colcon build          # ROS 2; use `catkin_make` if your environment is ROS 1
source install/setup.bash
```

Bring the simulated drone up and confirm the driver is alive before moving on:

```bash
ros2 launch drone_simulator sim.launch.py
ros2 topic list | grep -i drone
ros2 topic echo /drone/odom --once
```

If you see odometry messages flowing, the bridge between the simulator and ROS is working end to end.

## Try it yourself
Bring up the simulated drone, then use `ros2 topic list` (or `rostopic list` on ROS 1) to write down every topic whose name contains `cmd`, `odom`, `image`, or `land`/`takeoff`. You'll be sending messages on most of these in Unit 2 — knowing their exact names and message types now will save you debugging time later.
