# FlexBe with ROS — Unit 3: Actionlib States and Autonomy Levels

Almost every real FlexBE state you write ends up calling a ROS action server — move a joint, navigate to a pose, close a gripper. This unit covers the standard pattern for that, plus the autonomy-level mechanism that lets a human decide how much to supervise each transition.

## Why actions, not services, for state work

Services are request/response and block until done — fine for quick queries, bad for anything that takes seconds or needs cancelling. Actions give you goal, feedback, and result, plus the ability to cancel a running goal. Long-running robot behaviors (navigation, manipulation, drone flight) are almost always exposed as actions, so FlexBE states built around `ProxyActionClient` are the workhorse of most behaviors.

## Building an Actionlib-based state

FlexBE provides `ProxyActionClient`, a wrapper that manages the action client lifecycle for you (connecting, sending goals, checking status) so your state code stays focused on *what* goal to send and *how* to interpret the result.

```python
from flexbe_core import EventState, Logger
from flexbe_core.proxy import ProxyActionClient
from control_msgs.msg import FollowJointTrajectoryAction, FollowJointTrajectoryGoal

class SendTrajectoryState(EventState):
    """
    Sends a joint trajectory goal to an action server.

    -- action_topic  string  Name of the FollowJointTrajectory action server.

    <= done       Trajectory executed successfully.
    <= failed     The action server reported failure.
    """

    def __init__(self, action_topic):
        super().__init__(outcomes=['done', 'failed'])
        self._topic = action_topic
        self._client = ProxyActionClient({self._topic: FollowJointTrajectoryAction})
        self._error = False

    def on_enter(self, userdata):
        goal = FollowJointTrajectoryGoal()
        # ... populate goal.trajectory here ...
        self._error = False
        try:
            self._client.send_goal(self._topic, goal)
        except Exception as e:
            Logger.logwarn('Failed to send trajectory goal: %s' % str(e))
            self._error = True

    def execute(self, userdata):
        if self._error:
            return 'failed'
        if self._client.has_result(self._topic):
            result = self._client.get_result(self._topic)
            return 'done' if result else 'failed'
        # still waiting — stay in this state
```

The pattern is consistent across every Actionlib state you'll write: send the goal in `on_enter()`, poll `has_result()` in `execute()`, and map the result onto your declared outcomes. Handling the "still waiting" case (return nothing) is what lets FlexBE keep ticking without blocking the whole behavior.

## Cancelling on preempt

A well-behaved state should stop the robot if the behavior is preempted (paused/stopped by the operator) while the action is in flight. Override `on_exit()`:

```python
    def on_exit(self, userdata):
        if not self._client.has_result(self._topic):
            self._client.cancel(self._topic)
            Logger.loginfo('Cancelled trajectory goal on exit')
```

## Autonomy levels

FlexBE defines a small set of autonomy levels (roughly: Full, High, Low, None) that govern how much operator confirmation is required before a transition fires. At low autonomy, the operator must manually approve every state transition from the OCS; at full autonomy, the behavior runs end to end without intervention. You set the required autonomy per-transition when wiring a behavior — for example, you might require operator confirmation before a `Grasp` state fires (in case the target pose looks wrong) but let routine transitions like `MoveToWaypoint → CheckArrival` run autonomously.

This is the mechanism that makes FlexBE genuinely useful for supervised autonomy: you get one state machine that can run fully autonomously during testing and be dialed down to a human-gated, step-by-step mode for a first deployment on real hardware, without maintaining two separate programs.

## Try it yourself

Take the `SendTrajectoryState` above and sketch (in comments, no need to run it) a second state, `SendNavGoalState`, that sends a `nav2_msgs`/`move_base`-style navigation goal and returns `'arrived'`, `'failed'`, or `'timeout'`. Then decide, and write down why, which of those three outcomes you'd gate behind a manual operator confirmation (low autonomy) versus let run automatically.
