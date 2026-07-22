# ROS2 Control Framework — Unit 4: Hardware Interface Implementation Template

Everything so far has used someone else's hardware interface plugin (a simulator's). This unit teaches you to write your own from scratch — the C++ plugin that sits between `ros2_control`'s generic controllers and your specific motor drivers, sensors, or actuators. Treat this unit as the reusable template; Unit 5 applies it to a real device.

## The hardware interface lifecycle

A hardware interface is a `hardware_interface::SystemInterface` (or `ActuatorInterface`/`SensorInterface` for narrower cases) — itself a ROS 2 lifecycle node under the hood. The controller manager drives it through the same states controllers go through: `on_init()` → `on_configure()` → `on_activate()` ↔ `on_deactivate()`, with `read()` and `write()` called every cycle only while active. Getting this state machine right matters because it's what lets you safely power actuators on and off without restarting the whole ROS graph.

## Your hardware interface in 5 steps

1. Create a package and add a header (`.hpp`) declaring your class.
2. Add a source (`.cpp`) implementing the lifecycle methods.
3. Export state and command interfaces so the controller manager knows what your hardware offers.
4. Implement `read()`/`write()` — the two methods that actually touch hardware.
5. Register the class as a plugin via `PLUGINLIB_EXPORT_CLASS`, then build and configure it in your robot's `<ros2_control>` block.

## Header and source file skeleton

```cpp
// my_hw_interface.hpp
#pragma once
#include "hardware_interface/system_interface.hpp"

namespace my_robot {
class MyHardwareInterface : public hardware_interface::SystemInterface {
public:
  hardware_interface::CallbackReturn on_init(const hardware_interface::HardwareInfo & info) override;
  hardware_interface::CallbackReturn on_configure(const rclcpp_lifecycle::State &) override;
  hardware_interface::CallbackReturn on_activate(const rclcpp_lifecycle::State &) override;
  hardware_interface::CallbackReturn on_deactivate(const rclcpp_lifecycle::State &) override;
  std::vector<hardware_interface::StateInterface> export_state_interfaces() override;
  std::vector<hardware_interface::CommandInterface> export_command_interfaces() override;
  hardware_interface::return_type read(const rclcpp::Time &, const rclcpp::Duration &) override;
  hardware_interface::return_type write(const rclcpp::Time &, const rclcpp::Duration &) override;

private:
  std::vector<double> hw_positions_, hw_velocities_, hw_commands_;
};
}
```

## Write the on_init() method

`on_init()` receives the `<ros2_control>` XML as a parsed `HardwareInfo` struct — this is where you read joint names and count, resize your state/command buffers, and validate the URDF matches what your driver expects:

```cpp
hardware_interface::CallbackReturn MyHardwareInterface::on_init(
    const hardware_interface::HardwareInfo & info)
{
  if (hardware_interface::SystemInterface::on_init(info) != hardware_interface::CallbackReturn::SUCCESS)
    return hardware_interface::CallbackReturn::ERROR;
  hw_positions_.resize(info.joints.size(), 0.0);
  hw_velocities_.resize(info.joints.size(), 0.0);
  hw_commands_.resize(info.joints.size(), 0.0);
  return hardware_interface::CallbackReturn::SUCCESS;
}
```

## Add the on_configure() method

`on_configure()` is where you open a serial port, initialize an SDK, or connect to a driver — anything that should happen once before activation but shouldn't hold the device "live" yet. Return `SUCCESS` only once the connection is confirmed; anything else and the controller manager keeps the hardware component in `unconfigured`.

## Add the export_state_interfaces() and export_command_interfaces() methods

These tell the resource manager exactly what your hardware offers, by joint name and interface type — the same names your `<ros2_control>` XML declared in Unit 2:

```cpp
std::vector<hardware_interface::StateInterface> MyHardwareInterface::export_state_interfaces()
{
  std::vector<hardware_interface::StateInterface> state_interfaces;
  for (size_t i = 0; i < hw_positions_.size(); i++)
    state_interfaces.emplace_back(info_.joints[i].name, "position", &hw_positions_[i]);
  return state_interfaces;
}
```

`export_command_interfaces()` follows the identical pattern against `hw_commands_`. The name/interface pair is exactly what controllers claim by, so a typo here silently breaks a controller's ability to find your joint.

## Implement on_activate(), on_deactivate(), read(), and write()

`on_activate()` is your last safe checkpoint before commands start flowing — enable motor power, zero your command buffer to the current position (to avoid a jump), then return `SUCCESS`. `on_deactivate()` does the reverse: disable power safely. `read()` is called every cycle to pull fresh sensor values into `hw_positions_`/`hw_velocities_`; `write()` is called every cycle to push `hw_commands_` out to the device. Both must be fast and non-blocking — this loop typically runs at 100 Hz or more, so anything slow (logging, dynamic allocation) here will degrade real-time performance.

## Register, build, and switch in the plugin

Export the class so pluginlib can instantiate it by string name, then declare it in a plugin description XML referenced from `package.xml`:

```cpp
#include "pluginlib/class_list_macros.hpp"
PLUGINLIB_EXPORT_CLASS(my_robot::MyHardwareInterface, hardware_interface::SystemInterface)
```

After adding the plugin XML export, the required `ament_cmake` dependencies in `CMakeLists.txt`/`package.xml`, and building with `colcon build`, switch your robot's `<ros2_control><hardware><plugin>` tag from the simulator plugin to `my_robot/MyHardwareInterface`, write a matching launch file and controller YAML for real hardware, and test exactly as you did in Unit 2.

## Try it yourself

Write the header and source skeleton above for a single-joint stub device (no real hardware needed — just have `read()` increment a fake position and `write()` log the commanded value). Register it as a plugin, point a minimal `<ros2_control>` block at it, and confirm `ros2 control list_hardware_interfaces` shows your joint's `position` state interface and `velocity` command interface by name.
