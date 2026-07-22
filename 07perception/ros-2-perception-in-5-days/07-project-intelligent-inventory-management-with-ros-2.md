# ROS 2 Perception in 5 Days — Unit 7: Project: Intelligent Inventory Management with ROS 2

This capstone unit is where Units 2-6 stop being separate exercises and become one pipeline. You'll build a robot that follows a line through a warehouse-style layout, stops at marked points, and identifies and counts inventory by color — combining sensor handling, image processing, and object detection into a single working system.

## Project brief: what "intelligent inventory management" means here
The scenario: a mobile robot patrols a set of shelves connected by a painted line on the floor. At each shelf, it needs to determine what stock is present using color as a stand-in for product type (e.g. "red boxes are Product A, blue boxes are Product B"), and report a count. The project decomposes cleanly into three pipelines that map directly onto earlier units:

1. **Color encoding retrieval** — Unit 3's color-space and thresholding work, applied to classify boxes by color.
2. **Line follower pipeline** — Unit 3's line-following control loop, driving the robot between shelves.
3. **Inventory checking pipeline** — Unit 4/6-style detection and counting, applied once the robot has stopped at a shelf.

Treat this unit as an integration exercise: almost none of the individual techniques are new, but wiring them into one state machine that hands control between "drive" and "inspect" modes is the actual skill being tested.

## Color encoding retrieval
Revisit the HSV thresholding from Unit 3, but this time define a small lookup table of named color ranges instead of a single hardcoded threshold, since you now need to classify *which* of several colors a detected box is, not just detect the presence of one:

```python
COLOR_RANGES = {
    'product_a_red':   ((0, 120, 70), (10, 255, 255)),
    'product_b_blue':  ((100, 150, 70), (130, 255, 255)),
    'product_c_green': ((40, 100, 70), (80, 255, 255)),
}

def classify_color(hsv_pixel_region):
    best_color, best_count = None, 0
    for name, (lo, hi) in COLOR_RANGES.items():
        mask = cv2.inRange(hsv_pixel_region, lo, hi)
        count = cv2.countNonZero(mask)
        if count > best_count:
            best_color, best_count = name, count
    return best_color
```

Run this against a detected box's region of interest (from the inventory-checking pipeline below) to turn "there is a box here" into "there is a Product A box here."

## Line follower pipeline
Reuse the Unit 3 line follower largely as-is, but add the piece that was optional there and is required here: a way to detect *arrival* at a shelf, so the robot knows when to switch from "drive" mode to "inspect" mode. A simple and robust approach is a distinct marker at each stop (a perpendicular stripe crossing the line, or a fiducial marker) that the line-follower's image-processing step also checks for on every frame:

```python
if detect_stop_marker(frame):
    state = 'INSPECTING'
    stop_robot()
else:
    state = 'FOLLOWING_LINE'
    steer_toward_line(frame)
```

Structuring the whole project as an explicit state machine like this — rather than one monolithic control loop — is what keeps the driving logic and the inspection logic from interfering with each other.

## Inventory checking pipeline
Once stopped, switch to detection: either the Unit 4 point-cloud surface/object-clustering pipeline (if a depth sensor is available) or the Unit 6 YOLO detector (using a generic "box"-shaped class, or a small model fine-tuned on your own boxes) to find each item on the shelf, then run each detected item's region through `classify_color` above to get a per-color count:

```python
def inspect_shelf(frame, cloud=None):
    detections = detector.detect(frame)              # bounding boxes for candidate items
    counts = {}
    for box in detections:
        roi_hsv = cv2.cvtColor(crop(frame, box), cv2.COLOR_BGR2HSV)
        color = classify_color(roi_hsv)
        counts[color] = counts.get(color, 0) + 1
    return counts
```

Publish the resulting counts (a simple custom message, or even a JSON string on a `std_msgs/String` topic, is enough for this project) so the result is inspectable from outside the robot with `ros2 topic echo`.

## Try it yourself
Build the full state machine end to end: drive along a line, detect a stop marker, run the inventory check, publish the resulting color counts, then resume line-following to the next stop. Test it against a layout with at least two stops and boxes of at least two different colors, and confirm the reported counts match what's actually on each shelf.
