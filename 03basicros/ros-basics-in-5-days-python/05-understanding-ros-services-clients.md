# ROS Basics in 5 Days (Python) — Unit 5: Understanding ROS Services - Clients

Not every interaction with a robot fits the "broadcast and forget" model of topics. Sometimes you need a direct question with a direct answer — that's what services are for. This unit covers the caller side: service clients.

## Topics vs. services vs. actions

These three mechanisms cover different shapes of interaction, and picking the right one is a design decision you'll make constantly:

| Mechanism | Pattern | Blocking? | Best for |
|---|---|---|---|
| Topic | many-to-many, pub/sub | No | Continuous streams (sensor data, velocity) |
| Service | one-to-one, request/response | Yes | Quick queries or commands with an immediate answer ("is the gripper open?", "reset the odometry") |
| Action | one-to-one, goal/feedback/result | No (async, but trackable) | Long-running tasks needing progress and cancellation ("navigate to this waypoint") |

A useful rule of thumb: if the answer takes milliseconds and you need it before continuing, use a service. If the data never really "finishes" (it's a live stream), use a topic. If the task takes seconds-to-minutes and you want to know how far along it is or might need to cancel it, use an action (covered in Units 8–9).

## Services overview

A ROS service is defined by two message types bundled together: a **request** and a **response**. A server node advertises the service under a name; any client node can call it, sending a request and receiving a response, exactly like an RPC (remote procedure call). Only one server can own a given service name at a time, which is different from topics where many publishers can coexist.

## Calling a service from the command line

Before writing any client code, you can call any running service directly, which is invaluable for testing a service server in isolation:

```bash
ros2 service list
ros2 service type /add_two_ints
ros2 interface show example_interfaces/srv/AddTwoInts
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 3, b: 5}"
```

That last command blocks until the server replies, then prints the response — exactly what a Python client does under the hood.

## Service clients and service messages

A `.srv` file (message definitions for services) is split into request and response by a `---` separator:

```
# example_interfaces/srv/AddTwoInts.srv
int64 a
int64 b
---
int64 sum
```

A minimal asynchronous client in Python:

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MinimalClient(Node):
    def __init__(self):
        super().__init__('minimal_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('service not available, waiting...')

    def send_request(self, a, b):
        req = AddTwoInts.Request()
        req.a = a
        req.b = b
        future = self.cli.call_async(req)
        rclpy.spin_until_future_complete(self, future)
        return future.result()

def main():
    rclpy.init()
    node = MinimalClient()
    result = node.send_request(3, 5)
    node.get_logger().info(f'Result: {result.sum}')
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

`call_async` never blocks the executor thread by itself — you're responsible for driving execution until the future resolves, here via `spin_until_future_complete`. This matters once a node has other callbacks (subscribers, timers) that also need to run; a naive blocking call would freeze the whole node.

## Try it yourself

Using `ros2 service call`, find a service exposed by any node currently running in your environment (or `example_interfaces/srv/AddTwoInts` against a demo server if nothing else is running), then write a Python client that calls it three times with different arguments and logs each response. Compare the wall-clock time of a service call to the ~instant nature of publishing a topic message — note that a service call always incurs a round trip.
