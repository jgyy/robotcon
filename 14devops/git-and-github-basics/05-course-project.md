# Git and GitHub Basics — Unit 5: Course Project

This capstone unit applies everything from Units 1-4 to the workflow you'll actually use to contribute to someone else's project: forking, working on a branch, and submitting a pull request back upstream — the same path used to contribute to real open-source robotics packages.

## Forking vs. cloning

You have push access to your own repositories, but not to someone else's. A **fork** is your own personal, full copy of another repository, hosted under your GitHub account — click "Fork" on the repository's page. You then `git clone` *your fork* (not the original), so you have push access to what you cloned:

```bash
git clone https://github.com/<you>/<some-project>.git
cd <some-project>
```

To keep track of the original repository (conventionally called `upstream`) so you can pull in new changes made there after you forked:

```bash
git remote add upstream https://github.com/<original-owner>/<some-project>.git
git remote -v
# origin    -> your fork (you can push here)
# upstream  -> the original (you cannot push here)
```

## Staying in sync with upstream

Before starting new work, and periodically during a long-lived contribution, pull the latest changes from `upstream` into your local `main` so your fork doesn't drift:

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main       # keep your fork's main up to date too
```

Doing this regularly means your feature branches are based on recent code, which minimizes merge conflicts when your PR is eventually reviewed.

## The contribution workflow, end to end

Every step here reuses a command from an earlier unit — this unit is about the *sequence*, not new syntax:

1. `git switch -c fix/typo-in-readme` — branch off up-to-date `main`.
2. Make your change, `git add`, `git commit -m "..."`.
3. `git push -u origin fix/typo-in-readme` — push to *your fork*.
4. Open a pull request from your fork's branch into the upstream repository's `main` (GitHub detects this and offers a button automatically).
5. Respond to review comments with more commits pushed to the same branch.
6. A maintainer merges (or you do, if given permission) — your fork's branch can then be deleted; `upstream/main` now contains your change.

## Your project: contribute something small and real

Pick a small, genuinely useful, self-contained improvement and carry it through the full workflow above. Good candidates for a first contribution: fixing a typo or broken link in a README, adding a missing example to documentation, adding a code comment clarifying a non-obvious function, or fixing an off-by-one in a small utility script. Avoid large or opinionated changes for a first PR — the goal here is to exercise the *mechanics* of forking, branching, and PRs cleanly, not to redesign someone's architecture.

Work through five checkpoints:

1. **Fork and clone** a repository (a small ROS 2 community package or even a docs-only repo is fine) and add both `origin` and `upstream` remotes.
2. **Branch and implement** your change on a descriptively named branch.
3. **Push and open a PR**, writing a description that states what changed and why in one or two sentences.
4. **Simulate review**: ask a peer (or re-read it yourself after a break) to leave at least one comment, then push a follow-up commit addressing it.
5. **Get it merged** — or, if the maintainers are slow to respond, at minimum confirm the PR is open, mergeable (no conflicts, per GitHub's UI), and CI (if present) passes.

## Try it yourself

If you can't find an external project to contribute to right away, simulate the entire workflow using two of your own GitHub accounts (or ask a friend): fork a repo of yours, make a change on the fork, open a PR back into the original, and merge it — end to end, exactly as described above, so the mechanics are second nature before you try it against an unfamiliar codebase.
