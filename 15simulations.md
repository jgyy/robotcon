# 15 Simulation

## Why this matters
Real hardware is expensive, slow to iterate on, and unforgiving of bugs — a bad velocity command costs you a re-run in simulation but can cost you a broken robot or a damaged workspace in reality. Simulation is what lets you develop and stress-test perception, planning, and control code before it ever drives an actuator, and it's the only practical way to get the thousands of trial runs that reinforcement learning, fuzz-style regression testing, or multi-robot fleet logic require. Every simulator trades off physical accuracy, rendering fidelity, and speed differently, and none of them match reality perfectly — knowing which tool fits which job, and where each one will quietly lie to you, is a skill in its own right, separate from whatever robot or ROS concept you happen to be using it to teach.

## Core concepts

- Gazebo (new, "Gz") vs Gazebo Classic — the current Gazebo is a modular rewrite (Fortress/Harmonic/Jetty and later) that talks to ROS via the `ros_gz` bridge; Gazebo Classic (Gazebo 11) is the older, still-widely-deployed line built around `gzserver`/`gzclient` and `gazebo_ros_pkgs`; know which one a given tutorial or robot vendor is targeting before you start

- Webots — a self-contained simulator with its own physics engine, editor, and robot library, popular for teaching and quick multi-robot setups, with an official ROS2 interface

- NVIDIA Isaac Sim — GPU-accelerated, PhysX-based simulator built on Omniverse, aimed at photorealistic rendering, synthetic training-data generation, and large-scale parallelized reinforcement learning

- PyBullet — a lightweight, scriptable Python physics engine (built on Bullet) good for fast prototyping, RL research, and manipulation/grasping experiments without needing a full GUI stack

- MuJoCo — a physics engine known for fast, accurate contact and constraint dynamics, the de facto standard in robot-learning and control research; now free and open source, maintained by Google DeepMind

- Physics engine differences — contact/friction models, solver accuracy, and integration timestep vary between engines (ODE, Bullet, DART, PhysX, MuJoCo's own), and the same robot model can behave differently just by changing simulator

- SDF vs URDF — SDF (Simulation Description Format) is Gazebo's native world/model format; URDF is the format used across the rest of ROS tooling (see 04intermediateros2.md); the conversion between them is a common source of subtle discrepancies

- Sensor simulation and its limits — simulated cameras, LIDAR, IMUs, and depth sensors are modeled with idealized geometry and configurable noise, and are almost always cleaner than what a real sensor actually produces

- The sim-to-real gap — the general fact that a policy or controller tuned in simulation degrades to some degree on real hardware, driven by unmodeled friction, actuator delay/backlash, sensor noise, and rendering differences

- Domain randomization — deliberately varying textures, lighting, physics parameters, and sensor noise across simulated runs so that whatever transfers to the real robot is robust to the exact things you didn't model precisely

- System identification — measuring real robot parameters (mass, friction, motor response) and feeding them back into the simulator to close part of the fidelity gap, rather than guessing default values

- Headless/batch simulation — running a simulator without a GUI, which is faster, scriptable, and parallelizable, and is what makes simulation usable in CI and large training runs

- Simulation-based CI/regression testing — spinning up a scripted world in a build pipeline to catch navigation, planning, or control regressions automatically before merging code and before anyone touches hardware (see 14devops.md)

- Determinism and reproducibility — fixed random seeds and consistent physics timestep/solver settings matter if a simulated test is expected to give the same result on every run

- Real-time factor — how simulated time relates to wall-clock time; faster-than-real-time is what you want for CI and training, real-time (or slower) is what you want when a human is in the loop

- Multi-robot / fleet simulation — most of these simulators support spawning many robot instances in one world, which is how fleet-coordination logic gets tested before deployment (see 16enterprisecourses.md)

## Resources

- gazebosim.org — official documentation for current Gazebo (Gz), including "Getting Started" and tutorial sections

- classic.gazebosim.org — official documentation and tutorials for Gazebo Classic

- cyberbotics.com/doc/guide — the Webots User Guide (with a companion Reference Manual at cyberbotics.com/doc/reference)

- docs.isaacsim.omniverse.nvidia.com — official NVIDIA Isaac Sim documentation

- pybullet.org, and the "PyBullet Quickstart Guide" in the bulletphysics/bullet3 GitHub repository docs

- mujoco.readthedocs.io — official MuJoCo documentation; source and examples at github.com/google-deepmind/mujoco

- Todorov, Erez, Tassa, "MuJoCo: A Physics Engine for Model-Based Control" (IROS 2012) — the original MuJoCo paper, searchable by title on arxiv.org or via its DOI

- Tobin et al., "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World" (arXiv:1703.06907) — the paper that popularized domain randomization

- Zhao, Queralta, Westerlund, "Sim-to-Real Transfer in Deep Reinforcement Learning for Robotics: A Survey" (arXiv:2009.13303) — a good overview of sim-to-real techniques

- docs.ros.org — search your distro's docs for `ros_gz` (new Gazebo) or `gazebo_ros_pkgs` (Classic) to find the current ROS bridge packages

- search each project's official GitHub repository (`gazebosim/gz-sim`, `cyberbotics/webots`, `isaac-sim/IsaacSim`, `bulletphysics/bullet3`, `google-deepmind/mujoco`) for up-to-date example worlds and sample robot models

## Hands-on checkpoints

- [ ] Spawn a basic mobile robot model in one simulator (Gazebo or Webots) and drive it around with teleop

- [ ] Run the same robot model in two different simulators (e.g. Gazebo Classic vs new Gazebo, or Gazebo vs PyBullet) and compare how it moves and collides

- [ ] Add a simulated LIDAR or camera to a robot model and visualize the live sensor stream

- [ ] Write a script that launches a simulation headless, runs a fixed scenario, and asserts pass/fail on the outcome (e.g. did the robot reach a goal within N seconds without collision)

- [ ] Wire that headless scenario into a CI pipeline so it runs automatically on every commit, before anything touches hardware (see 14devops.md)

- [ ] Deliberately mis-tune a physics parameter (friction, mass, actuator gain) against its real-world value and observe how the resulting behavior diverges — a hands-on look at the sim-to-real gap

- [ ] Apply domain randomization to one simulated scenario (vary lighting, textures, friction) and note how much it changes downstream perception or control performance

- [ ] Measure real-time factor for a scenario in one simulator, then compare the wall-clock cost of running it headless versus with full rendering enabled
