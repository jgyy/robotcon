# TEB Local Planner — Unit 4: Set Up for Car-Like Robots

Most local planners are built assuming a differential-drive robot that can rotate in place. Car-like (Ackermann-steered) robots can't — they have a minimum turning radius and can only move along curvature-limited arcs. TEB is one of the few mainstream local planners with first-class support for this constraint, and this unit is about turning that support on correctly.

## Differential-drive vs. car-like kinematics

A differential-drive robot's velocity is `(v, ω)` — linear and angular velocity, independently commandable, including `ω` with `v = 0` (pure rotation in place). A car-like robot instead has a **non-holonomic** constraint tying its turning rate to a steering angle and a fixed wheelbase: it cannot spin in place, and its achievable curvature is bounded by the mechanical limits of the steering linkage.

If you hand a diff-drive-tuned TEB config to a car-like robot, it will happily generate trajectories that require in-place rotation or turns tighter than the vehicle can physically execute — the robot's low-level controller will either clip the commands (producing a trajectory the planner didn't intend) or the robot will simply fail to track the path. TEB avoids this by modeling the vehicle explicitly, but only if you tell it to.

## Key car-like parameters

Switch TEB's kinematic model and give it your vehicle's real geometry:

```yaml
teb_local_planner:
  ros__parameters:
    min_turning_radius: 1.5          # 0.0 means diff-drive / holonomic-in-rotation
    wheelbase: 0.85                  # distance between front and rear axle
    cmd_angle_instead_rotvel: true   # publish steering angle instead of angular velocity
    max_vel_x_backwards: 0.2         # car-like robots often have limited/no reverse
```

`min_turning_radius` is the constraint that matters most: setting it above `0.0` tells TEB's optimizer to only generate trajectories the vehicle can physically follow, rather than relying on the low-level controller to reject infeasible ones after the fact. `cmd_angle_instead_rotvel` changes the *meaning* of the angular component of `cmd_vel` — instead of an angular velocity, it becomes a steering angle, which is what most Ackermann-vehicle drivers expect. Get this wrong and your robot will misinterpret every command it receives, so check your vehicle driver's expected convention before flipping it.

## Footprint and collision model

Car-like robots are usually longer than they are wide, and often have a non-trivial overhang in front of or behind the axle. A circular footprint radius will be either dangerously optimistic (clipping corners) or needlessly conservative (refusing to fit through gaps it actually clears). Define an accurate polygon footprint instead:

```yaml
local_costmap:
  local_costmap:
    ros__parameters:
      footprint: "[[-0.3, -0.25], [-0.3, 0.25], [0.5, 0.25], [0.5, -0.25]]"
```

Coordinates are relative to `base_link`, in meters, going around the vehicle outline. Get the sign and offset of the origin right relative to your axle — a footprint that's mirrored front-to-back is a subtle bug that only shows up as unexplained collisions when reversing.

## Testing car-like behavior in simulation

Bring up a car-like robot model (many simulators ship an Ackermann or `car_demo`-style example) with the parameters above applied, and send it a goal that requires a tight turn — a hairpin in a corridor works well.

```bash
ros2 topic echo /cmd_vel
```

Watch for two things: the angular component should now read as a bounded steering angle (not an unbounded angular velocity), and the planned trajectory in RViz should show smooth arcs rather than any in-place pivoting.

## Try it yourself

Configure `min_turning_radius` and `wheelbase` for a car-like robot (real or simulated), then send it a goal directly behind its starting pose, off to one side, close enough that a diff-drive robot would just spin toward it. Confirm TEB instead generates a widening arc or a three-point-turn-style maneuver, and that it never asks for a turn tighter than your configured radius.
