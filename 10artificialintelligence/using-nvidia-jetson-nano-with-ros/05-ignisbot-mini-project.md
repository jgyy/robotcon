# Using NVIDIA Jetson Nano with ROS — Unit 5: Ignisbot Mini Project

This closing unit is integration work, not new material: you combine the driver (Unit 2), collision avoidance (Unit 3), and people follower (Unit 4) into one coherent Ignisbot that searches for a person, follows them, and won't run into things while doing it.

## Defining the behavior as a small state machine

Rather than one tangled node, think of Ignisbot's mission as a handful of states with clear transitions:

- **Search** — no person detected; rotate slowly (or patrol) looking for one.
- **Follow** — person detected; the Unit 4 follower controller is active.
- **Avoid** — the Unit 3 collision classifier reports `blocked`; override whatever else is happening and stop/back off, regardless of state.

```python
from enum import Enum, auto

class State(Enum):
    SEARCH = auto()
    FOLLOW = auto()
    AVOID = auto()

def next_state(current: State, person_detected: bool, blocked: bool) -> State:
    if blocked:
        return State.AVOID
    if person_detected:
        return State.FOLLOW
    return State.SEARCH
```

Note the priority order: `blocked` wins over everything, because "don't hit the wall" should never lose to "keep following the person."

## Arbitrating multiple sources of cmd_vel

Both `PersonFollower` and a collision-avoidance behavior want to publish velocity commands, but only one should reach the motors at a time. The cleanest fix is to have each behavior publish to its own topic (`cmd_vel_follow`, `cmd_vel_avoid`) and add a small mux/arbiter node that picks one based on the current state, publishing the result to the single `cmd_vel` the Unit 2 driver actually listens to:

```python
class BehaviorArbiter(Node):
    def __init__(self):
        super().__init__('behavior_arbiter')
        self.state = State.SEARCH
        self.create_subscription(PersonDetection, 'person_detection', self.on_detection, 10)
        self.create_subscription(Bool, 'blocked', self.on_blocked, 10)
        self.create_subscription(Twist, 'cmd_vel_follow', self.on_follow_cmd, 10)
        self.pub = self.create_publisher(Twist, 'cmd_vel', 10)
        self._blocked = False
        self._detected = False

    def on_blocked(self, msg: Bool):
        self._blocked = msg.data
        self.state = next_state(self.state, self._detected, self._blocked)

    def on_detection(self, msg: PersonDetection):
        self._detected = msg.detected
        self.state = next_state(self.state, self._detected, self._blocked)

    def on_follow_cmd(self, msg: Twist):
        if self.state == State.FOLLOW:
            self.pub.publish(msg)
        elif self.state == State.AVOID:
            self.pub.publish(Twist())  # stop
        # SEARCH handled by its own timer/publisher, omitted for brevity
```

## Test in simulation before the physical robot

Bring up the full graph — driver, detector, collision classifier, follower, arbiter — against a simulated Ignisbot first. It's far cheaper to debug a state machine oscillating between FOLLOW and AVOID in simulation than to watch a real robot do it into a wall. Once behavior looks correct there, move to the physical robot with power mode set to max performance (`sudo nvpmodel -m 0`) and re-check the achieved detector/classifier rate on real hardware, since simulated timing rarely matches the Nano's actual GPU throughput.

## Debugging the integrated system

When the full pipeline misbehaves, isolate a layer at a time rather than staring at the robot:

```bash
ros2 run rqt_graph rqt_graph          # confirm every node/topic connection you expect exists
ros2 topic hz person_detection        # is perception actually keeping up?
ros2 topic hz blocked
ros2 topic echo /cmd_vel              # what is actually being commanded, and by whom?
```

A common failure mode is a detector/classifier running too slowly to matter — by the time a `blocked` message arrives, the robot's already stopped naturally or already hit the obstacle. If `ros2 topic hz` shows a much lower rate than you benchmarked in Unit 3, revisit your TensorRT conversion before touching the behavior logic.

## Try it yourself

Wire up the full graph described here (driver, detector, collision classifier, follower, arbiter) and run Ignisbot through a scripted scenario: start in an empty room (SEARCH), have a person walk in (transition to FOLLOW), and place an obstacle in its path while following (transition to AVOID, then back to FOLLOW once clear). Capture the `ros2 topic echo` output of the arbiter's state changes as evidence the transitions happened in the right order.
