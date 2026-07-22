# ROS Manipulation in 5 Days — Unit 7: Project

This closing unit has no new theory — it's where everything from Units 1–6 gets assembled into one working pick-and-place task that you design, build, and run end to end, the same shape of project you'd be handed on the job.

## The brief

Build a node that, given a manipulator with a working MoveIt configuration, performs a complete pick-and-place cycle: start from a known pose, move to and grasp an object at a known (or perceived) location, carry it to a second location without collision, place it down, and return to the start pose. Treat "known location" as an acceptable simplification for this project — the goal is to prove out the manipulation pipeline, not to also build an object detector from scratch.

## Breaking it into milestones

Rather than writing one monolithic script, build and verify each stage independently before chaining them — this is both good engineering practice and the fastest way to debug when something goes wrong later:

1. **Scene setup** — add the target object and any obstacles as `CollisionObject`s to the planning scene (or confirm your Unit 4 octomap sensor sees them).
2. **Pre-grasp reach** — plan and execute a move to the pre-grasp pose above the object; verify no collisions and a sensible approach direction.
3. **Grasp + attach** — close the gripper, attach the object, retreat; verify the object's collision geometry follows the gripper in RViz.
4. **Transit to place pose** — plan a move to the place location with the object attached; this is where an under-sized collision margin around the carried object tends to surface as near-misses.
5. **Place + detach** — open the gripper, detach the object at its new pose, retreat.
6. **Return home** — plan back to the start/named pose.

Wrap each milestone's plan/execute call with a success check (MoveIt's plan results and execute calls both report success/failure) and log which stage failed rather than letting the node silently stop — you'll thank yourself the first time step 4 fails because step 3 left the gripper in the wrong orientation.

## A minimal state machine

You don't need a formal framework for a task this size — a straightforward Python state machine (or even a linear script with checks between stages) is enough:

```python
stages = ["approach", "grasp", "attach", "transit", "place", "detach", "home"]
for stage in stages:
    success = run_stage(stage)   # your per-stage function, returns bool
    if not success:
        node.get_logger().error(f"Pick-and-place failed at stage: {stage}")
        break
```

If you want this to be reusable, wrap the whole sequence behind a ROS service or action server (`Task.srv` / `PickPlace.action`) so other nodes can trigger it and get a result back — this is also how you'd eventually integrate it with a task planner or a perception pipeline that decides *what* to pick.

## Evaluation checklist

Before considering the project done, confirm: the full cycle runs without manual intervention between stages; the arm never collides with the object, the table, or itself during the carry (watch this closely at stage 4); the object ends up at the intended place pose within a reasonable tolerance; and re-running the whole node from a cold start produces the same result. If any of those don't hold, that's a legitimate bug to chase, not a detail to wave away.

## Where to go next

Once this project runs reliably, the natural extensions are: replace the known object pose with a real perception pipeline (object detection + pose estimation, feeding a `PoseStamped` into your grasp computation from Unit 6), swap the heuristic grasp for a learned grasp generator scored against a point cloud, or move the whole pipeline from a fake controller onto a simulated or real arm with actual physics and timing constraints. Each of those is a substantial topic in its own right — this course has given you the manipulation backbone they all plug into.

## Try it yourself

Run your full pick-and-place node against your Unit 3 MoveIt config, with at least one obstacle in the scene the arm must route around during transit (reuse your Unit 4 octomap setup, or a hand-added `CollisionObject`). Record which of the six milestones took the most iterations to get right, and why — that's usually the most useful thing to carry forward into the next manipulation project you tackle.
