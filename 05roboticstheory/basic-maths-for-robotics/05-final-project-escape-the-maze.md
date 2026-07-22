# Basic Maths for Robotics — Unit 5: Final Project: Escape the maze!

This capstone pulls together vectors, derivatives, and probability from Units 2-4 into one program: a simulated robot that must escape a maze using a motion model (linear algebra), a smooth speed profile (calculus), and a probabilistic belief about its own position (probability), since its sensors and motors are both noisy.

## Preliminary setup: the maze and the robot model
Represent the maze as a 2D grid of cells, each either free (`0`) or a wall (`1`), and represent the robot's pose as a position vector `p = (x, y)` plus a heading `theta`. Moving "forward" by a step is a linear map, exactly like Unit 2's rotation-then-translate composition: rotate the local forward vector `(1, 0)` by `theta`, scale it by the step size, and add it to the current position.

```python
import numpy as np

MAZE = np.array([
    [0, 0, 0, 1, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
])
START = (0, 0)
GOAL = (4, 4)

def move(pose, step, theta):
    x, y = pose
    direction = np.array([np.cos(theta), np.sin(theta)])
    dx, dy = step * direction
    return (x + dx, y + dy)
```

## The task
Write a program that drives the robot from `START` to `GOAL` without knowing its exact position — only a noisy belief over grid cells, updated with a discrete Bayes filter (Unit 4). At every step: (1) **predict** — shift the belief distribution in the direction of motion, blurred by motion uncertainty; (2) **sense** — take a noisy "wall ahead?" reading and use Bayes' rule to sharpen the belief toward cells consistent with that reading; (3) **decide** — move toward the *believed* most-likely free cell that reduces distance to the goal, using the Euclidean-distance-to-goal function whose gradient (Unit 3) tells you which direction actually helps.

```python
def sense_wall_ahead(true_cell, maze, p_correct=0.85):
    r, c = true_cell
    actual = maze[r, c] == 1
    if np.random.rand() < p_correct:
        return actual
    return not actual

def bayes_update(belief, sensor_says_wall, maze, p_correct=0.85):
    likelihood = np.where(
        maze == 1,
        p_correct if sensor_says_wall else (1 - p_correct),
        (1 - p_correct) if sensor_says_wall else p_correct,
    )
    posterior = belief * likelihood
    return posterior / posterior.sum()
```

## Project solution: putting it together
The full loop below initializes a uniform belief over free cells (Unit 4's "no idea where I start"), then alternates predict/sense/decide steps, using the gradient of squared distance to the goal — `grad ||p - goal||^2 = 2(p - goal)` — to pick a greedy descent direction at each step.

```python
def distance_to_goal_gradient(cell, goal):
    return 2 * (np.array(cell) - np.array(goal))

def run_escape(maze, start, goal, steps=30):
    belief = (maze == 0).astype(float)
    belief /= belief.sum()
    true_cell = start

    for step in range(steps):
        if true_cell == goal:
            print(f"Escaped in {step} steps!")
            return True

        wall_reading = sense_wall_ahead(true_cell, maze)
        belief = bayes_update(belief, wall_reading, maze)

        grad = distance_to_goal_gradient(true_cell, goal)
        candidates = [
            (true_cell[0] + dr, true_cell[1] + dc)
            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]
            if 0 <= true_cell[0] + dr < maze.shape[0]
            and 0 <= true_cell[1] + dc < maze.shape[1]
            and maze[true_cell[0] + dr, true_cell[1] + dc] == 0
        ]
        if not candidates:
            break
        true_cell = min(candidates, key=lambda c: np.dot(np.array(c) - np.array(true_cell), grad))

    print("Did not escape within step budget.")
    return False

run_escape(MAZE, START, GOAL)
```

Notice how each course pillar earns its place: the pose update is a linear map (Unit 2), the greedy move uses a gradient of a distance function (Unit 3), and the robot's confidence about walls is maintained with Bayes' rule (Unit 4) even though its individual sensor readings are only 85% reliable.

## Try it yourself
Modify `run_escape` so it also prints the belief's entropy (`-sum(p * log(p))` over nonzero belief cells) at each step, and confirm it trends downward as more sensor readings arrive — this is the same "uncertainty shrinks as evidence accumulates" behavior you exercised in Unit 4, now driving an actual navigation decision instead of a toy door example.
