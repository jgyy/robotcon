# Mastering Mobile Manipulators — Unit 4: Setting Up Grasping

Planning to a pose is only half of pick-and-place — the other half is deciding *which* pose to plan to (the grasp), coordinating the gripper with the arm's motion, and making sure MoveIt's collision checker knows about the object you're about to touch. This unit builds the full pick-and-place sequence.

## Anatomy of a pick-and-place task

Break it into discrete, individually testable steps rather than one monolithic motion:

1. **Approach** — move to a pose offset above/behind the object (the "pre-grasp" pose), clear of collisions, gripper open.
2. **Grasp approach** — move in a straight line (Cartesian path) from pre-grasp to the actual grasp pose, since a straight-line approach is far less likely to knock the object over than an arbitrary joint-space path.
3. **Close the gripper** and attach the object to the planning scene as part of the robot (so MoveIt stops treating it as a static obstacle and starts moving it with the arm).
4. **Retreat** — lift straight back up/out to a clear pose.
5. **Transport** — plan (with the object attached) to a pre-place pose near the destination.
6. **Place approach, release, retreat** — the mirror image of steps 2-4: approach, open the gripper, detach the object from the scene, retreat.

Keeping these as separate, named steps makes the sequence easy to drive from a state machine in Unit 5, and easy to debug — you can tell *which* step failed instead of "pick and place failed."

## Generating the grasp pose

The grasp pose usually comes from perception output (object pose estimate) plus a fixed offset that describes *how* your gripper should approach that object type — e.g. "approach from directly above, gripper fingers aligned with the object's shorter axis." For simple, known objects a hand-authored offset table per object class is often good enough; more general setups use a grasp-generation library that proposes candidate grasp poses from the object's geometry and ranks them by predicted stability. Either way, the output your motion planner needs is the same: a `PoseStamped` for pre-grasp and one for the final grasp.

```python
def grasp_pose_from_object(object_pose, approach_offset=0.15):
    pre_grasp = deepcopy(object_pose)
    pre_grasp.pose.position.z += approach_offset  # approach from above
    return pre_grasp, object_pose  # (pre-grasp, grasp)
```

## Gripper control and the planning scene

Two things need to happen together, and getting them out of sync is the most common source of "the arm moved but dropped the object" bugs:

- **Gripper actuation** — usually a separate, small `FollowJointTrajectory` (for a parallel-jaw gripper modeled as a joint) or a vendor-specific gripper action/service.
- **Collision object attach/detach** — MoveIt's planning scene interface lets you add a `CollisionObject` for the item once perception locates it, then call `attach_object` (moving it from "world" to "attached to gripper_link") right after the gripper closes, and `detach_object` right after it opens at place time.

```python
# after the gripper reports "closed"
self.scene.attach_object(object_id='box_01', link_name='gripper_link',
                          touch_links=['gripper_left_finger', 'gripper_right_finger'])
```

Skipping the attach step is a subtle bug: the arm will plan as if the object is still a stationary obstacle sitting where you picked it up from, and either refuse to move or (worse) collide with it.

## Try it yourself

Using the named poses and Python planning calls from Units 2-3, script the full six-step sequence for a single object placed at a known, fixed pose (skip perception for now — hardcode the object pose). Confirm the object gets attached after grasp and detached after place by checking the planning scene state (`ros2 service call` the relevant MoveIt scene query, or inspect it in RViz's scene display) at each stage.
