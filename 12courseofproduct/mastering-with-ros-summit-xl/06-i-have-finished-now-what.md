# Mastering with ROS: SUMMIT XL — I have finished, now what?

You now have a Summit XL that maps and navigates indoors, localizes and navigates outdoors via GPS, detects and recognizes people with two independent sensors, and ties it all together into a reactive patrol loop. This closing unit points at where to take that foundation next.

## Where to go deeper

Every unit here used the simplest workable version of its topic on purpose:

- **Navigation**: the indoor stack in Unit 1 used default costmap and planner tuning. Revisit the inflation radius, footprint, and recovery behaviors — a security-patrol robot in a real building needs to handle corridors, doorways, and elevators that default parameters often trip over.
- **Localization robustness**: the outdoor fusion in Unit 2 assumed a reasonably clean GPS signal. Real deployments deal with multipath near buildings and dropout under cover — look into adding a second localization source (visual odometry, or a second GPS fix source) so the EKF has something to fall back on.
- **Perception**: the HOG-based camera detector in Unit 3 was chosen for simplicity, not accuracy. Swapping in a modern DNN person detector (and a proper face-recognition model in place of a toy similarity check) is the natural next step, especially if you extend the recognition database beyond a handful of test faces.
- **Multi-robot patrol**: nothing in this course prevents running the same patrol logic on two or more Summit XL units covering different zones and reporting detections to a shared dashboard — a realistic next architecture step for a security-patrol product.

## Safety and real-world considerations

Everything here was built and tested in simulation, which is the right place to learn — but worth naming clearly before any of this goes near a real robot around real people:

- A patrol robot that stops and "investigates" a person needs a hard-defined minimum standoff distance and speed limit near people, enforced independently of the detection logic (a detector bug should never be the only thing preventing a collision).
- Treat person recognition results as a supporting signal for a human security process, not as an autonomous access-control decision — false negatives and false positives are inevitable with any camera-based recognition system.
- Everything you built here is a simulation-and-learning project; moving it near a real building and real people requires a proper risk assessment, not just working code.

## Build a portfolio project

The micro project deliberately kept scope small — one route, one detection type reaction. To turn it into something you can show, pick one clear extension rather than several small ones: add a second robot patrolling a second zone, replace the HOG detector with a DNN model and measure the accuracy difference, or extend the state machine to log every detection (authorized and not) to a simple time-stamped report. One well-documented extension demonstrates more than a pile of half-finished features.

## Continuing resources

- **docs.ros.org** — the canonical reference for ROS/ROS 2 concepts, CLI tools, and package documentation.
- **gazebosim.org** — documentation for the Gazebo simulator, useful for building richer test worlds than the default patrol course.
- **docs.opencv.org** — reference for the detection and recognition APIs used in Unit 3, including modern detectors beyond HOG.
- Robotnik's own Summit XL documentation and ROS packages, worth revisiting once you move from the simulated robot toward real hardware.

## Try it yourself

Write a one-page plan (just for yourself) for the single extension you'd make to the Unit 4 patrol project: what changes, which existing nodes or callbacks it touches, and what a successful test run looks like. Treat it as the spec you'd hand to yourself before the next coding session.
