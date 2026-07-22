# Robot Fleet Management in ROS2 v2 — Unit 2: Simple RMF Setup - Part 1

This unit gets a minimal Open-RMF stack running end-to-end with a single simulated robot, so you have a working baseline before adding complexity like multiple robots or fleets in the next two units.

## Installing the Open-RMF stack

Open-RMF ships as a collection of ROS 2 packages (`rmf_core`, `rmf_traffic`, `rmf_fleet_adapter`, `rmf_simulation`, and friends). The straightforward path is to build the demo workspace from source alongside your ROS 2 distro so you get matching versions of everything:

```bash
mkdir -p ~/rmf_ws/src
cd ~/rmf_ws/src
git clone https://github.com/open-rmf/rmf_demos.git
cd ~/rmf_ws
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install
source install/setup.bash
```

`rmf_demos` is useful precisely because it bundles a set of small, working example worlds — you don't need to author a building model to get your first robot moving under RMF.

## Anatomy of a minimal RMF launch

A minimal RMF deployment needs three things running together:

1. **The RMF core services** — the traffic schedule node, the building map server, and the task dispatcher.
2. **A simulated world** — a Gazebo/Ignition world containing the building geometry and one simulated robot.
3. **A fleet adapter** — the bridge between that one robot and the RMF core.

```bash
ros2 launch rmf_demos_gz office.launch.xml
```

This single launch file brings up all three pieces for the bundled "office" demo world with one robot. Watch the terminal output for the traffic schedule node and the fleet adapter both reporting they're alive before assuming anything is broken.

## Verifying the system is alive

Once it's launched, use ordinary ROS 2 introspection — nothing RMF-specific — to confirm the pieces are talking:

```bash
ros2 node list | grep -i rmf
ros2 topic list | grep -i fleet_states
ros2 topic echo /fleet_states
```

`/fleet_states` is a good first signal: it publishes the known fleets and each robot's reported name, position, battery level, and current task. If it's silent, the fleet adapter isn't connected to the core traffic schedule — check that both processes started without exceptions before the topic list was queried.

## Sending your first task

RMF ships a small command-line task requester. Try sending a "loop" task (go to waypoint A, then waypoint B, repeat N times) to confirm the whole path — dispatcher, adapter, robot — works:

```bash
ros2 run rmf_demos_tasks dispatch_loop -s pantry -f lounge -n 3
```

If the simulated robot starts moving between the two named waypoints, your minimal stack is functioning.

## Try it yourself

Launch the office demo, then use `ros2 topic echo /fleet_states` and `ros2 topic echo /task_summaries` in two separate terminals while you dispatch a loop task. Note how the fleet state's `task_id` field changes as the robot picks up, executes, and completes the task — this is the same mechanism you'll rely on later to debug custom adapters.
