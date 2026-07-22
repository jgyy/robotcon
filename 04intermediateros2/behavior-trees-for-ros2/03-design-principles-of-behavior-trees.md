# Behavior Trees for ROS2 — Unit 3: Design Principles of Behavior Trees

Knowing the node types from Unit 2 is not the same as being able to design a tree that stays readable and debuggable once it has fifty nodes instead of five. This unit covers the structural idioms — blackboards, ports, reactive patterns — that separate a maintainable BT from a mess.

## The blackboard and data ports

Nodes rarely work in total isolation; `DetectObject` needs to hand its result to `PickUpObject`. Rather than nodes calling each other directly (which would recreate tight coupling), BehaviorTree.CPP uses a shared key-value store called the **blackboard**. A node declares which blackboard entries it reads or writes via **ports**:

```cpp
class DetectObject : public BT::SyncActionNode
{
public:
  DetectObject(const std::string& name, const BT::NodeConfig& config)
    : BT::SyncActionNode(name, config) {}

  static BT::PortsList providedPorts()
  {
    return { BT::OutputPort<geometry_msgs::msg::Pose>("object_pose") };
  }

  BT::NodeStatus tick() override
  {
    geometry_msgs::msg::Pose pose = /* ...detection logic... */;
    setOutput("object_pose", pose);
    return BT::NodeStatus::SUCCESS;
  }
};
```

Any later node declares an `InputPort` with the same key to read it back. In XML, this is wired explicitly rather than left implicit:

```xml
<Sequence>
  <DetectObject object_pose="{target}"/>
  <PickUpObject object_pose="{target}"/>
</Sequence>
```

The `{target}` syntax marks a blackboard reference (as opposed to a literal string). This explicitness is deliberate: you can read the XML and know exactly what data flows between two nodes without opening any C++.

## Reactive vs. non-reactive control flow

A plain `Sequence` is non-reactive in a subtle way: once a later child is `RUNNING`, the tree does not re-check earlier children until that child finishes. If `BatteryOK` passed once at the start of a long navigation action, the tree won't notice the battery dying mid-navigation.

`ReactiveSequence` fixes this: on every tick it re-evaluates *all* prior children (not just the running one), so a condition that flips to `FAILURE` immediately interrupts the running action:

```xml
<ReactiveSequence>
  <BatteryOK/>
  <MoveToGoal goal="table"/>
</ReactiveSequence>
```

Now if `BatteryOK` fails while `MoveToGoal` is `RUNNING`, the sequence fails on this tick and `MoveToGoal` is halted. The trade-off is cost: reactive nodes re-tick their condition children every cycle, so use them for genuinely safety- or priority-relevant checks, not for one-time setup steps.

## Structuring large trees: subtrees and naming

Once a tree grows past a dozen or so nodes, inline it becomes unreadable. BehaviorTree.CPP lets you factor a chunk of tree into a named **subtree** and reference it elsewhere, exactly like extracting a function:

```xml
<root BTCPP_format="4">
  <BehaviorTree ID="PickAndPlace">
    <Sequence>
      <SubTree ID="Grasp" object="{target}"/>
      <SubTree ID="Deliver" object="{target}"/>
    </Sequence>
  </BehaviorTree>

  <BehaviorTree ID="Grasp">
    <!-- detect, approach, close gripper -->
  </BehaviorTree>

  <BehaviorTree ID="Deliver">
    <!-- navigate, open gripper -->
  </BehaviorTree>
</root>
```

Good design practice mirrors good function design: give each subtree a single clear responsibility, keep it testable in isolation (via a unit test that ticks just that subtree with a mock blackboard), and give nodes verb-based names (`DetectObject`, not `Detector` or `Check1`) so the printed tree reads like a sentence.

## Try it yourself

Take the "fetch a coffee mug" tree you sketched in Unit 2 and refactor it: (1) introduce a blackboard port so the detected mug's pose flows from a detection node into the grasp node, and (2) wrap the "battery check + navigate" portion in a `ReactiveSequence` so a low-battery event can interrupt an in-progress approach. Write out the resulting XML.
