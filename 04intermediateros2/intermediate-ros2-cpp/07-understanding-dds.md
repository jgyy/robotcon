# Intermediate ROS2 (C++) — Unit 7: Understanding DDS

Everything from Unit 6's QoS policies down to how two ROS 2 nodes find each other on a network is implemented by DDS, the middleware ROS 2 is built on top of. This unit pulls back the last layer of the stack: what DDS actually is, how to inspect and swap the implementation your system is using, and the daemon process that helps ROS 2 CLI tools work quickly.

## What DDS is

DDS (Data Distribution Service) is an OMG-standardized middleware for real-time, distributed publish/subscribe communication, originally designed for domains like defense and industrial control that predate ROS 2 by years. Rather than inventing its own transport layer, ROS 2 is built as a thin layer (`rmw`, the ROS middleware interface) on top of DDS, which is why concepts like QoS, "domains," and discovery in ROS 2 map directly onto DDS concepts rather than being ROS-specific inventions.

## Foundations of DDS

DDS nodes discover each other automatically over the network via a discovery protocol — no central broker or master process is involved, which is a deliberate difference from ROS 1's `roscore`. Communication is scoped by a **domain ID** (`ROS_DOMAIN_ID` in ROS 2), so multiple independent ROS 2 systems can share a network without seeing each other's traffic as long as they use different domain IDs. Every topic, service, and the QoS policies from Unit 6 are DDS-level concepts that `rclcpp` exposes through a ROS-shaped API.

## Checking the current middleware

You can always find out which DDS implementation a given ROS 2 install is actually using:

```bash
echo $RMW_IMPLEMENTATION
ros2 doctor --report | grep -i middleware
```

If `RMW_IMPLEMENTATION` is unset, ROS 2 falls back to whichever `rmw` implementation was set as the build-time default for that distribution.

## DDS implementations and how to switch

ROS 2 ships support for multiple interchangeable DDS implementations behind the same `rmw` interface — common ones include Fast DDS (the typical out-of-the-box default), Cyclone DDS, and Connext. Because they all implement the same `rmw` API, switching is usually just an environment variable, with no code changes required:

```bash
sudo apt install ros-${ROS_DISTRO}-rmw-cyclonedds-cpp
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ros2 run demo_nodes_cpp talker
```

Different implementations vary in discovery speed, memory footprint, and behavior on constrained or high-packet-loss networks, which is why some teams pick a non-default one for a specific robot or deployment. Every node in a system needs to use the *same* implementation to talk to each other — mixing implementations across nodes on the same domain is a common cause of nodes that simply never discover one another. Refer to docs.ros.org for the currently supported implementations per distribution.

## The ROS 2 daemon

The `ros2` CLI tools (`ros2 topic list`, `ros2 node info`, etc.) don't perform DDS discovery from scratch on every invocation — a background **daemon** process keeps a live view of the graph so those commands respond quickly. You'll occasionally need to restart it after certain network or `RMW_IMPLEMENTATION` changes if the CLI seems to be reporting stale information:

```bash
ros2 daemon status
ros2 daemon stop
ros2 daemon start
```

## Sources and further reading

The DDS specification is maintained by the Object Management Group; ROS 2's own documentation at docs.ros.org covers the `rmw` abstraction layer, the list of supported DDS vendors per distribution, and how domain IDs and discovery are configured in more depth than fits here.

## Try it yourself

Run `ros2 doctor --report` on your current setup and note which `rmw` implementation is active. If a second implementation is available (or installable) on your system, set `RMW_IMPLEMENTATION` to it in two separate terminals, run a publisher in one and a subscriber in the other, and confirm they still discover each other — then try leaving one terminal on the original implementation and observe that they no longer connect.
