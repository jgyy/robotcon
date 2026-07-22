# Ai Robot Arm Project — Unit 1: Hardware Setup, BOM, and First Bring-Up

Every VLA (vision-language-action) project lives or dies on the quality of the hardware it collects data from. This unit gets you from a box of parts to two working, calibrated robot arms that talk to your computer over a serial bus — the physical foundation for everything else in the course.

## Why a leader/follower pair

Low-cost imitation-learning arms like the SO-101 are almost always used in pairs: a **leader** arm that a human moves by hand, and a **follower** arm that mirrors it in real time. The leader has no motors doing active control — you backdrive it with your hand — while the follower's servos replay the leader's joint angles. This setup exists because it is the cheapest possible way to collect high-quality (observation, action) pairs: you literally demonstrate the task, and every joint-angle command you produce becomes a training label. Contrast this with scripted or hand-coded motion, which does not generalize the way a learned policy does. Understanding this asymmetry (leader = passive sensor, follower = actuator) will save you a lot of confusion later when you read training code that treats "action" as "the leader's joint positions."

## Bill of materials and assembly

A typical build for this kind of project includes:

- **Two identical arm kits** (leader + follower) — usually 3D-printed or laser-cut frames driven by serial bus servos (e.g. Feetech STS-series or Dynamixel-class motors), 5-6 degrees of freedom plus a gripper.
- **A USB-to-serial adapter per arm** (or a shared bus with separate power injection) to talk to the servo chain from your PC.
- **A regulated power supply** sized for stall current across all servos at once — undersizing this is the single most common cause of "random" resets during teleoperation.
- **One or more USB cameras** mounted to observe the workspace (wrist-mounted and/or a static top-down view are common choices).
- **A mounting surface/clamp** so the follower arm doesn't walk across the table under its own torque.

Assembly order matters: mount and center every servo horn *before* attaching arm links, so each joint's zero position lines up with the physical center of its range of motion. Skipping this step is the single most common reason people fight with inverted or clipped joint limits later.

## Wiring, motor IDs, and calibration

Bus servos share one serial line, so every motor on the chain needs a unique numeric ID before anything else works. Most vendor toolchains give you a scan/configure workflow that looks roughly like this:

```bash
# discover which serial port each arm is connected to
python -m lerobot.find_port

# with only ONE servo connected at a time, assign it a unique bus ID
python -m lerobot.setup_motor --port /dev/ttyUSB0 --motor-id 1
```

Repeat the ID-assignment step once per joint, working outward from the base, and label each connector as you go — mixing up shoulder and elbow IDs is a classic bring-up mistake that looks like a software bug.

## First bring-up: reading and driving positions

Once every servo has a stable ID, verify the bus end-to-end with a minimal read/write test before touching any training code:

```python
from lerobot.common.robot_devices.motors.feetech import FeetechMotorsBus

bus = FeetechMotorsBus(
    port="/dev/ttyUSB0",
    motors={
        "shoulder_pan": (1, "sts3215"),
        "shoulder_lift": (2, "sts3215"),
        "elbow_flex": (3, "sts3215"),
        "wrist_flex": (4, "sts3215"),
        "wrist_roll": (5, "sts3215"),
        "gripper": (6, "sts3215"),
    },
)
bus.connect()
print(bus.read("Present_Position"))   # should return one value per joint
bus.disconnect()
```

If this returns six sane values (not zeros, not error codes) for both arms, your electrical and driver layers are solid and you're ready to move on to calibration ranges and, in the next unit, actual teleoperation.

## Try it yourself

Wire up one arm fully, assign IDs to all of its servos, and write a short script that reads every joint's position once per second while you manually move the arm through its full range of motion. Confirm the reported values change smoothly and monotonically with no dropouts — that's your bring-up sanity check before you ever connect a second arm.
