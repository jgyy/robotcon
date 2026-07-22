# Developing Web Interfaces for ROS — Unit 12: Using ROS Action Servers from the web

Services (Unit 8) are for quick request/response calls. Actions are for anything long-running and cancelable — navigating to a goal, executing a manipulation trajectory — and they add two things services don't have: ongoing feedback while the task runs, and the ability to cancel mid-execution. This unit covers `ROSLIB.ActionClient` and `ROSLIB.Goal`.

## The three-phase action lifecycle
Every action interaction has the same shape: send a goal, receive periodic feedback while it executes, and eventually receive a result (or a cancellation acknowledgment). roslibjs models this with two cooperating classes — a client tied to the action's name/type, and a goal object you send and attach listeners to.

```javascript
const navClient = new ROSLIB.ActionClient({
  ros: ros,
  serverName: '/navigate_to_pose',
  actionName: 'nav2_msgs/action/NavigateToPose'
});

const goal = new ROSLIB.Goal({
  actionClient: navClient,
  goalMessage: {
    pose: {
      header: { frame_id: 'map' },
      pose: { position: { x: 2.0, y: 1.0, z: 0 }, orientation: { w: 1.0 } }
    }
  }
});
```

## Listening to feedback, result, and status
Attach handlers before sending, so you don't miss early feedback:

```javascript
goal.on('feedback', (feedback) => {
  distanceRemainingEl.textContent = feedback.distance_remaining?.toFixed(2) ?? '—';
});

goal.on('result', (result) => {
  statusEl.textContent = 'Navigation complete.';
});

goal.on('timeout', () => {
  statusEl.textContent = 'Goal timed out — no server response.';
});

goal.send();
statusEl.textContent = 'Navigating...';
```

The exact feedback and result fields depend entirely on the action definition (`NavigateToPose`, a custom manipulation action, etc.) — check it the same way you'd check a service:

```bash
ros2 interface show nav2_msgs/action/NavigateToPose
```

## Cancelling a goal
This is the capability that makes actions worth the extra complexity over a service — a running task can be aborted cleanly from the UI, which every teleoperation or task-execution dashboard needs (an "abort" or "cancel" button is not optional for anything that moves a robot for an extended period).

```javascript
cancelBtn.addEventListener('click', () => {
  goal.cancel();
  statusEl.textContent = 'Cancel requested...';
});
```

## Discovering available actions
Same discovery habit as services — confirm the name and type before wiring the UI:

```bash
ros2 action list                              # ROS 2
ros2 action info /navigate_to_pose
ros2 action send_goal /navigate_to_pose nav2_msgs/action/NavigateToPose "{...}"  # manual test
```

(ROS 1's `actionlib` predates the modern `ros2 action` CLI but roslibjs's `ActionClient`/`Goal` API works against either, since it speaks the rosbridge protocol rather than the native transport directly.)

## Try it yourself
Wire a "Send goal" / "Cancel" pair of buttons to a long-running action available in your setup (navigation is ideal if you have Nav2 running in simulation; otherwise any custom action with visible feedback works). Display live feedback in the page while the goal executes, and confirm clicking "Cancel" partway through actually stops the robot/task, not just the UI's display of it.
