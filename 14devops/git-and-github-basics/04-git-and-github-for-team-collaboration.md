# Git and GitHub Basics — Unit 4: Git and GitHub for Team Collaboration

Everything so far has been local. This unit connects your repository to GitHub — a hosting service for Git repositories — and covers the workflow that makes team robotics development possible: pushing, pulling, pull requests, and issue tracking.

## Git vs. GitHub, and setting up a remote

Git is the version control *tool*; GitHub is a *hosted service* built around Git that adds a web UI, access control, pull requests, issue tracking, and CI integration. You could use Git your entire career without GitHub (many teams self-host with GitLab or Bitbucket instead, or run a bare server), but GitHub is the de facto hub for open-source robotics code — ROS 2, MoveIt, and Nav2 all live there.

To connect a local repository to a new GitHub repository, create the (empty) repository on github.com, then point your local repo at it as a **remote**:

```bash
git remote add origin https://github.com/<you>/my_robot_pkg.git
git remote -v          # confirm it's set
```

`origin` is just a conventional name for "the remote I usually sync with" — nothing forces that name, but almost everyone uses it.

## Pushing, pulling, and working on GitHub.com

Push your commits (and create the branch on the remote) with:

```bash
git push -u origin main
```

`-u` sets `origin/main` as the default upstream for your local `main`, so afterwards a plain `git push`/`git pull` knows where to go. From here you can browse the GitHub repository page — files, commit history, branches — in the web UI, and even edit a file directly in the browser, which creates a commit on your behalf.

To bring down changes made elsewhere (by a teammate, or by you on GitHub's web editor):

```bash
git pull
```

`git pull` is really `git fetch` (download new commits) followed by `git merge` (integrate them into your current branch) — the same merge mechanics from Unit 3 apply, conflicts included. Push a feature branch the same way you pushed `main`:

```bash
git switch -c feature/nav-tuning
git commit -am "Tune costmap inflation radius"
git push -u origin feature/nav-tuning
```

## Pull requests: the code review workflow

A **pull request (PR)** asks "please review and merge this branch into that one" — it's GitHub's mechanism for code review before code lands on `main`. After pushing a feature branch, GitHub will offer to open a PR; you can also do it from the "Pull requests" tab. A good PR description explains *what* changed and *why*, not just a restatement of the diff.

Reviewers comment inline on specific lines, request changes, or approve. You address feedback by committing more changes to the *same branch* — they automatically appear in the open PR, no special command needed. Once approved, merging the PR performs the same fast-forward-or-merge-commit logic as a local `git merge`, just triggered from the web UI (or `gh pr merge` from GitHub's CLI).

```bash
# after pushing more commits addressing review comments:
git add controller.py
git commit -m "Address review: clamp before scaling"
git push
```

## GitHub Issues

**Issues** track bugs, feature requests, and tasks against a repository, independent of any specific branch. A well-written robotics issue includes what you expected, what happened, the ROS/simulator version, and reproduction steps. Issues can be referenced from commits and PRs using `#<number>` (e.g. `Fixes #42` in a commit message or PR description auto-closes that issue on merge) — this is how a project's history stays traceable back to the discussion that motivated each change.

## Try it yourself

Create a new (even empty) repository on GitHub, push a local repo to it as `origin`, then open one issue describing a fake bug. Create a branch, make a commit whose message includes `Fixes #1` (matching your issue number), push the branch, open a pull request, and merge it — then confirm the issue closed automatically.
