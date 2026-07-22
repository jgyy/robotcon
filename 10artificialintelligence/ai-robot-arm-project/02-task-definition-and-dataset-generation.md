# Ai Robot Arm Project — Unit 2: Task Definition and Dataset Generation

With a working leader/follower pair from Unit 1, the next job is deciding exactly what you want the arm to learn and then producing a dataset good enough to teach it. This unit covers picking a scoped task and two complementary ways to generate demonstrations: teleoperation by hand, and automated collection with inverse kinematics and computer vision.

## Choosing a task that's actually learnable

A good first task is narrow, visually unambiguous, and physically short: "pick up the red cube and drop it in the bin," not "tidy the desk." Imitation-learning policies like ACT and SmolVLA learn a mapping from camera images (and sometimes a language instruction) to joint actions — they do not plan or reason about sub-goals the way a classical planner would. That means:

- The task should be completable in a few seconds to tens of seconds.
- The object(s) involved should be visually distinct from the background and from each other.
- Start-state variation (object position/orientation) should be the main axis of variation you want the policy to generalize over — everything else should stay as consistent as possible early on.

Write your task definition down as a one-sentence instruction (e.g. "pick up the marker and place it in the cup") — this string is literally what you'll feed the model as its language conditioning later, for language-conditioned policies like SmolVLA.

## Manual dataset generation via teleoperation

This is the most direct way to collect data: you move the leader arm, the follower mirrors it, and every timestep you log camera frames plus joint positions. A minimal teleoperation-and-record loop looks like this conceptually:

```python
for episode in range(num_episodes):
    reset_scene()  # randomize object position by hand between episodes
    for step in range(max_steps_per_episode):
        leader_pos = leader_bus.read("Present_Position")
        follower_bus.write("Goal_Position", leader_pos)
        frame = camera.read()
        dataset.add_frame(
            observation={"image": frame, "state": follower_bus.read("Present_Position")},
            action=leader_pos,
        )
    dataset.save_episode()
```

Aim for tens to a few hundred episodes for a first task, with real variation in object placement between episodes — a dataset where every demonstration looks identical will produce a policy that memorizes rather than generalizes.

## Automatic dataset generation with inverse kinematics and computer vision

Once you understand the manual loop, you can bootstrap larger datasets automatically: use a camera plus a simple color/shape detector (OpenCV's contour or HSV-threshold tooling is enough for a single colored object) to find the target object's pose, then use inverse kinematics (IK) to compute joint angles that reach it, and script the pick sequence:

```python
import cv2

def find_object_pixel(frame, hsv_lo, hsv_hi):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, hsv_lo, hsv_hi)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest = max(contours, key=cv2.contourArea)
    (cx, cy), _ = cv2.minEnclosingCircle(largest)
    return cx, cy
```

Feed the detected object position through an IK solver (many arm SDKs bundle one; otherwise a small analytic or numerical solver for a 5-6 DOF arm is a well-documented problem) to get target joint angles, then drive the follower there and record the trajectory as if it were a teleoperated episode. This scripted approach is faster for pure pick-and-place data but is worth combining with manual episodes — human demonstrations capture natural recovery behavior (small corrections, retries) that a scripted IK path won't.

## Dataset format and sanity checks

Whichever collection method you use, store data in a structured, versioned format (a Parquet/HDF5-backed dataset with per-episode camera video plus a state/action table is the common pattern in this space) so it can be loaded consistently by the training code in Unit 3. Before training anything, always visualize a handful of random episodes end-to-end — replay the recorded actions against the recorded images and confirm they're temporally aligned. A one-frame offset between image and action is a silent bug that quietly caps how good your trained policy can ever be.

## Try it yourself

Pick one small pick-and-place task, collect 10 teleoperated episodes with the object in a different starting position each time, and write a short script that plays back episode 0's camera frames next to its recorded joint actions to confirm they line up in time.
