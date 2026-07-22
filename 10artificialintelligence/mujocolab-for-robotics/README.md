# MujocoLab for Robotics

MuJoCo Warp turns MuJoCo's physics into something you can step thousands of times in parallel on a GPU, and MJLab is the framework built on top of that for actually training robots with reinforcement learning — environment configs, reward specification, and training/logging glue instead of hand-rolled physics loops. This course walks from a first orientation in that stack, through the default built-in humanoid and its walking and motion-imitation tasks, to authoring your own custom terrain and objects, and finally to integrating an entirely new robot MJLab has never seen — ending with a policy you trained yourself, tested on terrain you built yourself.

1. [MJLab ecosystem](01-mjlab-ecosystem.md) — How MuJoCo, MuJoCo Warp, and MJLab relate, and a first look at what a trained policy demo looks like.
2. [MJLab basics](02-mjlab-basics.md) — Scaffold a project with uv, launch your first simulation, and train velocity-tracking and motion-imitation policies on the built-in robot.
3. [Terrains](03-terrains.md) — Structure a project for custom scenes, populate them with static/dynamic/mesh objects, and generate procedural custom terrain.
4. [Robots](04-robots.md) — Integrate a brand-new robot from a bare MJCF model through `robot_cfg`/`rl_cfg`, train it to walk, and drive it interactively with a joystick.
