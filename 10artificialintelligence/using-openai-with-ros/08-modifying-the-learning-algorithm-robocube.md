# Using OpenAI with ROS — Unit 8: Modifying the Learning Algorithm: RoboCube

Unit 7 moved CartPole from tabular Q-learning to DeepQ. This unit repeats that migration for the RoboCube `TaskEnv` from Unit 5 — a slightly harder case, since RoboCube's reward landscape is less forgiving than CartPole's, which makes it a good place to learn how to tell "the algorithm is broken" apart from "training just needs more time."

## Porting RoboCube's TaskEnv observations to a DeepQ-friendly form

Same move as Unit 7: stop calling `discretize()` before handing observations to the algorithm, and make sure `observation_space` bounds in the `TaskEnv` are realistic (tight bounds that don't match what the robot can actually report will bias the network's input normalization). RoboCube's 3-vector (`roll_angle`, `roll_velocity`, `disk_velocity`) needs no other change — this is the payoff of having kept `_get_obs()` returning continuous values all along and only discretizing at the algorithm boundary in Unit 5.

```python
self.observation_space = spaces.Box(
    low=np.array([-0.5, -3.0, -6.0]),
    high=np.array([0.5, 3.0, 6.0]),
    dtype=np.float32,
)
```

## Discrete action encoding for torque commands

RoboCube's action space was already `Discrete(3)` (spin CW / hold / spin CCW) for the tabular version, and DQN is naturally suited to discrete actions, so — unlike the continuous-control robots later in this course — no action-space redesign is needed here. This is worth noticing explicitly: DQN-family algorithms require a discrete action space; if you later wanted finer-grained torque control (five or nine speed levels instead of three), that's a `TaskEnv`-only change, still compatible with DQN, whereas *continuous* torque would require switching families entirely (as Units 9-11 do with DDPG/HER).

## Training and comparing against the Qlearn baseline

Run the same `deepq.learn` pattern from Unit 7 against the RoboCube `TaskEnv`, and keep the Unit 5 Qlearn run's reward curve on hand as a baseline — the comparison is the actual point of this unit, not just getting DeepQ to run.

```python
model = deepq.learn(
    env,
    network="mlp",
    lr=5e-4,
    total_timesteps=200_000,
    buffer_size=50_000,
    exploration_fraction=0.15,
    exploration_final_eps=0.02,
    print_freq=20,
)
model.save("robocube_deepq.pkl")
```

Log both runs' episode reward (moving-averaged, since single-episode reward is noisy) to the same plot. Expect DQN to need more total environment steps to get started than tabular Qlearn did on this small a state space, but to keep improving past the point where the discretized table's resolution capped it.

## Diagnosing divergence and unstable training

RoboCube trains less forgivingly than CartPole because a bad early action (over-spinning the disk) can put the cube into a state it can't recover from, ending the episode almost immediately — which starves the replay buffer of anything but short, low-information episodes. Symptoms and first things to check, in order:

- **Reward flatlines near the worst possible value** — the agent may be stuck exploring the same failure mode; increase `exploration_fraction` so it samples more of the state space before committing.
- **Reward oscillates wildly episode to episode** — `lr` is likely too high, or `buffer_size` too small relative to episode length, so recent noisy transitions dominate each update.
- **Loss (if logged) grows unbounded** — check your reward scale; a `-200.0` fall penalty next to `+1.0` per-step rewards can make Q-value targets swing enormously, and clipping or rescaling rewards often stabilizes this faster than touching `lr`.

## Try it yourself

Rescale RoboCube's fall penalty from `-200.0` to `-10.0` (keeping the `+1.0` alive-bonus the same) and predict, before running anything, whether you'd expect training to become more or less stable, and why. If you have a running setup, test it against the original scale over a short run (10-20k timesteps) and compare the reward curves.
