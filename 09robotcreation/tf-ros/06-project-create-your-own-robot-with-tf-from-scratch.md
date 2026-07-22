# TF ROS — Unit 6: PROJECT - Create your own robot with TF from scratch

This capstone pulls together every tool from Units 1-5 into one deliverable: a minimal robot that publishes a complete, correct, well-behaved TF tree — by hand this time, with no URDF as a crutch, so the mechanics are unmistakably yours.

## Project brief
Design a simple robot with at least four frames and at least one moving joint. A good scope: a differential-drive base with a lidar and a single pan-only sensor head, giving you this tree:

```
odom
 └── base_link          (dynamic: the robot's pose in odom, from your "odometry")
      ├── lidar_link     (static: fixed mount on the chassis)
      └── head_base_link
           └── head_link (dynamic: pans left/right)
```

Return to your Unit 1 sketch of a frame tree — refine it if needed, then use it as your target for this project.

## Step 1: static mounts
Publish `base_link -> lidar_link` and `base_link -> head_base_link` as static transforms, using the command-line or launch-file approach from Unit 5. These never move for the lifetime of the run.

## Step 2: the dynamic base
Write a node that fakes odometry — pick any simple motion (drive in a circle, or just oscillate back and forth) — and broadcasts `odom -> base_link` on every timer tick using a `TransformBroadcaster`, exactly as in Unit 3. Stamp each transform with the current time, and make sure `odom` is the parent, `base_link` the child.

## Step 3: the panning head
Write a second broadcaster for `head_base_link -> head_link` whose yaw oscillates over time (e.g. a sine wave scaled to a comfortable range like ±45°). This is your only "joint" — treat it as a stand-in for what `joint_state_publisher` + `robot_state_publisher` would normally compute for you automatically from a URDF, per Unit 4.

## Step 4: verify the whole tree
Bring everything up together and check it the way you learned in Unit 2:

```bash
ros2 run tf2_tools view_frames        # confirm all 4 frames appear, tree is connected
ros2 run tf2_ros tf2_echo odom head_link   # confirm this composed transform updates live
```

`tf2_echo odom head_link` is the real test of correctness: that transform is never published directly by any of your nodes — it only exists if TF is correctly composing your two dynamic broadcasts and two static ones through the tree. If it prints sensible, smoothly-changing numbers, your tree is right.

## Step 5 (stretch): visualize in RViz
Add a TF display and, if you're comfortable with basic shapes, a couple of markers at `lidar_link` and `head_link` so you can watch the head sweep and the lidar mount stay fixed while `base_link` moves underneath both.

## Try it yourself
Deliberately swap parent and child on one of your static transforms (publish it as `lidar_link -> base_link` instead of `base_link -> lidar_link`) and observe what breaks — in the `view_frames` PDF, in `tf2_echo`, and in RViz. Then fix it. Recognizing this exact failure mode fast is one of the most useful debugging skills this course teaches.
