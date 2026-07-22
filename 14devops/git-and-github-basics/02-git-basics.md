# Git and GitHub Basics — Unit 2: Git Basics

This is the core local workflow you will use every single day: turning a plain folder into a repository, and reliably capturing snapshots of your work as commits. Everything later in the course (branches, pull requests, collaboration) is just this loop applied more elaborately.

## Initial setup and initializing a repository

Before your first commit, Git needs to know who you are — this identity gets baked into every commit you make, which matters once you collaborate:

```bash
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"
git config --global init.defaultBranch main
```

`--global` writes to `~/.gitconfig` so it applies to every repository on your machine; drop it to set a value for the current repository only.

To start tracking an existing folder (say, a ROS 2 package you've been hacking on):

```bash
cd my_robot_pkg
git init
```

This creates a hidden `.git/` directory that holds the entire history and configuration. Nothing outside `.git/` is touched — `git init` never modifies your files.

## The three states, and checking status

Git thinks of every tracked file as being in one of three areas: the **working directory** (what's on disk right now), the **staging area** / **index** (what you've marked to go into the next commit), and the **repository** (the permanent history of past commits). This three-stage model is what lets you commit *part* of your changes deliberately rather than everything at once.

`git status` is the command you will run constantly — it tells you which files are modified, staged, or untracked:

```bash
$ git status
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        launch/robot.launch.py
Changes not staged for commit:
        modified:   src/controller.py
```

## Staging and committing changes

Staging (`git add`) moves a file's current content into the index — it's a deliberate "yes, include this" step:

```bash
git add src/controller.py          # stage one file
git add launch/                    # stage a whole directory
git add -A                         # stage everything (new, modified, deleted)
```

Committing takes what's staged and permanently records it with a message explaining *why*:

```bash
git commit -m "Fix velocity clamping in controller"
```

Write commit messages as an imperative summary ("Fix", not "Fixed" or "Fixes") of the *intent* of the change — future-you debugging a regression will thank present-you.

## Viewing history and diffs

`git log` shows the commit history; `git log --oneline --graph` is the compact form worth aliasing:

```bash
git log --oneline
a3f9c21 Fix velocity clamping in controller
7b2e410 Add first note
```

`git diff` shows *exactly* what changed, line by line, before you commit it:

```bash
git diff                # unstaged changes vs. the index
git diff --staged       # staged changes vs. the last commit
```

Always read `git diff --staged` before committing — it's the single best habit for catching accidental debug prints or stray files.

## Modifying staged files and amending commits

If you `git add` a file and then edit it further, the staging area still holds the *old* version — you need to `git add` again to update what will be committed. `git status` will show the same file as both staged and modified simultaneously to warn you of this.

If you just committed and immediately notice a typo or a forgotten file, don't make a separate "fix typo" commit — amend:

```bash
git add forgotten_file.py
git commit --amend -m "Fix velocity clamping in controller"
```

Only amend commits that haven't been pushed/shared yet — amending rewrites the commit, which is disruptive for anyone who already has the old one.

## Getting older versions

Every commit is a full, addressable snapshot. To see an old version of a file without disturbing your working directory:

```bash
git log --oneline -- src/controller.py     # history of just this file
git show a3f9c21:src/controller.py          # print that file's content at that commit
git restore --source a3f9c21 -- src/controller.py   # bring it into the working dir
```

`git restore` (or the older `git checkout <commit> -- <file>`) pulls a past version forward without rewriting history — it creates a new change you can then commit, so nothing is ever silently lost.

## Try it yourself

In a scratch repo, create a file, commit it, then make two more edits with two more commits. Use `git log --oneline` to find the first commit's hash, then use `git show <hash>:<file>` to print the file's original content — without checking anything out — confirming you can time-travel through history non-destructively.
