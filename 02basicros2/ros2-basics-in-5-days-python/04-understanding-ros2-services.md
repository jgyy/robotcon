# ROS2 Basics in 5 Days (Python) — Unit 4: Understanding ROS2 Services

Where topics are a continuous, fire-and-forget stream, services are ROS 2's request/response mechanism — the equivalent of a synchronous RPC call. This unit covers when to reach for a service instead of a topic, and how to build both sides of one.

## What is a service in ROS 2?
A service is a one-shot call: a client sends a request, a server processes it and sends back exactly one response, then the exchange is over. Unlike a topic, there's no ongoing stream and no fan-out to multiple listeners in the same interaction — it's point-to-point and stateless per call. Use a service when you need an answer *right now* to act on (e.g. "is the gripper currently holding something?", "recompute this once") — use a topic when you're describing an ongoing state or event stream. Services are defined with `.srv` files, which split a request and response into two message blocks separated by `---`.

## Service Server
A server node registers a callback that receives the request and must return a populated response:
```python
from example_interfaces.srv import AddTwoInts

class AddServer(Node):
    def __init__(self):
        super().__init__('add_server')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.handle_add)

    def handle_add(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'{request.a} + {request.b} = {response.sum}')
        return response
```
You can inspect and call it from the CLI without any client code:
```bash
ros2 service list
ros2 service type /add_two_ints
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 2, b: 3}"
```

## Service Client
A client node builds a request object, sends it, and waits for the response:
```python
class AddClient(Node):
    def __init__(self):
        super().__init__('add_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('waiting for service...')

    def send_request(self, a, b):
        req = AddTwoInts.Request()
        req.a, req.b = a, b
        return self.cli.call_async(req)
```
`wait_for_service` blocks (with a timeout you control) until the server is discoverable — a common source of "my client hangs forever" bugs is calling a service that was never started.

## Synchronous vs. asynchronous clients
`call_async()` returns a `Future` immediately without blocking the node's executor — this is the pattern you should default to, because it lets `rclpy.spin()` keep processing other callbacks (timers, subscriptions) while the request is in flight. A synchronous-looking `call()` exists in some client APIs but effectively blocks the whole node, which will deadlock if the server it's calling lives in the same node/executor. In practice: send the request async, then either `rclpy.spin_until_future_complete(node, future)` in a simple script, or check `future.done()` from within another callback.

## Custom service interface
Define your own `.srv` file, e.g. `srv/SetSpeed.srv`:
```
float32 target_speed
---
bool accepted
string message
```
Wire it up in `package.xml`/`setup.py` the same way as a custom message (Unit 3), rebuild, and the request/response classes become importable.

## Using a custom service interface
```python
from my_robot_pkg.srv import SetSpeed
self.srv = self.create_service(SetSpeed, 'set_speed', self.handle_set_speed)
```

## Try it yourself
Build a service `reset_counter` (using a custom `.srv` with an empty request and an `int32 previous_value` response) that resets an internal counter in a server node back to zero and reports what it was before the reset. Call it from the CLI with `ros2 service call`, then write a small async client that calls it and logs the response.
