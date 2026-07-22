# Reinforcement Learning for Robotics — Unit 3: Dynamic Programming

Dynamic programming (DP) is what you use when you have a complete, known model of the environment — the transition probabilities `P(s'|s,a)` and reward function `R(s,a,s')` from Unit 2 are fully known in advance. That's rarely true for a real robot, but DP is still worth mastering first: it computes the *exact* solution to an MDP, giving you a ground truth to check the approximate, model-free methods of Units 4 and 5 against.

## Why DP applies to MDPs
DP solves problems by breaking them into overlapping subproblems and reusing solutions — and the Bellman equation from Unit 2 is exactly that kind of recursive decomposition: the value of a state is defined in terms of the values of its successor states. Because the state space of a robot's MDP is typically finite (a grid, a discretized configuration space, a set of task modes), you can represent `V(s)` or `Q(s,a)` as a table and update every entry using the values already sitting in the rest of the table.

## Policy evaluation
Given a fixed policy `π`, **policy evaluation** computes `V^π(s)` for every state by repeatedly applying the Bellman equation as an update rule until the values stop changing:

```python
import numpy as np

def policy_evaluation(P, R, policy, gamma=0.9, theta=1e-6):
    n_states = len(policy)
    V = np.zeros(n_states)
    while True:
        delta = 0.0
        for s in range(n_states):
            a = policy[s]
            v_new = sum(
                P[s][a][s2] * (R[s][a][s2] + gamma * V[s2])
                for s2 in range(n_states)
            )
            delta = max(delta, abs(v_new - V[s]))
            V[s] = v_new
        if delta < theta:
            break
    return V
```

This is the Bellman equation used as an *update*, applied over and over (a fixed-point iteration) rather than solved in one shot — it provably converges to the true `V^π` as long as `gamma < 1`.

## Policy iteration
Policy evaluation only tells you how good a *fixed* policy is. **Policy iteration** alternates two steps until the policy stops changing:
1. **Evaluate** the current policy (as above) to get `V^π`.
2. **Improve** the policy by making it greedy with respect to `V^π`: for every state, pick the action that maximizes `Σ_{s'} P(s'|s,a)[R(s,a,s') + γV(s')]`.

Each improvement step is guaranteed to produce a policy at least as good as the previous one (the **policy improvement theorem**), and because there are finitely many deterministic policies, this process is guaranteed to converge to the optimal policy `π*` in finitely many iterations.

## Value iteration
Policy iteration does a full evaluation pass to convergence before every single improvement step, which is wasteful. **Value iteration** collapses evaluation and improvement into one update — instead of averaging over the policy's chosen action, take the max over all actions directly:

```python
def value_iteration(P, R, n_states, n_actions, gamma=0.9, theta=1e-6):
    V = np.zeros(n_states)
    while True:
        delta = 0.0
        for s in range(n_states):
            q_values = [
                sum(P[s][a][s2] * (R[s][a][s2] + gamma * V[s2]) for s2 in range(n_states))
                for a in range(n_actions)
            ]
            v_new = max(q_values)
            delta = max(delta, abs(v_new - V[s]))
            V[s] = v_new
        if delta < theta:
            break
    policy = [np.argmax([
        sum(P[s][a][s2] * (R[s][a][s2] + gamma * V[s2]) for s2 in range(n_states))
        for a in range(n_actions)
    ]) for s in range(n_states)]
    return V, policy
```

Value iteration converges to the same optimal `V*` and `π*` as policy iteration but usually needs fewer total sweeps, at the cost of each sweep doing a max over all actions rather than following one fixed action.

## Try it yourself
Build a tiny 4-state MDP by hand (write out `P` and `R` as nested Python lists or dicts for a 1D corridor: states `0-1-2-3`, actions `left`/`right`, `+1` reward for reaching state 3, `0` otherwise) and run both `policy_evaluation` under the always-move-right policy and `value_iteration` on it. Confirm the two give the same `V(s)` for every state — if they don't, the bug is almost always an off-by-one in how you index terminal states.
