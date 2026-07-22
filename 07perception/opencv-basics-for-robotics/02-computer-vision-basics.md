# OpenCV Basics for Robotics — Unit 2: Computer Vision Basics

This is the toolbox unit: the bridge between ROS image messages and OpenCV, plus the core low-level operations — color spaces, filtering, edge detection, and convolutions — that every later unit in this course builds on.

## cv_bridge: getting images out of ROS
ROS passes images around as `sensor_msgs/msg/Image` (or the compressed variant), a message that stores raw byte data plus width, height, and an encoding string (e.g. `bgr8`, `rgb8`, `mono8`). OpenCV wants a `numpy` array. `cv_bridge` converts between the two:

```python
from cv_bridge import CvBridge
import cv2

bridge = CvBridge()

def image_callback(msg):
    frame = bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
    cv2.imshow('camera', frame)
    cv2.waitKey(1)
```

Note the encoding argument: OpenCV's native convention is BGR channel order (a historical quirk), while most other tools assume RGB. Mismatching this is one of the most common "why do my colors look inverted" bugs in robotics vision code. Going the other way — publishing a processed frame — uses `bridge.cv2_to_imgmsg(frame, encoding='bgr8')`.

## Color spaces and color filtering
An image loaded by OpenCV is a 3D array (`height x width x channels`) in BGR by default. BGR is convenient for display but bad for filtering by color, because a single "hue" like red is smeared across all three channels and is sensitive to lighting. HSV (Hue, Saturation, Value) separates color identity (hue) from brightness (value), which makes thresholding far more robust:

```python
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
lower_red = (0, 120, 70)
upper_red = (10, 255, 255)
mask = cv2.inRange(hsv, lower_red, upper_red)
result = cv2.bitwise_and(frame, frame, mask=mask)
```

This pattern — threshold in HSV, then mask — is the basis of simple color-based object tracking (following a colored ball or a tape line, for instance) and is often good enough for a first working demo before reaching for anything heavier.

## Edge detection
Edges mark where intensity changes sharply, and they're a cheap, lighting-invariant signal for object boundaries. The Canny detector is the standard choice: it smooths the image, computes intensity gradients, thins the result to one-pixel-wide edges, and keeps only edges connected to a strong edge (hysteresis thresholding):

```python
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, threshold1=50, threshold2=150)
```

The two thresholds matter: pixels above `threshold2` are always kept as edges, pixels below `threshold1` are always discarded, and pixels in between are kept only if connected to a strong edge. Tuning these two numbers for your lighting conditions is most of the practical work of using Canny.

## Convolutions and morphological transformations
Canny, blurring, and sharpening are all built on convolution: sliding a small matrix (a kernel) over the image and, at each position, computing a weighted sum of the pixels it covers. A Gaussian blur kernel averages neighboring pixels (weighted toward the center) to suppress noise; a sharpening kernel does the opposite.

Morphological transformations are convolution-like operations specifically for binary (mask) images, typically used to clean up the output of `cv2.inRange` above:

```python
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
clean = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)   # erosion then dilation: removes small noise specks
clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE, kernel)  # dilation then erosion: fills small holes
```

`MORPH_OPEN` and `MORPH_CLOSE` are the two you'll reach for most: opening strips away isolated single-pixel false positives, closing fills small gaps inside a detected blob before you compute its contour or centroid.

## Try it yourself
Take the webcam script from Unit 1 and extend it: convert each frame to HSV, threshold for a color of an object you have nearby (a mug, a sticky note), clean the mask with `MORPH_OPEN`/`MORPH_CLOSE`, then run `cv2.Canny` on the cleaned mask and display the result alongside the original frame. Adjust the HSV bounds until only your object's edges show up.
