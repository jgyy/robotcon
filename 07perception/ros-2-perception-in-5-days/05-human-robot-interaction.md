# ROS 2 Perception in 5 Days — Unit 5: Human-Robot Interaction

Robots that share space with people need to notice them specifically, not just as generic obstacles. This unit applies the image-processing skills from Unit 3 to three progressively richer people-perception tasks: detecting faces, recognizing whose face it is, and tracking a person as they move.

## Face and eye detection with Haar cascades
Haar cascade classifiers are a fast, classical (pre-deep-learning) object detector: they slide a window across the image at multiple scales and test each window against a cascade of simple rectangular-contrast features, rejecting non-matches early so most of the image is discarded cheaply. OpenCV ships pretrained cascades for frontal faces and eyes, which is why this remains a good starting point even in a deep-learning-heavy course — it's lightweight enough to run in real time on modest hardware with no GPU and no training step.

```python
import cv2

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
for (x, y, w, h) in faces:
    face_roi = gray[y:y + h, x:x + w]
    eyes = eye_cascade.detectMultiScale(face_roi)
```

Note the pattern: eye detection runs *inside* each detected face region, not the whole frame — this both speeds things up and avoids false eye-like detections elsewhere in the image.

### Create, launch, and test Face and Eye Detection nodes
Wrap the snippet above into a node that draws bounding boxes on detected faces and eyes and republishes the annotated image for `rqt_image_view`. Confirm detection holds up as a person turns their head and moves closer/farther from the camera — Haar cascades are sensitive to head pose and scale, so expect it to degrade past roughly a 30-45 degree turn.

## Face recognition: from detection to identity
Detection answers "is there a face here?"; recognition answers "whose face is this?". The typical pipeline is: detect a face (as above), crop and normalize it, extract a numeric feature vector (an "embedding") using a face-recognition model, and compare that vector against a small database of known people's embeddings using a distance metric — the closest match under some threshold is the identification, and nothing within threshold means "unknown."

```python
# conceptual pipeline — the embedding model itself is swappable
face_crop = gray[y:y + h, x:x + w]
embedding = face_recognizer.compute(face_crop)          # e.g. LBPH, or a learned embedding model
distances = {name: np.linalg.norm(embedding - db_emb) for name, db_emb in known_faces.items()}
best_match = min(distances, key=distances.get)
identity = best_match if distances[best_match] < THRESHOLD else 'unknown'
```

OpenCV's `cv2.face` module (in `opencv-contrib-python`) includes a ready-to-use LBPH (Local Binary Patterns Histograms) recognizer that follows exactly this pattern and is a reasonable first implementation before reaching for a heavier learned model.

### Create and test a Face Recognition node
Build a small labeled dataset (a handful of face crops per person), train/fit the recognizer on it, then run the node live and confirm it correctly labels known faces and reports "unknown" for a face not in the dataset.

## Human tracking: closing the loop with motion commands
Tracking differs from per-frame detection in that it maintains identity and position *across* frames, so the robot can follow a specific person rather than re-detecting from scratch every frame (which is both slower and prone to jitter if detection briefly fails). A practical approach: detect once to acquire a target (a face box, or a full-body HOG/YOLO detection), then hand that box to a lightweight tracker (e.g. OpenCV's `TrackerCSRT` or `TrackerKCF`) that updates the box's position each frame using appearance and motion cues alone, re-running full detection periodically or whenever the tracker reports low confidence.

```python
tracker = cv2.TrackerCSRT_create()
tracker.init(frame, initial_bbox)
# each subsequent frame:
success, bbox = tracker.update(frame)
if success:
    x, y, w, h = bbox
    target_cx = x + w / 2
    # steer toward target_cx, same proportional-control idea as the Unit 3 line follower
```

### Create and test a Human Tracking node
Combine detection (to acquire and periodically re-acquire a target) with a tracker (to follow it between detections), and drive `cmd_vel` proportionally to keep the tracked person's horizontal position centered in frame, exactly as in Unit 3's line-follower control loop. Test with a person walking at a moderate pace across and toward the camera.

## Conclusions
Detection, recognition, and tracking are three distinct capabilities that compose: recognition needs detection first, and tracking is what makes following a *specific* detected or recognized target smooth and continuous instead of jittery frame-by-frame re-detection.

## Try it yourself
Chain all three: detect faces, recognize the one matching a name in your small database, and once recognized, switch to tracking mode and turn the robot to keep that person centered in frame — stopping the turn if the tracker reports it has lost the target.
