# Intermediate ROS2 — Unit 6: Managing Complex Nodes

A node with one timer callback never has to think about concurrency. A node with a timer, two subscriptions, and a service — all of which might take meaningful time — does, because by default ROS 2's single-threaded executor runs every one of those callbacks on the same thread, one at a time. This unit covers what that default actually does, when it breaks down, and the tools (multithreaded executors, callback groups) for fixing it.

## The default: single-threaded executor

`rclpy.spin(node)` runs a `SingleThreadedExecutor` under the hood: a loop that picks up ready callbacks (timers, subscriptions, services, actions) and runs them one at a time, in whatever order they become ready. This is fine as long as every callback is fast. The moment one callback blocks — a slow computation, a blocking I/O call, a service call waiting on another node's response — every other callback on that node stalls too, including ones with nothing to do with the slow one.

```python
def slow_callback(self, msg):
    time.sleep(2.0)  # blocks the ENTIRE node, not just this callback
```

This is the single most common cause of "my ROS 2 node stopped responding" bugs, and it's worth deliberately reproducing once so you recognize it instantly later.

## Multithreaded executors

`MultiThreadedExecutor` runs callbacks across a thread pool instead of one thread, so a slow callback no longer blocks unrelated ones by default:

```python
from rclpy.executors import MultiThreadedExecutor

rclpy.init()
node = Counter()
executor = MultiThreadedExecutor(num_threads=4)
executor.add_node(node)
executor.spin()
```

This alone doesn't make your code thread-safe — if two callbacks touch the same instance attribute, you now need a lock around it, the same as in any multithreaded program. What it buys you is *isolation*: one callback being slow no longer starves the others.

## Callback groups: controlling what can run concurrently

A multithreaded executor still won't run two callbacks from the same **mutually exclusive callback group** concurrently — and by default, every callback on a node belongs to one implicit mutually exclusive group, so simply switching executors doesn't parallelize anything until you explicitly assign callbacks to groups.

```python
from rclpy.callback_groups import MutuallyExclusiveCallbackGroup, ReentrantCallbackGroup

fast_group = MutuallyExclusiveCallbackGroup()
slow_group = MutuallyExclusiveCallbackGroup()

self.create_subscription(Int32, 'fast_topic', self.fast_cb, 10, callback_group=fast_group)
self.create_subscription(Int32, 'slow_topic', self.slow_cb, 10, callback_group=slow_group)
```

Two callbacks in *different* mutually exclusive groups can run concurrently; two callbacks in the *same* group never do, which is exactly what you want for callbacks that share state and mustn't interleave. A `ReentrantCallbackGroup` allows even the same callback to run multiple overlapping instances of itself concurrently — rarely what you want, but essential for one specific case: a service callback that needs to call another service and wait for the result without deadlocking the executor.

## The classic deadlock: calling a service from a callback

Calling a service synchronously from inside a node's own callback, on a single-threaded (or single-group) executor, deadlocks: the call blocks waiting for a response, but the response can only be processed by the same executor thread that's currently blocked waiting for it.

```python
# Deadlocks on a single-threaded executor:
def my_callback(self, msg):
    future = self.client.call_async(request)
    rclpy.spin_until_future_complete(self.node, future)  # never returns
```

The fix is either a `MultiThreadedExecutor` with the calling callback in its own (reentrant, or simply separate) group, or restructuring to use the async future without blocking — attaching a `done_callback` instead of spinning for it inline.

## Try it yourself

Build a node with two subscriptions: one that just logs immediately, and one whose callback does `time.sleep(1.0)` to simulate slow work. Run it under `rclpy.spin` (single-threaded) and publish rapidly to both topics — observe the fast one getting delayed. Then switch to `MultiThreadedExecutor` with each subscription in its own callback group and confirm the fast topic is no longer held up by the slow one.
