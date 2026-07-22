# Basic Maths for Robotics — Unit 1: Course Introduction

This unit is the map before the journey: it explains why a robotics developer needs linear algebra, calculus, and probability, what you'll build hands-on, and what to have installed before Unit 2 starts.

## What is this course about?
A robot is, mathematically, a system that turns numbers (sensor readings) into other numbers (motor commands) while respecting the geometry of the physical world it lives in. Every layer of the stack you'll eventually touch — kinematics, control, perception, path planning, SLAM — is built on the same three mathematical pillars: **linear algebra** (representing positions, orientations, and transformations as vectors and matrices), **calculus** (relating position, velocity, and acceleration, and finding optimal parameters via derivatives), and **probability** (reasoning about noisy sensors and uncertain state estimates). This course does not aim to make you a mathematician; it aims to make each of these tools feel like something you reach for on purpose, because you recognize the shape of the problem.

## What will you learn with this course?
- Unit 2 (Linear Algebra): vectors and matrices, how to declare and manipulate them, and the linear maps and identities used constantly in robot geometry (rotations, transforms, projections).
- Unit 3 (Calculus): functions, derivatives, partial derivatives, gradients, Jacobians, Hessians, and integrals — the toolkit for relating motion quantities and for optimization.
- Unit 4 (Probability): random variables, joint/conditional probability, Bayes' rule, common distributions, and belief representations used in filtering and localization.
- Unit 5 (Final Project): all three pillars combined to get a simulated robot out of a maze.

## What tools will you use in this course?
Everything here is deliberately lightweight: a Python interpreter with NumPy (for arrays, linear algebra, and random sampling) and Matplotlib (for plotting functions, vector fields, and distributions) is enough for every exercise. No simulator, no ROS installation, and no specific robot are required for this course — the goal is the underlying mathematics, which transfers directly to whatever robotics stack you use afterward.

```bash
python3 -m venv robomath-env
source robomath-env/bin/activate
pip install numpy matplotlib scipy
```

## Which code will you be developing in this course?
Each unit's "Try it yourself" section is a small, self-contained script — a vector/matrix exercise, a derivative or gradient computation, a probability simulation. There's no single running codebase to clone; instead, keep a local folder (e.g. `robomath-exercises/`) and add one script per unit as you go, so that by the Final Project you have a personal reference library of small, tested math snippets to reuse.

```bash
mkdir -p robomath-exercises
cd robomath-exercises && python3 -c "import numpy as np; print(np.__version__)"
```

## How can mathematics help you become a robotics developer?
A few concrete scenarios you'll be able to solve after this course: computing where a camera-detected object actually is in the world (linear algebra — coordinate transforms); figuring out how fast a joint must move to keep an end-effector on a smooth trajectory (calculus — derivatives and Jacobians); fusing a noisy GPS reading with a noisy IMU reading into a single best estimate of position (probability — Bayesian updates); and deciding how confident a robot should be in "I am at this cell of the map" before it acts on that belief (probability — belief distributions). None of these are abstract exercises — they are the daily bread of writing perception, control, and navigation code.

## Requirements for this course
- Comfortable general-purpose programming (this course uses Python, but the concepts are language-agnostic).
- No prior linear algebra, calculus, or probability background is assumed — each is introduced from first principles in its unit.
- High-school level familiarity with algebra and trigonometry (you should recognize `sin`, `cos`, and solving for `x` in an equation) is helpful but not strictly required.

## Try it yourself
Set up the environment above, then write a five-line script that creates two NumPy vectors `a = [1, 2, 3]` and `b = [4, 5, 6]`, prints their dot product and their element-wise sum, and plots nothing yet — just confirm the environment works. This is the baseline you'll extend in every later unit's exercise.
