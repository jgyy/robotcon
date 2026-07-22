# Reinforcement Learning for Robotics — Unit 6: Course Project

This project puts every prior unit to work: you'll define a maze as an MDP (Unit 2), build a tabular Q-learning agent (Unit 5) that improves on the exact answer dynamic programming would give you (Unit 3), and validate it the same way Monte Carlo methods validate a policy (Unit 4) — by running episodes and measuring return. The task: navigate a grid maze with three fixed obstacles from a start cell to a goal cell using Q-learning, with no built-in gym dependency, so every moving part is visible.

## Defining the maze as an MDP
A grid maze maps directly onto the `(S, A, P, R, γ)` tuple from Unit 2: states are grid cells, actions are the four compass directions, transitions are deterministic (moving into a wall/obstacle just keeps you in place), and reward is `-1` per step with `+10` on reaching the goal — which pushes the agent to find the *shortest* path, not just any path.

```python
import numpy as np

GRID_SIZE = 5
START = (0, 0)
GOAL = (4, 4)
OBSTACLES = {(1, 1), (2, 3), (3, 1)}      # the three obstacles
ACTIONS = {0: (-1, 0), 1: (1, 0), 2: (0, -1), 3: (0, 1)}  # up, down, left, right

def step(state, action):
    dr, dc = ACTIONS[action]
    r, c = state[0] + dr, state[1] + dc
    if not (0 <= r < GRID_SIZE and 0 <= c < GRID_SIZE) or (r, c) in OBSTACLES:
        r, c = state                       # blocked: stay put
    next_state = (r, c)
    if next_state == GOAL:
        return next_state, 10.0, True
    return next_state, -1.0, False
```

Keeping the environment this explicit — rather than reaching straight for a library — is worth the extra lines: on a real robot you will eventually have to define your own state space, action set, and reward function exactly like this, and no library can do that domain modeling for you.

## Implementing tabular Q-learning
With `step()` in hand, the Q-learning update from Unit 5 plugs in directly. The Q-table here is indexed by `(row, col)` state and one of 4 actions:

```python
def state_to_index(s):
    return s[0] * GRID_SIZE + s[1]

n_states = GRID_SIZE * GRID_SIZE
n_actions = 4
Q = np.zeros((n_states, n_actions))

alpha, gamma, epsilon = 0.1, 0.95, 0.2

def eps_greedy(state, epsilon):
    if np.random.random() < epsilon:
        return np.random.randint(n_actions)
    return int(np.argmax(Q[state_to_index(state)]))
```

## Training loop
```python
n_episodes = 3000
max_steps = 100

for ep in range(n_episodes):
    state = START
    epsilon = max(0.05, 0.3 * (1 - ep / n_episodes))   # decay exploration
    for t in range(max_steps):
        a = eps_greedy(state, epsilon)
        next_state, reward, done = step(state, a)
        s_idx, s2_idx = state_to_index(state), state_to_index(next_state)
        Q[s_idx, a] += alpha * (reward + gamma * np.max(Q[s2_idx]) - Q[s_idx, a])
        state = next_state
        if done:
            break
```

Decaying `epsilon` over training is a direct application of the exploration/exploitation trade-off from Unit 2: explore heavily while `Q` is still uninformed, then lean on the learned values as they become trustworthy. Watch what happens if you skip the decay and fix `epsilon = 0.2` for the whole run — the agent still learns, but convergence is visibly noisier because it never stops taking random detours.

## Evaluating and visualizing the learned policy
Once training finishes, extract the greedy policy and roll it out once with no exploration to check it actually reaches the goal, then print it as a grid so you can eyeball whether it routes around all three obstacles:

```python
symbols = {0: "^", 1: "v", 2: "<", 3: ">"}
state = START
path = [state]
for _ in range(max_steps):
    a = int(np.argmax(Q[state_to_index(state)]))
    state, _, done = step(state, a)
    path.append(state)
    if done:
        break
print("reached goal in", len(path) - 1, "steps:", path)

for r in range(GRID_SIZE):
    row = ""
    for c in range(GRID_SIZE):
        if (r, c) in OBSTACLES:
            row += " # "
        elif (r, c) == GOAL:
            row += " G "
        else:
            best_a = int(np.argmax(Q[state_to_index((r, c))]))
            row += f" {symbols[best_a]} "
    print(row)
```

If the printed path length is close to the Manhattan distance between `START` and `GOAL` (accounting for the detours the obstacles force), your agent has found something close to optimal. If it plateaus well above that, suspect too little training, `epsilon` decaying too fast, or `alpha` set too high for the update to settle.

## Try it yourself
Move one obstacle so that it fully blocks the shortest straight-line path from `START` to `GOAL`, forcing a detour, and retrain from scratch. Confirm the printed policy routes around it and the reported step count reflects the longer path. Then add a fourth obstacle of your own choosing and verify the agent still converges — this is the same maze-solving skill applied to a slightly harder instance of the identical MDP.
