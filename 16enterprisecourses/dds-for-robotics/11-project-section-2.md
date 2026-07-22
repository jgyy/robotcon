# DDS for Robotics — Unit 11: Project - Section 2

With a baseline captured in Section 1, this section has you deliberately diagnose and fix whatever discovery/QoS problems your two-host setup showed, using the XML configuration and QoS tuning skills from Units 4, 6, and 7.

## Diagnose before you fix
Resist the urge to change settings speculatively. Using your Section 1 capture and report, identify the *specific* failure category:
- **No discovery at all** — no `DATA(p)` packets cross between hosts (common on Docker bridge networks or multicast-filtered WiFi).
- **Discovery succeeds, data doesn't flow** — participants see each other but `ros2 topic echo` on the subscriber gets nothing (check for a QoS mismatch via `ros2 topic info -v`, per Unit 4).
- **Data flows but is unreliable** — messages arrive late, out of order, or are dropped under load (check HEARTBEAT/ACKNACK patterns in Wireshark, per Unit 3).

Write down which category (or combination) applies to your baseline before touching configuration.

## Apply a targeted fix
Depending on your diagnosis, apply one of:
- **Multicast blocked** → add an explicit unicast peer list via Cyclone DDS or Fast DDS XML config (Unit 7), pointing each host directly at the other's IP.
- **QoS mismatch** → align `reliability`/`durability` between publisher and subscriber explicitly in code, rather than relying on defaults, and re-verify with `ros2 topic info -v`.
- **Wrong interface selected** → pin the DDS implementation to the correct network interface in XML config (Unit 7), especially relevant if a host has more than one NIC (Unit 2).

Example: a Cyclone DDS peer-list fix for a Docker bridge network where multicast is unreliable:
```xml
<CycloneDDS xmlns="https://cdds.io/config">
  <Domain id="any">
    <Discovery>
      <Peers>
        <Peer Address="172.18.0.2"/>   <!-- other container's bridge IP -->
        <Peer Address="172.18.0.3"/>
      </Peers>
    </Discovery>
  </Domain>
</CycloneDDS>
```

## Re-capture and compare
Repeat the exact capture procedure from Section 1 (same duration, same filter) with the fix applied. Save it as `section2_fixed.pcapng`. Open both captures side by side and confirm, with specific packet evidence, that the failure mode you diagnosed is gone — e.g. `DATA(p)` packets now present where they were absent, or ACKNACK patterns showing successful retransmission instead of stalled reliable delivery.

## Section 2 deliverables
1. A written diagnosis (which failure category, with capture evidence).
2. The exact XML config or code change applied, with a one-paragraph explanation of *why* that specific change addresses the diagnosed cause.
3. A `section2_fixed.pcapng` capture and a short before/after comparison note.

## Try it yourself
If your Section 1 baseline actually worked without issue (possible on a permissive local network), deliberately break it first — set mismatched QoS reliability policies between publisher and subscriber — capture that failure, then apply and verify the fix. The goal is to practice the full diagnose-fix-verify loop at least once, even if your original environment was cooperative.
