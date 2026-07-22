# Reinforcement Learning for Robotics — Unit 5: Temporal-Difference Methods

Monte Carlo methods (Unit 4) need a full episode before they can update anything, and dynamic programming (Unit 3) needs a full model before it can update anything. Temporal-difference (TD) learning needs neither: it updates its value estimates after every single step, using a guess to correct a guess. This combination — model-free like MC, but step-by-step like DP — is why TD methods, and Q-learning specifically, are the most widely used family of algorithms in practical RL.

## TD prediction: TD(0)
Instead of waiting for the true return `G_t`, TD(0) bootstraps: it uses the reward just received plus the *current estimate* of the next state's value as a stand-in for the real return.

```
V(s) ← V(s) + α · [ r + γV(s') − V(s) ]
```

The bracketed term `r + γV(s') − V(s)` is the **TD error**: the difference between what you just observed (one step of real reward plus a bootstrapped estimate) and what you previously believed. `α` is the learning rate/step size. Because this update only needs `(s, r, s')` — a single transition — TD(0) can learn online, mid-episode, from an environment that never terminates.

## SARSA: on-policy TD control
**SARSA** takes its name from the quintuple it consumes on every update: `(S, A, R, S', A')`. It's on-policy — the action `A'` used in the update is the action the agent actually takes next, sampled from the same (e.g. epsilon-greedy) policy being followed:

```python
import numpy as np

def sarsa(env, n_episodes=2000, alpha=0.1, gamma=0.95, epsilon=0.1):
    n_states, n_actions = env.observation_space.n, env.action_space.n
    Q = np.zeros((n_states, n_actions))

    def eps_greedy(s):
        if np.random.random() < epsilon:
            return env.action_space.sample()
        return int(np.argmax(Q[s]))

    for _ in range(n_episodes):
        s, _ = env.reset()
        a = eps_greedy(s)
        done = False
        while not done:
            s2, r, terminated, truncated, _ = env.step(a)
            a2 = eps_greedy(s2)
            Q[s, a] += alpha * (r + gamma * Q[s2, a2] - Q[s, a])
            s, a = s2, a2
            done = terminated or truncated
    return Q
```

Because SARSA updates toward the value of the action it will *actually* take (including occasional random exploration), it learns a policy that accounts for its own exploration risk — it tends to prefer safer paths on tasks where a wrong exploratory step near a hazard is costly.

## Q-learning: off-policy TD control
**Q-learning** changes one line: instead of bootstrapping off the action the agent will actually take next, it bootstraps off the *best possible* next action, regardless of what the behavior policy ends up doing:

```python
Q[s, a] += alpha * (r + gamma * np.max(Q[s2]) - Q[s, a])
```

This makes Q-learning **off-policy**: the behavior policy (epsilon-greedy, for exploration) and the target policy being learned (the greedy policy implied by `Q`) are different. `Q` converges toward the optimal `Q*` regardless of how much exploring the behavior policy does, which is exactly what makes Q-learning the algorithm used for the Unit 6 project — you can explore freely during training and still end up learning the optimal policy.

## Comparing DP, MC, and TD
|                    | Needs a model | Updates from | Bootstraps |
|--------------------|---------------|---------------|------------|
| Dynamic Programming | Yes           | full sweep    | Yes        |
| Monte Carlo         | No            | full episode  | No         |
| Temporal-Difference | No            | single step   | Yes        |

TD sits deliberately in the middle: it gets MC's independence from a model and DP's ability to update immediately, at the cost of introducing bias early in training (its bootstrapped targets are built from value estimates that are themselves still wrong).

## Try it yourself
Run both `sarsa` and a Q-learning variant (copy `sarsa` and swap in the off-policy update line above) on `FrozenLake-v1` with `is_slippery=True` for 5,000 episodes each. Evaluate both learned policies over 200 greedy (epsilon=0) test episodes and compare success rates. SARSA typically comes out slightly more conservative near the holes than Q-learning on the slippery variant — see if your results agree, and think about why the slippery dynamics make that difference more visible than on the deterministic version.
