# Robotics Introduction for High Schoolers Part 2 — Unit 2: Conditional Statements & Loops

Storing data is only half the story — a robot has to make decisions and repeat actions. This unit covers the two control-flow tools every maze-solving program needs: branching on what the robot senses, and looping until it reaches the exit.

## if / elif / else

Python's conditional syntax drops the parentheses and braces you'd use in C++, and uses indentation instead of `{}` to mark a block:

```python
front_clear = True
left_clear = False

if front_clear:
    move = "forward"
elif left_clear:
    move = "turn_left"
else:
    move = "turn_right"

print(move)
```

Indentation is not a style choice in Python — it's the syntax. Mixing tabs and spaces, or misaligning a block, is a syntax error, not just an ugly-code warning.

## Comparison and logical operators

The comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) work as expected, but Python spells boolean logic with words instead of symbols:

```python
row, col = 2, 3
grid_size = 5

in_bounds = (0 <= row < grid_size) and (0 <= col < grid_size)
at_exit = (row == grid_size - 1) and (col == grid_size - 1)
should_stop = at_exit or not in_bounds
```

`and`, `or`, and `not` replace `&&`, `||`, and `!`. Python also short-circuits exactly like C++ does, which matters when the second condition depends on the first being true — for example `robot.sensor is not None and robot.sensor.distance < 0.3` never touches `.distance` on a missing sensor.

## for loops

Python `for` loops iterate directly over a sequence — there's no C-style `for (int i = 0; ...)` counter loop. `range()` generates the counter when you need one:

```python
directions = ["north", "east", "south", "west"]

for direction in directions:
    print(f"checking {direction}")

for step in range(4):              # 0, 1, 2, 3
    print(f"step {step}")

for index, direction in enumerate(directions):   # both index and value
    print(f"{index}: {direction}")
```

`enumerate()` is the idiomatic replacement for manually tracking an index alongside a loop variable — reach for it instead of `range(len(directions))`.

## while loops

A `for` loop is for a known number of iterations; a `while` loop is for "keep going until a condition changes" — exactly the shape of "keep moving until the robot reaches the exit":

```python
reached_exit = False
max_steps = 100
steps = 0

while not reached_exit and steps < max_steps:
    # decide_next_move() and take_step() are stand-ins for logic you'll write later
    move = decide_next_move()
    reached_exit = take_step(move)
    steps += 1

if not reached_exit:
    print("gave up — hit the step limit")
```

The `steps < max_steps` guard alongside the real exit condition is a habit worth keeping permanently: an unbounded `while True` in robot code is how a real robot ends up spinning in place forever.

## break, continue, and skipping work

`break` exits a loop immediately; `continue` skips to the next iteration:

```python
for direction in directions:
    if direction == left_wall_direction:
        continue          # don't even consider walking into a known wall
    if direction == exit_direction:
        chosen = direction
        break              # found it, stop looking
```

## Try it yourself

Using the 4x4 maze grid from Unit 1, write a `while` loop that starts the robot at `(0, 0)` and repeatedly tries to move right (`col += 1`) as long as the next cell is `"open"` or `"exit"` and still in bounds. Stop the loop (with `break`) the moment the robot's cell is `"exit"`, and print how many steps it took.
