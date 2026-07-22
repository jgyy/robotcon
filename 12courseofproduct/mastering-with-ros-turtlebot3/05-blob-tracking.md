# Mastering with ROS: Turtlebot3 — Unit 5: Blob Tracking

Line following extracted a position from a thin strip of the image; this unit generalizes that to tracking an arbitrary colored object (a "blob") anywhere in the full frame, and uses its position and apparent size to drive the robot toward it — the direct predecessor to the object-recognition and manipulation work later in the course.

## What makes something a "blob"

A blob detector looks for a connected region of pixels sharing some property — here, color — and reports it as a single entity with a centroid, an area, and often a bounding shape. Unlike line following's fixed horizontal strip, blob tracking searches the whole frame and must cope with the blob appearing at any size and position, or not at all.

## Color thresholding in HSV

As in line following, HSV space is preferred over RGB because hue is largely decoupled from lighting changes. Pick a color range for your target (a bright ball or a colored marker works well for testing) and clean up the resulting mask with morphological operations to remove sensor noise:

```python
import cv2
import numpy as np

def make_mask(frame, lower_hsv, upper_hsv):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_hsv, upper_hsv)
    mask = cv2.erode(mask, None, iterations=2)   # remove small noise specks
    mask = cv2.dilate(mask, None, iterations=2)  # restore blob's original size
    return mask
```

## Finding and characterizing the blob

Use contour detection to find connected regions in the mask, then keep only the largest one (assuming a single target object in frame) and compute its enclosing circle:

```python
def find_blob(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None

    largest = max(contours, key=cv2.contourArea)
    if cv2.contourArea(largest) < 200:  # ignore tiny noise contours
        return None

    (x, y), radius = cv2.minEnclosingCircle(largest)
    return (x, y, radius)
```

The radius is doing double duty here: besides describing the blob's size, it's a cheap proxy for distance — a nearer object appears as a larger circle in the frame, which is exactly what you need to decide whether to keep approaching or stop.

## Driving toward the blob

Combine horizontal offset (steer toward it, same idea as line following) with the size proxy (approach or stop):

```python
def compute_twist(blob, frame_width, target_radius):
    twist = Twist()
    if blob is None:
        twist.angular.z = 0.3  # rotate in place to search
        return twist

    x, y, radius = blob
    error_x = (x - frame_width / 2) / (frame_width / 2)
    twist.angular.z = -1.0 * error_x

    if radius < target_radius:
        twist.linear.x = 0.1  # blob still small/far — keep approaching
    # else: close enough, radius >= target_radius, stay put
    return twist
```

## Try it yourself

Track two differently-colored blobs simultaneously (two separate HSV masks and contour searches) and drive the robot toward whichever one currently has the larger detected radius, switching targets live if the closer object changes. This is a small step toward the kind of target-selection logic real perception-driven behaviors need.
