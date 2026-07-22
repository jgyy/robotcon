# Docker Basics for Robotics — Unit 10: Docker for Robot Deployment

This final unit closes the loop: taking everything you've learned about building, composing, and running containers, and applying it to the problem of reliably bringing up a real robot's software stack every time it powers on.

## Building for the target architecture
A robot's onboard computer is often ARM-based (Raspberry Pi, NVIDIA Jetson) while you likely develop on an x86 laptop. `docker buildx` lets you build multi-architecture images, or cross-build directly for the robot's architecture, without needing the target hardware in hand:

```bash
docker buildx create --use
docker buildx build --platform linux/arm64 -t myrobot/bringup:1.0 --push .
docker buildx build --platform linux/amd64,linux/arm64 -t myrobot/bringup:1.0 --push .
```

Pushing straight to a registry (rather than `--load`ing locally) is typical here, since the target robot will pull the image itself.

## Structuring the deployment image
A deployment image should be self-contained: your workspace already built with `colcon build` inside the image (not mounted from the host), a fixed version tag (never `latest` on a robot you can't easily SSH into), and only the runtime dependencies it actually needs — reuse the multi-stage build pattern from Unit 3 to leave the compiler toolchain out of the final image.

```dockerfile
FROM osrf/ros:humble-ros-base AS builder
WORKDIR /ros2_ws
COPY src ./src
RUN rosdep update && rosdep install --from-paths src --ignore-src -r -y \
    && . /opt/ros/humble/setup.sh && colcon build

FROM osrf/ros:humble-ros-base
COPY --from=builder /ros2_ws/install /ros2_ws/install
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["ros2", "launch", "my_robot_bringup", "bringup.launch.py"]
```

## Bringing the stack up automatically on boot
On the robot itself, define the full bringup as a Compose file (Unit 6) and let it start automatically. Docker's own restart policies handle process-level recovery (a node crashing and restarting), while a systemd unit handles machine-level recovery (the whole robot rebooting after a power cycle):

```ini
# /etc/systemd/system/robot-bringup.service
[Unit]
Description=Robot bringup stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/robot/bringup
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now robot-bringup.service
```

Combined with `restart: unless-stopped` on each service in the Compose file, this gives you two layers of resilience: Docker restarts an individual crashed container immediately, and systemd brings the whole stack back after a reboot.

## Constraints and update strategy
Embedded robot computers have limited RAM, storage, and sometimes intermittent network access, so deployment habits differ from a cloud server: set `--memory`/`--cpus` limits (Unit 4) so one runaway node can't starve the rest of the stack, keep images slim (multi-stage builds, minimal base images) since storage is finite, and prefer pulling a new version explicitly and rolling back to a known-good tag over always tracking `latest` — a bad update on a robot in the field is much harder to fix than one in a data center.

## Try it yourself
Take the deployment Dockerfile pattern above and adapt it for a small ROS package you have (or the demo nodes from Unit 7). Build it with a pinned version tag, write a matching `docker-compose.yml` with `restart: unless-stopped` and a memory limit, and bring it up with `docker compose up -d`. Kill the container's main process from another terminal (`docker kill <container>`) and confirm Docker restarts it automatically.
