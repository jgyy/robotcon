# ROS Basics in 5 Days (C++) — Unit 4: Understanding ROS Topics - Publishers

Topics are how most data flows through a robot: sensor readings, robot state, commanded velocities. This unit covers the publish side of that pattern — the next unit covers subscribing and defining your own message types.

## What a topic is
A topic is a named, typed data channel. "Named" means it has a string identifier like `/cmd_vel` or `/scan`. "Typed" means every message sent on it must match a single declared message type — you can't publish a string on a topic declared to carry numbers. Publishing is fire-and-forget and many-to-many: zero, one, or many nodes can publish to the same topic, and zero, one, or many nodes can subscribe, and the publisher never knows or cares who (if anyone) is listening. This decoupling is the entire point — a camera driver doesn't need to know whether zero or five nodes are consuming its images.

## Message types and structure
A message type is a plain data schema — fields with names and primitive types (or nested message types), no methods. Common built-in types live in packages like `std_msgs` (primitives wrapped in a struct, e.g. `std_msgs::msg::String`), `geometry_msgs` (poses, twists, vectors), and `sensor_msgs` (camera images, laser scans, IMU data). You'll define your own custom message type in the next unit; for now, built-in types are enough to get a publisher running.

## Writing a publisher node in C++
A publisher is created once (typically in the constructor) and reused on every send. This example publishes a `std_msgs::msg::String` on `/greeting` ten times a second using a timer callback:

```cpp
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
#include <chrono>

using namespace std::chrono_literals;

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("greeting_publisher");

  auto pub = node->create_publisher<std_msgs::msg::String>("/greeting", 10);

  auto timer = node->create_wall_timer(100ms, [&pub, node]() {
    auto msg = std_msgs::msg::String();
    msg.data = "hello from " + node->get_name();
    pub->publish(msg);
  });

  rclcpp::spin(node);
  rclcpp::shutdown();
  return 0;
}
```

The `10` in `create_publisher` is the queue size — how many outgoing messages can buffer before old ones are dropped if a subscriber is slow. The equivalent ROS 1 call is `nh.advertise<std_msgs::String>("/greeting", 10)`.

## Rate, timing, and delivery guarantees
Two things bite beginners here. First, publish rate is whatever you set the timer to — ROS does not throttle or guarantee delivery timing for you, so a control loop publishing commands needs its own timer at the rate the downstream consumer expects. Second, in ROS 2 delivery reliability, queue depth, and "latching" behavior (does a late-joining subscriber get the last message?) are governed by **QoS (Quality of Service) settings** — the default profile is fine for this course, but know that it exists, because mismatched QoS between a publisher and subscriber is a common silent-failure mode (they simply never connect, with no error).

## Try it yourself
Modify the publisher above to publish the current loop iteration count instead of a fixed greeting, at 2 Hz instead of 10 Hz. Run it, then use the CLI to echo the topic and confirm you see one new message roughly every half second.
