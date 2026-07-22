# Using OpenAI with ROS — Unit 5: Exploring the OpenAI Structure: RoboCube. Part 3

With the `RobotEnv` from Part 2 done, this unit adds the `TaskEnv` on top — turning "a cube whose disk I can spin" into an actual learning problem — and trains it with the tabular Qlearn algorithm you'll reuse (and later replace) throughout the rest of the course.

## Designing the Task Environment: obs, actions, reward

The task: keep the cube from tipping over past some angle while it balances on one edge. That gives you a natural, small design:

- **`action_space`**: `Discrete(3)` — spin the disk clockwise, counter-clockwise, or hold.
- **`observation_space`**: `Box` over `[roll_angle, roll_velocity, disk_velocity]`.
- **Reward**: alive bonus each step, large penalty on falling.

```python
def _set_action(self, action):
    speed = {0: -self.speed_step, 1: 0.0, 2: self.speed_step}[action]
    self.move_joints(speed)

def _get_obs(self):
    return np.array([self.get_cube_orientation(), self.get_roll_velocity(),
                      self.joints.velocity[0]])

def _is_done(self, obs):
    return abs(obs[0]) > self.max_tilt_angle

def _compute_reward(self, obs, done):
    return -200.0 if done else 1.0
```

## Discretizing continuous states for tabular Q-learning

Tabular Q-learning needs a *finite* number of states, but the observation above is continuous. The standard fix is binning: pick a small number of buckets per dimension and map each continuous reading to a bucket index, then combine the indices into one discrete state key.

```python
import numpy as np

BINS = [np.linspace(-0.3, 0.3, 10),   # roll_angle
        np.linspace(-2.0, 2.0, 10),   # roll_velocity
        np.linspace(-5.0, 5.0, 10)]   # disk_velocity

def discretize(obs):
    return tuple(int(np.digitize(v, b)) for v, b in zip(obs, BINS))
```

More bins gives finer-grained behavior but a bigger table to fill in, which means slower learning — this trade-off is the main reason Unit 7 eventually moves to a neural-network approximator instead of a table.

## The Qlearn algorithm loop

`qlearn.py` implements plain epsilon-greedy tabular Q-learning: with probability `epsilon`, act randomly (explore); otherwise pick the action with the highest known Q-value for the current state (exploit). After each step, the observed reward updates that state-action's Q-value toward the Bellman target.

```python
class QLearn:
    def __init__(self, actions, epsilon=0.1, alpha=0.2, gamma=0.9):
        self.q, self.actions = {}, actions
        self.epsilon, self.alpha, self.gamma = epsilon, alpha, gamma

    def choose_action(self, state):
        if np.random.random() < self.epsilon:
            return np.random.choice(self.actions)
        qs = [self.q.get((state, a), 0.0) for a in self.actions]
        return self.actions[int(np.argmax(qs))]

    def learn(self, state, action, reward, next_state):
        max_q_next = max(self.q.get((next_state, a), 0.0) for a in self.actions)
        old = self.q.get((state, action), 0.0)
        self.q[(state, action)] = old + self.alpha * (reward + self.gamma * max_q_next - old)
```

## Running and monitoring training

The training script ties it together: reset, discretize, choose, step, learn, repeat, for a fixed number of episodes — logging cumulative reward per episode is enough to see whether learning is working.

```python
qlearn = QLearn(actions=[0, 1, 2])
for episode in range(1000):
    state = discretize(env.reset())
    total_reward = 0
    for t in range(200):
        action = qlearn.choose_action(state)
        obs, reward, done, _ = env.step(action)
        next_state = discretize(obs)
        qlearn.learn(state, action, reward, next_state)
        state, total_reward = next_state, total_reward + reward
        if done:
            break
    print(f"episode {episode}: reward={total_reward}")
```

## Try it yourself

Reduce `BINS` above to 4 buckets per dimension instead of 10, and predict in one or two sentences how you'd expect training speed and final policy quality to change. If you have a running RoboCube setup, try it and compare the reward curve against the 10-bucket version.
