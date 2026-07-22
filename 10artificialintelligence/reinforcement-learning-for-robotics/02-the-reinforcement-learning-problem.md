# Reinforcement Learning for Robotics — Unit 2: The Reinforcement Learning Problem

This unit gives you the vocabulary the rest of the course runs on. You'll go from the simplest possible decision problem (a multi-armed bandit) to the full formalism (a Markov Decision Process) and the equation that ties value to reward (the Bellman equation).

## The multi-armed bandit problem
Imagine a row of slot machines ("one-armed bandits"), each with an unknown, fixed probability of paying out. You get a fixed number of pulls and want to maximize total payout. There is no notion of "state" here — pulling one arm doesn't change what any arm pays out next time — which makes the bandit the purest form of the **exploration vs. exploitation** trade-off: do you keep pulling the arm that has paid out best so far, or do you spend pulls testing arms you know less about?

```python
import numpy as np

true_probs = [0.2, 0.5, 0.75]          # unknown to the agent in practice
counts = np.zeros(3)
values = np.zeros(3)
epsilon = 0.1

def choose_arm():
    if np.random.random() < epsilon:
        return np.random.randint(3)     # explore
    return int(np.argmax(values))       # exploit

for pull in range(1000):
    arm = choose_arm()
    reward = 1.0 if np.random.random() < true_probs[arm] else 0.0
    counts[arm] += 1
    values[arm] += (reward - values[arm]) / counts[arm]   # incremental mean

print("estimated values:", values)
```

This `epsilon`-greedy strategy — mostly exploit, occasionally explore at random — reappears throughout the course for a reason: it's the simplest fix to a problem that never goes away, in bandits or in full MDPs.

## Markov Decision Processes
A bandit has no state; a robot's world does — where it is, what it's holding, what obstacles are nearby all change what happens next. The **Markov Decision Process (MDP)** is the standard formalism for sequential decision problems, defined by a tuple `(S, A, P, R, γ)`:
- `S` — the set of possible states.
- `A` — the set of possible actions.
- `P(s'|s, a)` — transition dynamics: probability of landing in state `s'` after taking action `a` in state `s`.
- `R(s, a, s')` — the reward received for that transition.
- `γ` — the discount factor in `[0, 1)`, controlling how much future reward is worth relative to immediate reward.

The **Markov property** — that `s'` depends only on `(s, a)`, not on the full history — is an assumption, not a guarantee. If you strip too much information out of your state (say, a robot's position without its velocity), the process stops being Markovian in practice and every algorithm downstream gets noticeably harder to train.

## State-Value and Action-Value functions
An agent's behavior is its **policy** `π`, a mapping from states to actions (or to a probability distribution over actions). To compare policies, you need to know how good a state — or a state-action pair — is under that policy:
- **State-value function**: `V^π(s) = E_π[G_t | S_t = s]` — expected discounted return starting in state `s` and following `π` thereafter.
- **Action-value function**: `Q^π(s, a) = E_π[G_t | S_t = s, A_t = a]` — expected discounted return starting in `s`, taking action `a`, then following `π`.

where the return `G_t = R_{t+1} + γR_{t+2} + γ²R_{t+3} + ...` is the discounted sum of all future reward from time `t` onward.

## The Bellman equation
Computing `G_t` by simulating all the way to the end of an episode is expensive and often impossible (episodes can be infinite). The **Bellman equation** avoids that by expressing value recursively — the value of a state equals the immediate reward plus the discounted value of wherever you land next:

```
V^π(s) = Σ_a π(a|s) Σ_{s'} P(s'|s,a) [ R(s,a,s') + γ V^π(s') ]
Q^π(s,a) = Σ_{s'} P(s'|s,a) [ R(s,a,s') + γ Σ_{a'} π(a'|s') Q^π(s',a') ]
```

Every algorithm in Units 3–5 is, at its core, a different strategy for solving or approximating this equation: dynamic programming solves it directly using a known model, Monte Carlo estimates it by averaging sampled full-episode returns, and temporal-difference methods estimate it by bootstrapping off the very next step. Learning to recognize the Bellman equation inside each algorithm is the single most useful skill this course teaches.

## Try it yourself
Extend the bandit code above to a 5-armed bandit with hidden probabilities `[0.1, 0.3, 0.3, 0.6, 0.55]`, and run it three times with `epsilon = 0.0`, `epsilon = 0.1`, and `epsilon = 0.5`. Record the final estimated value for the best arm (index 3) in each run, and explain in a sentence why `epsilon = 0.0` produces the least reliable estimate even though it earns the highest average reward *during* the run.
