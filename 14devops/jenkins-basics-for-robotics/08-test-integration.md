# Jenkins Basics for Robotics — Unit 8: Test Integration

A build that only compiles code is a weak safety net. This unit covers running your test suite as part of a Jenkins build and, critically, getting Jenkins to understand and surface the results rather than just the raw exit code.

## Running tests as a build step
The simplest form is just invoking your test runner from a shell step, same as any local run:

```bash
# Python project
python3 -m pytest tests/ --junitxml=results/pytest.xml

# ROS 2 workspace
colcon test --packages-select my_robot_pkg
colcon test-result --verbose
```

This alone gets you pass/fail in the console output, but Jenkins treats the whole step as one binary result (the shell step's exit code) — you lose per-test granularity in the UI unless you go one step further.

## Publishing structured test results
Most test frameworks can emit results in the JUnit XML format, which Jenkins understands natively via the `junit` step/post-build action. This turns a wall of console text into a searchable table of individual test cases, with trend graphs across builds over time.

```groovy
post {
    always {
        junit 'results/**/*.xml'
    }
}
```

Getting JUnit XML out of common robotics test tooling:

```bash
# pytest
pytest --junitxml=results/pytest.xml

# colcon (ROS 2) — results already land as JUnit-compatible XML under build/
colcon test
colcon test-result --all   # human-readable summary
# the underlying XML Jenkins should point `junit` at is under build/<pkg>/test_results/

# Google Test (C++)
./my_test --gtest_output=xml:results/gtest.xml
```

## Unstable vs. Failed builds
Jenkins distinguishes a **Failed** build (something in the pipeline itself errored, e.g. a non-zero exit code that wasn't handled) from an **Unstable** build (the build completed, but the `junit` step recorded one or more failing tests). This distinction matters: you can configure downstream jobs or notifications to treat "unstable" more leniently than "failed", and it lets you see at a glance whether a red build means "broken pipeline" or "broken code."

```groovy
stage('Test') {
    steps {
        // don't let a nonzero pytest exit code kill the whole pipeline immediately —
        // let the junit step below determine unstable/failed based on actual results
        sh 'pytest --junitxml=results/pytest.xml || true'
    }
}
post {
    always {
        junit 'results/**/*.xml'
    }
}
```

## Test coverage and thresholds
Coverage tools (e.g. `pytest-cov`, `gcovr` for C/C++) can likewise emit machine-readable reports that plugins (Cobertura, Coverage) publish as trend graphs, and some setups fail the build if coverage drops below a threshold — a useful guardrail once a codebase has meaningful test coverage to protect.

## Try it yourself
Add a small failing test to a project's test suite on purpose, wire `pytest --junitxml=...` (or your language's equivalent) into a pipeline stage followed by a `junit` post step, and run the build. Confirm the build shows **Unstable** rather than a hard **Failed**, then open the build's **Test Result** page and confirm you can see exactly which test failed and why, not just a pass/fail count.
