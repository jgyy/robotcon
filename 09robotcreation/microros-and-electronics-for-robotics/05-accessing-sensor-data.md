# MicroROS and Electronics for Robotics — Unit 5: Accessing sensor data

Units 3 and 4 gave PEDRITO the ability to move; this unit gives it the ability to perceive. You'll wire a sensor to the MCU, publish its readings as a ROS 2 topic, and introduce services — the request/response counterpart to topics — in the micro-ROS context.

## Reading a sensor on the MCU

Sensor wiring depends heavily on the interface: a simple ultrasonic distance sensor (e.g. HC-SR04-style) uses two GPIO pins and a trigger/echo timing measurement, while an IMU or more capable distance sensor typically speaks I2C over two shared pins (SDA/SCL) and a library handles the protocol for you. Either way, the pattern from the MCU's perspective is the same: a function that returns a fresh reading, called from a timer.

```c
float read_distance_cm(void) {
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration_us = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout
  return duration_us * 0.0343f / 2.0f;
}
```

Note the explicit timeout on `pulseIn` — a disconnected or failed sensor should return an error/timeout value rather than block your executor loop forever. Blocking calls inside a callback stall every other timer and subscriber on that executor, which is a common source of "the robot stopped responding to commands" bugs once sensors enter the picture.

## Publishing sensor data

Wrap the reading in a timer-driven publisher, same shape as the heartbeat timer from Unit 4:

```c
void sensor_timer_callback(rcl_timer_t * timer, int64_t last_call_time) {
  (void) last_call_time;
  if (timer != NULL) {
    range_msg.range = read_distance_cm() / 100.0f;  // sensor_msgs/Range wants meters
    rcl_publish(&range_publisher, &range_msg, NULL);
  }
}
```

Using `sensor_msgs/msg/Range` (rather than a raw float) means the topic is immediately compatible with standard ROS 2 visualization and processing tools without a translation layer — a `Twist`-style habit worth keeping for every sensor you add.

## Services in micro-ROS

Topics are fire-and-forget; a **service** is a synchronous request/response call, useful when you want to explicitly ask the robot to do something and know when it's done — e.g. "recalibrate the sensor" or "take one reading right now." micro-ROS supports services on both sides:

```c
void calibrate_service_callback(const void * req, void * res) {
  std_srvs__srv__Trigger_Request  * request  = (std_srvs__srv__Trigger_Request *) req;
  std_srvs__srv__Trigger_Response * response = (std_srvs__srv__Trigger_Response *) res;
  (void) request;

  baseline_offset = read_distance_cm();
  response->success = true;
  strcpy(response->message.data, "calibrated");
}
```

Register it with `rclc_executor_add_service`, same as a subscription. From the host side it's called exactly like any other ROS 2 service:

```bash
ros2 service call /pedrito/calibrate std_srvs/srv/Trigger "{}"
```

## Try it yourself

Add a second `std_srvs/srv/Trigger`-based service, `/pedrito/take_reading`, that publishes one immediate sensor reading on demand (separately from the periodic timer publisher) and returns success. Call it with `ros2 service call` and confirm on `ros2 topic echo` that a reading appears right when you call it, not just on the regular timer cadence.
