# Path Planning Basics — Unit 4: Rapidly-Exploring Random Tree (RRT)

Every algorithm so far has assumed a discretized grid you can exhaustively search. RRT drops that assumption entirely and searches continuous configuration space via random sampling — a completely different strategy that scales far better in high-dimensional or large continuous spaces, at the cost of optimality guarantees.

## Step by step: how RRT works
RRT builds a tree rooted at the start configuration, growing it one random branch at a time:
1. Sample a random point `q_rand` in the configuration space (uniformly, most of the time; occasionally biased toward the goal to speed convergence).
2. Find `q_near`, the existing tree node closest to `q_rand`.
3. Step from `q_near` toward `q_rand` by a fixed `step_size`, producing `q_new`.
4. If the straight-line segment from `q_near` to `q_new` doesn't cross any obstacle, add `q_new` to the tree with `q_near` as its parent.
5. Repeat. Periodically check whether `q_new` is close enough to the goal to connect directly; if so, stop and extract the path by walking parent pointers back to the root.

The "rapidly exploring" property comes from a nice side effect of uniform random sampling: the tree preferentially grows into the largest unexplored regions of free space, because larger empty regions have a higher chance of containing the next random sample.

## The basic RRT algorithm
```python
import random

def rrt(sample_fn, start, goal, is_free_segment, step_size=0.5, goal_tolerance=0.5, max_iters=5000):
    tree = {start: None}          # node -> parent
    nodes = [start]

    for _ in range(max_iters):
        q_rand = goal if random.random() < 0.05 else sample_fn()  # goal-biased sampling
        q_near = min(nodes, key=lambda n: distance(n, q_rand))
        q_new = steer(q_near, q_rand, step_size)

        if is_free_segment(q_near, q_new):
            tree[q_new] = q_near
            nodes.append(q_new)
            if distance(q_new, goal) < goal_tolerance:
                tree[goal] = q_new
                return reconstruct_path(tree, goal)

    return None  # no path found within max_iters

def steer(from_pt, to_pt, step_size):
    dx, dy = to_pt[0]-from_pt[0], to_pt[1]-from_pt[1]
    dist = (dx**2 + dy**2) ** 0.5
    if dist <= step_size:
        return to_pt
    return (from_pt[0] + dx/dist*step_size, from_pt[1] + dy/dist*step_size)

def reconstruct_path(tree, node):
    path = [node]
    while tree[node] is not None:
        node = tree[node]
        path.append(node)
    return list(reversed(path))
```
`is_free_segment` is where your collision checker lives — for a grid map that's a Bresenham-line check against occupied cells; for a general map it might be a geometric intersection test against obstacle polygons.

## Testing in a simulator
The tree-building process is easiest to understand visually before you ever run it against a real robot: plot each accepted `(q_near, q_new)` edge as you generate it, and you'll watch the tree fan out from the start and eventually snake toward the goal. Once that's convincing, connect it to ROS 2 and a simulator the same way as previous units — publish the final path as waypoints and drive a simulated robot through them:
```bash
ros2 topic pub /goal_pose geometry_msgs/msg/PoseStamped "{...}"
```
Because RRT paths are jagged (built from randomly-directed straight segments), it's common practice to post-process the raw path with a shortcutting/smoothing pass before handing it to a controller — try connecting non-adjacent waypoints directly whenever the straight line between them is still obstacle-free.

## Benefits, challenges, and variants
**Benefits**: RRT doesn't require discretizing the whole space up front, so it scales far better than grid search to high-dimensional configuration spaces (e.g. planning for a multi-joint arm, where a grid would be exponential in the number of joints) and to large open environments where a fine grid would be wasteful.

**Challenges**: the raw path is not optimal and not even guaranteed smooth; results vary run to run because of the randomness; and in cluttered environments with narrow passages, uniform sampling can take a long time to happen to find its way through a gap.

**Variants worth knowing the names of**: **RRT\*** adds a rewiring step that incrementally improves path cost as more samples are added, converging toward the optimal path given enough time/samples. **RRT-Connect** grows two trees simultaneously (one from start, one from goal) and tries to connect them, which is often much faster in practice. You won't implement these here, but knowing they exist tells you where to look when the basic version isn't good enough.

## Conclusions
RRT trades the completeness and optimality guarantees of grid search for the ability to scale into continuous, high-dimensional spaces that grid-based planners simply can't handle. Choosing between "A*-style" and "RRT-style" planning in practice usually comes down to: is my configuration space low-dimensional and discretizable (use A*), or high-dimensional/continuous (use a sampling-based planner)?

## Try it yourself
Implement the `rrt` function above against your Unit 1 grid (treat the grid as continuous free space, checking each segment against occupied cells). Run it 5 times with the same start/goal and compare the resulting path lengths — the variation you see run-to-run is the direct, hands-on consequence of RRT's randomness, and is exactly what RRT* is designed to reduce.
