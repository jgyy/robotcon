# Python 3 for Robotics — Unit 4: Methods

As soon as a piece of logic is used more than once — converting degrees to radians, clamping a velocity command to safe limits — it belongs in a function. This unit covers defining and calling Python functions, the parameter styles you'll meet in robotics libraries, and where lambdas fit in.

## Defining functions and parameters

A function groups code under a name so it can be called, tested, and reused, with `def`, a parameter list, and an optional `return`:

```python
def clamp(value, low, high):
    return max(low, min(value, high))

safe_speed = clamp(1.8, -1.0, 1.0)   # -> 1.0
```

Parameters can have default values, letting callers omit arguments that usually don't change:

```python
def move_forward(distance_m, speed=0.2):
    duration_s = distance_m / speed
    print(f"Moving {distance_m} m at {speed} m/s for {duration_s:.1f} s")

move_forward(1.0)             # uses default speed
move_forward(1.0, speed=0.5)  # overrides it
```

Python also supports variable-length argument lists — `*args` collects extra positional arguments into a tuple, `**kwargs` collects extra keyword arguments into a dict. You'll see this constantly in library code (including `rclpy`) that needs to forward arbitrary arguments to a parent constructor:

```python
def log_status(robot_name, *readings, **metadata):
    print(f"{robot_name}: readings={readings}, metadata={metadata}")

log_status("spot-01", 0.9, 1.2, location="warehouse-a", operator="jgy")
```

## Return values and scope

A function without an explicit `return` returns `None`. A function can return multiple values, which Python packs into a tuple automatically — a pattern you'll use for things like returning both a status and a value:

```python
def read_sensor(raw_value):
    is_valid = raw_value >= 0
    distance_m = raw_value / 100.0
    return is_valid, distance_m

ok, distance = read_sensor(87)
```

Variables created inside a function are local to it and disappear when the function returns; they don't leak into or overwrite variables of the same name outside. If you need a function to affect state outside itself, pass in a mutable object (like a list or an object instance) and mutate it, or return a new value and assign it at the call site — relying on the `global` keyword is usually a sign the design should be restructured, and it becomes especially important to avoid once you move to class-based, node-style code.

## Lambda functions

A `lambda` is a small, unnamed function limited to a single expression, most useful as a short throwaway argument to something like `sorted()` or `filter()`:

```python
readings = [("front", 0.9), ("left", 0.3), ("right", 1.4)]
closest_first = sorted(readings, key=lambda r: r[1])

valid_only = list(filter(lambda r: r[1] > 0, readings))
```

If the logic needs more than one line or gets used more than once, write a normal `def` function instead — lambdas are for brevity, not for hiding real logic.

## Try it yourself

Write a function `velocity_command(distance_to_goal, max_speed=0.5, slow_radius=1.0)` that returns a linear speed: full `max_speed` when `distance_to_goal` is beyond `slow_radius`, and linearly scaled down toward zero as the robot approaches the goal inside that radius (so it decelerates smoothly rather than stopping abruptly). Test it by calling the function with a few different distances and printing the results.
