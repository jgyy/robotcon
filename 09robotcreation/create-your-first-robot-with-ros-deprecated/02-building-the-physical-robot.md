# Create Your First Robot with ROS (Deprecated) — Unit 2: Building the Physical Robot

This unit is entirely hands-on: mounting the two-wheeled chassis and wiring its electronics so that, at the end, you have a robot that powers on safely even though nothing is driving it yet. Get this right and every later software unit has a stable platform to talk to; get it wrong and you'll spend Unit 5 debugging a loose wire instead of a driver bug.

## Chassis and drivetrain assembly
Start with the mechanical structure before any electronics: mount the two geared DC motors to the chassis plate, attach the wheels, and fit the caster or ball-bearing support that keeps the robot balanced as a differential-drive platform (two powered wheels plus one passive contact point). Torque screws by hand-tight plus a small turn — over-tightening plastic chassis mounts is a common way to crack a mount you'll need to replace mid-course. Check that both wheels spin freely with no motor power applied; binding at this stage means an alignment problem now, not a "weak motor" problem later.

## Wiring power and the motor driver
The motor driver board sits between the battery/regulator and the motors, and typically also between the single-board computer's GPIO pins and the motors — the SBC's pins supply logic-level control signals, the driver board supplies the actual motor current. Wire it in this order to minimize the risk of magic smoke:
1. Battery → voltage regulator → driver board power input (confirm voltage with a multimeter before connecting anything else).
2. Motors → driver board motor outputs.
3. SBC GPIO pins → driver board control/logic inputs (direction and PWM enable pins), matching the pinout in your driver's datasheet exactly.
4. Common ground between the SBC and the driver board — a missing shared ground is the single most common cause of "the motors just don't respond" bugs.

## Mounting the computer and sensors
Fix the single-board computer to the chassis with standoffs so nothing shorts against the metal or the motor leads, and route cables so they can't catch in the wheels. If your kit includes a camera or a proximity/line sensor for later units, mount it now even though you won't wire it into ROS until Unit 5 or 6 — physically placing it while you have full access to the chassis is much easier than retrofitting it later.

## Power-on and continuity checks
Before connecting to ROS at all, do a bare electrical smoke test:
```bash
# with the robot on a stand so wheels can spin freely
# 1. power on the battery/regulator only, check driver board LED indicators
# 2. power on the SBC, confirm it boots (check via HDMI or a serial console)
# 3. with a multimeter, verify 0V across any pin pair that should be isolated
```
Only once the board boots cleanly and nothing gets warm should you consider the physical build done.

## Try it yourself
Draw (or photograph and annotate) the full wiring diagram of your assembled robot: battery, regulator, driver board, motors, and SBC, with every wire labeled by source and destination pin. Keep this diagram — you'll need it again in Unit 5 when you write the motor driver node and have to map GPIO pin numbers to physical wires.
