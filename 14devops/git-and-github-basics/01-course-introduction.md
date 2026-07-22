# Git and GitHub Basics — Unit 1: Course Introduction

This unit sets the stage for the rest of the course: why version control matters for robotics work specifically, what Git actually is, and how the course is structured so you can get the most out of the hands-on units that follow.

## Challenges in the robotics software development process

Robotics projects tend to break version control workflows that were designed for simple web apps, for a few reasons:
- **Multiple moving parts** — a single robot stack might span a ROS 2 workspace, URDF/Xacro descriptions, simulation worlds, calibration files, and deployment scripts. Losing track of which combination of these actually worked together is a common and expensive mistake.
- **Long-lived experiments** — you often need to try an approach (a new controller gain, a different planner), keep the old behavior available, and compare them later. Copy-pasting folders (`my_pkg_v2_final_ACTUALLY_final/`) does not scale.
- **Collaboration across hardware and software** — a teammate tuning PID gains and another rewriting a perception node need to work in parallel without overwriting each other's changes.
- **Reproducibility** — if a robot behaves unexpectedly in the field, you need to know exactly which version of the code was running, which is impossible without a real history.

Version control solves all of these by giving you a structured, queryable history of every change, who made it, and why.

## What is Version Control, and what is Git

**Version control** is the practice of tracking changes to a set of files over time, so you can inspect history, revert mistakes, and combine work from multiple people without losing anything. It replaces ad hoc practices like emailing zip files or naming folders `final_v3`.

**Git** is a distributed version control system created by Linus Torvalds in 2005 (originally to manage the Linux kernel source). "Distributed" means every clone of a repository carries the *entire* project history, not just a snapshot — there is no single server that must be reachable for you to commit, branch, or inspect history. This is why Git works offline and why almost every open-source robotics project (ROS 2 itself, MoveIt, Nav2, Gazebo/Ignition) uses it.

Git tracks content, not files-as-blobs: it stores snapshots of your whole project each time you commit, and it's smart enough to detect renames, deduplicate unchanged files, and diff text efficiently.

## A first taste: hands-on

You don't need a project yet to see Git in action. Try this now, in any scratch directory:

```bash
mkdir git-demo && cd git-demo
git init
echo "hello robot" > notes.txt
git add notes.txt
git commit -m "Add first note"
git log --oneline
```

That last command should show one commit. You've just created a repository, staged a file, and recorded a permanent, inspectable snapshot of it. Every concept in the rest of this course builds on this same four-step rhythm: change something, `git add`, `git commit`, `git log`.

## How this course is structured, and what you need

The remaining units build in this order: Git Basics (the local workflow: staging, committing, history, diffing, amending), Git Branches (working on multiple lines of development and merging them back), Git and GitHub for Team Collaboration (pushing to a remote, pull requests, code review, issues), and a Course Project where you apply everything by contributing to a real external repository.

You only need three things to follow along: a terminal, Git installed (`git --version` to check), and a text editor. No prior Git or GitHub experience is assumed — but since you're already comfortable programming, expect this course to move quickly through syntax and spend its time on the *mental model* of commits, branches, and remotes, which is where most confusion actually comes from.

## Try it yourself

Run `git --version` and `git config --list` in your terminal. If Git reports no `user.name` or `user.email`, that's expected — you'll set those in the next unit. Then repeat the four-command demo above in a fresh directory, but this time create two files before your first commit and check what `git status` reports between each step.
