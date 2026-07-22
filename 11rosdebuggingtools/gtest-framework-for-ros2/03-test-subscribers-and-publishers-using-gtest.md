# GTest Framework for ROS2 — Unit 3: Test Subscribers and Publishers using GTest

Plain unit tests from Unit 2 do not touch the ROS graph at all. Real nodes, though, live and die by whether they publish the right message at the right time and react correctly to what they subscribe to. This unit shows how to bring a live (but isolated) ROS2 node into a GTest test.

## Why pub/sub testing is harder than plain unit testing

A publisher/subscriber interaction is asynchronous: calling `publish()` does not guarantee a subscriber's callback has run by the next line of your test. If you write `EXPECT_EQ(received_msg.data, 42)` immediately after publishing, you have a race condition, not a test — it may pass on your laptop and fail intermittently in CI. Testing nodes correctly means being deliberate about spinning the executor and giving messages time to arrive before asserting anything.

## A minimal publisher/subscriber pair to test against

Assume a simple node under test — a publisher that republishes a scaled sensor value, and its counterpart:

```cpp
class ScalerNode : public rclcpp::Node {
public:
  ScalerNode() : Node("scaler_node") {
    pub_ = create_publisher<std_msgs::msg::Float64>("scaled", 10);
    sub_ = create_subscription<std_msgs::msg::Float64>(
      "raw", 10,
      [this](std_msgs::msg::Float64::SharedPtr msg) {
        std_msgs::msg::Float64 out;
        out.data = msg->data * 2.0;
        pub_->publish(out);
      });
  }
private:
  rclcpp::Publisher<std_msgs::msg::Float64>::SharedPtr pub_;
  rclcpp::Subscription<std_msgs::msg::Float64>::SharedPtr sub_;
};
```

## Driving the node from a test with a helper subscriber

The test creates the node under test plus a second, plain node that acts as a test harness: publishing input and capturing output.

```cpp
TEST(ScalerNodeTest, DoublesInput) {
  rclcpp::init(0, nullptr);
  auto scaler = std::make_shared<ScalerNode>();
  auto harness = std::make_shared<rclcpp::Node>("test_harness");

  auto pub = harness->create_publisher<std_msgs::msg::Float64>("raw", 10);
  std_msgs::msg::Float64 received;
  bool got_msg = false;
  auto sub = harness->create_subscription<std_msgs::msg::Float64>(
    "scaled", 10,
    [&](std_msgs::msg::Float64::SharedPtr msg) {
      received = *msg;
      got_msg = true;
    });

  rclcpp::executors::SingleThreadedExecutor executor;
  executor.add_node(scaler);
  executor.add_node(harness);

  std_msgs::msg::Float64 input;
  input.data = 21.0;
  pub->publish(input);

  auto start = std::chrono::steady_clock::now();
  while (!got_msg && std::chrono::steady_clock::now() - start < std::chrono::seconds(2)) {
    executor.spin_some();
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }

  ASSERT_TRUE(got_msg);
  EXPECT_DOUBLE_EQ(received.data, 42.0);
  rclcpp::shutdown();
}
```

The pattern to internalize: create an executor, `add_node()` both the node under test and your harness node, then repeatedly call `spin_some()` in a bounded loop until either the expected message arrives or a timeout expires. Never spin forever without a timeout — a bug that prevents the message from arriving should fail your test quickly, not hang your CI job.

## Asserting on message content and QoS

Beyond checking `msg->data`, pay attention to QoS compatibility — a publisher using `rclcpp::QoS(1).best_effort()` will silently fail to deliver to a subscriber requesting `reliable()`. If a test's `got_msg` never becomes true, mismatched QoS is one of the first things to check, alongside topic name typos and namespace remapping. It is good practice to assert the publisher/subscriber counts (`pub->get_subscription_count()`) once the executor has spun at least once, as a quick sanity check that the graph actually connected before you start asserting on message content.

## Try it yourself

Write a small node that subscribes to a `std_msgs/String` command topic and republishes an `std_msgs/Bool` "acknowledged" message on a different topic whenever it receives a command. Write a GTest test using the harness-node pattern above that publishes a command and asserts the acknowledgment arrives within a timeout, and a second test that asserts *no* acknowledgment arrives if nothing is published (i.e. the node stays quiet when idle).
