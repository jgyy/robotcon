# TEB Local Planner — Unit 5: Mini Project

Time to put Units 1 through 4 together into a single working, tuned setup rather than isolated exercises. This project asks you to configure TEB end to end on a robot of your choice and prove, with evidence, that it's actually performing well.

## Project brief

Set up a simulated robot — differential-drive or car-like, your choice — with the full Navigation Stack, TEB as the active local planner, and a cluttered test environment containing at least:

- A narrow gap the robot must pass through deliberately (not just skirt around).
- A dynamic or repositioned obstacle that isn't in the static map the global planner used.
- A goal that requires either a sharp turn (diff-drive) or a maneuver respecting `min_turning_radius` (car-like).

## Steps

1. **Bring-up.** Launch your robot, map, localization, and the full Navigation Stack with TEB wired in as the local planner plugin (Unit 2).
2. **Baseline run.** Send the robot through the test environment with TEB on its default parameters. Record the outcome — does it reach the goal, does it collide, does it stall, does it oscillate?
3. **Tune.** Using the RViz trajectory visualization and the parameter groups from Unit 3 (and Unit 4 if you're using a car-like robot), iteratively adjust the configuration to fix whatever the baseline run got wrong. Keep a short changelog of each parameter you changed and why.
4. **Re-run and compare.** Send the robot through the identical scenario again. Capture evidence of the improvement — a screen recording, an RViz screenshot of the trajectory, or a `cmd_vel` plot showing smoother velocity commands.
5. **Stress test.** Reposition the dynamic obstacle mid-run (move it in the simulator, or use a second actor if your simulator supports one) and confirm TEB replans around it without requiring a full stop-and-restart of navigation.

## Success criteria

- The robot reaches the goal without collision in the tuned run.
- The narrow gap is traversed deliberately, not by accident (the trajectory should show the robot aiming for the gap's centerline, not clipping an edge).
- You can point to at least one specific parameter change and explain, in terms of the cost-weight tradeoffs from Unit 3, why it produced the improvement you observed.
- (Car-like robots only) No commanded trajectory violates your configured `min_turning_radius`.

## Stretch goals

- Compare TEB against your original local planner (DWA or otherwise) on the exact same scenario and quantify the difference — path smoothness, time to goal, minimum obstacle clearance.
- Add a second, tighter narrow gap and see how far you can push `min_obstacle_dist` down before TEB starts refusing to plan through it at all — this tells you where your safety margin actually starts costing you feasible plans.

## Try it yourself

Write a short README for your project (a paragraph is enough) documenting your final parameter file, the scenario you tested against, and the single most impactful tuning change you made. Treat this as the artifact you'd hand to a teammate who needs to reproduce your setup — if it's missing a step, that's a gap in your own understanding worth closing before you consider TEB "learned."
