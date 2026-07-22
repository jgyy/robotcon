# Using OpenAI with ROS — Unit 2: Exploring the OpenAI Structure: CartPole

CartPole is the "hello world" of `openai_ros`: a cart that slides on a rail with a pole hinged on top, simulated in Gazebo. This unit walks the full workflow end to end — simulation, `RobotEnv`, `TaskEnv`, registration, and a minimal training loop — so that by the end you can trace any call in `env.step()` back to the ROS message it produces.

## The CartPole simulation and its ROS interfaces

The Gazebo world spawns a cart-and-pole model with two joints: a prismatic (sliding) joint for the cart on its rail, and a revolute joint for the pole. Like any Gazebo robot, its state is published on `/joint_states` (position and velocity of both joints) and it's driven by publishing effort or velocity commands to a controller topic — typically something like `/cartpole_v0/foot_joint_velocity_controller/command`. Everything above this — Gym, the algorithm — never sees these topic names directly; they're encapsulated one layer down.

```bash
rostopic echo /joint_states       # watch cart position and pole angle live
rostopic list | grep cartpole     # find the exact controller command topic
```

## Robot environment: sensors and actuators

`CartPoleEnv(RobotGazeboEnv)` is where those topics get wrapped into Python. It subscribes to `/joint_states` in a callback that stores the latest message, exposes a `move_joints(action)` method that publishes to the controller topic, and implements `_check_all_systems_ready()` — a startup gate that blocks until the first message has arrived on every required topic, so training never starts against stale or empty sensor data.

```python
class CartPoleEnv(RobotGazeboEnv):
    def _joints_callback(self, msg):
        self.joints = msg

    def move_joints(self, effort):
        self._cmd_pub.publish(Float64(effort))

    def _check_all_systems_ready(self):
        self.joints = None
        while self.joints is None and not rospy.is_shutdown():
            self.joints = rospy.wait_for_message("/joint_states", JointState, timeout=5.0)
        return True
```

Notice there's no reward and no `done` anywhere in this class — it only knows how to read and drive the hardware.

## Task environment: rewards, resets, and episode termination

`CartPoleStayUpEnv(CartPoleEnv)` adds the RL problem. It defines `action_space` (typically `Discrete(2)`: push left / push right), `observation_space` (cart position, cart velocity, pole angle, pole angular velocity as a `Box`), and three methods every `TaskEnv` must implement:

```python
def _set_action(self, action):
    effort = self.pos_step if action == 1 else -self.pos_step
    self.move_joints(effort)

def _get_obs(self):
    return np.array([self.joints.position[0], self.joints.velocity[0],
                      self.joints.position[1], self.joints.velocity[1]])

def _is_done(self, observations):
    return abs(observations[2]) > self.max_pole_angle  # pole fell over

def _compute_reward(self, observations, done):
    return -1.0 if done else 1.0  # +1 per step survived, penalty on fall
```

`_set_init_pose()` (called on every `reset()`) puts the cart back at the center with the pole upright, which is what makes each episode start from a comparable state.

## Registering and running the environment

A small registration snippet ties the `TaskEnv` class to a Gym environment ID, which is what lets `gym.make()` find it:

```python
from gym.envs.registration import register

register(
    id="CartPoleStayUp-v0",
    entry_point="openai_ros.task_envs.cartpole_stay_up:CartPoleStayUpEnv",
    max_episode_steps=1000,
)
```

From here a training script is just a normal Gym loop — `env.reset()`, then repeated `env.step(action)` — with `roscore` and `gzserver` already running underneath it.

## Try it yourself

Write out (on paper or in a scratch file, doesn't need to run) the `register()` call and a `_compute_reward` variant that instead rewards the agent proportionally to how close the pole angle is to zero, rather than a flat +1/-1. Explain in one sentence why this denser reward might make training converge faster than the sparse version above.
