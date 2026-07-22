# Mastering with ROS: TIAGo - Melodic — Unit 9: Micro Project

This closing unit doesn't introduce new concepts — it's where you wire together control, navigation, MoveIt, OpenCV, and PCL from Units 2 through 8 into one small autonomous behavior. Treat it as the checkpoint that proves the individual skills actually compose.

## The project: find it, go to it, pick it up

Build a single script (or a small set of ROS nodes) that makes TIAGo perform this loop, starting from some distance away from a table with one object on it:

1. **Navigate** to a pose near the table using `move_base` (Unit 3).
2. **Perceive** the object: use the PCL plane-segmentation-and-clustering pipeline (Unit 8) to get its 3D centroid relative to the camera, and transform that centroid into the arm's planning frame with `tf2`.
3. **Plan and grasp**: use the `arm_torso` planning group to Cartesian-approach the object (Unit 6), close the gripper (Unit 2), and retreat vertically under an orientation constraint.
4. **Confirm**: check the gripper's joint state or effort after closing to sanity-check whether it actually grasped something versus closing on empty air.

## Suggested structure

Resist the urge to write this as one giant script — split it into functions (or nodes) with a single clear responsibility each, matching the units they came from:

```python
def navigate_to(pose):        # Unit 3 — MoveBaseAction, blocks until arrival
    ...

def find_object():            # Unit 8 — returns a PointStamped centroid, or None
    ...

def approach_and_grasp(target_point):   # Units 2, 5, 6 — Cartesian approach + gripper close
    ...

def main():
    navigate_to(table_approach_pose)
    target = find_object()
    if target is None:
        rospy.logerr("No object found near the table")
        return
    approach_and_grasp(target)
```

This shape — navigate, perceive, act, each isolated and independently testable — is exactly how larger robotics applications are structured in practice, so the habit is worth more than the specific project.

## Debugging when the chain breaks

Multi-stage behaviors fail in the stage boundaries far more often than within a single stage. When something goes wrong, check in order: did `navigate_to` actually reach a pose close enough for the camera to see the table (echo `/amcl_pose` and compare to the goal); did `find_object` return a centroid that's plausible in RViz (publish it as a `Marker` and look at it relative to the robot); did the MoveIt plan preview (Unit 4's habit) look reasonable before you let it execute. Isolating which stage broke is almost always faster than staring at the whole pipeline at once.

## Try it yourself

Run the full loop against a simulated TIAGo and a single object placed on a table at a fixed, known pose. Once it reliably works, move the object to a different position on the table without changing the code, and confirm the perception step alone is enough to adapt the grasp — that's the real test of whether Units 7 and 8 actually decoupled perception from the rest of the pipeline.
