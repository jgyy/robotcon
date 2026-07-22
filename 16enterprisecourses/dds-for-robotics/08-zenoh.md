# DDS for Robotics — Unit 8: Zenoh

Having seen DDS discovery's scaling and multicast problems firsthand (Unit 6), this unit introduces Zenoh — a pub/sub/query protocol that ROS 2 can use as a drop-in alternative middleware specifically to sidestep those problems.

## What Zenoh is, and isn't
Zenoh ("Zero Overhead Network Protocol") is not a DDS implementation — it's a separate protocol designed from the start for constrained, wireless, and WAN networks, built around explicit routing and brokered discovery rather than DDS's default multicast-everywhere approach. ROS 2 supports it via `rmw_zenoh_cpp`, an `rmw` implementation just like `rmw_cyclonedds_cpp`, meaning you switch to it the same way you switch DDS vendors:

```bash
sudo apt install ros-<distro>-rmw-zenoh-cpp
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
```

Because Zenoh implements the same `rmw` interface, your publisher/subscriber code is unchanged — only the wire protocol and discovery mechanism underneath differ.

## Why Zenoh addresses the problems from Unit 6
Zenoh's key architectural difference is a *router* (`zenohd`) that participants connect to, rather than every participant multicasting to every other participant. This turns discovery from O(N²) mesh announcements into connections funneled through a known router, which:
- Works over networks that block multicast entirely (cloud VPCs, most WiFi APs, cross-subnet WAN links) since routers can be reached by plain unicast/TCP.
- Scales far better for large fleets, since discovery load stays roughly constant per participant rather than growing with fleet size.
- Supports bridging separate physical sites over the internet, which plain DDS multicast discovery cannot do without VPN-level tricks.

```bash
zenohd                                    # start a router, defaults to listening on 7447/tcp
export ZENOH_ROUTER=tcp/<router-ip>:7447  # point ROS 2 nodes at it (name may vary by version)
```

## Trade-offs to understand before adopting it
Zenoh is not a strict superset of DDS behavior — QoS semantics, some discovery timing characteristics, and tooling maturity differ, and `rmw_zenoh_cpp` support/version compatibility with a given ROS 2 distribution should be checked against docs.ros.org before committing a production robot to it. For a single robot on a clean local network, plain DDS is often simpler; Zenoh earns its complexity specifically at fleet scale or across unreliable/WAN links — exactly the profile the TurtleBot 4 case study (Unit 5) started to hint at.

## Try it yourself
Install `rmw_zenoh_cpp`, start a local `zenohd` router, set `RMW_IMPLEMENTATION=rmw_zenoh_cpp` on two terminals, and run a talker/listener pair. Then capture traffic with `tcpdump -i lo` and compare what you see against the RTPS multicast traffic you captured in Unit 3 — confirm the packets now go point-to-point through the router's port instead of to a multicast address.
