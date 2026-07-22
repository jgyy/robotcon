# Jenkins Basics for Robotics — Unit 11: Exam

This closing unit is a self-assessment, not new material: a checklist and a capstone exercise to confirm you can actually operate Jenkins end to end for a robotics project, not just recognize the terms.

## Concept checklist
Before attempting the capstone below, make sure you can explain each of these in your own words, without looking back at earlier units:

- The difference between a Jenkins **controller** and an **agent**, and why you might run builds on a separate agent rather than the controller itself.
- What a **build trigger** is, and the tradeoff between polling and webhooks (Unit 7).
- The difference between a **Freestyle** job and a **Pipeline** job, and why pipeline-as-code is generally preferred for anything beyond a quick experiment (Units 3 and 6).
- What a **workspace** is and when you'd want to wipe it (Unit 3).
- The difference between **authentication** and **authorization**, and what a Jenkins **credential** is used for versus a plain environment variable (Unit 5).
- Why a build can be **Unstable** without being **Failed**, and which Jenkins step produces that distinction (Unit 8).
- What `-s` does on `jenkins-cli.jar build`, and why that matters when calling Jenkins from another script (Unit 9).

If any of these feels shaky, that's a pointer back to the relevant unit — this course builds each one directly on the last.

## Capstone exercise
Build the following pipeline from scratch, using only what you've covered:

1. A Git repository containing a small package (ROS-based, or any language with a real test suite — your choice) with at least one intentional unit test.
2. A Jenkins **Pipeline** job, defined via a `Jenkinsfile` checked into that repository, that: checks out the code, installs dependencies, builds it, and runs the test suite, publishing results via the `junit` step.
3. A **trigger** so the pipeline runs automatically on push (Poll SCM is fine if you don't have a publicly reachable Jenkins).
4. **Role-based authorization** configured so a second, non-admin account can trigger and view builds but cannot modify job configuration or global security settings.
5. The pipeline triggered at least once via the **Jenkins CLI** (not the web UI), with the CLI's exit code demonstrated to reflect the build's actual pass/fail status.

## Self-grading rubric
Score yourself honestly against these outcomes — this is for your own tracking, not submitted anywhere:

| Criterion | Pass condition |
|---|---|
| Pipeline runs end to end | A push to the repo produces a completed build without manual intervention beyond the initial push |
| Test results are visible | The build's **Test Result** page shows individual test cases, not just a console log |
| Failure is legible | Deliberately breaking a test or the build produces a clearly Unstable/Failed status, not a false green |
| Security is real | The non-admin account genuinely cannot reach `Manage Jenkins`, verified by logging in as that user |
| CLI works | `jenkins-cli.jar build <job> -s` returns a non-zero exit code when the underlying build fails |

## Try it yourself
Run the capstone, then deliberately break each of the two failure modes on purpose — a failing test, and a build step that errors outright (e.g. a bad shell command) — and confirm you can tell them apart from the build status page alone, without opening the console log. This is the practical skill the whole course has been building toward.
