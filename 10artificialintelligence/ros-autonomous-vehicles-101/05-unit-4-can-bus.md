# ROS Autonomous Vehicles 101 — Unit 4: CAN-Bus

Everything so far has commanded a simulated car through `/cmd_vel`. Real vehicles don't listen to ROS topics — they listen to CAN-Bus. This unit covers what CAN-Bus is, what a Drive-By-Wire (DBW) interface is, and how to bridge ROS commands onto it.

## What CAN-Bus is
The **Controller Area Network (CAN)** bus is the wiring standard nearly every production vehicle uses to let its electronic control units (ECUs) — engine, brakes, steering, dashboard — talk to each other over a shared pair of wires. It's decades old, extremely robust to electrical noise, and deliberately simple: every message (a "frame") has a numeric ID and up to 8 bytes of data, broadcast to every device on the bus. Each ECU decides for itself which IDs to pay attention to.

A CAN frame, conceptually:

```
ID: 0x120        (which signal this is — e.g. "steering angle")
Data: [0x03, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]  (8 bytes, meaning defined per-ID)
```

There is no universal meaning for a given ID — the mapping from ID and byte offsets to physical values (steering angle, throttle percentage, wheel speed) is defined by the vehicle manufacturer or, for an aftermarket/research platform, by whoever wired up the DBW kit. That mapping is usually published as a **DBC file**, a text format describing every signal on the bus.

## The Drive-By-Wire (DBW) interface
"Drive-by-wire" means there's no direct mechanical link between the pedals/wheel and the engine/brakes/steering — everything is electronic, which is what makes it possible for software to drive the car at all. A DBW kit exposes a defined set of CAN signals for exactly the controls you need to automate:

- Throttle command / throttle report (commanded vs. actual, so you can verify the command took effect)
- Brake command / brake report
- Steering angle command / steering report
- Gear selector
- Enable/disable signal — critical for Unit 3's emergency stop to have somewhere to go

The command/report pairing matters: a Level 3 system must confirm the vehicle actually did what it was told, not just assume the CAN frame was obeyed.

## Bridging ROS to CAN
On Linux, CAN interfaces show up as network devices via **SocketCAN**, which means standard tools work directly:

```bash
# bring up a CAN interface (hardware) or virtual one (testing)
sudo ip link set can0 up type can bitrate 500000
# or for a virtual bus with no hardware:
sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0

# watch raw traffic
candump vcan0

# send a test frame
cansend vcan0 120#03E800000000000
```

On the ROS side, a bridge node subscribes to your normal ROS control topics and translates each command into the correct CAN frame ID/byte layout for your DBC, and does the reverse for report messages coming back — packages such as `ros2_socketcan` provide the low-level ROS-to-SocketCAN plumbing so you're only responsible for the DBC-specific encode/decode logic, not raw socket handling.

A minimal encode step, once you know the byte layout from the DBC:

```python
import struct

def encode_steering_command(angle_rad: float) -> bytes:
    # example: signal scaled by 1000, signed 16-bit, big-endian
    scaled = int(angle_rad * 1000)
    return struct.pack('>h', scaled).ljust(8, b'\x00')
```

## GPS over CAN
Some DBW-equipped vehicles also broadcast GPS data as CAN signals rather than (or in addition to) a separate GPS receiver on ROS — the same decode approach applies: look up the signal's ID and byte layout in the DBC, then decode it the same way you would throttle or steering, and republish it as a standard `NavSatFix` so the rest of your stack (Unit 2) doesn't need to know the difference.

## Try it yourself
Bring up a virtual CAN interface (`vcan0`), use `cansend` to send a hand-crafted frame, and confirm it with `candump` in a second terminal. Then write a tiny Python script using the `python-can` library (or plain sockets) to send the same frame programmatically — this is the exact pattern a ROS-to-CAN bridge node uses internally.
