# Git and GitHub Basics — Unit 3: Git Branches

With the single-line workflow from the last unit solid, this unit adds the feature that makes Git genuinely powerful for real projects: branching, so you can develop a risky change (a new navigation planner, a controller rewrite) in isolation and bring it back together only once it works.

## What branches are and why they matter

A branch is simply a movable, named pointer to a commit. When you commit, the branch you're "on" moves forward to point at the new commit. `main` (or `master`) is just a branch with no special technical status — it's a convention for "the primary line of development." Because branches are cheap (a branch is a few dozen bytes, not a copy of the project), Git encourages you to create one for every feature, experiment, or bugfix rather than working directly on `main`.

This matters especially in robotics: you can branch off to try retuning a controller's gains, keep `main` running the known-good version the whole time, and only merge once the new gains are validated in simulation.

## Creating, switching, and comparing branches

```bash
git branch                      # list local branches, * marks current
git branch feature/lidar-filter # create a new branch (doesn't switch to it)
git switch feature/lidar-filter # switch to it
# or in one step:
git switch -c feature/lidar-filter
```

(`git checkout -b <name>` is the older, still-common equivalent of `git switch -c <name>`; you'll see both in the wild.)

Once on a branch, your normal `add`/`commit` workflow applies — those commits only exist on this branch until it's merged:

```bash
echo "cutoff = 0.05" >> filter_params.yaml
git add filter_params.yaml
git commit -m "Tighten lidar filter cutoff"
```

To see exactly what a branch changed relative to another:

```bash
git diff main feature/lidar-filter
```

## Merging branches and resolving conflicts

Once a branch is ready, integrate it back into `main`:

```bash
git switch main
git merge feature/lidar-filter
```

If `main` hasn't changed since you branched, this is a **fast-forward** — `main` simply catches up. If both branches touched the same lines, Git can't decide automatically and reports a **merge conflict**, marking the file with conflict markers:

```
<<<<<<< HEAD
cutoff = 0.08
=======
cutoff = 0.05
>>>>>>> feature/lidar-filter
```

Resolve by editing the file to the correct final content, deleting the `<<<<<<<`/`=======`/`>>>>>>>` markers, then:

```bash
git add filter_params.yaml
git commit
```

Conflicts are not errors — they're Git correctly refusing to guess when two people (or two branches) made incompatible changes. Reading both sides and picking (or combining) the right one is a normal, expected step.

## Renaming and deleting branches

```bash
git branch -m old-name new-name     # rename current or specified branch
git branch -d feature/lidar-filter  # delete, but only if already merged
git branch -D feature/lidar-filter  # force-delete, even if unmerged
```

Prefer `-d` over `-D` by default — Git's refusal to delete an unmerged branch is a useful safety net against losing commits that exist nowhere else.

## Try it yourself

Create two branches from `main` that both edit the *same line* of the *same file* differently, commit on each, then merge the first into `main` cleanly and the second into `main` to deliberately trigger a conflict. Resolve it by hand and confirm with `git log --graph --oneline --all` that the history shows both branches converging.
