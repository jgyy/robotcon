# Advanced Modern C++ for Robotics — Unit 7: Concurrency (threads in C++)

A real robot is inherently concurrent: sensor drivers stream data, control loops run at fixed rates, and planners think in the background — all at once. This unit covers `std::thread` and friends so you can write correct, non-racy concurrent C++, and connects it to how ROS 2's executor model actually runs your callbacks.

## Thread basics: std::thread
`std::thread` launches a function on a new OS thread. You must `join()` (wait for it to finish) or `detach()` (let it run independently) every thread before it's destroyed, or your program terminates.

```cpp
#include <thread>
void pollSensor() { /* runs concurrently */ }

std::thread sensor_thread(pollSensor);
// ... do other work on the main thread ...
sensor_thread.join();   // block until pollSensor() returns
```
Threads can take arguments and capture via lambdas, same as any callable:
```cpp
std::thread t([](int id) { std::cout << "worker " << id << "\n"; }, 3);
t.join();
```

## Synchronization: mutexes and locks
When multiple threads touch the same data, you get a **data race** unless you synchronize access. A `std::mutex` ensures only one thread holds the lock at a time; `std::lock_guard`/`std::unique_lock` acquire it in their constructor and release it automatically in their destructor (RAII again).

```cpp
#include <mutex>
std::mutex state_mutex;
double latest_temperature = 0.0;

void updateTemperature(double t) {
    std::lock_guard<std::mutex> lock(state_mutex);   // locked for the scope
    latest_temperature = t;
}   // automatically unlocked here
```
`std::condition_variable` lets one thread sleep until another thread notifies it — the standard way to implement a producer/consumer queue (e.g. a sensor thread pushing readings, a processing thread waking up to consume them) without busy-waiting.

## std::this_thread and task-based concurrency
The `std::this_thread` namespace operates on the *calling* thread — commonly `std::this_thread::sleep_for` to pace a control loop, or `std::this_thread::get_id()` for logging.

```cpp
#include <chrono>
while (running) {
    doControlStep();
    std::this_thread::sleep_for(std::chrono::milliseconds(20));   // ~50 Hz loop
}
```
**Task-based concurrency** shifts the abstraction from "manage this thread" to "run this task and give me its result later." `std::async` launches a callable and returns a `std::future` you can `.get()` when you need the result, letting the runtime decide (depending on policy) whether/when to actually use a new thread:

```cpp
#include <future>
std::future<double> result = std::async(std::launch::async, computeIK, target_pose);
// ... do other work ...
double joint_angle = result.get();   // blocks only if not yet ready
```

## Concurrency applied to ROS 2
ROS 2 nodes don't manage raw threads for their callbacks by default — an **executor** (`rclcpp::executors::SingleThreadedExecutor` or `MultiThreadedExecutor`) pulls ready callbacks (subscriptions, timers, services) off a queue and runs them. A single-threaded executor runs everything sequentially on one thread (simple, no data races between callbacks, but one slow callback blocks everything else); a multi-threaded executor runs callbacks from a pool of threads, requiring you to protect any node state they share with the same mutex techniques above. **Callback groups** (`MutuallyExclusive` vs `Reentrant`) let you control which callbacks are allowed to run concurrently with each other within the same node.

## Try it yourself
Write a small producer/consumer program: one thread pushes 20 randomly generated "sensor readings" (doubles) onto a shared `std::queue<double>` protected by a `std::mutex` and `std::condition_variable`; a second thread pops and prints them as they arrive, then exits once it has consumed all 20. Confirm it terminates cleanly with no hangs or lost readings.
