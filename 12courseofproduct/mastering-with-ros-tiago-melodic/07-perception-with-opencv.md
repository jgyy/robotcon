# Mastering with ROS: TIAGo - Melodic — Unit 7: Perception with OpenCV

Motion planning gives TIAGo a way to move; this unit gives it a way to decide *where* to move by processing what its head camera sees. You'll get images out of ROS and into OpenCV, run basic detection on them, and publish the results back as ROS messages other nodes can consume.

## Getting images out of ROS

TIAGo's head camera publishes `sensor_msgs/Image` on topics under its camera namespace (commonly something ending in `/rgb/image_raw`). ROS images aren't OpenCV's native `numpy` array format, so every perception node starts with `cv_bridge` converting between the two:

```python
import rospy, cv2
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError

bridge = CvBridge()

def image_callback(msg):
    try:
        frame = bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")
    except CvBridgeError as e:
        rospy.logerr(e)
        return
    cv2.imshow("TIAGo head camera", frame)
    cv2.waitKey(1)

rospy.init_node("tiago_camera_view")
rospy.Subscriber("/xtion/rgb/image_raw", Image, image_callback)
rospy.spin()
```

## A basic detection pipeline

Most classic (non-deep-learning) OpenCV detection follows the same shape: convert color space, threshold or filter to isolate what you care about, find contours, filter contours by size/shape, and derive a centroid or bounding box. A simple color-blob detector — useful for tracking a brightly colored marker or object — looks like this:

```python
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
mask = cv2.inRange(hsv, (25, 80, 80), (35, 255, 255))   # a yellow-ish range
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

if contours:
    biggest = max(contours, key=cv2.contourArea)
    M = cv2.moments(biggest)
    if M["m00"] > 0:
        cx, cy = int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"])
        cv2.circle(frame, (cx, cy), 5, (0, 0, 255), -1)
```

For faces or people specifically, OpenCV's Haar cascade classifiers (`cv2.CascadeClassifier`) give you a fast, dependency-light detector that's more than good enough for "is there a person roughly here" tasks without pulling in a full deep-learning pipeline — see `docs.opencv.org` for the full object-detection module reference.

## Publishing detections back into ROS

A perception node is only useful once its results reach other nodes — a 2D pixel centroid on its own doesn't do much for navigation or manipulation. Publish it as a plain message (a `geometry_msgs/PointStamped` in the image frame is a common minimal choice, or overlay the detection on the image and republish that for debugging):

```python
from geometry_msgs.msg import PointStamped

detection_pub = rospy.Publisher("/tiago/detected_object_2d", PointStamped, queue_size=1)

pt = PointStamped()
pt.header = msg.header          # reuse the source image's frame_id and timestamp
pt.point.x, pt.point.y = cx, cy
detection_pub.publish(pt)
```

A 2D pixel location alone can't tell you how far away the object is or where it sits relative to the robot — bridging that gap with depth data is exactly what the next unit, point cloud processing, covers.

## Try it yourself

Extend the color-blob detector above to publish a `PointStamped` only when the detected blob's area exceeds a threshold (to reject noise), and visualize the detection by drawing the bounding circle on the displayed frame. Test it by moving a colored object through TIAGo's simulated or real camera view.
