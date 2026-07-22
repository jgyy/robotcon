# ROS Control — Unit 2: ROS_Controls Essentials

Before configuring or writing anything, you need a solid picture of the moving parts inside `ros_control`/`ros2_control` and how they talk to each other. This unit walks through each actor in the pipeline in isolation.

## The controller manager
The controller manager is the central coordinator. On startup it:

1. Loads a hardware interface (real or simulated) that exposes a set of *state interfaces* (readable: position, velocity, effort) and *command interfaces* (writable: position, velocity, effort) per joint.
2. Loads whichever controllers you ask it to, matching each controller's required interfaces against what the hardware exposes.
3. Runs a fixed-rate update loop: `read()` from hardware → `update()` each active controller → `write()` commands back to hardware.

You interact with it mostly through CLI tools rather than code:

```bash
ros2 control list_controllers
ros2 control list_hardware_interfaces
ros2 control load_controller my_controller
ros2 control switch_controllers --activate my_controller --deactivate old_controller
```

(ROS 1's `controller_manager` exposes the same ideas via `rosservice call` and the `spawner`/`unspawner` scripts.)

## State and command interfaces
Every joint exposes named interfaces, typically `<joint_name>/position`, `<joint_name>/velocity`, `<joint_name>/effort`. A controller declares which interfaces it *needs* — a position controller needs a `position` command interface and usually a `position` state interface for feedback; a joint trajectory controller typically needs position and velocity. The controller manager refuses to activate a controller if the hardware can't satisfy its claimed interfaces, which is the most common source of "controller failed to configure" errors you'll hit.

## Controller types you'll actually use
- **`joint_state_broadcaster`** — not a controller in the "commands actuators" sense; it publishes the current state of every joint to `/joint_states` so RViz, TF, and everything else can see the robot move. You'll load this on almost every robot regardless of what else you're doing.
- **Position/velocity/effort controllers** — the simplest controllers: send a raw setpoint per joint, no trajectory shaping.
- **`joint_trajectory_controller`** — accepts a full time-parameterized trajectory (a sequence of waypoints with timestamps) and interpolates between them; this is what you'll use for arms in units 5 and 7.
- **`diff_drive_controller`** — converts `cmd_vel` (linear/angular velocity) into individual wheel commands for a differential-drive base.

## The real-time update loop
The controller manager's `update()` call is meant to run at a fixed, predictable rate (commonly 100–1000 Hz) so that control math (especially PID-based effort control) behaves consistently. This is why controllers avoid blocking calls, dynamic memory allocation in the hot path, and heavy logging inside `update()` — anything that can stall the loop translates directly into jittery or unstable motion on real hardware.

## Try it yourself
Pick any ROS 2 demo robot with `ros2_control` already configured (many `_description` or `_bringup` example packages ship one), launch it, and run `ros2 control list_controllers` followed by `ros2 control list_hardware_interfaces`. Match each controller in the first list to the interfaces it's consuming in the second, and write down which controller you think is responsible for publishing `/joint_states`.
