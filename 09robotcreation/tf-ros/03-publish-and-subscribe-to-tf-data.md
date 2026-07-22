# TF ROS — Unit 3: Publish & Subscribe to TF data

Now you move from reading someone else's TF tree to producing your own. This unit works through a small, self-contained example — a 3D take on turtlesim — so you can broadcast a moving frame and then look it up from another node.

## Broadcasting a transform
A `TransformBroadcaster` wraps the boilerplate of stamping and publishing a `TransformStamped` message onto `/tf`. Typically you call it once per timer tick or once per pose update, not on some fixed unrelated schedule — the transform's timestamp should match the moment the pose was actually true.

```python
import rclpy
from rclpy.node import Node
from tf2_ros import TransformBroadcaster
from geometry_msgs.msg import TransformStamped

class TurtleBroadcaster(Node):
    def __init__(self):
        super().__init__('turtle_tf_broadcaster')
        self.broadcaster = TransformBroadcaster(self)
        self.timer = self.create_timer(0.05, self.broadcast)

    def broadcast(self):
        t = TransformStamped()
        t.header.stamp = self.get_clock().now().to_msg()
        t.header.frame_id = 'world'
        t.child_frame_id = 'turtle1'
        t.transform.translation.x = self.x
        t.transform.translation.y = self.y
        t.transform.translation.z = 0.0
        t.transform.rotation = yaw_to_quaternion(self.theta)
        self.broadcaster.sendTransform(t)
```

Note the pattern: `header.frame_id` is the *parent*, `child_frame_id` is the *child*. Getting these backwards is the single most common TF bug — the tree will still build without errors, it will just be inverted, and everything downstream will look mirrored or wildly wrong.

## Listening for a transform
On the receiving side, a node builds up a `Buffer` from the `/tf` and `/tf_static` streams via a `TransformListener`, then queries it whenever it needs a relationship. Because the listener needs time to accumulate messages, the very first lookup after startup commonly needs a short wait or a try/except around a `LookupException`.

```python
from tf2_ros import Buffer, TransformListener
from tf2_ros import LookupException, ExtrapolationException

tf_buffer = Buffer()
tf_listener = TransformListener(tf_buffer, node)

try:
    trans = tf_buffer.lookup_transform('world', 'turtle1', rclpy.time.Time())
    print(trans.transform.translation)
except (LookupException, ExtrapolationException) as e:
    node.get_logger().warn(f'transform not available yet: {e}')
```

`rclpy.time.Time()` (i.e. time zero) means "give me the latest available transform" rather than one at an exact timestamp — handy while learning, though production code usually asks for the transform at the exact stamp of the sensor data it's fusing.

## A practical use: driving one frame toward another
Once you can look up `world -> turtle1` and `world -> turtle2`, you can compute the relative pose between two turtles and use it to drive one toward the other — a small but complete demonstration of why TF composition matters: neither turtle ever needed to know the other's frame name in advance, TF supplied the relationship.

## Try it yourself
Write a broadcaster node that publishes a frame `moving_thing` circling around `world` (e.g. `x = r*cos(t)`, `y = r*sin(t)`), and a separate listener node that looks up `world -> moving_thing` on a timer and logs the distance from the origin. Confirm the logged distance stays close to your chosen radius `r`.
