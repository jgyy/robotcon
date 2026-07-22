# Robot Fleet Management in ROS2 v2 — Unit 13: Interaction With Other Systems

Fleets don't operate in isolation from the rest of a facility's automation. This unit covers integrating RMF with non-robot systems — the doors and lifts you'll configure in Units 15-17, plus arms and other fixed automation.

## The general pattern: adapters for everything, not just robots

RMF applies the same adapter pattern used for mobile robots (Units 5-6) to fixed infrastructure. A door or lift gets a lightweight adapter node that translates between RMF's request/state interface and that system's actual control protocol (a PLC, a building management system API, a vendor SDK). The mobile-robot fleet adapter and a door adapter are structurally the same idea: RMF sends an abstract command, the adapter executes it on real hardware, and reports state back.

## Door and lift interfaces

RMF defines standard message types for doors and lifts so any door/lift adapter, regardless of hardware, presents the same interface to the traffic scheduler:

```bash
ros2 interface show rmf_door_msgs/msg/DoorRequest
ros2 interface show rmf_door_msgs/msg/DoorState
ros2 interface show rmf_lift_msgs/msg/LiftRequest
ros2 interface show rmf_lift_msgs/msg/LiftState
```

A robot's fleet adapter, when its route requires passing through a door, publishes a `DoorRequest` and waits for `DoorState` to report `OPEN` before proceeding — it never needs to know whether that door is a swing door on a servo or an automatic sliding door on a separate building system.

## Integrating a robot arm as a task participant

For fixed automation like a pick-and-place arm at a workstation, the integration typically isn't "the arm moves through the traffic graph" (it's stationary) but rather "the arm is the target of a custom action" — combining the door/lift adapter pattern with the custom-task pattern from Unit 8:

```python
def perform_action(self, robot_name, category, description, execution):
    if category == "arm_pick":
        self._trigger_arm_pick_sequence(description["item_id"])
        execution.finished()
```

A mobile robot arrives at the workstation waypoint, RMF triggers the `arm_pick` action, and the arm (via its own bridge to whatever arm controller you're using, e.g. MoveIt) executes independently of the traffic scheduler, since it isn't itself navigating the shared space.

## Writing an adapter for an arbitrary building system

For anything without a pre-defined RMF message type (a turnstile, a freight elevator with a proprietary API, a warehouse conveyor), the pattern is: define a minimal ROS 2 service or topic pair that represents "request state change" and "report current state," then have your fleet adapters treat it the same way they treat doors — check state before proceeding, and don't advance until it's satisfied.

## Try it yourself

Write a minimal simulated "conveyor" adapter node that publishes a custom `ConveyorState` (idle/running) and accepts a `ConveyorRequest` (start/stop) over a topic. Extend one of your fleet adapters from Unit 8 so a `load_conveyor` custom action requests the conveyor to start, polls its state, and calls `execution.finished()` once it reports idle again (simulating load completion).
