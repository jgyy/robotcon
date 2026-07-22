# Using OpenAI with ROS — Unit 9: Training a Fetch Robot. Part 1

Fetch is the most complex robot in this course: a mobile-manipulator arm with a gripper, versus CartPole and RoboCube's single actuated joint. This unit builds the `RobotEnv` layer for Fetch — reading its arm state and driving it — while Unit 10 adds the goal-conditioned `TaskEnv` on top.

## Fetch robot's actuators and sensors in Gazebo

Fetch's arm has seven joints plus a two-finger gripper, all reporting through the same `/joint_states` topic pattern you've seen since CartPole — just with many more entries in the `name`/`position`/`velocity` arrays. Rather than reading raw joint angles as the observation (as CartPole and RoboCube did), Fetch tasks are usually framed around the *end-effector's Cartesian pose* — where the gripper is in 3D space — since that's what actually matters for a reaching or grasping task, and it stays low-dimensional (a 3-vector position, optionally plus orientation) regardless of how many joints the arm has.

## Reading arm joint states and end-effector pose

Joint state reading is identical in shape to earlier units:

```python
def _joints_cb(self, msg):
    self.joints = msg
```

Getting the end-effector *pose*, though, means either running forward kinematics yourself from the joint angles, or — far more commonly — asking `tf2` for the transform between a fixed frame (e.g. `base_link`) and the gripper frame (e.g. `gripper_link`), which ROS keeps continuously updated from the robot's joint states and URDF:

```python
import tf2_ros

def get_ee_position(self):
    trans = self.tf_buffer.lookup_transform(
        "base_link", "gripper_link", rospy.Time(0), rospy.Duration(1.0))
    t = trans.transform.translation
    return np.array([t.x, t.y, t.z])
```

## Commanding the arm: joint trajectory vs Cartesian control

There are two common ways to command a 7-DOF arm, and the choice affects how you design `move_arm()`:

- **Joint trajectory control** — publish target joint angles/velocities directly (via a `JointTrajectory` message to a trajectory controller, or per-joint effort/velocity controllers as in earlier units). Simple to wire up, but the RL agent has to implicitly learn inverse kinematics — mapping "I want the gripper 5cm to the left" into seven joint deltas — from scratch.
- **Cartesian / MoveIt-mediated control** — send a target end-effector pose and let MoveIt (or a simpler IK service) solve for the joint motion. This shrinks the action space the agent has to learn over (3 or 6 numbers instead of 7 joint deltas) at the cost of relying on a planner underneath, which adds latency and can occasionally fail to find a plan.

For RL specifically, action-space size matters a lot for sample efficiency, so most `openai_ros` Fetch tasks lean toward exposing a small Cartesian-delta action space even when the underlying command ends up being resolved into joint motion.

```python
def move_ee(self, delta_xyz):
    target = self.get_ee_position() + delta_xyz
    self._ik_client(target)  # wraps a MoveIt or custom IK service call
```

## Implementing FetchEnv (RobotEnv layer)

Putting the pieces together, `FetchEnv(RobotGazeboEnv)` exposes exactly the same shape of interface as `CartPoleEnv` and `MyCubeSingleDiskEnv` did — sensor callbacks, a `_check_all_systems_ready()` gate, and thin actuator methods — just with `get_ee_position()` and `move_ee()` in place of the single-joint equivalents:

```python
class FetchEnv(RobotGazeboEnv):
    def __init__(self):
        super().__init__(robot_name_space="fetch", controllers_list=[...])
        rospy.Subscriber("/joint_states", JointState, self._joints_cb)
        self.tf_buffer = tf2_ros.Buffer()
        tf2_ros.TransformListener(self.tf_buffer)
        self.joints = None
        self._check_all_systems_ready()
```

No reward, no goal, no notion of "reached the target" appears anywhere in this file — exactly as with every `RobotEnv` before it.

## Try it yourself

Write a `get_gripper_state()` method stub that returns whether the gripper is open or closed, based on the finger joint positions in `/joint_states`. Decide, and justify in a sentence, whether this belongs in `FetchEnv` (robot layer) or the `TaskEnv` you'll build in Unit 10 — use the same "does this need to know about the task's goal" test you've been applying since Unit 3.
