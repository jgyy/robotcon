# Create Your First Robot with ROS (Deprecated) — Unit 7: Autonomous Navigation II

Line following in Unit 6 required a purpose-built environment (a line to follow). This unit moves to general-purpose navigation: using ORB-SLAM2 to build a map of an arbitrary environment and localize the robot within it, using nothing but the same monocular camera you already have mounted.

## What SLAM solves that line following doesn't
SLAM (Simultaneous Localization and Mapping) answers two questions at once, each of which depends on the other: "where am I?" (localization) and "what does the environment around me look like?" (mapping). You can't localize without a map to localize against, and you can't build a map without knowing where you were when you observed each part of it — hence "simultaneous." Unlike line following, a SLAM-equipped robot doesn't need the environment prepared for it; it discovers structure (walls, corners, distinctive visual features) as it drives.

## Why monocular (single-camera) SLAM is harder
A single RGB camera loses depth information in the projection from 3D world to 2D image — an object could be small-and-close or large-and-far and produce the same pixels. Monocular SLAM systems like ORB-SLAM2 work around this by triangulating the same visual features across multiple frames taken from different positions, the same way your own two eyes (or one eye moving) infer depth from parallax. The practical consequence: monocular SLAM only recovers scale (distances) up to an unknown constant factor unless you give it something to calibrate against, such as a known object size or a second sensor (stereo camera, IMU, or wheel odometry).

## ORB features: the building block
ORB-SLAM2 tracks ORB (Oriented FAST and Rotated BRIEF) features — image keypoints that are fast to detect and reasonably stable under rotation and moderate lighting change. You can inspect what the tracker sees using OpenCV directly, which is useful for sanity-checking that your camera and environment give SLAM enough to work with before wiring up the full pipeline:
```python
import cv2

orb = cv2.ORB_create(nfeatures=500)
frame = cv2.imread("sample_frame.png")
keypoints, descriptors = orb.detectAndCompute(frame, None)
print(f"found {len(keypoints)} ORB features")
out = cv2.drawKeypoints(frame, keypoints, None, color=(0, 255, 0))
cv2.imwrite("keypoints_debug.png", out)
```
A textureless environment (blank white walls, uniform carpet) starves ORB-SLAM2 of features to track and is a common, non-obvious cause of "SLAM keeps losing tracking" — check your feature counts with a snippet like this before assuming the SLAM configuration is at fault.

## Running the pipeline and building a map
At a high level, integrating ORB-SLAM2 with your robot means: run the ORB-SLAM2 monocular node subscribed to your camera's image topic, feed it a calibration file describing your camera's intrinsics (focal length, distortion — get this from a standard checkerboard calibration), and let it publish the estimated camera pose as it processes frames. Drive the robot slowly around the space you want mapped; the system builds a sparse point-cloud map of tracked features alongside the estimated trajectory, both of which you can visualize in `rviz`.

## Try it yourself
With your camera mounted and calibrated, run the ORB feature-detection snippet above on a few frames captured from different rooms or angles in your test environment, and compare feature counts. Identify at least one "SLAM-friendly" area (high feature count — textured, cluttered) and one "SLAM-hostile" area (low feature count — blank walls, glossy floors) before you attempt a full mapping run; knowing this in advance turns a mysterious tracking failure into an expected, explainable one.
