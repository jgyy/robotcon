# ROS2 Basics in 3 Days (Rust) — Unit 2: Basic Concepts

This unit covers the scaffolding every ROS 2 Rust project sits on: how a package is laid out and built, what a node and a client library actually are, and how a launch file starts several of them together. Get comfortable here before Unit 3, where you write real publish/subscribe logic.

## ROS 2 packages and the Cargo/colcon relationship
A ROS 2 package is a directory with a `package.xml` manifest declaring its name, dependencies, and build type. For a Rust package, that directory also contains a normal `Cargo.toml`. The `ament_cargo` build type tells `colcon` (ROS 2's workspace build tool) to shell out to `cargo build` for that package while still respecting ROS 2's cross-package dependency graph and install layout. In practice, your workspace looks like:

```
ros2_ws/
  src/
    my_rust_pkg/
      package.xml
      Cargo.toml
      src/
        main.rs
```

Create the skeleton and build it with the same commands you'd use for any workspace:

```bash
cargo new --lib my_rust_pkg          # or hand-write Cargo.toml + src/
cd ~/ros2_ws
colcon build --packages-select my_rust_pkg
source install/setup.bash
```

`colcon` isolates each package's build artifacts under `install/`, and sourcing the generated `setup.bash` puts your compiled binaries and any generated message crates on your `PATH`/`CARGO_TARGET_DIR` equivalents so other packages (and `ros2 run`) can find them.

## Writing Cargo build scripts
Rust packages that depend on ROS 2 interface (message/service) definitions need code generated from `.msg`/`.srv` files at build time — that's the job of a `build.rs` build script. `ros2_rust` provides a helper crate (`rosidl_generator_rs` tooling) you call from `build.rs` to turn the interface packages listed in your `Cargo.toml` build-dependencies into Rust structs before your crate compiles. A minimal shape:

```rust
// build.rs
fn main() {
    let generator = ros2_rust_msg_gen::MessageGenerator::new();
    generator.generate().expect("failed to generate ROS 2 message bindings");
}
```

You don't hand-write these generated types; you `use` them once generation succeeds, the same way you'd use any other crate's public API.

## Nodes and client libraries
A **node** is a single process (or a logical unit within one) that does one job — publish sensor data, run a controller loop, aggregate diagnostics — and communicates with other nodes only through ROS 2's messaging primitives, never through shared memory or direct function calls. A **client library** (`rclcpp` for C++, `rclpy` for Python, `rclrs` for Rust) is the language binding that wraps the underlying `rcl`/DDS machinery and gives you an idiomatic API to create nodes, publishers, subscribers, and timers. In `rclrs`, creating a node looks like this:

```rust
use rclrs::{Context, Node};

fn main() -> Result<(), rclrs::RclrsError> {
    let context = Context::default_from_env()?;
    let node = Node::new(&context, "my_first_node")?;
    println!("Node '{}' created", node.name());
    rclrs::spin(node)?;
    Ok(())
}
```

`Context::default_from_env` initializes the ROS 2 middleware layer for this process; `Node::new` registers a named node with it; `rclrs::spin` blocks and processes incoming callbacks (timers, subscriptions) until the process is shut down.

## Launch files
A single `ros2 run` command starts one node. Real systems need several nodes (and sometimes parameters, remappings, and conditional logic) starting together — that's what launch files are for. ROS 2 launch files are conventionally written in Python, regardless of what language the nodes themselves are implemented in — the launch system just spawns processes and doesn't care what compiled them:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_rust_pkg',
            executable='my_first_node',
            name='my_first_node',
        ),
    ])
```

Run it with `ros2 launch my_rust_pkg my_launch_file.launch.py`. This is exactly the mechanism you'll use in Unit 3 to bring up a publisher and a subscriber together.

## Try it yourself
Create a new Rust package with a minimal `Cargo.toml` and `package.xml`, write a `main.rs` that creates an `rclrs` node named `hello_ros2_rust` and spins it, build it with `colcon build`, then write a one-node Python launch file that starts it via `ros2 launch`. Confirm with `ros2 node list` (in another terminal) that your node shows up while running.
