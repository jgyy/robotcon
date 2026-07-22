# Jenkins Basics for Robotics — Unit 7: Source Code Management Integration

So far your jobs have run canned shell commands with no real code involved. This unit connects Jenkins to a Git repository so builds operate on your actual robotics codebase, and sets up the trigger that makes CI feel automatic.

## Connecting a Git repository
Under a job's **Source Code Management** section (Freestyle) or in the "Pipeline script from SCM" option (Pipeline), choose **Git** and supply the repository URL plus a **Credentials** entry (an SSH key or a token, stored via **Manage Jenkins → Credentials**, never typed in plaintext here — see Unit 5). Set the **Branch Specifier**, e.g. `*/main`, or `*/${BRANCH_NAME}` in a multibranch setup.

```
Repository URL: git@github.com:yourname/my_robot_ws.git
Credentials:    (SSH key added in Manage Jenkins → Credentials)
Branch Specifier: */main
```

On a build, Jenkins clones (or fetches, on subsequent builds) the repository into the job's workspace before any build steps run — you can rely on the workspace containing a checked-out copy of exactly the commit being built.

## Useful Git-derived environment variables
The Git plugin exposes information about the checkout as environment variables usable in build steps:

```bash
echo "Building commit ${GIT_COMMIT}"
echo "On branch ${GIT_BRANCH}"
```

These matter for anything that needs to tag an artifact or a Docker image with the commit it came from — reproducibility again.

## Triggers: polling vs. webhooks
Two mechanisms get Jenkins to notice new commits:

- **Poll SCM** — Jenkins periodically checks the repository for changes on a cron-like schedule (e.g. `H/5 * * * *` = roughly every 5 minutes). Simple, needs no network path from the Git host to Jenkins, but adds latency and load.
- **Webhook (push trigger)** — the Git host (GitHub, GitLab, self-hosted) notifies Jenkins immediately on push, via **GitHub hook trigger for GITScm polling** or the generic Webhook plugin. Near-instant, but requires Jenkins to be reachable from the Git host (a public URL, a tunnel, or a self-hosted runner with network access).

For a personal/learning setup where Jenkins isn't publicly reachable, polling is the pragmatic default; in a team setting with a reachable Jenkins, webhooks are strictly better.

```groovy
// Declarative pipeline equivalent of "Poll SCM"
pipeline {
    agent any
    triggers {
        pollSCM('H/5 * * * *')
    }
    stages {
        stage('Build') { steps { sh 'colcon build' } }
    }
}
```

## Building pull requests
For code review workflows, the **GitHub Branch Source** plugin (used with a Multibranch Pipeline job) automatically discovers branches and open pull requests in a repository and builds each one independently, reporting a pass/fail status check back onto the PR itself — this is what makes "CI required to merge" possible on GitHub.

## Try it yourself
Push a small ROS package (or any Git repo with a couple of files) to a repository you control, add a `Jenkinsfile` with a single `Checkout` stage that just runs `sh 'git log -1'`, and configure a Pipeline job using "Pipeline script from SCM" pointed at that repo. Trigger a build manually first to confirm the checkout works, then configure Poll SCM with a short interval, push a new commit, and confirm Jenkins picks it up and builds automatically within that interval.
