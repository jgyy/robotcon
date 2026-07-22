# ROS Perception in 5 Days — Unit 7: Face Recognition

Detection (Unit 6) answers "is there a face here?"; recognition answers "whose face is this?" This unit adds an identity layer on top of the detector, which is what lets a robot like Fetch greet specific people by name instead of treating every face identically.

## Encodings instead of raw pixels
Comparing face images pixel-by-pixel is fragile — lighting, angle, and expression all change the raw pixels for the same person. Face recognition libraries instead compute a face *encoding*: a fixed-length numeric vector (commonly 128 dimensions) produced by a neural network trained so that encodings of the same person's face sit close together in vector space, and different people's encodings sit far apart:
```python
import face_recognition

image = face_recognition.load_image_file("known_people/alice.jpg")
encoding = face_recognition.face_encodings(image)[0]  # 128-d vector
```

## Building a known-faces database
Before recognition can work, you need a reference set — one or more encodings per known person, usually built once and loaded at startup:
```python
known_encodings = []
known_names = []
for name, path in [("alice", "known_people/alice.jpg"), ("bob", "known_people/bob.jpg")]:
    img = face_recognition.load_image_file(path)
    known_encodings.append(face_recognition.face_encodings(img)[0])
    known_names.append(name)
```
For a robot deployed in a fixed environment (a home, a lab), this database is typically built once offline; a more dynamic system would let a node add new people on the fly by capturing a few frames and computing their encoding.

## Matching a detected face against the database
For each face found in a live frame, compute its encoding and compare distances against the known set:
```python
face_locations = face_recognition.face_locations(frame)
face_encodings = face_recognition.face_encodings(frame, face_locations)

for encoding in face_encodings:
    distances = face_recognition.face_distance(known_encodings, encoding)
    best_match = distances.argmin()
    if distances[best_match] < 0.6:  # lower distance = more similar
        name = known_names[best_match]
    else:
        name = "unknown"
```
The `0.6` threshold trades off false accepts (recognizing the wrong person) against false rejects (failing to recognize a known person) — tune it against your own test set rather than trusting a default blindly.

## Publishing identity as a ROS message
Wrap `(name, confidence, bounding_box)` into a message and publish it, the same way Units 5-6 wrapped detections — this keeps identity recognition decoupled from whatever consumes it (a greeting behavior, a logging node, an access-control check).

## Try it yourself
Build a small known-faces database from 2-3 people (photos of yourself and a couple of others, or willing collaborators). Write a node that detects and recognizes faces in a live stream, overlays each person's name on the video, and logs "unknown" for anyone not in the database. Test the distance threshold by seeing how it handles a photo of someone not in your database.
