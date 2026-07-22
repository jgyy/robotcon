# Mastering with ROS: Turtlebot3 — Unit 8: Project Part 1

This unit and the next form the course's capstone: a single project that forces navigation, perception, and manipulation to work together instead of being practiced as isolated demos. Part 1 covers scoping the project and building its first half — getting the robot to a search area and detecting a target object within it.

## The project: search, approach, retrieve

The task: starting from a known dock position, the robot must navigate to a search zone on a pre-built map (Unit 3), scan for a target object using the camera (Unit 6, backstopped by blob tracking from Unit 5 if you want a simpler color-based target), and — once found — approach and prepare to interact with it. Part 2 will finish the job by actually picking it up with MoveIt (Unit 7) and returning it to the dock. You're free to substitute "point at it" or "push it" for "pick it up" if you're working on a Burger without a manipulator — the navigation and perception integration is the part that matters most here.

## Why this needs a state machine, not one big callback

Each capability you've built so far runs its own control loop: navigation drives toward a goal pose, blob tracking drives toward a color centroid. They cannot both be publishing to `/cmd_vel` at once — you saw in Unit 2 that whoever publishes last wins, which in this case means unpredictably. The project's core architectural problem is sequencing: know which behavior owns the robot at any given moment, and cleanly hand off between them. A small explicit state machine is the standard fix:

```python
from enum import Enum, auto

class State(Enum):
    NAVIGATE_TO_SEARCH_ZONE = auto()
    SCAN_FOR_OBJECT = auto()
    APPROACH_OBJECT = auto()
    DONE_PART1 = auto()

class ProjectNode(Node):
    def __init__(self):
        super().__init__('project_node')
        self.state = State.NAVIGATE_TO_SEARCH_ZONE
        # ... publishers/subscribers/action clients from earlier units ...
        self.timer = self.create_timer(0.2, self.tick)

    def tick(self):
        if self.state == State.NAVIGATE_TO_SEARCH_ZONE:
            self.handle_navigate()
        elif self.state == State.SCAN_FOR_OBJECT:
            self.handle_scan()
        elif self.state == State.APPROACH_OBJECT:
            self.handle_approach()
```

Only one `handle_*` method should be commanding `/cmd_vel` (or an action client) at a time — that's the discipline this pattern buys you.

## Stage 1: navigate to the search zone

Reuse the `BasicNavigator` pattern from Unit 3 exactly as before, but wrap goal completion as a state transition instead of a blocking `while` loop, since the rest of the state machine needs to keep running (sensor callbacks, timeouts) while navigation is in flight:

```python
def handle_navigate(self):
    if not self.nav_goal_sent:
        self.navigator.goToPose(self.search_zone_pose)
        self.nav_goal_sent = True
        return

    if self.navigator.isTaskComplete():
        result = self.navigator.getResult()
        self.get_logger().info(f'Arrived at search zone: {result}')
        self.state = State.SCAN_FOR_OBJECT
```

## Stage 2: scan for the object

On arrival, rotate slowly in place while running your detector (Unit 6) or blob search (Unit 5) on each frame, and transition out as soon as a target is confirmed for several consecutive frames — a single-frame detection is not enough evidence given how noisy detectors can be, so require persistence before committing:

```python
def handle_scan(self):
    detection = self.latest_detection
    if detection is not None:
        self.detection_streak += 1
    else:
        self.detection_streak = 0
        self.publish_twist(angular_z=0.3)  # keep rotating to search
        return

    if self.detection_streak >= 5:
        self.target = detection
        self.state = State.APPROACH_OBJECT
    else:
        self.publish_twist(angular_z=0.0)  # hold still while confirming
```

## Try it yourself

Implement and test `NAVIGATE_TO_SEARCH_ZONE` and `SCAN_FOR_OBJECT` end to end in simulation: the robot should navigate to a fixed pose, then rotate and stop once it has held a detection steady for your confirmation streak. Log every state transition with a timestamp — you'll want that log in Part 2 when you're debugging the full sequence and need to know exactly when the handoff between behaviors happened.
