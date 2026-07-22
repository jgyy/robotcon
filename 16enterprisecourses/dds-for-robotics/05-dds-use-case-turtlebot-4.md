# DDS for Robotics — Unit 5: DDS Use Case: TurtleBot 4

Theory becomes concrete when you look at a real, widely-deployed robot's network topology — this unit walks through the TurtleBot 4 as a worked example of DDS decisions that matter in practice.

## Why TurtleBot 4 is a useful case study
The TurtleBot 4 (built on the iRobot Create 3 base with a Raspberry Pi compute module, running ROS 2) is a common reference platform precisely because its network setup exposes the same problems you'll hit on any real robot: it has multiple compute nodes talking over both an internal link and WiFi to an operator's laptop, it's expected to be discoverable on a shared lab network with other robots, and it ships with an opinionated default DDS configuration (Cyclone DDS) that you'll want to understand rather than fight.

## The two-computer, two-network topology
A TurtleBot 4 actually runs ROS 2 nodes on *two* separate computers — the Create 3 base's own controller and the Raspberry Pi payload — bridged over an internal Ethernet-over-USB or WiFi link, while your development laptop joins the *same* ROS 2 domain over the lab WiFi. This means DDS discovery traffic has to cross two network hops, not one, and any of the following can each independently break it:
- The base and Pi disagreeing on `ROS_DOMAIN_ID`.
- The lab WiFi access point filtering multicast (see Unit 6) between the robot and your laptop, even though base-to-Pi communication works fine.
- Client isolation / "AP isolation" settings on the WiFi router silently dropping peer-to-peer traffic between two WiFi-connected devices (a very common enterprise/campus WiFi default).

```bash
# On each machine that should share the ROS 2 graph:
export ROS_DOMAIN_ID=42          # must match across all participants
ros2 doctor --report | grep -i domain
```

## Diagnosing a TurtleBot-style split network
The standard triage sequence: confirm domain ID matches everywhere, confirm multicast reachability between the two networks with `ping` to a multicast address, then confirm whether unicast discovery (a fallback some DDS vendors support) is configured. Cyclone DDS in particular supports explicit peer lists as a workaround for broken multicast — this is exactly the kind of manual configuration Unit 7 covers in depth:

```xml
<!-- excerpt of a Cyclone DDS config used to bypass multicast discovery -->
<Discovery>
  <Peers>
    <Peer Address="192.168.1.50"/>   <!-- explicit IP of the other participant -->
  </Peers>
</Discovery>
```

## Lessons that generalize beyond this one robot
The TurtleBot 4 case generalizes to any fleet or multi-compute robot: split networks are the norm, not the exception, once a robot has more than one onboard computer plus an operator station. The habit worth building here is to always draw the actual network topology (which device, which interface, which subnet) before touching DDS configuration — most "DDS is broken" reports turn out to be "the network topology doesn't allow multicast between these two specific nodes."

## Try it yourself
Sketch (on paper or in a text file) the network topology of a robot you have access to, or a hypothetical fleet robot with an onboard computer + WiFi operator laptop. Mark every network hop, then annotate each hop with whether you'd expect multicast to work across it by default. This diagram is the same first step you'd take debugging a real TurtleBot 4 discovery failure.
