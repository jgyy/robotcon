# ROS Basics in 5 Days (C++) — Unit 9: Understanding ROS Actions - Clients

Services (Units 6-7) are for quick questions. Actions are for goals: "navigate to this point," "close the gripper" — things that take real time, that you might want to cancel partway through, and where you want progress updates rather than silence until it's done. This unit covers calling an action; the next covers building one.

## Why not just use a service?
Technically you could implement "long-running task" as a service and just wait a long time for the response — but you'd lose two things actions give you for free: **feedback** (periodic progress messages while the goal executes, e.g. "40% of the path traveled") and **cancellation** (the client can ask the server to abort cleanly mid-goal). Under the hood, an action is actually built from topics and services combined, but you interact with it through a single higher-level action client/server API rather than wiring that up yourself.

## The action interface anatomy
An action definition has three parts: a **goal** (what you're asking for), **result** (the final outcome, delivered once), and **feedback** (progress updates, delivered zero or more times during execution). A `.action` file looks like:

```
# action/Fibonacci.action
int32 order
---
int32[] sequence
---
int32[] partial_sequence
```

(goal / result / feedback, separated by `---`, in that order)

## Writing an action client in C++
Using `rclcpp_action`, a client sends a goal, then reacts to feedback and the eventual result via callbacks:

```cpp
#include "rclcpp/rclcpp.hpp"
#include "rclcpp_action/rclcpp_action.hpp"
#include "your_package/action/fibonacci.hpp"

using Fibonacci = your_package::action::Fibonacci;
using GoalHandle = rclcpp_action::ClientGoalHandle<Fibonacci>;

void feedback_cb(GoalHandle::SharedPtr, const std::shared_ptr<const Fibonacci::Feedback> fb) {
  RCLCPP_INFO(rclcpp::get_logger("client"), "progress: %zu numbers so far",
              fb->partial_sequence.size());
}

void result_cb(const GoalHandle::WrappedResult &result) {
  if (result.code == rclcpp_action::ResultCode::SUCCEEDED) {
    RCLCPP_INFO(rclcpp::get_logger("client"), "done, %zu numbers",
                result.result->sequence.size());
  }
}

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("fibonacci_client");
  auto client = rclcpp_action::create_client<Fibonacci>(node, "fibonacci");
  client->wait_for_action_server();

  auto goal = Fibonacci::Goal();
  goal.order = 10;

  rclcpp_action::Client<Fibonacci>::SendGoalOptions options;
  options.feedback_callback = feedback_cb;
  options.result_callback = result_cb;
  client->async_send_goal(goal, options);

  rclcpp::spin(node);
  rclcpp::shutdown();
  return 0;
}
```

## Cancellation and the goal lifecycle
A sent goal moves through states you can query: accepted, executing, and a terminal state (succeeded, aborted, or canceled). Calling `client->async_cancel_goal(goal_handle)` requests cancellation, but the server decides how to honor it — a well-written server checks for cancellation periodically during long work and stops promptly; a poorly written one may ignore the request entirely. This is exactly why Unit 10 emphasizes checking for cancellation inside the server's execution loop.

## Try it yourself
Using the `Fibonacci` action above (or your own similarly shaped goal/feedback/result action), write a client that sends a goal, logs each feedback message as it arrives, and cancels the goal partway through — e.g. after receiving the third feedback message — instead of waiting for the result.
