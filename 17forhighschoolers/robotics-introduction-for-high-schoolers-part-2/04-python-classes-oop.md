# Robotics Introduction for High Schoolers Part 2 — Unit 4: Python Classes & OOP

Passing the maze grid, robot position, and heading around as separate arguments to every function gets unwieldy fast. This unit wraps that state and the functions that act on it into a single `Robot` object — the same organizing idea behind every ROS 2 node you'll eventually write.

## Defining a class

A class is a blueprint; `__init__` is the constructor that runs when you create an instance, and `self` is the instance itself — every method takes it as the first parameter, and Python passes it automatically:

```python
class Robot:
    def __init__(self, row, col, heading="north"):
        self.row = row
        self.col = col
        self.heading = heading
        self.steps_taken = 0

    def position(self):
        return (self.row, self.col)

robot = Robot(0, 0)
print(robot.position())     # (0, 0)
print(robot.steps_taken)     # 0
```

`self.row = row` is what makes `row` stick around as part of the object instead of vanishing when `__init__` returns — this is the class equivalent of the local-vs-global problem from Unit 3, solved properly.

## Methods that change state

Instance methods read and update `self`'s attributes directly, instead of needing values passed in and new values returned every time:

```python
class Robot:
    MOVES = {"north": (-1, 0), "south": (1, 0), "east": (0, 1), "west": (0, -1)}

    def __init__(self, row, col, heading="north"):
        self.row, self.col, self.heading = row, col, heading
        self.steps_taken = 0

    def turn(self, new_heading):
        self.heading = new_heading

    def step_forward(self):
        dr, dc = Robot.MOVES[self.heading]
        self.row += dr
        self.col += dc
        self.steps_taken += 1

robot = Robot(2, 2)
robot.turn("east")
robot.step_forward()
print(robot.row, robot.col, robot.steps_taken)   # 2 3 1
```

`MOVES` here is a class attribute — shared by every `Robot` instance — while `row`, `col`, and `heading` are instance attributes, unique per object. That distinction matters the moment you have more than one robot in the same maze.

## Inheritance

Inheritance lets a more specific class reuse and extend a general one. A `TurtleBot` is a `Robot` with extra behavior (say, a bump sensor), without re-writing movement logic:

```python
class TurtleBot(Robot):
    def __init__(self, row, col, heading="north"):
        super().__init__(row, col, heading)   # run Robot's __init__ first
        self.bumped = False

    def step_forward(self, wall_ahead=False):
        if wall_ahead:
            self.bumped = True
            return
        super().step_forward()

bot = TurtleBot(0, 0)
bot.step_forward(wall_ahead=True)
print(bot.bumped, bot.position())   # True (0, 0)
```

`super()` reaches into the parent class — use it to extend behavior rather than duplicating the parent's code inside the child.

## Dunder methods

Methods surrounded by double underscores ("dunders") hook into Python's built-in behavior. `__str__` controls what `print()` shows for your object:

```python
class Robot:
    def __init__(self, row, col):
        self.row, self.col = row, col

    def __str__(self):
        return f"Robot@({self.row},{self.col})"

print(Robot(1, 4))   # Robot@(1,4) instead of a default <Robot object at 0x...>
```

You've already met `__init__`; `__str__` and `__repr__` are the next two worth knowing, since they make every `print()` and debugger inspection of your robot readable.

## Try it yourself

Extend the `TurtleBot` class above with a method `is_at_exit(self, grid)` that checks whether the cell at `(self.row, self.col)` in a maze grid equals `"exit"`. Create an instance, call `step_forward()` a few times, and print the result of `is_at_exit()` after each step.
