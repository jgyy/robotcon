# ROS2 Basics in 5 Days (C++) — Unit 3: Topics

Topics are the workhorse communication channel in ROS 2 — the continuous, many-to-many data streams behind sensor readings, velocity commands, and robot state. This unit takes you from inspecting topics on the command line to writing your own publishers, subscribers, and custom message types.

## What is a ROS 2 topic?

A topic is a named, typed data channel. Any number of nodes can publish to it and any number can subscribe — publishers and subscribers don't know about each other, only about the topic name and message type they share. This decoupling is the whole point: you can swap a simulated rover for a real one without touching the nodes that consume `/cmd_vel` or `/scan`, as long as the message types match.

Delivery is governed by **QoS** (Quality of Service) settings — reliability (best-effort vs. reliable), history depth, and durability. Sensor data is often published best-effort (dropping a frame is fine, latency isn't), while commands are usually reliable. You'll pass a `rclcpp::QoS` object when creating publishers/subscriptions; the default profile is a sane starting point until you have a reason to change it.

## Basic topic commands

```bash
ros2 topic list                      # every active topic
ros2 topic list -t                   # with message types
ros2 topic info /cmd_vel             # publisher/subscriber counts
ros2 topic echo /cmd_vel             # print messages as they arrive
ros2 topic hz /scan                  # measured publish rate
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist \
  '{linear: {x: 0.2}, angular: {z: 0.0}}' --once
```

If you have the rover simulation running, `ros2 topic list -t` and `ros2 topic echo` on its topics (`/cmd_vel`, `/scan`, `/odom` are typical names) is the fastest way to understand what data is flowing before you write a line of code.

## Writing a topic publisher

```cpp
#include "rclcpp/rclcpp.hpp"
#include "geometry_msgs/msg/twist.hpp"
using namespace std::chrono_literals;

class DriveForward : public rclcpp::Node
{
public:
  DriveForward() : Node("drive_forward")
  {
    pub_ = create_publisher<geometry_msgs::msg::Twist>("cmd_vel", 10);
    timer_ = create_wall_timer(500ms, std::bind(&DriveForward::tick, this));
  }

private:
  void tick()
  {
    auto msg = geometry_msgs::msg::Twist();
    msg.linear.x = 0.2;
    pub_->publish(msg);
  }
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr pub_;
  rclcpp::TimerBase::SharedPtr timer_;
};
```

The `10` is the QoS history depth (a shorthand for a reliable, keep-last-10 profile). Publishing on a timer, as above, is the standard pattern for commands and periodic state — as opposed to publishing only in response to an event.

## Writing a topic subscriber

```cpp
#include "sensor_msgs/msg/laser_scan.hpp"

class ObstacleWatcher : public rclcpp::Node
{
public:
  ObstacleWatcher() : Node("obstacle_watcher")
  {
    sub_ = create_subscription<sensor_msgs::msg::LaserScan>(
      "scan", 10,
      std::bind(&ObstacleWatcher::on_scan, this, std::placeholders::_1));
  }

private:
  void on_scan(const sensor_msgs::msg::LaserScan::SharedPtr msg)
  {
    float closest = *std::min_element(msg->ranges.begin(), msg->ranges.end());
    RCLCPP_INFO(get_logger(), "Closest obstacle: %.2f m", closest);
  }
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr sub_;
};
```

Subscription callbacks are invoked by the executor when a message arrives — never called by you directly (more on how that scheduling works in Units 5 and 6).

## Mixing publishers and subscribers

A single node can hold both, which is how most real control nodes work: subscribe to sensing, publish commands. Put both the publisher and subscription member variables in one class and react to incoming data inside the subscription callback by publishing on the publisher — e.g., stop the rover (`linear.x = 0`) when `ObstacleWatcher`'s closest reading drops below a threshold.

## Custom interfaces

When the built-in message types (`std_msgs`, `geometry_msgs`, `sensor_msgs`, ...) don't fit your data, define your own in a `.msg` file inside an `interfaces` package:

```
# msg/RoverStatus.msg
float32 battery_percent
string current_task
bool is_charging
```

Declare it in `CMakeLists.txt` with `rosidl_generate_interfaces`, build the package, then use it like any built-in type: `#include "my_interfaces/msg/rover_status.hpp"` and `create_publisher<my_interfaces::msg::RoverStatus>(...)`.

## Try it yourself

Define a custom `RoverStatus.msg` with at least two fields, publish it from a node on a 1-second timer with fake data, and subscribe to it from a second node that logs it. Confirm the message flowing with `ros2 topic echo /rover_status` and `ros2 interface show my_interfaces/msg/RoverStatus`.
