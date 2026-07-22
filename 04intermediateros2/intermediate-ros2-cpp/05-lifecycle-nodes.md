# Intermediate ROS2 (C++) — Unit 5: Lifecycle Nodes

An ordinary ROS 2 node is either running or not — there's no standard way to ask it to "get ready but don't start moving the robot yet" or to cleanly hand it back to an idle state. Lifecycle (managed) nodes add that missing state machine, and they're the mechanism behind how Nav2 and other large stacks bring themselves up safely.

## Why you need managed nodes

Consider a controller node that starts publishing motor commands the instant it's constructed. If it comes up before the motor driver is ready, or before another node has finished configuring itself, you get commands going nowhere or, worse, garbage values reaching real hardware. A managed node solves this by separating "constructed" from "actively doing its job": it can be built, configured, and verified while inactive, and only moved to active — and start publishing, subscribing, or actuating — once the rest of the system is confirmed ready.

## What a managed node is

A lifecycle node (`rclcpp_lifecycle::LifecycleNode`) implements a standard state machine with four primary states — `unconfigured`, `inactive`, `active`, `finalized` — and transitions between them, each with a corresponding callback you override: `on_configure`, `on_activate`, `on_deactivate`, `on_cleanup`, `on_shutdown`, `on_error`. Publishers created through the lifecycle API are automatically muted while the node is anything other than `active`, so you don't need to manually guard every publish call.

## A minimal lifecycle node

```cpp
#include "rclcpp_lifecycle/lifecycle_node.hpp"
using CallbackReturn = rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn;

class LifecycleTalker : public rclcpp_lifecycle::LifecycleNode
{
public:
  LifecycleTalker() : rclcpp_lifecycle::LifecycleNode("lifecycle_talker") {}

  CallbackReturn on_configure(const rclcpp_lifecycle::State &) override
  {
    pub_ = this->create_publisher<std_msgs::msg::String>("chatter", 10);
    RCLCPP_INFO(get_logger(), "configured");
    return CallbackReturn::SUCCESS;
  }

  CallbackReturn on_activate(const rclcpp_lifecycle::State &) override
  {
    pub_->on_activate();
    RCLCPP_INFO(get_logger(), "activated");
    return CallbackReturn::SUCCESS;
  }

  CallbackReturn on_deactivate(const rclcpp_lifecycle::State &) override
  {
    pub_->on_deactivate();
    return CallbackReturn::SUCCESS;
  }

private:
  std::shared_ptr<rclcpp_lifecycle::LifecyclePublisher<std_msgs::msg::String>> pub_;
};
```

Note the class inherits from `LifecycleNode`, not the plain `Node`, and the publisher itself gets `on_activate()`/`on_deactivate()` calls so it only emits messages while the node is active.

## Managing lifecycle nodes from the command line, and the Life Cycle Manager

Every lifecycle node exposes services for driving its state machine, which the CLI wraps:

```bash
ros2 lifecycle list /lifecycle_talker
ros2 lifecycle get /lifecycle_talker
ros2 lifecycle set /lifecycle_talker configure
ros2 lifecycle set /lifecycle_talker activate
```

Driving every lifecycle node in a system by hand doesn't scale, which is why systems with many managed nodes use a **Life Cycle Manager** — a coordinator node that walks a configured set of managed nodes through `configure` then `activate` (and back down through `deactivate`/`cleanup` on shutdown) in a defined order, so dependencies come up in the right sequence and a single command can bring the whole system to `active`.

## Lifecycle nodes in Nav2

Nav2 is the clearest real-world example: its planner, controller, recovery, and map servers are all lifecycle nodes, and `nav2_lifecycle_manager` is exactly the coordinator described above — it configures and activates the whole navigation stack in dependency order at startup, and can deactivate it cleanly (e.g. for a safe pause) without killing any processes.

## Try it yourself

Turn the `LifecycleTalker` above into a working package, add an `on_deactivate` log line if you haven't already, and drive it entirely from the CLI: `configure`, `activate`, watch `ros2 topic echo /chatter` receive messages, then `deactivate` and confirm the topic goes quiet even though the node process is still alive.
