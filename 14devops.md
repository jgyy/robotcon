# 14 DevOps for Robotics

## Why this matters

Robot software has to run identically on your laptop, a CI runner, and the actual onboard computer — usually a different architecture, a different set of installed libraries, and no keyboard attached once it's deployed. "Works on my machine" is a much bigger liability here than in web development, because you often can't just SSH in and patch a robot at 2am in a warehouse. Containers and reproducible build tooling let you pin down a known-good stack (OS, ROS distro, drivers, dependencies) and ship it as a unit, while CI catches integration breaks — a node that silently stops publishing, a changed message type — before they reach hardware. ROS 2 also spans several distros, each tied to a specific Ubuntu release with its own support window, so a real deploy pipeline needs a story for what happens when the ground shifts under a package you're not actively touching anymore.

## Core concepts

- Containers as the reproducibility unit — Docker (or Podman) images pin OS, ROS distro, and system packages so a build is identical on your machine, on CI, and on the robot.
- rocker — a wrapper around `docker run`, maintained by Open Robotics, purpose-built for ROS: handles X11/GUI forwarding, GPU (nvidia) passthrough, device mounts, and matching the container user to your host UID so RViz windows and camera access work out of the box.
- Multi-stage Dockerfiles — separate the build-time toolchain (compilers, headers, colcon build deps) from the runtime image so what actually ships to the robot is small and doesn't carry your whole dev environment.
- Base image choice — official `ros:<distro>` images vs. building from plain Ubuntu, and the tradeoffs in image size, layer control, and matching the robot's real OS version.
- colcon as the ROS 2 build tool — `colcon build`, `colcon test`, workspace overlay/underlay sourcing, and options like `--merge-install` or `--symlink-install` that change how the install space is laid out.
- rosdep — resolving and installing the system-level dependencies declared in each package's `package.xml`, so a fresh checkout (or CI image) can bootstrap its own dependencies instead of you hand-installing apt packages.
- vcstool and `.repos` files — pinning exact repo/branch/tag/commit for every package in a multi-repo workspace, so `vcs import` reproduces the same source tree today and a year from now.
- CI pipeline shape for a ROS 2 repo — typical stages: checkout, rosdep install, `colcon build`, `colcon test`, static analysis/lint, then publish an image or artifact; usually run inside a ROS docker image on a hosted or self-hosted runner.
- Reading colcon test results — `colcon test-result --verbose`, and wiring gtest/pytest/launch_testing output into CI pass/fail gates rather than eyeballing console output.
- Cross-architecture builds — building for ARM robot computers (Jetson, Raspberry Pi) via native build-on-target, QEMU-emulated Docker builds, or a real cross-compilation toolchain, and why "builds on x86" isn't the finish line.
- Versioning across ROS distros — each distro tracks a specific Ubuntu LTS with a defined end-of-life; keeping a support matrix of what's tested against what, and what quietly breaks when upstream package versions move.
- Dependency pinning strategy — locking exact versions (apt pins, rosdep version exceptions, vcstool commit SHAs) vs. floating on "latest," and why a robot you're not actively maintaining needs the former.
- Registries and artifact distribution — pushing built images to a registry (Docker Hub, GHCR, or a private one) and pulling a pre-built image onto the robot instead of rebuilding from source on constrained hardware.
- Dev containers — a containerized development environment (VS Code Dev Containers or a bare Docker workflow) so every contributor, or you on a new machine, gets an identical toolchain without polluting the host OS.
- Keeping secrets and robot-specific config out of images — network settings, calibration files, and credentials get injected at deploy/runtime rather than baked into a layer that ends up in a registry.

## Resources

- Docker official documentation (docs.docker.com) — images, multi-stage builds, Compose.
- `docs.ros.org` — the "Installation" section covers official ROS 2 Docker images and Docker-based install paths per distro.
- Official ROS Docker images on Docker Hub (`hub.docker.com/_/ros`).
- rocker, by Open Robotics — search GitHub for `osrf/rocker` for docs and usage examples.
- colcon documentation (colcon.readthedocs.io) — build verbs, workspace layout, mixins.
- rosdep — see the rosdep tutorials on docs.ros.org and the rosdep documentation on the ROS wiki for how the dependency database and `package.xml` keys work.
- vcstool, by Dirk Thomas — search GitHub for `dirk-thomas/vcstool`; the ROS 2 core repo's own `.repos` files (e.g. in `ros2/ros2`) are a good real-world example of the format.
- REP 2000 — the official ROS 2 distributions REP (ros.org/reps), listing each distro's Ubuntu base and support timeline.
- `ros-tooling/action-ros-ci` — a real, maintained GitHub Action for building and testing ROS 2 packages in CI; search GitHub for it.
- `ros-industrial/industrial_ci` — a widely used CI helper for ROS/ROS 2 package repos; search GitHub for it.
- Dev Containers specification (containers.dev) — for a portable, editor-agnostic dev container setup.
- Docker Compose documentation, for orchestrating multi-container robot stacks (e.g. a simulator container plus a driver container).
- ROS Discourse (discourse.ros.org) — search for CI and containerization threads; practices here shift as tooling matures, so it's worth checking current discussion rather than relying only on a single tutorial.

## Hands-on checkpoints

- [ ] Write a Dockerfile that builds a small ROS 2 workspace on top of an official `ros:<distro>` base image and runs a single node with `docker run`.
- [ ] Use rocker to launch a GUI tool (RViz2 or rqt) from inside a container, with X11 forwarding working end to end.
- [ ] Add a `.repos` file (vcstool) and a rosdep-driven install step to a multi-package workspace, so `vcs import` + `rosdep install` + `colcon build` reproduces the whole environment from a clean clone.
- [ ] Set up a CI pipeline (GitHub Actions or GitLab CI) that checks out the repo, installs dependencies with rosdep, runs `colcon build` and `colcon test`, and fails the pipeline when a test fails.
- [ ] Convert a working Dockerfile into a multi-stage build that produces a slim runtime image with no compiler toolchain, and push it to a container registry.
- [ ] Get the same image building and running on both your dev machine and an ARM target (Raspberry Pi, Jetson, or a QEMU-emulated build), and debug whatever breaks that didn't break on x86.
- [ ] Pin every dependency in a workspace (vcstool commit SHAs, explicit rosdep/apt versions) and confirm that checking out an old commit of your own repo still builds cleanly against those pins.
