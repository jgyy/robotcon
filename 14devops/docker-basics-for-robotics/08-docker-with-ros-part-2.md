# Docker Basics for Robotics — Unit 8: Docker with ROS Part 2

Part 1 got a single containerized ROS node talking to itself. This unit tackles the harder, more realistic problems: multi-container ROS systems, GUI tools like rviz, GPU access, and DDS discovery across container and machine boundaries.

## Multi-container ROS systems with Compose
Combine what you learned in Unit 6 with the ROS image patterns from Unit 7 to run a full system as separate services — useful for keeping perception, planning, and hardware-driver code in independently buildable/updatable images:

```yaml
services:
  driver:
    build: ./driver
    network_mode: host
    environment:
      - ROS_DOMAIN_ID=12

  perception:
    build: ./perception
    network_mode: host
    environment:
      - ROS_DOMAIN_ID=12
    depends_on:
      - driver

  planner:
    build: ./planner
    network_mode: host
    environment:
      - ROS_DOMAIN_ID=12
    depends_on:
      - perception
```

Note `network_mode: host` on every service rather than a shared user-defined network — for ROS 2's default DDS discovery, host networking is usually the path of least resistance (more on why below). `ROS_DOMAIN_ID` scopes discovery so this stack doesn't cross-talk with an unrelated ROS system on the same network.

## DDS discovery across containers and hosts
ROS 2's default middleware discovers other nodes via UDP multicast. Docker's default bridge network isolates containers from the host's multicast traffic, which is why containers on a bridge network often can't see each other's topics even though they can ping each other. Two common fixes:
- **`--network host`** (or `network_mode: host` in Compose): the container shares the host's network stack directly, so multicast works exactly as it would for a non-containerized node. Simplest, but only works on Linux and gives up network isolation.
- **A DDS configured for unicast/discovery-server mode**: some DDS implementations support a discovery server or explicit peer lists instead of multicast, which works across a bridge network or even across separate machines without host networking. Check your DDS vendor's documentation for `ROS_DISCOVERY_SERVER` or equivalent configuration if you need containers to stay network-isolated.

For nodes split across *separate physical machines* (e.g. a container on your laptop talking to a container on the robot), make sure `ROS_DOMAIN_ID` matches on both ends and that any firewall allows the DDS traffic through.

## GUI tools: X11 forwarding for rviz and Gazebo
GUI applications need access to an X11 display, which isn't part of a container by default. On Linux, the common approach is mounting the X11 socket and passing the display variable:

```bash
xhost +local:docker   # allow local containers to connect to your X server
docker run -it --rm \
  --network host \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  osrf/ros:humble-desktop rviz2
```

Run `xhost -local:docker` afterward to revoke the access you granted. This is a development convenience, not something you'd ship on a deployed robot.

## GPU passthrough
Perception and simulation workloads that use CUDA (e.g. GPU-accelerated Gazebo rendering or a neural-network-based detector) need the container to see the host's GPU. With the NVIDIA Container Toolkit installed on the host:

```bash
docker run --gpus all --rm nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
```

`--gpus all` (or a specific device count/ID) exposes the GPU driver and devices inside the container. Your image still needs matching CUDA libraries, but the driver comes from the host.

## Try it yourself
Using the compose pattern above as a template, write a two-service `docker-compose.yml` where both services use `network_mode: host` and the same `ROS_DOMAIN_ID`. Put a `talker` node in one service and a `listener` node in the other (reuse `ros-humble-demo-nodes-cpp` from Unit 7). Bring the stack up with `docker compose up` and confirm the listener's logs show messages arriving from the talker.
