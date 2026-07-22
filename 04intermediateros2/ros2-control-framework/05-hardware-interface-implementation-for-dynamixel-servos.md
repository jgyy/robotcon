# ROS2 Control Framework — Unit 5: Hardware Interface Implementation for Dynamixel Servos

Unit 4 gave you the generic template; this unit applies it to a real, commonly-used actuator family — ROBOTIS Dynamixel servos — so you see what changes when "hardware" stops being an abstract concept and becomes a serial bus with real timing, real safety, and a vendor SDK.

## The ROBOTIS Dynamixel SDK and why real hardware differs from templates

Dynamixel servos are daisy-chained on a serial bus (TTL or RS-485) and addressed by numeric ID; you talk to them through ROBOTIS's Dynamixel SDK, which exposes C/C++ functions to open a port, set a baud rate, and read/write specific "control table" addresses (position, velocity, torque-enable, operating mode, and more — documented per-model in ROBOTIS's e-Manual). The key difference from the stub in Unit 4: every `read()`/`write()` call now costs real serial-bus time, and multiple joints on the same bus share bandwidth, so batching reads/writes (the SDK provides `GroupSyncRead`/`GroupSyncWrite` for exactly this) matters far more than it did with a simulated joint.

## SDK Installation

Install the SDK for your language/platform (source build or the ROS-wrapped package, depending on your distribution's packaging), and confirm the correct USB-to-serial adapter is recognized before writing any ROS 2 code:

```bash
ls /dev/ttyUSB*          # or /dev/ttyACM*, depending on your adapter
sudo usermod -aG dialout $USER   # avoid needing sudo for serial access; re-login after
```

Bring up a vendor example or a simple standalone SDK script first to confirm you can ping and move a servo *outside* ROS — isolating "is the hardware talking at all" from "is my hardware interface plugin correct" saves enormous debugging time later.

## Create a Package and Wire Up Header/Source Files

Following the same 5-step shape as Unit 4, create a new package for the Dynamixel-specific interface, and add a header/source pair. The SDK's port and packet handlers become members of your class, opened in `on_configure()`:

```cpp
// in on_configure():
port_handler_ = dynamixel::PortHandler::getPortHandler(port_name_.c_str());
packet_handler_ = dynamixel::PacketHandler::getPacketHandler(protocol_version_);
if (!port_handler_->openPort() || !port_handler_->setBaudRate(baud_rate_))
  return hardware_interface::CallbackReturn::ERROR;
```

## Wiring SDK calls into export_*_interfaces(), read(), and write()

`export_state_interfaces()`/`export_command_interfaces()` follow Unit 4's pattern exactly (position, velocity per joint). The difference is inside `read()` and `write()`, which now issue real SDK calls instead of touching a stub array:

```cpp
hardware_interface::return_type MyDynamixelInterface::read(const rclcpp::Time &, const rclcpp::Duration &)
{
  for (size_t i = 0; i < joint_ids_.size(); i++) {
    int32_t raw_pos = 0;
    packet_handler_->read4ByteTxRx(port_handler_, joint_ids_[i], ADDR_PRESENT_POSITION, (uint32_t*)&raw_pos);
    hw_positions_[i] = ticks_to_radians(raw_pos);
  }
  return hardware_interface::return_type::OK;
}
```

`write()` mirrors this in reverse, converting `hw_commands_` from radians back into the servo's tick units before writing to `ADDR_GOAL_POSITION`. In production code prefer `GroupSyncRead`/`GroupSyncWrite` over per-joint calls to keep bus traffic bounded as joint count grows.

## Implement enable_torque(), set_control_mode(), and reset_command()

Unlike the generic template, real servos need extra setup that has no equivalent in a simulator: `enable_torque()` toggles the servo's torque-enable register (must be *disabled* before changing operating mode, and enabled before accepting motion commands); `set_control_mode()` writes the operating-mode register (position, velocity, or current/effort control — chosen to match what your `<ros2_control>` command interfaces declare); `reset_command()` re-reads the servo's actual current position into `hw_commands_` on activation so the first `write()` doesn't command a jump from wherever the servo happens to be.

## Register, build, and test on real hardware

The plugin export, `CMakeLists.txt`/`package.xml`, launch file, and controller-manager YAML steps are identical in shape to Unit 4 — only the plugin name and hardware-specific parameters (serial port, baud rate, per-joint Dynamixel ID) change. Before testing with a controller active, always confirm `enable_torque()` behaves correctly with a very low-effort or velocity-limited controller first — an eager position controller commanding a large step on a torque-enabled real servo can move a joint fast enough to damage a mechanism or pinch a finger.

## Try it yourself

With a single Dynamixel servo on a bus, write a minimal standalone script (outside ROS, using the SDK directly) that pings the servo by ID, reads its present position, enables torque, and commands a small position change. Once that works reliably, that script's four operations map directly onto `on_configure()`, `read()`, `on_activate()`, and `write()` in your hardware interface — porting it is largely a matter of relocating the same calls into the right lifecycle methods.
