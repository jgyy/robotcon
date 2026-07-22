# ROS Basics in 5 Days (C++) — Unit 3: ROS Basics

With the map from Unit 2 in hand, this unit gets hands-on with the four things every ROS session starts with: getting the graph running, understanding what a node is, reading/writing parameters, and knowing which environment variables control it all.

## Bootstrapping the graph
In ROS 1, a single process called the **master** (`roscore`) must be running before anything else — it's the registry every node talks to first to find out who else exists. Nothing works without it, and forgetting to start it is the single most common "why isn't anything connecting" bug for beginners. In ROS 2, there is no master; nodes discover each other automatically over the network via DDS, so there's no equivalent process to start — but the mental model of "a graph that nodes join and leave" is identical, and the same CLI questions ("who's out there?") still apply.

## Nodes
A node is a single-purpose, running instance of a compiled program — one node per logical responsibility (one camera driver, one path planner), not one giant process doing everything. Nodes have a name, which appears in every debugging tool, and can be namespaced to avoid collisions when you run multiples of the same node type. From C++, the minimal node lifecycle looks like this (ROS 2 / `rclcpp` shown; ROS 1 / `roscpp` is the same shape with `ros::init`, `ros::NodeHandle`, and `ros::spin`):

```cpp
#include "rclcpp/rclcpp.hpp"

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("my_first_node");
  RCLCPP_INFO(node->get_logger(), "node started");
  rclcpp::spin(node);   // blocks, processing callbacks until shutdown
  rclcpp::shutdown();
  return 0;
}
```

`spin()` is what keeps the process alive and dispatching callbacks (timers, subscriptions, service calls) — a node that returns immediately after `init` never actually does any work.

## The parameter server
Parameters are named, typed configuration values a node can read at startup or be watched for changes at runtime — things like a control loop's gain, a topic name override, or a max-speed limit that you want to change without recompiling. From the CLI you can list and get/set them live, which is invaluable for tuning a running robot. From code, a node declares the parameters it expects and reads their current value:

```cpp
node->declare_parameter<double>("max_speed", 1.0);
double max_speed = node->get_parameter("max_speed").as_double();
```

(ROS 1's `ros::param` API is centralized on the master rather than per-node, but serves the same purpose.)

## Environment variables
A handful of environment variables control how your shell finds and runs ROS software: things like the package search path, the workspace overlay paths your build tool sets up after you source `setup.bash`, and (in ROS 2) a domain ID that isolates separate ROS networks running on the same physical network so your graph doesn't accidentally talk to your neighbor's. Run `printenv | grep ROS` (or `grep AMENT` / `grep ROS_DOMAIN_ID`) after sourcing your workspace to see what's actually set on your machine — this is the first thing to check when nodes on the same machine mysteriously can't see each other.

## Try it yourself
Write and run the minimal node above, but have it declare a parameter `greeting_count` (integer, default 1) and log the greeting that many times using `RCLCPP_INFO` in a loop. Confirm from a second terminal, using the CLI, that you can see the node's name and read its parameter value while it's running.
