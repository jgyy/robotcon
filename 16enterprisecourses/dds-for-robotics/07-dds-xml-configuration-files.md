# DDS for Robotics — Unit 7: DDS XML Configuration Files

Once you understand what discovery and QoS are doing (Units 4 and 6), this unit teaches you to actually change that behavior via each vendor's XML configuration format, rather than relying on ROS 2 defaults.

## Why XML config instead of code
DDS QoS and transport settings *can* be set per-publisher in application code (Unit 4 showed this), but that only covers what `rclpy`/`rclcpp` expose, and it has to be recompiled/redeployed per change. Vendor XML configuration files instead let you tune the underlying DDS implementation's behavior — transport selection, discovery peers, buffer sizes, thread priorities — without touching application code at all, and they're loaded via an environment variable at process startup:

```bash
# Cyclone DDS
export CYCLONEDDS_URI=file:///home/user/cyclonedds.xml
# Fast DDS
export FASTRTPS_DEFAULT_PROFILES_FILE=/home/user/fastdds.xml
```

## A minimal Cyclone DDS profile
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<CycloneDDS xmlns="https://cdds.io/config">
  <Domain id="any">
    <General>
      <Interfaces>
        <NetworkInterface name="wlan0" priority="default" multicast="default"/>
      </Interfaces>
    </General>
    <Discovery>
      <Peers>
        <Peer Address="192.168.1.50"/>   <!-- explicit unicast fallback -->
      </Peers>
      <ParticipantIndex>auto</ParticipantIndex>
    </Discovery>
  </Domain>
</CycloneDDS>
```
This pins Cyclone DDS to a specific interface (avoiding the "which NIC does discovery go out of" ambiguity from Unit 2) and adds an explicit peer so discovery works even if multicast is blocked.

## A minimal Fast DDS profile
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<dds xmlns="http://www.eprosima.com">
  <profiles>
    <transport_descriptors>
      <transport_descriptor>
        <transport_id>udp_transport</transport_id>
        <type>UDPv4</type>
      </transport_descriptor>
    </transport_descriptors>
    <participant profile_name="robot_participant" is_default_profile="true">
      <rtps>
        <userTransports>
          <transport_id>udp_transport</transport_id>
        </userTransports>
        <useBuiltinTransports>false</useBuiltinTransports>
      </rtps>
    </participant>
  </profiles>
</dds>
```
Fast DDS's profile structure separates *transport descriptors* (how bytes move — UDP, shared memory, TCP) from *participant/publisher/subscriber profiles* (QoS and discovery behavior), and profiles are referenced by name, so one file can define multiple named configurations for different nodes.

## Practical workflow
1. Reproduce the problem with defaults and capture it (Unit 3's Wireshark skills).
2. Identify the specific setting to change (peer list, interface binding, reliability, history depth).
3. Write the smallest XML file that changes only that setting — don't copy a huge example file wholesale, since unrelated settings can have side effects.
4. Re-run with the environment variable set and re-capture to confirm the wire behavior actually changed.

## Try it yourself
Write a Cyclone DDS XML file that restricts discovery to a single named network interface on your machine (use `ip addr show` from Unit 2 to get its name), set `CYCLONEDDS_URI` to point at it, and run a talker/listener pair. Use `tcpdump -i <other-interface>` to confirm no discovery traffic leaves through interfaces you didn't list.
