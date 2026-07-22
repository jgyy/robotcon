# ROS Basics in 5 Days (Python) — Unit 6: Understanding ROS Services - Server

You've called services from the client side; now you'll build the side that actually does the work — the service server — and define your own custom service message when the standard ones don't fit.

## The service server

A service server registers a callback under a service name and type; every time a client's request arrives, ROS invokes that callback with the request and expects a filled-in response object returned from it. Unlike a subscriber callback (which returns nothing), a service callback's return value *is* the reply sent back to the waiting client — get this wrong (return `None`, or the wrong type) and the client's call will hang or error out.

```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(
            AddTwoInts, 'add_two_ints', self.add_callback)

    def add_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(f'{request.a} + {request.b} = {response.sum}')
        return response

def main():
    rclpy.init()
    node = MinimalService()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

Run this alongside the client from Unit 5 and the CLI `ros2 service call` — both work identically against it, because both are just ROS clients calling a named, typed service; the server has no idea (or care) which one is asking.

## Custom service messages

Just like custom topic messages, you define a `.srv` file in a `srv/` directory when the built-in types don't match your domain. A service to toggle a robot's LED and get back a confirmation and current battery level might look like:

```
# my_robot_msgs/srv/SetLed.srv
bool turn_on
---
bool success
float64 battery_percent
```

After building, this is usable exactly like `AddTwoInts`:

```python
from my_robot_msgs.srv import SetLed

class LedService(Node):
    def __init__(self):
        super().__init__('led_service')
        self.srv = self.create_service(SetLed, 'set_led', self.set_led_callback)
        self.led_on = False

    def set_led_callback(self, request, response):
        self.led_on = request.turn_on
        response.success = True
        response.battery_percent = 76.0  # stand-in for a real reading
        return response
```

A design habit worth building now: keep service callbacks *fast*. Because a client blocks (or waits on a future) for the response, a service callback that does anything slow — reading a file, waiting on hardware, sleeping — makes every caller of that service wait too. If a task genuinely takes a while and callers need progress updates, that's a strong signal you actually want an action (Units 8–9), not a service.

## Try it yourself

Implement the `SetLed` server above as a real node, and write a small client script that calls it twice: once with `turn_on: true`, once with `turn_on: false`, printing the `success` and `battery_percent` fields each time. Then, as a design exercise (no code needed), write one sentence explaining why toggling an LED is a good fit for a service rather than a topic or an action.
