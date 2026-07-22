# Jenkins Basics for Robotics — Unit 3: Jenkins Jobs (Part 1)

A job (also called a "project" in the UI) is the fundamental unit of work in Jenkins — a named, configured task that Jenkins can run on demand, on a schedule, or in response to a trigger. This unit gets your first job running end to end.

## Job types
Jenkins ships with several job types under "New Item":

- **Freestyle project** — a build configured entirely through the web UI: a sequence of build steps (shell commands, etc.) with no code representation. Simple to learn, harder to version-control.
- **Pipeline** — a build defined as code (a `Jenkinsfile`), which you'll cover in depth in Unit 6.
- **Multibranch Pipeline / Folder / Multi-configuration** — more advanced organizational types you won't need yet.

This unit uses a Freestyle project because it makes every concept (source, triggers, build steps, post-build actions) visible as a distinct UI section before you meet the same concepts as code in a `Jenkinsfile` later.

## Creating a basic job
From the Jenkins dashboard: **New Item → enter a name → Freestyle project → OK**. The configuration page is organized into sections:

1. **General** — description, and options like "Discard old builds" (keep disk usage bounded by capping build history).
2. **Source Code Management** — where to pull code from (covered properly in Unit 7; leave as "None" for now).
3. **Build Triggers** — what causes this job to run (manual only, for now).
4. **Build Steps** — the actual work: "Execute shell" is the one you'll use most.
5. **Post-build Actions** — what to do with the result (archive files, send notifications, trigger another job).

For a first job, add a single **Execute shell** build step:

```bash
echo "Hello from Jenkins"
uname -a
python3 --version
date
```

Click **Save**, then **Build Now**. Jenkins queues and runs the job on an executor (a worker slot on the controller or an agent) and produces a numbered **build** — build #1, #2, and so on, each with its own console output and result status (Success, Unstable, Failure).

## Reading build output and status
Click into a specific build number, then **Console Output**, to see the exact stdout/stderr of every build step, in order, with timestamps available via a plugin if needed. The build's status is driven by exit codes: a shell step that exits non-zero marks the build **Failed**; a zero exit code marks it **Success**. This matters once your build steps are running real compilers and test runners — a broken build should always exit non-zero, or Jenkins will report false positives.

```bash
# a build step that correctly fails the job when something is wrong
colcon build || exit 1
```

## Workspace basics
Every job gets a **workspace**: a directory on the agent's filesystem (by default `$JENKINS_HOME/workspace/<job-name>`) where source is checked out and build steps run. It persists between builds by default, which speeds up incremental builds but can also hide "works only because of leftover state" bugs — the **Wipe out workspace** option gives you a clean slate when you need to be sure a build succeeds from nothing.

## Try it yourself
Create a Freestyle job named `hello-jenkins` with a shell build step that prints your OS, your Python and Git versions, and the contents of the job's workspace directory (`ls -la $WORKSPACE`). Run it, confirm it reports Success, then edit the shell step to deliberately `exit 1` and re-run it — confirm the build now shows Failed, and find where in the console output the failure is reported.
