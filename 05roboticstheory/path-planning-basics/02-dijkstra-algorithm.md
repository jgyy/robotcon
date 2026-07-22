# Path Planning Basics — Unit 2: Dijkstra Algorithm

Dijkstra's algorithm is the foundation every other planner in this course either builds on or reacts against. This unit walks through the algorithm mechanically, implements it in Python against a grid map, and is honest about where it starts to struggle.

## The problem to solve
Model the environment as a graph: each free cell in a grid is a node, and edges connect it to its (typically 4- or 8-connected) free neighbors, weighted by the cost of moving between them (often just Euclidean distance, or 1 for orthogonal moves and sqrt(2) for diagonals). Given a start node and goal node, find the minimum-total-cost path between them. Dijkstra solves this optimally for graphs with non-negative edge weights, which grid maps naturally satisfy.

## Step by step
1. Maintain a `cost_so_far` map (initialized to infinity for every node except the start, which is 0) and a priority queue of `(cost, node)` seeded with `(0, start)`.
2. Pop the lowest-cost node from the queue. If it's the goal, stop — you're done, because Dijkstra always expands nodes in non-decreasing order of cost, so the first time you pop the goal, that cost is optimal.
3. Otherwise, for each neighbor, compute `new_cost = cost_so_far[current] + edge_cost(current, neighbor)`. If that's cheaper than the neighbor's currently known cost, update it and push `(new_cost, neighbor)` onto the queue, recording `current` as the neighbor's `came_from` parent.
4. Repeat until the queue is empty or the goal is popped.
5. Reconstruct the path by walking `came_from` pointers backward from the goal to the start, then reversing.

The core insight is greedy-but-correct: because you always expand the cheapest frontier node next, and edge weights are non-negative, no later discovery can ever retroactively make an already-finalized node's cost cheaper.

## Dijkstra in Python
```python
import heapq

def dijkstra(grid, start, goal):
    def neighbors(cell):
        x, y = cell
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx, ny = x+dx, y+dy
            if 0 <= nx < grid.width and 0 <= ny < grid.height and grid.is_free(nx, ny):
                yield (nx, ny)

    frontier = [(0, start)]
    cost_so_far = {start: 0}
    came_from = {start: None}

    while frontier:
        cost, current = heapq.heappop(frontier)
        if current == goal:
            break
        if cost > cost_so_far[current]:
            continue  # stale queue entry, skip
        for nxt in neighbors(current):
            new_cost = cost_so_far[current] + 1  # unit edge cost
            if nxt not in cost_so_far or new_cost < cost_so_far[nxt]:
                cost_so_far[nxt] = new_cost
                came_from[nxt] = current
                heapq.heappush(frontier, (new_cost, nxt))

    if goal not in came_from:
        return None  # unreachable

    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = came_from[node]
    return list(reversed(path))
```

## Testing with ROS 2 and a simulator
To see this on an actual (simulated) robot rather than a bare grid: run the algorithm's output path as a sequence of waypoints published to a simple pose-follower node, with a differential-drive robot in a simulator such as Gazebo. Concretely:
```bash
ros2 topic echo /odom              # confirm the robot's pose is publishing
ros2 topic pub /goal_pose geometry_msgs/msg/PoseStamped "{...}"   # send a planned waypoint
```
Even without a full navigation stack, publishing each waypoint from your `path` list in order and watching the robot step through them in a simulator is enough to sanity-check that your planner's output is physically sane — no waypoint should require passing through an obstacle cell.

## Limitations
Dijkstra is optimal and simple, but it's *uninformed* — it has no notion of "toward the goal," so it expands outward in all directions equally, wasting time exploring cells that move away from the goal just as eagerly as cells that move toward it. On a large open grid, that means visiting a huge fraction of the map before ever reaching a distant goal. This is exactly the gap A* (Unit 3) closes by adding a heuristic.

## Conclusions
You now have a working, optimal shortest-path planner and a concrete feel for why "optimal" and "efficient" are different properties. Every algorithm in the rest of this course is best understood as a variation on the same expand-the-frontier idea, either adding guidance (A*) or abandoning exhaustive search altogether (RRT, potential fields).

## Try it yourself
Run your `dijkstra` implementation against the 6x6 grid you sketched in Unit 1. Add an instrumentation counter that increments every time a node is popped from the frontier, and compare that count to the number of cells actually on the final path — that ratio is a rough measure of how much "wasted" search Dijkstra does, which you'll revisit numerically in Unit 3.
