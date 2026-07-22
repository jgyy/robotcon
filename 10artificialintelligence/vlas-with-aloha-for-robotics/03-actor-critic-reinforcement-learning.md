# VLAs with ALOHA for robotics — Unit 3: Actor-Critic Reinforcement Learning

Where Unit 2 learned to copy a demonstrator, this unit learns from reward instead — the policy improves through its own trial and error, evaluated against a task objective rather than a fixed set of labeled examples. Actor-critic methods are the RL family most commonly paired with continuous-control robotics tasks like pick-and-place, and they'll give you a second lens (reward-driven, rather than imitation-driven) for the ALOHA work in Unit 4.

## Why actor-critic, and not plain policy gradient
A basic policy-gradient method (REINFORCE) updates the policy directly using the total return of a whole episode, but that return is extremely noisy — one lucky or unlucky trajectory swings the gradient estimate a lot, which makes training slow and unstable, especially with continuous action spaces like joint torques.

Actor-critic splits the job in two:

- **Actor** — the policy `pi(a|s)` that picks actions, exactly like the BC policy from Unit 2, except now it's updated to increase the probability of actions that led to higher-than-expected reward instead of just copying a demonstration.
- **Critic** — a separate value function `V(s)` (or `Q(s,a)`) trained to estimate expected future reward from a state. The critic's estimate replaces the noisy episode return as the training signal for the actor, which is what stabilizes learning.

## A minimal actor-critic loop for pick-and-place
Consider a pick-and-place task: reward is 0 at every timestep except +1 when the object is successfully placed in the target zone, and a small negative shaping term for excessive joint movement (encouraging smooth motion). The core update loop looks like this:

```python
import torch

def actor_critic_step(actor, critic, obs, action, reward, next_obs, done, gamma=0.99):
    value = critic(obs)
    next_value = critic(next_obs).detach() * (0 if done else 1)
    td_target = reward + gamma * next_value
    advantage = td_target - value

    critic_loss = advantage.pow(2).mean()

    log_prob = actor.log_prob(obs, action)
    actor_loss = -(log_prob * advantage.detach()).mean()

    return actor_loss, critic_loss
```

The `advantage` term — "was this action better or worse than the critic expected from this state?" — is the key idea: it tells the actor which actions to reinforce using a much lower-variance signal than raw episode return.

## Reward shaping for manipulation
Sparse rewards (only +1 on success) are simple to define but slow to learn from, because early in training the random policy almost never succeeds, so there's almost no learning signal. For pick-and-place specifically, common shaping terms include:

- Distance between gripper and object (decreasing distance = small positive reward)
- Whether the gripper has successfully grasped the object (a binary bonus)
- A penalty on joint velocity or jerk, to discourage jerky, unrealistic motion that wouldn't transfer to real hardware

Shaping speeds up learning but risks the classic RL failure mode of reward hacking — the policy finds a way to maximize shaped reward without actually solving the task (e.g. hovering near the object without grasping it, if the distance term dominates). Always validate against the true sparse success metric, not just shaped reward, when judging whether training has actually worked.

## Where this fits next to imitation learning
In practice, pure RL from scratch on a real robot is expensive (many trials, real wear, real time) and pure BC is limited by demonstration coverage. A common pattern — and part of the motivation for ACT in Unit 4 — is to warm-start a policy with BC on demonstrations, then optionally fine-tune with RL or additional imitation data. Understanding the actor-critic mechanics here will help you recognize this hybrid pattern when you see it in ALOHA-derived research.

## Try it yourself
Using the `actor_critic_step` skeleton above, write out (in comments or pseudocode) what `actor.log_prob(obs, action)` needs to compute for a continuous action space — specifically, what distribution you'd use for a policy that outputs continuous joint deltas, and why a Gaussian with a learned mean and standard deviation is a common choice.
