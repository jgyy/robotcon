# ROS2 Basics in 5 Days (Python) — Unit 5: Callbacks in ROS 2

Every subscriber, service handler, timer, and action goal you've written so far has been a callback. This unit steps back to explain the execution model behind them — why ROS 2 is callback-driven and what actually causes a callback to run — so multithreading (Unit 6) makes sense afterward.

## Functions vs. callbacks
A regular function is something *you* call, at a point in your code you choose. A callback is a function you *register* with some other system, which calls it for you when a condition is met — a message arrives, a timer fires, a service request comes in. You already write callbacks in most event-driven code (GUI handlers, `asyncio` coroutine callbacks, HTTP route handlers); ROS 2's model is the same idea applied to robot events. The key mental shift: you don't write "wait for a message, then process it" — you write "when a message arrives, do this," and hand control to the ROS 2 executor.

## Callback functions in ROS 2
Every `create_subscription`, `create_service`, and `create_timer` call takes a callback as an argument:
```python
self.create_subscription(LaserScan, '/scan', self.on_scan, 10)   # callback: self.on_scan
self.create_timer(1.0, self.on_tick)                              # callback: self.on_tick
```
These callbacks are not run immediately or on their own thread by default — they're queued and dispatched by an **executor** when you call `rclpy.spin(node)`. `spin()` is a blocking loop: it waits for something to become ready (a message, a timer expiring, a service request) and invokes the matching callback, one at a time, on the same thread, by default.

## Hands-on practice
Put this together in a node that reacts to sensor data and issues a command — the classic "if X, do Y" pattern:
```python
class PlantDetector(Node):
    def __init__(self):
        super().__init__('plant_detector')
        self.create_subscription(Image, '/camera/image', self.on_image, 10)
        self.alert_pub = self.create_publisher(Bool, '/plant_detected', 10)

    def on_image(self, msg):
        detected = self.run_detection(msg)   # your logic here
        self.alert_pub.publish(Bool(data=detected))
```
Because `on_image` runs inside `spin()`'s single dispatch loop, any expensive work here (heavy image processing) delays every *other* callback on this node — including timers and other subscriptions. This is the exact problem Unit 6 (Multithreading) exists to solve.

## Spin once
`rclpy.spin(node)` runs forever. `rclpy.spin_once(node, timeout_sec=...)` processes at most one ready callback (or waits up to the timeout and returns if nothing is ready) and then returns control to you. This is useful for: writing test/demo scripts where you want manual control of the event loop, polling for a service response without a full executor, or integrating ROS 2 into an existing non-ROS main loop that can't hand over control indefinitely.
```python
while rclpy.ok():
    rclpy.spin_once(node, timeout_sec=0.1)
    # do other, non-ROS work here between callbacks
```

## Try it yourself
Modify the counter subscriber from Unit 3 so it uses `spin_once` in an explicit `while rclpy.ok()` loop instead of `spin`, and add a `print` statement right after each `spin_once` call. Run it and observe that your print statement interleaves with the callback's log output — this makes the "callback vs. your own loop" distinction concrete.
