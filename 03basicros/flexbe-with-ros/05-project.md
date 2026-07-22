# FlexBe with ROS — Unit 5: Project

This unit ties together everything from Units 2-4 into a small, self-contained project: two FlexBE states that command a drone to take off and land, wired into a behavior and covered by unit tests.

## Project goal

Build:
1. A `TakeoffState` that sends a takeoff command to the drone and waits for it to reach a target altitude.
2. A `LandState` that sends a land command and waits for the drone to report it's on the ground.
3. A minimal behavior, `TakeoffAndLandBehavior`, that runs `TakeoffState` followed by `LandState`.
4. Unit tests for both states covering success and failure/timeout outcomes.

This mirrors real drone packages (e.g. MAVROS-based stacks expose `CommandTOL`-style services/actions for takeoff and landing), but the state logic below is written against a generic action interface so it applies regardless of which drone stack you're using.

## Designing the states

`TakeoffState` follows the Actionlib pattern from Unit 3: send the goal on enter, poll for completion, map the result to an outcome.

```python
from flexbe_core import EventState, Logger
from flexbe_core.proxy import ProxyActionClient
from drone_msgs.msg import TakeoffAction, TakeoffGoal  # stand-in interface name

class TakeoffState(EventState):
    """
    Commands the drone to take off to a target altitude.

    -- action_topic  string  Name of the takeoff action server.
    -- altitude      float   Target altitude in meters.

    <= done      Drone reached target altitude.
    <= failed    Takeoff action reported failure.
    """

    def __init__(self, action_topic, altitude):
        super().__init__(outcomes=['done', 'failed'])
        self._topic = action_topic
        self._altitude = altitude
        self._client = ProxyActionClient({self._topic: TakeoffAction})
        self._error = False

    def on_enter(self, userdata):
        goal = TakeoffGoal(target_altitude=self._altitude)
        self._error = False
        try:
            self._client.send_goal(self._topic, goal)
        except Exception as e:
            Logger.logwarn('Takeoff goal failed to send: %s' % str(e))
            self._error = True

    def execute(self, userdata):
        if self._error:
            return 'failed'
        if self._client.has_result(self._topic):
            result = self._client.get_result(self._topic)
            return 'done' if result.success else 'failed'

    def on_exit(self, userdata):
        if not self._client.has_result(self._topic):
            self._client.cancel(self._topic)
```

`LandState` is structurally identical (a `LandAction`/`LandGoal` pair, `'done'`/`'failed'` outcomes) — write it yourself as part of this project rather than copy-pasting, so the pattern sticks.

## Wiring the behavior

```python
from flexbe_core import StateMachine
from my_flexbe_states.takeoff_state import TakeoffState
from my_flexbe_states.land_state import LandState

sm = StateMachine(outcomes=['mission_complete', 'mission_failed'])
with sm:
    StateMachine.add('TAKEOFF', TakeoffState(action_topic='/drone/takeoff', altitude=2.0),
                      transitions={'done': 'LAND', 'failed': 'mission_failed'})
    StateMachine.add('LAND', LandState(action_topic='/drone/land'),
                      transitions={'done': 'mission_complete', 'failed': 'mission_failed'})
```

Every outcome from every state has a transition — there's no dangling path where the state machine would simply stop responding.

## Testing it

Using the mock pattern from Unit 4, write tests for `TakeoffState` that cover: goal succeeds (→ `'done'`), goal reports failure (→ `'failed'`), and goal send throws an exception (→ `'failed'`). Do the same for `LandState`. Together these give you confidence in the logic before ever powering on a drone — real or simulated.

## Bringing autonomy levels back in

As a final touch, decide the autonomy level for the `TAKEOFF → LAND` transition. Takeoff succeeding safely is exactly the kind of moment you might want a human to visually confirm ("yes, it's stably hovering, go ahead and land") before FlexBE proceeds — set that transition to require manual confirmation, as covered in Unit 3, rather than running fully autonomous.

## Try it yourself

Implement `LandState` from the description above, write its three unit tests (success, failure, send-exception), then extend the behavior with a third state, `HoverState`, inserted between takeoff and land, that holds position for a fixed duration before landing — reusing the `WaitForSecondsState` pattern from Unit 2 as a starting point.
