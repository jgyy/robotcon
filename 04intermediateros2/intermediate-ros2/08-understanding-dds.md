# Intermediate ROS2 — Unit 8: Understanding DDS

QoS policies (Unit 7) are ROS 2's exposed surface of a much larger system underneath: DDS, the Data Distribution Service, an OMG industry standard for real-time, peer-to-peer publish-subscribe networking that ROS 2 uses as its default middleware. Understanding DDS itself — not just the ROS 2 API on top of it — explains a lot of ROS 2 behavior that otherwise looks arbitrary: automatic peer discovery, why there's no `roscore` anymore, and why network configuration matters more than it did in ROS 1.

## Why ROS 2 has no master

ROS 1 required a `roscore` process that every node registered with, and through which nodes discovered each other. ROS 2 has no equivalent: DDS implementations do **peer-to-peer discovery** using multicast (by default) — every DDS participant on the network periodically announces itself, and every other participant listens. Two nodes on the same network with compatible QoS and matching topic names/types will find each other and connect automatically, with no central process to start, and no single point of failure to lose.

This also explains a common point of confusion: if you run ROS 2 nodes in two separate Docker containers or two machines and they don't see each other, it is almost always a multicast/networking problem (firewall, container network mode, `ROS_DOMAIN_ID` mismatch), not a "forgot to start roscore" problem — there is no such process to forget.

## RMW: swappable DDS implementations

ROS 2 doesn't hardcode one DDS vendor. The **RMW** (ROS Middleware) layer is an abstraction that lets you swap DDS implementations without changing your application code — common choices include Fast DDS, Cyclone DDS, and Connext, each with different performance and licensing tradeoffs.

```bash
echo $RMW_IMPLEMENTATION
RMW_IMPLEMENTATION=rmw_cyclonedds_cpp ros2 run my_pkg counter
```

All nodes that need to talk to each other must use the same RMW implementation (or at least compatible ones) — mixing Fast DDS and Cyclone DDS nodes on the same topic is another common cause of silent non-communication, alongside the QoS mismatches from Unit 7.

## Domain IDs: isolating groups of nodes

`ROS_DOMAIN_ID` partitions DDS discovery — nodes with different domain IDs simply never discover each other, even on the same physical network. This is the standard way to run multiple independent ROS 2 systems (two students' robots on the same lab Wi-Fi, or CI jobs running in parallel) without them interfering:

```bash
export ROS_DOMAIN_ID=42
ros2 daemon stop && ros2 daemon start   # restart the daemon to pick up the change
```

Valid domain IDs fall in a bounded range that's documented on docs.ros.org and varies slightly by RMW implementation and OS — pick something unlikely to collide with the default (`0`) or your neighbors' choices, and check the docs for the safe upper bound on your platform.

## Discovery costs and tuning

DDS discovery traffic scales with the number of participants and topics — every node discovers every other node's every topic, service, and action by default, which can produce noticeable network chatter on large systems (many nodes, many robots on one network). `ROS_LOCALHOST_ONLY=1` restricts discovery to loopback, useful for single-machine development where you don't want to announce yourself on the LAN at all. Larger deployments often reach for **Discovery Server** (a Fast DDS feature that replaces multicast discovery with a centralized, more scalable lookup) once the multicast approach starts costing too much bandwidth or takes too long to stabilize on join.

## Try it yourself

Start a talker and listener demo node (or your own counter/subscriber pair) normally and confirm they communicate. Then start the listener again in a second terminal with a different `ROS_DOMAIN_ID` set and confirm it no longer receives anything, with no error on either side — this is the exact "silent by design" behavior DDS discovery produces, and it's worth seeing once deliberately.
