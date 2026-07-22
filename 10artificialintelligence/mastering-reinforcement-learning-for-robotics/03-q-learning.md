# Mastering Reinforcement Learning for Robotics — Unit 3: Q-Learning

Q-Learning is the algorithm most people learn RL through first, and for good reason: it directly implements the Bellman equation from Unit 2 as an update rule you can code in a few lines, with no neural network required. This unit builds a working Q-Learning agent end to end on a small, fully observable environment.

## The Q-table
Q-Learning represents the action-value function `Q(s,a)` as an explicit lookup table — one row per state, one column per action — which only works when both `S` and `A` are small and discrete. For a robotics-flavored example, imagine a simplified grid-world "warehouse robot" that must navigate a 5x5 grid to a goal cell while avoiding obstacle cells: the state is the robot's `(row, col)` position (25 states), and the action is one of `{up, down, left, right}` (4 actions), giving a 25x4 Q-table. Real robot state spaces are rarely this small (that's exactly the problem Unit 4 solves), but the grid-world keeps the algorithm itself visible without a neural network in the way.

```python
import numpy as np

n_states = 25
n_actions = 4
Q = np.zeros((n_states, n_actions))
```

## The update rule
Q-Learning is an **off-policy, temporal-difference** algorithm: after each step it nudges its current estimate `Q(s,a)` toward a better target built from the observed reward and the best value achievable from the next state:

```
Q(s,a) ← Q(s,a) + α · [ r + γ · max_a' Q(s',a') − Q(s,a) ]
```

- `α` (alpha) is the learning rate — how much to trust each new sample.
- The bracketed term is the **TD error**: the gap between what you predicted and what you now believe is true.
- `max_a' Q(s',a')` is what makes this off-policy — it bootstraps from the *greedy* action at `s'`, regardless of which action the agent actually took (which might have been an exploratory one).

```python
def q_update(Q, s, a, r, s_next, alpha=0.1, gamma=0.99):
    td_target = r + gamma * np.max(Q[s_next])
    td_error = td_target - Q[s, a]
    Q[s, a] += alpha * td_error
    return Q
```

## The training loop
Putting it together with the epsilon-greedy policy from Unit 2:

```python
import random

def train(env, n_episodes=500, alpha=0.1, gamma=0.99,
          epsilon_start=1.0, epsilon_end=0.05, epsilon_decay=0.995):
    Q = np.zeros((env.n_states, env.n_actions))
    epsilon = epsilon_start
    episode_returns = []

    for ep in range(n_episodes):
        s, _ = env.reset()
        done = False
        total_reward = 0

        while not done:
            if random.random() < epsilon:
                a = random.randrange(env.n_actions)
            else:
                a = int(np.argmax(Q[s]))

            s_next, r, terminated, truncated, _ = env.step(a)
            done = terminated or truncated
            Q = q_update(Q, s, a, r, s_next, alpha, gamma)
            s = s_next
            total_reward += r

        epsilon = max(epsilon_end, epsilon * epsilon_decay)
        episode_returns.append(total_reward)

    return Q, episode_returns
```

Note the epsilon *decay* — same idea from Unit 2, implemented for real this time. Watching `episode_returns` climb (and its variance shrink) over training is the primary signal that the agent is actually learning rather than just noisily wandering.

## Reward shaping for robotics
The environment's reward function is a design choice, and it matters enormously. A sparse reward (`+1` only on reaching the goal, `0` everywhere else) is easy to specify but can leave the agent with no learning signal for a very long time in a large state space. A denser, *shaped* reward — e.g., a small negative step penalty (`-0.01` per step) plus a bonus for reducing distance to the goal — speeds up learning but risks the reward-hacking problem mentioned in Unit 1: an agent might learn to farm the shaping bonus (oscillate near the goal collecting small distance-reduction rewards) instead of actually finishing the task. Designing a reward function that captures what you actually want, not a proxy for it, is one of the most practically important — and most underestimated — skills in applied RL.

## Try it yourself
Implement the 5x5 grid-world described above (state = flattened `(row, col)` index, actions move by one cell, `+10` reward at the goal, `-1` for hitting a wall/obstacle and staying in place, `-0.05` per step otherwise) and run the training loop for 500 episodes. Plot `episode_returns` and confirm it trends upward. Then print the learned Q-table's greedy action at every state (`np.argmax(Q, axis=1)`) and check by hand that it traces a sensible path to the goal — this "read the policy off the table" check is something you lose once you move to function approximation in the next unit, so it's worth doing here while you still can.
