# FlexBe with ROS

FlexBE is a high-level behavior engine, built on top of ROS's SMACH state-machine library, that lets you compose complex robot behaviors from small, reusable states instead of hand-coding tangled control flow. This course walks through the FlexBE mental model, building your own states and behaviors, wiring in Actionlib-based states with tunable autonomy levels for human supervision, unit testing state logic in isolation, and finishing with a small drone take-off-and-land project that ties every piece together.

1. [Introduction to the Course](01-introduction-to-the-course.md) — Unit for previewing the contents of the Course.
2. [Creating a basic Behavior](02-creating-a-basic-behavior.md) — Learn the basic concepts of FlexBe, and review, step by step, how to create a basic behavior and a basic state.
3. [Actionlib States and Autonomy Levels](03-actionlib-states-and-autonomy-levels.md) — Learn how to create a new state based on an Action Client, and how to use Autonomy Levels in FlexBe.
4. [Unit Testing](04-unit-testing.md) — Learn how to create unit tests for your FlexBe states.
5. [Project](05-project.md) — Create two different FlexBe states: one to make the drone take off and another one to land it.
