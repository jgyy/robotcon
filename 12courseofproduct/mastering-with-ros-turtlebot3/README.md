# Mastering with ROS: Turtlebot3

This course takes Turtlebot3 — the Burger and Waffle variants alike — from first bringup through autonomous navigation, vision-driven behaviors (line following, blob tracking, object recognition), MoveIt-based arm motion planning, and finally a two-part capstone project that forces navigation, perception, and manipulation to work together on one robot rather than as isolated demos.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Burger vs. Waffle, course scope, and getting a Turtlebot3 workspace built and running.
2. [Basic Usage](02-basic-usage.md) — Bringing the robot up, teleoperating it, reading odometry and TF, and publishing your own velocity commands.
3. [Navigation with Burger](03-navigation-with-burger.md) — SLAM mapping, costmaps, AMCL localization, and sending autonomous navigation goals.
4. [Follow a Line](04-follow-a-line.md) — A full vision-to-control pipeline: image capture, HSV thresholding, and proportional steering.
5. [Blob Tracking](05-blob-tracking.md) — Detecting and approaching an arbitrary colored object anywhere in frame, using size as a distance proxy.
6. [Object Recognition](06-object-recognition.md) — Moving beyond color thresholds to classical and learned object detectors, and publishing structured detections.
7. [Motion Planning with MoveIt](07-motion-planning-with-moveit.md) — Planning scenes, joint- and pose-space goals, and a basic pick sequence on the OpenManipulator arm.
8. [Project Part 1](08-project-part-1.md) — Scoping the capstone project and building its navigate-and-detect first half with an explicit state machine.
9. [Project Part 2](09-project-part-2.md) — Finishing the project with approach, manipulation, and return-to-dock, plus integration testing across the seams.
10. [Final Recommendations](10-final-recommendations.md) — Habits worth keeping, where to take these skills next, and where to find help.
