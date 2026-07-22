# Reinforcement Learning for Robotics — Unit 4: Monte Carlo Methods

Dynamic programming in Unit 3 required a full model of the environment — you can't run it on a real robot arm whose exact transition probabilities you don't know. Monte Carlo (MC) methods drop that requirement entirely: they learn value estimates purely by sampling complete episodes and averaging the returns that were actually observed. The cost is that you need episodes to *end* before you can learn from them.

## MC prediction: first-visit vs. every-visit
**MC prediction** estimates `V^π(s)` by running the policy, recording every episode's trajectory, and averaging the return that followed each visit to `s`.
- **First-visit MC** only counts the return following the *first* time `s` is visited in an episode.
- **Every-visit MC** counts the return following *every* visit to `s` in that episode.

Both converge to the true `V^π(s)` as the number of episodes grows; first-visit is more common because its estimates are independent across episodes, which makes the statistics easier to reason about.

```python
from collections import defaultdict

def first_visit_mc_prediction(env, policy, n_episodes=5000, gamma=0.9):
    returns_sum = defaultdict(float)
    returns_count = defaultdict(int)
    V = defaultdict(float)

    for _ in range(n_episodes):
        episode = []
        state, _ = env.reset()
        done = False
        while not done:
            action = policy(state)
            next_state, reward, terminated, truncated, _ = env.step(action)
            episode.append((state, reward))
            state = next_state
            done = terminated or truncated

        visited = set()
        G = 0.0
        for t in reversed(range(len(episode))):
            s, r = episode[t]
            G = r + gamma * G
            if s not in visited:
                visited.add(s)
                returns_sum[s] += G
                returns_count[s] += 1
                V[s] = returns_sum[s] / returns_count[s]
    return V
```

Notice the backward pass over the episode: it computes the return `G` for every timestep in one sweep, reusing the fact that `G_t = r_t + γG_{t+1}`, instead of resumming the whole remaining trajectory at every step.

## MC control and exploring starts
**MC control** turns prediction into policy improvement: estimate `Q(s,a)` instead of `V(s)`, then make the policy greedy with respect to `Q`. The catch is that a purely greedy policy will never revisit state-action pairs it has decided are bad, so those `Q` estimates stay permanently unreliable. The classic fix is **exploring starts** — force every episode to begin at a randomly chosen `(s, a)` pair, guaranteeing every pair gets sampled eventually. Exploring starts work fine in simulation (you can teleport the agent to any state) but are usually impossible on real hardware, which is why the epsilon-greedy behavior policy from Unit 2 is the more practical alternative.

## On-policy vs. off-policy learning
- **On-policy** methods evaluate and improve the same policy that generates the data (e.g., epsilon-greedy MC control, where the same epsilon-greedy policy both acts and gets improved).
- **Off-policy** methods learn about a target policy (often the greedy, deterministic one) while following a different, more exploratory behavior policy — using **importance sampling** to correct for the mismatch between the two.

Off-policy MC lets you learn the optimal, purely-greedy policy's values while your robot keeps acting safely and exploratively during data collection — a distinction that becomes central again with Q-learning in Unit 5, which is off-policy by construction.

## Try it yourself
Take the `first_visit_mc_prediction` function above and run it on `FrozenLake-v1` (`is_slippery=False`) with a fixed policy that always tries to move toward the goal (right, then down). Print `V(s)` for every state after 5,000 episodes. Then compare it against a `value_iteration` result for the same environment from Unit 3 — the two `V` tables should be close, and any large discrepancy in one particular state is a good signal that state isn't being visited often enough for MC to have converged there yet.
