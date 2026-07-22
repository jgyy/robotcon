# MujocoLab for Robotics — Unit 4: Robots

Every previous unit trained MJLab's built-in humanoid. This unit removes that scaffolding: you take a robot MJLab has never seen — referred to here by the example name Atom01 — and wire it into the framework from a bare MJCF model to a policy that walks and responds to joystick commands. This is the unit where the pieces you only *used* in Units 1-3 (`robot_cfg`, `rl_cfg`, task registration) become things you write yourself.

## From built-in robot to your own
Integrating a new robot is fundamentally an exercise in describing, in config, everything MJLab previously assumed for you: which MJCF model to load, which joints are actuated and how they map to action-vector indices, what the observation vector contains, and what reward terms define "walking well" for *this* robot's morphology. None of that is physics work — the underlying MuJoCo Warp stepping and PPO training loop from Unit 2 are unchanged. What changes is entirely the configuration layer.

Before writing any config, get the raw MJCF model loading and rendering correctly in a plain MuJoCo viewer, independent of MJLab entirely. If a model's joint limits, collision geometry, or actuator gains look wrong at that stage, no amount of RL training will fix it later — debug the model first, the training task second.

## Anatomy of a custom robot integration
Four pieces come together to define a new task:

- **The task definition** ties a scene, a robot, and a reward specification together under a registered task name — this is the object the `--task` flag in `scripts/train.py` ultimately resolves to.
- **`robot_cfg`** describes the robot itself: the MJCF path, which joints are actuated, actuator gain/damping parameters, and the initial pose to spawn in.
- **The minimal environment** is the smallest scene that lets the robot exist and be observed — typically just a flat ground plane and gravity, with no terrain complexity or objects — so you can debug the robot integration in isolation before layering Unit 3's terrain and object work back on top.
- **`rl_cfg`** specifies the RL side: which algorithm, the reward term weights (upright bonus, velocity-tracking error, energy/torque penalty, termination-on-fall condition), and observation/action space sizes.

```python
# robot_cfg / rl_cfg — illustrative shape, following the pattern from Unit 1
robot_cfg = RobotCfg(
    mjcf_path="assets/atom01.xml",
    actuators={"hip_pitch_l": "motor", "knee_l": "motor", ...},
)

rl_cfg = RlCfg(
    algorithm="ppo",
    reward_terms=[
        ("upright", 1.0),
        ("velocity_tracking", 2.0),
        ("torque_penalty", -0.01),
    ],
)
```

A useful first milestone here isn't a walking robot — it's a robot that *stands still under gravity without immediately collapsing* when driven by an all-zeros ("do nothing") policy. If that fails, the problem is almost always actuator gains or an unstable initial pose in `robot_cfg`, not the reward design in `rl_cfg`.

## Training and evaluating Atom01
Once the zero-policy sanity check passes, training follows the exact same launch pattern from Unit 2 — only the task name changes, because everything else (parallel environments, PPO, W&B logging) is infrastructure the robot doesn't affect:

```bash
uv run python scripts/train.py --task Mjlab-Velocity-Atom01 --num-envs 4096 --logger wandb
uv run python scripts/play.py --task Mjlab-Velocity-Atom01-Play --checkpoint runs/atom01/last.pt
```

Expect a new robot's first successful training run to need more reward-shaping iteration than Unit 2's built-in humanoid did — the built-in robot's reward terms were already tuned by whoever authored it. A reward curve that plateaus low usually means a reward term is fighting against the robot's actual joint limits or torque capacity rather than a bug in the training script.

## Interactive control with a joystick
A trained velocity-tracking policy already accepts a commanded velocity as part of its observation — joystick control simply replaces "a fixed or randomly sampled command" with "whatever the joystick's analog stick reports right now," read continuously and fed into the same observation slot the policy was trained against. Because the policy was trained across a *range* of commanded velocities rather than one fixed value, it generalizes to whatever the joystick asks for within that trained range, which is what makes an offline-trained policy usable interactively rather than needing retraining per command.

## Try it yourself
Take the Atom01 velocity-tracking policy you trained on the minimal flat environment and re-launch play mode pointed at the custom terrain scene you built in Unit 3, without retraining. Note where it breaks down first — a specific terrain type (slope vs. step), a specific gait speed, or immediately at spawn — and write one sentence on which piece you'd change first: the terrain difficulty curriculum, the reward weights in `rl_cfg`, or the robot's actuator gains in `robot_cfg`.
