# Intermediate ROS2 — Unit 10: Course Project

This capstone pulls together the whole course into one package: a node that detects circular shapes (posts, table legs, trash cans) from 2D laser scan data, packaged with a proper build system, launched with a configurable launch file, tuned via parameters, and published with QoS appropriate to its inputs and outputs.

## Framing the problem

A `sensor_msgs/msg/LaserScan` message is a flat array of ranges at fixed angular increments around the sensor. A circular obstacle produces a short, contiguous run of range readings that curves smoothly and consistently — points at the edge of the circle facing the sensor are closer, points curving away are progressively farther, in a way distinguishable from a flat wall (all points roughly equidistant along a line) or a corner (a sharp discontinuity). The classic approach: convert the relevant scan points to Cartesian `(x, y)` coordinates in the sensor frame, cluster contiguous points into candidate segments, and fit a circle to each segment, keeping the ones whose fit residual is low and whose radius falls in a plausible range.

## Building the package

Structure it as an `ament_python` package (Unit 2), with the detector as a proper node and its parameters declared up front (Unit 5):

```python
class CircleDetector(Node):
    def __init__(self):
        super().__init__('circle_detector')
        self.declare_parameter('min_radius', 0.05)
        self.declare_parameter('max_radius', 0.5)
        self.declare_parameter('cluster_gap', 0.1)   # max distance between points in one cluster
        self.declare_parameter('max_fit_error', 0.02)

        sensor_qos = QoSProfile(reliability=ReliabilityPolicy.BEST_EFFORT, depth=5)
        self.create_subscription(LaserScan, 'scan', self.scan_cb, sensor_qos)
        self.pub = self.create_publisher(PoseArray, 'detected_circles', 10)
```

The subscription QoS matches Unit 7's guidance: laser scans are high-rate sensor data, so `BEST_EFFORT` is the right default rather than the library default of `RELIABLE`.

## The detection pipeline

```python
def scan_cb(self, msg: LaserScan):
    points = self.polar_to_cartesian(msg)
    clusters = self.cluster_points(points, self.get_parameter('cluster_gap').value)
    circles = []
    for cluster in clusters:
        if len(cluster) < 4:
            continue
        center, radius, error = self.fit_circle(cluster)
        min_r = self.get_parameter('min_radius').value
        max_r = self.get_parameter('max_radius').value
        max_err = self.get_parameter('max_fit_error').value
        if min_r <= radius <= max_r and error <= max_err:
            circles.append((center, radius))
    self.publish_detections(circles, msg.header)
```

`fit_circle` can be as simple as an algebraic least-squares circle fit (solving for center and radius that minimize squared distance-from-circle across the cluster's points) — a few lines with `numpy`, no external CV library required, since the input here is already a set of 2D points rather than an image.

## Packaging it as a launch-file-driven demo

Tie it together the way the rest of the course has been building toward: a launch file (Unit 3) that starts the detector alongside a simulated or bagged laser scan source, with a params YAML (Unit 5) holding the tuned thresholds for your particular test environment, and — if you want to push further — the detector rewritten as a lifecycle node (Unit 9) so it only starts processing scans once explicitly activated by a supervisor.

```bash
ros2 launch my_pkg circle_detector.launch.py params_file:=config/circle_detector.yaml
ros2 topic echo /detected_circles
```

## Try it yourself

Implement the pipeline above against a recorded or simulated laser scan containing at least one genuinely circular object and one flat wall. Tune `cluster_gap`, `min_radius`/`max_radius`, and `max_fit_error` via `ros2 param set` while it's running until the wall is reliably rejected and the circular object is reliably detected — then dump the final values with `ros2 param dump` into your package's params YAML so the tuning survives a restart.
