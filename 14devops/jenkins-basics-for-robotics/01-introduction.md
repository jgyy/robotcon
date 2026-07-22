# Jenkins Basics for Robotics — Unit 1: Introduction

This unit sets the stage for the whole course: what Jenkins actually is, where it fits in a robotics software workflow, and why a "build server" matters when your codebase already compiles fine on your laptop.

## What is Jenkins?
Jenkins is an open-source automation server, originally built for continuous integration (CI). At its core it does one thing: it watches for a trigger (a git push, a timer, a manual click) and then runs a defined sequence of steps — checkout code, build it, run tests, package it, deploy it — on a machine you control, independent of anyone's laptop. It's written in Java, runs as a long-lived server process, and is extended almost entirely through plugins: source control integrations, build tools, notification systems, cloud agents, and more.

Jenkins predates most of its "modern" competitors (GitHub Actions, GitLab CI, CircleCI) and remains popular specifically because it is self-hosted and plugin-extensible — you are not tied to one hosting provider's CI product, and you can wire it into whatever weird, non-cloud-native infrastructure your lab or company already has (which, in robotics, is common: real hardware, GPU build farms, license-locked simulators).

## Why robotics projects need CI
In application software, CI mostly answers "did I break the build or the tests?" In robotics, the same question is harder and more valuable to automate, because:

- **Builds are slow and environment-sensitive.** A ROS workspace can involve dozens of interdependent packages, native C++ compilation, and specific OS/toolchain versions. "Works on my machine" is a bigger risk when "my machine" has months of accumulated `apt install`s.
- **Integration bugs are expensive to find by hand.** A planner, a controller, and a driver node can each pass their own unit tests and still fail together. Automated integration test runs catch this before it reaches a robot.
- **Hardware time is scarce.** If Jenkins can catch a broken launch file or a bad topic remap in simulation before anyone touches the real robot, that's real time and real hardware saved.
- **Multiple contributors, one robot.** CI gives a shared, objective gate ("this PR passed the build and the test suite") instead of relying on everyone remembering to test everything locally.

## How Jenkins fits into a robotics workflow
A typical loop looks like: a developer pushes code to a Git repository → Jenkins detects the change → it spins up (or uses) an agent with the right OS/toolchain → checks out the code → builds the workspace (e.g. `colcon build`) → runs linters and unit tests → optionally runs a simulation-based integration test → reports pass/fail back to the pull request → on success to a protected branch, optionally packages and publishes build artifacts (Docker images, `.deb` packages, firmware binaries). Later units in this course build exactly this pipeline, one piece at a time: install Jenkins (Unit 2), create your first job (Units 3–4), integrate source control (Unit 7), integrate tests (Unit 8), and finally build a full ROS-focused pipeline (Unit 10).

## Try it yourself
Before installing anything, sketch (on paper or in a text file) the CI pipeline you would want for a robotics project you're familiar with — even a toy one. List the concrete stages in order (e.g. "checkout → build workspace → run unit tests → run one launch-file smoke test") and, for each stage, write one sentence on what "failure" would mean. Keep this sketch — you'll build toward it for real starting in Unit 6.
