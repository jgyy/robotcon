# OpenCV Basics for Robotics — Unit 3: People-related OpenCV Functions

Robots frequently need to notice humans — for safety stops, social navigation, or hand-off tasks. This unit covers OpenCV's two classical, pre-deep-learning building blocks for that: Haar cascade face detection and HOG people detection.

## Face detection with Haar cascades
A Haar cascade is a fast object detector trained on simple rectangular features (differences of sums of pixel intensities in adjacent regions) organized into a cascade of increasingly strict stages — early stages quickly reject obviously-non-face regions so the detector spends most of its time on plausible candidates. OpenCV ships pretrained cascades (frontal face, eye, smile, and more) as XML files.

```python
import cv2

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(
    gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
)
for (x, y, w, h) in faces:
    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
```

`scaleFactor` controls how much the search window shrinks at each scale step (smaller = more thorough but slower); `minNeighbors` controls how many overlapping detections are required before a region counts as a real face (higher = fewer false positives, but risk of missing faces). Haar cascades are fast enough to run in real time on modest hardware, which is exactly why they're still relevant on resource-constrained robots even though deep-learning face detectors are more accurate.

## People detection and tracking with HOG
Faces require a mostly-frontal, well-lit view. For detecting a whole person — walking away from the robot, side-on, partially occluded — OpenCV provides a Histogram of Oriented Gradients (HOG) detector paired with a linear SVM, pretrained on pedestrian images. HOG works by dividing the image into small cells, computing the dominant gradient direction in each cell, and using the resulting histogram as a shape descriptor that's robust to lighting and minor pose changes.

```python
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

boxes, weights = hog.detectMultiScale(
    frame, winStride=(8, 8), padding=(8, 8), scale=1.05
)
for (x, y, w, h) in boxes:
    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
```

`winStride` trades speed for thoroughness (larger stride = faster, coarser scan), and `scale` controls how finely the image pyramid is sampled to catch people at different distances from the camera. HOG detection alone is not tracking — each frame is detected independently. For simple continuity across frames (so you can say "this is still the same person as last frame"), pair detections with a lightweight tracker such as OpenCV's `cv2.TrackerCSRT_create()`, or match detections between frames by proximity of their bounding-box centroids.

## Try it yourself
Run both detectors on the same webcam stream, drawing face boxes in green and full-body boxes in blue. Log to the console how many of each are found per frame, and note situations where one detector fires but the other doesn't (e.g. someone facing away from the camera, or standing very close so only their face fills the frame). This gap is exactly why the Course Project (Unit 6) will need more than one detector working together.
