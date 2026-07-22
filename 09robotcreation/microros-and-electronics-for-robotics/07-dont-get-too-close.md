# MicroROS and Electronics for Robotics — Unit 7: Don't get too close

This is the capstone unit: everything from Units 2–6 — actuator control, sensor reading, executors and timers, and a service-triggered interaction — combines into one autonomous behavior. PEDRITO will stop (or back away) whenever something gets closer than a configured threshold, and the behavior itself will be armed and disarmed through a micro-ROS service rather than always-on firmware logic.

## Designing the behavior as a small state machine

Resist the urge to bolt the obstacle-avoidance logic directly into the sensor timer callback from Unit 5. Instead, keep an explicit state on the MCU:

```c
typedef enum { MODE_MANUAL, MODE_AUTONOMOUS } robot_mode_t;
static robot_mode_t current_mode = MODE_MANUAL;
static float stop_threshold_m = 0.20f;
```

`MODE_MANUAL` is the behavior you already have — motor commands come straight from `/cmd_vel`. `MODE_AUTONOMOUS` overrides that: the sensor timer callback now also decides whether to let commands through or clamp them to zero.

```c
void sensor_timer_callback(rcl_timer_t * timer, int64_t last_call_time) {
  (void) last_call_time;
  if (timer == NULL) return;

  float distance_m = read_distance_cm() / 100.0f;
  range_msg.range = distance_m;
  rcl_publish(&range_publisher, &range_msg, NULL);

  if (current_mode == MODE_AUTONOMOUS && distance_m < stop_threshold_m) {
    stop_all_motors();
  }
}
```

## Arming the behavior through a service

Use a service (as introduced in Unit 5) to switch modes, rather than a topic — you want a clear acknowledgment that the robot actually received and applied the mode change before you walk toward it to test:

```c
void set_mode_callback(const void * req, void * res) {
  std_srvs__srv__SetBool_Request  * request  = (std_srvs__srv__SetBool_Request *) req;
  std_srvs__srv__SetBool_Response * response = (std_srvs__srv__SetBool_Response *) res;

  current_mode = request->data ? MODE_AUTONOMOUS : MODE_MANUAL;
  response->success = true;
}
```

```bash
ros2 service call /pedrito/set_autonomous std_srvs/srv/SetBool "{data: true}"
```

## Bringing in the watchdog and the dashboard

Reuse the no-command watchdog from Unit 4 even in autonomous mode — it protects you if the host machine crashes mid-test, not just when it stops sending `Twist` messages on purpose. And keep the rviz dashboard from Unit 6 open while testing: watching the live range plot cross your `stop_threshold_m` line as you walk toward PEDRITO is far more informative than only watching the wheels.

## Testing safely

- Start with `stop_threshold_m` generously large and the robot on blocks (wheels off the ground) so a bug in the state machine can't send it into a wall or off a table.
- Arm autonomous mode, confirm the service call succeeds, then slowly bring an object toward the sensor and confirm motors clamp to zero at the expected distance.
- Only after that passes, put PEDRITO on the ground and repeat with `MODE_MANUAL` driving it toward an obstacle to confirm the autonomous override actually takes precedence over your manual commands.

## Try it yourself

Extend the behavior so that instead of a hard stop, PEDRITO backs away at a slow constant speed while an obstacle remains inside the threshold, and resumes accepting manual `/cmd_vel` commands the moment the obstacle clears. This turns the unit's binary stop/go logic into a small closed-loop controller — a good bridge into more advanced behaviors beyond this course.
