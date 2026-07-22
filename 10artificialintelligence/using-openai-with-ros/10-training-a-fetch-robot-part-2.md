# Using OpenAI with ROS — Unit 10: Training a Fetch Robot. Part 2

With `FetchEnv` from Part 1 able to read the gripper's position and move it, this unit builds the `TaskEnv` for a reaching task, and introduces both a new reward structure (sparse, goal-conditioned) and a new algorithm to handle it: Hindsight Experience Replay (HER) from OpenAI Baselines, layered on top of DDPG.

## Goal-conditioned RL: achieved_goal vs desired_goal

Every task so far has had one implicit goal, baked into the reward function (stay upright). A reaching task is different: "success" depends on a *target position* that changes every episode, so the environment needs to tell the agent what it's trying to do this time, not just what happened. The standard pattern (matching the classic Gym `GoalEnv` convention) is a dict observation with three keys:

```python
def _get_obs(self):
    return {
        "observation": self.get_ee_position(),        # current state
        "achieved_goal": self.get_ee_position(),       # what state was reached
        "desired_goal": self.current_target,           # what state we want
    }
```

For a pure reaching task, `observation` and `achieved_goal` happen to be the same vector; they diverge in richer tasks (e.g. pick-and-place, where `achieved_goal` is the *object's* position, not the gripper's).

## Sparse rewards and why HER helps

The natural reward for "did you reach the target" is sparse: `0` if within some distance threshold of the goal, `-1` otherwise. Sparse rewards are honest (no hand-tuned shaping to get subtly wrong) but brutal to learn from directly — early in training, a random policy essentially never reaches the goal, so the agent gets `-1` on almost every transition and has no gradient signal telling it which of its bad episodes were "less bad."

HER's trick: after an episode ends, relabel some of the stored transitions as if the goal the agent *actually achieved* had been the goal all along, and recompute the reward for that relabeled goal. A transition that failed to reach the real target becomes a *successful* transition for the (achieved) goal it did reach, giving the replay buffer usable positive-reward signal from day one, without changing the environment or the sparse reward function itself.

## Implementing compute_reward and the Task Environment

HER-compatible environments must expose `compute_reward(achieved_goal, desired_goal, info)` as a standalone method, since HER calls it directly on relabeled goals — not just internally during `step()`:

```python
def compute_reward(self, achieved_goal, desired_goal, info):
    distance = np.linalg.norm(achieved_goal - desired_goal)
    return 0.0 if distance < self.success_threshold else -1.0

def step(self, action):
    obs, reward, done, info = super().step(action)
    reward = self.compute_reward(obs["achieved_goal"], obs["desired_goal"], info)
    return obs, reward, done, info

def _sample_goal(self):
    return self.workspace_center + np.random.uniform(-0.15, 0.15, size=3)
```

`_sample_goal()` is called on `reset()` so each episode targets a different point in the arm's reachable workspace — without goal randomization, the agent would just memorize one fixed reach rather than learning to reach generally.

## Launching HER+DDPG training with OpenAI Baselines

DDPG (Deep Deterministic Policy Gradient) is the continuous-action-space algorithm HER is normally paired with — appropriate here since Cartesian end-effector deltas (Unit 9) are continuous, unlike RoboCube's discrete torque levels.

```python
from baselines.her.her import learn as her_learn

model = her_learn(
    env,
    network="mlp",
    total_timesteps=500_000,
    n_cycles=10,
    replay_strategy="future",   # relabel with goals achieved LATER in the same episode
    replay_k=4,                 # 4 relabeled transitions per real one
)
model.save("fetch_her.pkl")
```

`replay_strategy="future"` is the most common HER variant: for each real transition, sample `replay_k` *later* achieved-goal states from the same episode as substitute goals, which tends to generate more useful relabeled experience than picking a random goal from anywhere in the episode.

## Try it yourself

Write a `compute_reward` variant that returns a continuous (dense) value — negative distance to the goal — instead of the binary `0`/`-1` above, and explain in a sentence why HER is specifically designed for the sparse case and offers little benefit once you've already switched to a dense, distance-based reward.
