# Build Your First ROS2 Based Robot — Unit 3: Battery

A robot that browns out mid-drive or catches fire on the shelf is worse than no robot at all. This unit covers sizing your power budget, picking a battery that meets it safely, and wiring it into the rest of the system.

## Power consumption calculation
Before you can choose a battery you need to know how much current your robot actually draws. Build a table of every powered component and its current draw at typical and peak load:

| Component | Voltage | Typical current | Peak current |
|---|---|---|---|
| 2x drive motors | 12V | 0.5A each | 2.5A each (stall) |
| Onboard computer (e.g. Raspberry Pi) | 5V | 0.6A | 1.2A |
| LiDAR | 5V | 0.3A | 0.4A |
| Camera | 5V | 0.25A | 0.3A |

Sum typical draw for expected runtime, and sum peak draw to make sure your battery and wiring can survive a worst case (e.g. both motors stalled against an obstacle while the compute stack is under full load). Convert everything to watts (`W = V × A`) if your components run at different voltages, since battery capacity is often rated in watt-hours as well as amp-hours. A robot pulling 20W typical needs roughly a 20Wh battery per hour of desired runtime, before derating for battery inefficiency and the fact that batteries shouldn't be run down to zero.

## Battery selection
For small mobile robots, lithium-based chemistries (LiPo or Li-ion, typically in a 2S or 3S configuration for 7.4V/11.1V nominal) dominate because of their energy density, but they come with real safety obligations:
- **Never discharge below the chemistry's minimum cell voltage** (commonly ~3.0-3.2V/cell) — a battery-management circuit or a voltage-cutoff-aware power board protects against this.
- **Match capacity (mAh) and discharge rating (C-rating) to your peak current draw**, not just typical draw — a battery with too low a C-rating sags under load exactly when the motors need the most current.
- **Use a dedicated charger for the chemistry you chose** and never leave LiPo cells charging unattended.

If this is your first robot and you'd rather not manage LiPo safety directly, a well-regulated Li-ion battery pack with an integrated battery-management system (the kind used in off-the-shelf robot kits and power banks) is a reasonable, lower-risk starting point; you can graduate to raw LiPo packs once you're comfortable.

## Connect battery to robot
Motors and logic electronics usually want different voltages, so the battery typically feeds a power distribution/regulation board rather than components directly:
```
Battery --> Power switch --> Fuse --> Voltage regulator(s) --> {Motor driver (motor voltage), Onboard computer (5V), Sensors (5V/3.3V)}
```
Two practices are worth adopting from the start: put an inline fuse (or resettable polyfuse) between the battery and the rest of the circuit sized just above your peak current, so a wiring fault trips the fuse instead of the battery; and put a physical power switch between the battery and everything else so you're never disconnecting a live circuit by pulling wires.

## Conclusion
You now have a battery that is sized against a real power budget rather than a guess, and a power distribution path that gets safe, regulated voltage to the motors, the computer, and the sensors. Every later unit — the compute in Unit 4, the sensors in Units 8-9 — assumes this power foundation is in place and stable.

## Try it yourself
Fill in the power-budget table above with your own robot's actual components and their datasheet current figures, sum typical and peak wattage, and use that to pick a target battery capacity (mAh) and minimum discharge (C) rating before you buy one.
