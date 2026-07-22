# OpenCV Basics for Robotics — Unit 1: Introduction to the Course

This unit orients you before you touch any code: what OpenCV is, why it sits at the center of most robot perception stacks, and how the five units that follow build on each other.

## Why vision, and why OpenCV
A robot with only range sensors (LIDAR, sonar, IMU) knows *where* things are but rarely *what* they are. Cameras are cheap, information-dense, and let a robot answer questions like "is that a person or a chair?" or "which way is this door handle facing?". OpenCV (Open Source Computer Vision Library) is the de facto toolkit for turning raw pixel data into that kind of structured information — it has been the backbone of robotics vision since long before deep learning made object detection mainstream, and it remains essential for the lower-level steps (color filtering, edge detection, feature matching) that deep models still rely on for preprocessing, calibration, and lightweight on-robot tasks where a full neural network is overkill.

## What this course covers
- **Unit 2 — Computer Vision Basics**: the OpenCV/ROS bridge (`cv_bridge`), color spaces, color filtering, edge detection, and a first look at convolutions and morphological transformations. This is the toolbox unit — everything after it reuses these primitives.
- **Unit 3 — People-related OpenCV functions**: Haar cascade face detection and HOG-based people detection/tracking, the classical (pre-deep-learning) way robots notice humans nearby.
- **Unit 4 — Feature Matching**: FAST, BRIEF, and ORB — how to find and describe distinctive points in an image so two views of the same scene (or object) can be matched, which underlies tracking, mosaicking, and simple visual localization.
- **Unit 5 — ARTags**: fiducial markers that give a robot a cheap, extremely reliable way to know "this exact object is at this exact 6-DOF pose", useful for calibration, docking, and pick-and-place.
- **Unit 6 — Course Project**: a combined exercise — detect people in a scene and pick out a specific one, exercising Units 2-4 together.

## How the units connect to a robot
In a real system, images typically arrive as ROS `sensor_msgs/Image` messages from a camera driver node. `cv_bridge` (Unit 2) converts those into OpenCV `numpy` arrays (or `cv::Mat` in C++) so the rest of this course's material — which is otherwise plain OpenCV, with no ROS dependency — can operate on them. Keeping OpenCV code ROS-agnostic like this is deliberate: it lets you develop and unit-test vision logic against static images or a webcam before ever wiring it into a robot.

## Setting up
You'll want a working OpenCV install (`pip install opencv-python opencv-contrib-python` for the Python bindings used in this course; `opencv-contrib-python` adds extras used later, like some ArUco marker utilities) and, if you plan to run things through ROS, `cv_bridge` and `image_transport` from your ROS distro's `vision_opencv` stack. Everything can also be prototyped with a plain webcam and no ROS at all — that's the recommended way to work through Units 2-5 before integrating.

```bash
python3 -c "import cv2; print(cv2.__version__)"
```

## Try it yourself
Install OpenCV's Python bindings, then write a five-line script that opens your default webcam (`cv2.VideoCapture(0)`), grabs one frame, prints its shape (height, width, channels), and saves it to disk with `cv2.imwrite`. Confirm the saved file opens correctly — this is the "hello world" you'll build every later unit's examples on top of.
