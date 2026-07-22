# Developing Web Interfaces for ROS 2 — Unit 6: Calling ROS Services from the Web

Topics are fire-and-forget; this unit covers the request/response pattern — calling a ROS service from the page and doing something with the answer once it comes back.

## Services vs. topics, from the browser's side
A topic publish or subscribe is a one-way stream with no reply. A service call is a single request that expects exactly one response, which makes it the right tool for "ask a question, get an answer right now" interactions — reading a battery percentage on demand, triggering a one-shot recalibration, toggling a mode. Because a service call is asynchronous over the WebSocket (the response arrives as a separate message some time after the request), you handle it with a callback or a Promise, never as a synchronous return value.

## Calling a service with roslibjs
`ROSLIB.Service` mirrors `ROSLIB.Topic`'s shape: describe the service name and type, then call it with a request object and a callback for the response.

```javascript
const getBattery = new ROSLIB.Service({
  ros: ros,
  name: '/get_battery_level',
  serviceType: 'my_robot_interfaces/srv/GetBatteryLevel'
});

const request = new ROSLIB.ServiceRequest({});   // empty request, no fields needed

getBattery.callService(request, (result) => {
  console.log('Battery level:', result.battery_level);
}, (error) => {
  console.error('Service call failed:', error);
});
```

Always pass the error callback (the third argument). Unlike topics, a failed or unavailable service gives you no other signal that anything went wrong — without it, a missing service just silently never calls back.

## Worked example
Putting it into a small UI: a button that calls the service and writes the result into the page, with a loading state so the user knows the request is in flight.

```javascript
document.getElementById('checkBattery').addEventListener('click', () => {
  const label = document.getElementById('batteryLabel');
  label.textContent = 'Checking...';
  getBattery.callService(new ROSLIB.ServiceRequest({}), (result) => {
    label.textContent = `Battery: ${result.battery_level}%`;
  }, (error) => {
    label.textContent = 'Error reading battery';
    console.error(error);
  });
});
```

If you need to call a service you don't have the interface for handy, `ros2 interface show <package>/srv/<Name>` shows you the request/response field layout, exactly like it does for messages.

## Try it yourself
Add a "Get Battery Level" button to your dashboard that calls a battery-status service and displays the result, including a visible error state if the service isn't reachable (test this by stopping the service node while the page is open, and confirm your error callback fires instead of the page hanging silently).
