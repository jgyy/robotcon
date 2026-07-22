# Python 3 for Robotics — Unit 3: Conditional Statements & Loops

A robot is constantly making decisions — "is the path clear?", "has the battery dropped too low?" — and repeating actions — "keep reading the laser scan every cycle until the goal is reached." Conditionals and loops are how you express both, and they're the backbone of every control loop you'll write.

## Conditional statements

`if` / `elif` / `else` in Python reads close to plain English and relies on indentation instead of braces to define blocks:

```python
battery_percent = 18

if battery_percent < 10:
    print("Critical: return to dock immediately")
elif battery_percent < 25:
    print("Warning: battery low, plan return soon")
else:
    print("Battery OK")
```

Python has no `switch` statement, but chained `elif` or a dictionary lookup covers the same ground. Boolean operators (`and`, `or`, `not`) combine conditions the way you'd expect, and Python allows chained comparisons that read naturally for range checks:

```python
front_distance = 0.35
if 0.0 < front_distance < 0.5:
    print("Obstacle in stopping range — halt")
```

Also useful: any non-empty collection, non-zero number, or non-`None` value is "truthy," so `if joint_angles:` is a common, idiomatic way to check a list isn't empty.

## Loops: for and while

`for` loops iterate over a sequence — exactly what you want when processing a batch of sensor readings you already have:

```python
scan_ranges = [1.2, 0.9, 0.4, 2.1, 3.0]
for i, r in enumerate(scan_ranges):
    if r < 0.5:
        print(f"Obstacle at scan index {i}, distance {r:.2f} m")
```

`while` loops run as long as a condition holds — the natural shape of a robot control loop that keeps going until some goal is met or the process is stopped:

```python
distance_to_goal = 5.0
step = 0.5

while distance_to_goal > 0:
    distance_to_goal -= step
    print(f"Distance remaining: {distance_to_goal:.1f} m")
```

Real ROS 2 nodes don't usually write their own `while True` loop for the main run cycle — a framework-level executor (`rclpy.spin`) calls your callbacks on a timer instead — but `while` loops are still everywhere in helper scripts, simulators, and command-line tools.

## Loop control and comprehensions

`break` exits a loop early, `continue` skips to the next iteration, and a `for`/`while` loop can carry an `else` clause that runs only if the loop completed without hitting `break` — handy for "search until found, otherwise report failure" patterns:

```python
target_id = 7
detected_ids = [3, 5, 7, 9]

for obj_id in detected_ids:
    if obj_id == target_id:
        print("Target found")
        break
else:
    print("Target not in this frame")
```

List comprehensions give you a compact, often more readable way to build a new list from an existing one, and are idiomatic Python rather than an advanced trick:

```python
scan_ranges = [1.2, 0.9, 0.4, 2.1, 3.0]
close_obstacles = [r for r in scan_ranges if r < 1.0]
clamped = [min(r, 3.5) for r in scan_ranges]
```

## Try it yourself

Write a script that loops over a list of ten simulated laser-scan distances. Use a `for` loop with `enumerate` to find the closest obstacle and its index. Then write a conditional that prints `"STOP"` if the closest distance is under 0.3 m, `"SLOW"` if it's under 1.0 m, or `"GO"` otherwise. Finally, rewrite the "find distances under 1.0 m" step as a one-line list comprehension.
