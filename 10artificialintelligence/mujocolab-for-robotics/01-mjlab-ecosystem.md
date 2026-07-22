# MujocoLab for Robotics — Unit 1: MJLab ecosystem

This unit orients you in the toolchain before you write a single config file: what MuJoCo, MuJoCo Warp, and MJLab each do, how they stack on top of one another, and what the rest of the course will build on top of that stack.

## What MJLab is
MuJoCo itself is a general-purpose physics engine — accurate contact dynamics, articulated bodies, actuators — used across robotics research regardless of what you do with it. On its own it simulates *one* environment at a time on CPU. MuJoCo Warp is a GPU-accelerated reimplementation of the same physics that can step thousands of environment copies in parallel on a single GPU, which is what makes large-scale reinforcement learning (RL) for legged and humanoid robots practical in reasonable wall-clock time instead of days on a CPU cluster.

MJLab sits one layer above that: it is an environment-authoring and training framework built on MuJoCo Warp, in the same spirit as NVIDIA's Isaac Lab is for Isaac Sim. Instead of writing raw physics-stepping and reward-accumulation loops yourself, you describe a task through configuration objects — a scene, a robot, an RL problem — and MJLab handles vectorizing that across GPU-parallel environments, feeding a standard RL library (this course leans on the conventions you'll see reused across every unit: `robot_cfg`, `scene_cfg`, `rl_cfg`).

```python
# Illustrative shape of an MJLab task definition — the pattern you will
# see fleshed out for real in Units 2-4, not a literal API reference.
from dataclasses import dataclass

@dataclass
class RobotCfg:
    mjcf_path: str          # MuJoCo XML model to load
    actuators: dict         # joint -> actuator mapping

@dataclass
class SceneCfg:
    robot: RobotCfg
    terrain: str = "flat"
    num_envs: int = 4096    # parallel environments on the GPU

@dataclass
class RlCfg:
    algorithm: str = "ppo"
    reward_terms: list = None
```

The three config classes above are a preview: `robot_cfg` and `rl_cfg` are exactly the pieces you assemble by hand in Unit 4 when you integrate a robot MJLab doesn't ship out of the box.

## A first look: the demo
A typical MJLab demo session looks like this: you launch a training run for a humanoid (commonly a Unitree G1-class robot in published examples) against a velocity-tracking task — "walk forward at 1 m/s," "turn left" — and watch thousands of copies of that robot fall over, stumble, and gradually learn to stand and walk, all rendered as one crowded scene in the MuJoCo viewer while the actual physics steps happen off-screen on the GPU. Alongside the viewer, a Weights & Biases (W&B) dashboard streams reward curves, episode length, and other training metrics in real time so you can tell "is this run actually learning" without staring at raw numbers in a terminal.

The same pattern — parallel environments, a reward signal, a live dashboard — reappears whether the task is walking, motion imitation (mimicking a captured dance or gesture clip), or a policy you train yourself on a custom robot later in the course.

## What this course will cover
- **Unit 2 (MJLab basics)** gets you from an empty project to a trained walking policy and a motion-imitation policy using MJLab's built-in robot and environment.
- **Unit 3 (Terrains)** replaces the default flat ground with custom terrain and objects, so policies learn to handle a scene you designed.
- **Unit 4 (Robots)** removes the training wheels entirely: you integrate a robot MJLab has never seen, wiring up its own `robot_cfg` and `rl_cfg` from scratch and training it to walk.

Each unit assumes the previous one's environment still works — this is a stack, not a set of disconnected demos.

## Try it yourself
Before Unit 2, confirm your machine can actually run GPU-parallel MuJoCo. Open the MuJoCo documentation at mujoco.readthedocs.io and find the section describing MJX / batched simulation, and separately check the Weights & Biases docs at docs.wandb.ai for how a Python script authenticates to log metrics (an API key, typically via `wandb login`). Write down, in your own words: (1) what makes MuJoCo Warp's batching different from just running many separate MuJoCo processes, and (2) what the one command is you'll need to run before any training script in this course can push metrics to your W&B dashboard.
