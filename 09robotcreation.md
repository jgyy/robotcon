# 09 Robot Creation

## Why this matters
Every other file in this roadmap assumes a robot already exists — this one is about the step before that: turning an idea into a physical (or at least simulated) machine that can actually run the software you're learning elsewhere. Picking the wrong motor, underestimating current draw, or writing a URDF that doesn't match your real link geometry will bite you far more than any software bug, because fixing hardware mistakes costs money and time, not just a recompile. The goal here is a repeatable workflow — requirements, then component selection, then a model, then simulation, then real hardware — so that by the time you're bolting things together you already know they'll roughly work. File 04 covers URDF and ros2_control as ROS 2 tooling in depth; this file is the surrounding design process that tells you what to put into that tooling.

## Core concepts
- Requirements-first design — derive payload, speed, terrain, runtime, and sensor needs from the actual task before touching a parts catalog, so you don't over- or under-build
- Locomotion and chassis choice — differential drive, skid-steer, Ackermann, legged, or aerial, each with different mechanical complexity and control demands
- Actuator selection — DC gearmotors, servos, steppers, and BLDC motors, and the torque/speed/gearing trade-offs that decide whether a motor can actually move your robot
- Sensor selection matched to task — choosing sensors your navigation/perception stack actually needs rather than instrumenting everything "just in case," and understanding each sensor's power, bandwidth, and mounting requirements
- Power budgeting — cell chemistry (LiPo, Li-ion, NiMH), voltage sag under load, peak vs. idle current draw per component, and computing realistic runtime instead of assuming datasheet numbers
- Electrical integration — separate motor and logic power rails, fusing/current limiting, common grounding, connector choice, and motor-driver EMI that can corrupt nearby sensor signals
- Mechanical design and CAD workflow — iterating chassis/mount geometry in a CAD tool before (or alongside) writing URDF, and exporting real dimensions and masses instead of guessing them
- URDF authoring — link/joint tree structure, distinguishing visual from collision geometry, and estimating mass and inertia so the model behaves plausibly, not just looks right
- XACRO for reuse — parameterized macros for repeated structures (wheels, arm links) so the description scales without hand-duplicated XML
- Simulate-first-then-build — validating kinematics, dynamics, and control logic in simulation before committing to physical parts, since simulation iteration is nearly free compared to hardware iteration
- Bridging simulation and hardware with ros2_control — the hardware_interface abstraction that lets the same controllers and controller configuration run against a mock, a simulated, and a real robot with minimal changes (see file 04 for the deep dive)
- The reality gap — friction, backlash, sensor noise, communication latency, and power sag that simulation under-represents, and building in margin rather than being surprised by it
- Onboard compute selection — microcontroller (e.g. ESP32, STM32) vs. single-board computer (e.g. Raspberry Pi, Jetson) vs. offboard laptop, driven by compute needs, power budget, and real-time requirements
- Keeping hardware artifacts in sync — BOM, wiring diagrams, CAD, and URDF drifting apart is a common source of "it worked in sim" surprises; treat them as one versioned design, not independent documents

## Resources
- ROS 2 URDF documentation and tutorials — search docs.ros.org for "URDF" (also useful: the long-standing wiki.ros.org/urdf/Tutorials, format is unchanged across ROS versions)
- xacro package documentation — search docs.ros.org or wiki.ros.org for "xacro"
- ros2_control documentation — control.ros.org, for how the hardware abstraction you'll target actually works
- REP 103 (Standard Units of Measure and Coordinate Conventions) and REP 105 (Coordinate Frames for Mobile Platforms) — ros.org/reps, worth reading once so your URDF and TF tree follow ROS conventions from the start
- Gazebo — gazebosim.org (current Gazebo, formerly Ignition) or classic.gazebosim.org (Gazebo Classic), depending on which your distro pairs with
- "Modern Robotics: Mechanics, Planning, and Control" by Kevin Lynch and Frank Park — free textbook, video lectures, and code library at modernrobotics.org; strong on the kinematics/dynamics math behind actuator and mechanism choices
- "Programming Robots with ROS" by Morgan Quigley, Brian Gerkey, and William D. Smart (O'Reilly) — older and ROS1-flavored, but still a solid grounding in the idea-to-robot workflow
- Pololu's technical resources — pololu.com, DC motor/gearmotor selection guides that explain torque-speed curves and stall current in practical terms
- Battery University — batteryuniversity.com, well-known reference for battery chemistry, discharge behavior, and voltage sag under load
- CAD-to-URDF exporters — search for "onshape-to-robot" (Onshape), "sw2urdf" (SolidWorks, ROS-Industrial), or "Fusion2URDF" (Fusion 360) depending on your CAD tool, to avoid hand-writing geometry and inertia
- `check_urdf` and `urdf_to_graphiz` command-line tools (ship with the urdf ecosystem) for sanity-checking a URDF's link tree before loading it anywhere

## Hands-on checkpoints
- [ ] Write down your robot's mission in one paragraph and derive concrete requirements from it: payload, speed, terrain, runtime, required sensors
- [ ] Build a power budget spreadsheet listing every actuator, sensor, and compute board with peak/idle current draw, and compute expected runtime for a candidate battery
- [ ] Author a URDF (or XACRO) for your robot with a correct link/joint tree, plausible masses and inertias, and dimensions matching parts you've actually chosen
- [ ] Load the URDF in RViz and verify the TF tree, joint limits, and visual/collision geometry before touching a simulator
- [ ] Bring the same URDF into a simulator and get it standing/driving under physics with sane inertia values
- [ ] Wire up ros2_control against the simulated robot (mock or sim hardware interface) and drive it through a controller to confirm the full control chain
- [ ] Swap in a real hardware_interface talking to your actual motor driver/microcontroller, reusing the same URDF and controller configuration
- [ ] Run the same commanded trajectory in sim and on the real robot, and document where they diverge (friction, latency, sensor noise) and by how much
