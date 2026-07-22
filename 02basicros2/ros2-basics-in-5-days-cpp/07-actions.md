# ROS2 Basics in 5 Days (C++) — Unit 7: Actions

Some tasks are neither an instant request/response nor a raw data stream — they take a while, you want progress updates, and you might want to cancel partway through. That's what ROS 2 **actions** are for: "drive to this waypoint," "run this arm trajectory," "return to base." This unit covers interacting with actions from the CLI and writing your own action servers and clients.

## What is an action, and how does it differ from topics and services?

An action is built out of three parts, defined together in a `.action` file:

```
# action/NavigateTo.action
geometry_msgs/Point target      # Goal
---
bool success                    # Result
string message
---
float32 distance_remaining      # Feedback
```

Under the hood, an action is actually implemented using topics and services: a goal service, a result service, a cancel service, and feedback/status topics — but as an API, `rclcpp_action` gives you a single clean abstraction with three request/response phases:

- **Goal**: client sends a goal, server accepts or rejects it.
- **Feedback**: server streams progress updates while working (like a topic).
- **Result**: server sends a final result once done, cancelled, or aborted (like a service response).

Compared to a service, the key difference is duration and cancellability: services are assumed fast and atomic; actions are for anything that takes real time and where the caller might want to check progress or bail out.

## Interacting with actions from the command line

```bash
ros2 action list -t
ros2 action info /navigate_to
ros2 action send_goal /navigate_to my_interfaces/action/NavigateTo \
  "{target: {x: 5.0, y: 2.0, z: 0.0}}" --feedback
```

`--feedback` streams feedback messages to your terminal as they arrive, which is a fast way to sanity-check a server's behavior before writing a client node.

## Action server

```cpp
using NavigateTo = my_interfaces::action::NavigateTo;
using GoalHandle = rclcpp_action::ServerGoalHandle<NavigateTo>;

class NavigateServer : public rclcpp::Node
{
public:
  NavigateServer() : Node("navigate_server")
  {
    server_ = rclcpp_action::create_server<NavigateTo>(
      this, "navigate_to",
      [](auto, auto) { return rclcpp_action::GoalResponse::ACCEPT_AND_EXECUTE; },
      [](auto) { return rclcpp_action::CancelResponse::ACCEPT; },
      std::bind(&NavigateServer::execute, this, std::placeholders::_1));
  }

private:
  void execute(const std::shared_ptr<GoalHandle> goal_handle)
  {
    auto feedback = std::make_shared<NavigateTo::Feedback>();
    auto result = std::make_shared<NavigateTo::Result>();
    for (float remaining = 10.0; remaining > 0; remaining -= 1.0) {
      if (goal_handle->is_canceling()) {
        result->success = false;
        goal_handle->canceled(result);
        return;
      }
      feedback->distance_remaining = remaining;
      goal_handle->publish_feedback(feedback);
      std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
    result->success = true;
    result->message = "Arrived";
    goal_handle->succeed(result);
  }
  rclcpp_action::Server<NavigateTo>::SharedPtr server_;
};
```

Note the three callbacks: a goal-acceptance handler, a cancel handler, and the execute function itself — `execute` runs on its own thread once a goal is accepted, so a long-running loop there doesn't block the node's other callbacks the way it would inside a plain service handler.

## Action client

```cpp
auto client = rclcpp_action::create_client<NavigateTo>(node, "navigate_to");
client->wait_for_action_server();

auto goal = NavigateTo::Goal();
goal.target.x = 5.0;

auto options = rclcpp_action::Client<NavigateTo>::SendGoalOptions();
options.feedback_callback =
  [](auto, const std::shared_ptr<const NavigateTo::Feedback> fb) {
    RCLCPP_INFO(rclcpp::get_logger("client"), "Remaining: %.1f", fb->distance_remaining);
  };
options.result_callback =
  [](const auto & result) {
    RCLCPP_INFO(rclcpp::get_logger("client"), "Success: %d", result.result->success);
  };

client->async_send_goal(goal, options);
```

## Custom action interfaces

Custom `.action` files go in the same `interfaces` package as messages and services, under an `action/` directory, and are added to `rosidl_generate_interfaces` in `CMakeLists.txt` alongside your `.msg` and `.srv` entries — the build system treats all three uniformly.

## Try it yourself

Build `NavigateTo` end to end: the `.action` file, `NavigateServer`, and a client that sends a goal, prints feedback as it streams in, and prints the final result. Then test cancellation — call `ros2 action send_goal` in one terminal, and in another use `ros2 action list` plus `ros2 topic pub` on the cancel mechanism, or simply Ctrl+C the `send_goal` call and confirm your server's `is_canceling()` branch fires.
