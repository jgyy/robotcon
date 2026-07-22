# Robot Fleet Management in ROS2 v2 — Unit 14: Custom rmf-panel-js

Unit 12 introduced `rmf-panel-js` as the default human touchpoint for RMF. This unit covers customizing it — adding your own task types and views to the operator dashboard rather than relying on the stock UI.

## What rmf-panel-js actually is

`rmf-panel-js` is a React web application that talks to RMF over `rosbridge` (a WebSocket-to-ROS-2 bridge), so a browser client can subscribe to topics like `/fleet_states` and publish to `/task_api_requests` without any native ROS 2 dependency in the browser itself. Understanding this bridge matters because it means customizing the panel is "ordinary React development plus a rosbridge client," not something requiring deep RMF internals knowledge.

## Getting rosbridge running

```bash
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

This exposes a WebSocket endpoint (default `ws://localhost:9090`) that the panel's frontend connects to for both subscribing to state topics and publishing task requests.

## Adding a custom task form

The stock panel ships forms for the default task types from Unit 10. To add a form for your custom task from Unit 8 (e.g., `inspect_shelf`), you add a new form component that builds the same JSON task-request structure and publishes it over the rosbridge connection:

```javascript
import ROSLIB from 'roslib';

function requestInspectShelf(ros, robotName, fleetName, shelfId) {
  const topic = new ROSLIB.Topic({
    ros,
    name: '/task_api_requests',
    messageType: 'std_msgs/String',
  });

  const request = {
    type: 'robot_task_request',
    robot: robotName,
    fleet: fleetName,
    request: {
      category: 'compose',
      description: {
        category: 'inspect_shelf',
        phases: [{
          activity: {
            category: 'perform_action',
            description: {
              category: 'inspect_shelf',
              description: { shelf_id: shelfId },
            },
          },
        }],
      },
    },
  };

  topic.publish(new ROSLIB.Message({ data: JSON.stringify(request) }));
}
```

This is the same JSON shape from Unit 8, just constructed in JavaScript and sent over rosbridge instead of a native ROS 2 client.

## Subscribing to live fleet state in the UI

```javascript
const fleetStateTopic = new ROSLIB.Topic({
  ros,
  name: '/fleet_states',
  messageType: 'rmf_fleet_msgs/FleetState',
});

fleetStateTopic.subscribe((message) => {
  updateDashboard(message.robots);
});
```

Bind this to whatever visualization component you want — a table of robots and battery levels, or markers on a floor-plan overlay — using ordinary React state management.

## Try it yourself

Add a new button to a local build of `rmf-panel-js` that calls a function like `requestInspectShelf` above with a hardcoded shelf ID, and confirm clicking it produces a task visible in `/task_summaries` when your backend from Unit 8 is running. This closes the loop: browser click, rosbridge, RMF task API, fleet adapter action.
