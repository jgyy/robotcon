# Debug Cases — Unit 3: Case 2: ROS Services and Messages

Services are ROS's request/response mechanism, and they fail differently than topics: instead of silently not-publishing, a broken service call usually blocks, times out, or throws a clear error — which makes them easier to debug once you know where to look. This unit covers writing and inspecting a custom service definition and diagnosing common request/response bugs.

## Anatomy of a custom service definition

A `.srv` file is split into request and response sections by a `---` line:

```
# AddTwoInts.srv
int64 a
int64 b
---
int64 sum
```

Unlike messages, services are not "published" — they're called. The request fields go in before `---`, the response fields after. Both compile into distinct generated types (`AddTwoInts.Request` and `AddTwoInts.Response` in `rclpy`).

## Building and verifying the custom interface

After adding a `.srv` file to a package's `srv/` directory and wiring it into `CMakeLists.txt`/`package.xml` (for `ament_cmake`) or `setup.py` (for pure Python packages using `rosidl` generation via a sibling interfaces package), rebuild and confirm the type exists before writing any node code:

```bash
colcon build --packages-select my_interfaces
source install/setup.bash
ros2 interface show my_interfaces/srv/AddTwoInts
```

If `ros2 interface show` can't find your type, the build didn't register it — check for typos in `CMakeLists.txt`'s `rosidl_generate_interfaces()` call before suspecting your node code.

## Debugging a service call from the command line

You don't need a client node to test a service — `ros2 service` covers most diagnostics:

```bash
ros2 service list
ros2 service type /add_two_ints
ros2 service call /add_two_ints my_interfaces/srv/AddTwoInts "{a: 3, b: 4}"
```

If the call hangs indefinitely, the server node either isn't running or isn't advertising that service name — check with `ros2 service list` first. If it returns immediately with an error about the type, your request YAML doesn't match the generated request fields; re-check with `ros2 interface show`.

## Common service message pitfalls

- **Field name/case mismatches** between your `.srv` definition and the CLI call — YAML field names must match exactly.
- **Server not spinning** — a service server node that isn't calling `rclpy.spin()` (or an executor) will register the service but never process callbacks, so calls hang forever, not error out.
- **Blocking the server's own callback** — a service callback that itself waits on a topic that never arrives will hang the whole node, not just that call.

## Try it yourself

Define a small custom service with at least two request fields and one response field, build it, and confirm `ros2 interface show` reports it correctly. Write a server node that intentionally never calls `spin()`, call it from the CLI, and observe the hang — then fix the node and confirm the call now returns.
