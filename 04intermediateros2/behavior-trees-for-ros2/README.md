# Behavior Trees for ROS2

Behavior Trees have become the standard way to structure decision-making logic in ROS2 robots — Nav2 uses them for navigation recoveries, and they show up increasingly in manipulation and multi-robot coordination. This course builds up from the core concepts (nodes, ticks, the `SUCCESS`/`FAILURE`/`RUNNING` contract, and the Sequence/Fallback/Parallel/Decorator node types) through design principles for keeping large trees maintainable, into hands-on integration with ROS2 using the BehaviorTree.CPP library, and finishes with stochastic nodes, a light touch of automated planning, and an original final project.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Course overview, why BTs beat hand-rolled FSMs, and getting BehaviorTree.CPP installed.
2. [Introduction to Behavior Trees](02-introduction-to-behavior-trees.md) — Nodes, ticks, the three-status contract, and the core Sequence/Fallback/Parallel/Decorator node types.
3. [Design Principles of Behavior Trees](03-design-principles-of-behavior-trees.md) — Blackboards and ports, reactive vs. non-reactive control flow, and structuring large trees with subtrees.
4. [Integration of Behavior Trees with ROS2](04-integration-of-behavior-trees-with-ros2.md) — Writing custom nodes that wrap ROS2 actions/services/topics, loading and ticking a tree, and visualizing with Groot2.
5. [Stochastic Behavior Trees and Automated Planning](05-stochastic-behavior-trees-and-automated-planning.md) — Probabilistic nodes, distinguishing transient from persistent failures, and how planners can generate tree structure.
6. [Final Project](06-final-project.md) — Design, implement, and test an original ROS2 Behavior Tree that demonstrates the full course's design principles.
