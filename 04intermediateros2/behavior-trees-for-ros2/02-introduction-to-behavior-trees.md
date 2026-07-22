# Behavior Trees for ROS2 — Unit 2: Introduction to Behavior Trees

This unit builds the vocabulary and mental model you'll use for the rest of the course: what a node is, what "ticking" means, the three-status return contract, and the handful of control-flow node types that every BT is built from.

## Nodes, ticks, and status

A Behavior Tree is a directed tree of nodes. Execution happens by "ticking" the root at some frequency (or reactively, on an event); a tick propagates down through children according to each node's own rules, and every ticked node returns exactly one of three statuses:

- `SUCCESS` — the node's job is done and succeeded.
- `FAILURE` — the node's job is done and failed.
- `RUNNING` — the node needs more time; it will be ticked again on the next cycle before a final result is known.

`RUNNING` is what separates BTs from a plain decision tree: long-running actions like "navigate to a waypoint" or "wait for a gripper to close" don't block the tree — they report `RUNNING` and get re-ticked, letting the tree stay responsive to changes elsewhere (like a higher-priority interrupt) while the action is in flight.

Nodes fall into two broad categories:

- **Leaf nodes** do actual work: `Condition` nodes check something and return `SUCCESS`/`FAILURE` without side effects; `Action` nodes do something in the world (and may return `RUNNING` while it's in progress).
- **Control-flow nodes** have children and decide which of them to tick, and in what order, based on the children's returned statuses.

## The core control-flow nodes

**Sequence** ticks its children left to right and succeeds only if *all* of them succeed. It fails (and stops ticking further children) as soon as one child fails. Think "AND, in order":

```xml
<Sequence>
  <IsDoorClosed/>
  <OpenDoor/>
  <WalkThroughDoor/>
</Sequence>
```

**Fallback** (sometimes called `Selector`) also ticks children left to right, but succeeds as soon as *one* child succeeds, and only fails if all of them fail. Think "OR, in priority order" — this is your mechanism for expressing "try the preferred approach, then the backup":

```xml
<Fallback>
  <DockAtChargingStation/>
  <RequestHumanAssistance/>
</Fallback>
```

**Parallel** ticks all of its children on every tick (rather than stopping early) and succeeds/fails based on configurable success/failure thresholds — useful for "monitor for an obstacle *while* driving forward".

**Decorator** nodes wrap a single child and modify its behavior or result — for example `Inverter` flips `SUCCESS`↔`FAILURE`, `Retry` re-ticks a failed child up to N times, and `Timeout` forces `FAILURE` if the child stays `RUNNING` too long.

## Reading a tree end-to-end

Combine the above into something closer to a real robot decision:

```xml
<Fallback>
  <Sequence>
    <BatteryOK/>
    <Retry num_attempts="3">
      <MoveToGoal goal="table"/>
    </Retry>
    <PickUpObject/>
  </Sequence>
  <ReturnToBase/>
</Fallback>
```

Trace it: if the battery check fails, the whole `Sequence` fails immediately (short-circuit, just like `&&` in code) and the outer `Fallback` moves on to `ReturnToBase`. If the battery is fine but navigation fails three times in a row, the `Retry` decorator finally reports `FAILURE`, which again fails the `Sequence` and falls back to returning to base. Only if every step succeeds does the whole tree succeed without ever reaching `ReturnToBase`.

## Try it yourself

Sketch (on paper or in XML) a small BT for a "fetch a coffee mug" behavior with this priority order: (1) if a mug is already gripped, go straight to delivering it; (2) otherwise try to detect and grasp a mug up to 2 times; (3) if grasping still fails, ask for help instead of failing silently. Identify which control-flow node you used at the top level and why a `Sequence` alone couldn't express the retry-then-fallback logic.
