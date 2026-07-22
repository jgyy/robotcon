# Mastering with ROS: Jackal — Unit 6: I have finished, now what?

You've taken Jackal from an unfamiliar platform to a robot that maps a room, navigates by GPS outdoors, detects people with two different sensors, and patrols reactively. This closing unit is about consolidating that into skills you can carry to the next robot, and turning the simulated project into something you'd trust running for real.

## What You Built in This Course

Stack the units up and you've effectively assembled a security-patrol robot: platform and sensor fundamentals, indoor SLAM and navigation, outdoor GPS-fused navigation, dual-sensor person detection, and a reactive state machine tying it all together. That's not a toy exercise — it's the same shape (perceive, localize, plan, act, react) that underlies most real mobile-robot applications, just scaled up or down depending on the domain.

## Bridging the Sim-to-Real Gap

Simulation is forgiving in ways real hardware isn't. Before trusting any of this on the physical Jackal, expect and plan for: noisier and slower GPS fixes than the simulated GPS plugin gives you, laser returns affected by reflective or transparent surfaces, camera exposure and white balance that drift with real lighting, and motor response with real acceleration limits and wheel slip that a perfect kinematic model doesn't capture. The single most useful habit for closing that gap is recording real sensor data for offline replay and tuning:

```bash
ros2 bag record /scan /odom /gps/filtered /cmd_vel -o jackal_field_test
```

Play that bag back against your nodes without the robot moving, and you can safely tune costmap inflation, AMCL/EKF covariances, and detector thresholds against real noise before ever driving on hardware. Always start real-world tests with a hard velocity cap and a hand near the e-stop, and only relax the cap once you trust the behavior at low speed.

## Where to Go Next

A few directions worth pursuing once this course is done: dig into Nav2's behavior trees (docs.ros.org) to replace the simple two-state FSM from the patrol project with something that handles more edge cases without becoming spaghetti; look at proper sensor fusion — a Kalman or particle filter over the laser and camera person estimates instead of naive averaging; if your Jackal has a manipulator attachment, MoveIt (moveit.picknik.ai) is the natural next step from "detect a person" to "interact with an object"; and if you're working with more than one robot, multi-robot coordination for patrol coverage is a substantial and practical problem in its own right.

## Keeping the Skills Sharp

The fastest way to find out how much of this actually transferred is to port the patrol project to a different diff-drive robot — different URDF, different sensor topics, same control and state-machine logic. If it takes you an afternoon instead of a rewrite, you've learned the concepts and not just the Jackal-specific commands. Beyond that, contributing fixes or documentation back to the ROS packages you leaned on here (Nav2, `robot_localization`, `slam_toolbox`) is a genuinely good way to keep learning past the end of a course.

## Try it yourself

Pick one gap between your simulated patrol project and a deployable version — noisy GPS, camera lighting sensitivity, or an FSM edge case you noticed while testing — and write down the specific test you'd run on real hardware to validate it before trusting the robot near actual people.
