# Jenkins Basics for Robotics

Jenkins is a self-hosted, plugin-extensible automation server that has been the default open-source choice for continuous integration and delivery for years — and its self-hosted nature makes it a natural fit for robotics projects, which often need CI wired into unusual infrastructure (build farms, simulator licenses, or eventually real hardware) that hosted CI products don't reach. This course takes you from installing Jenkins for the first time through jobs, pipelines-as-code, source control and test integration, users and security, the CLI, and finally a realistic end-to-end pipeline for a ROS package.

1. [Introduction](01-introduction.md) — What Jenkins is, why robotics projects benefit from CI, and how the pieces of this course fit together.
2. [Installation and Initial Setup](02-installation-and-initial-setup.md) — Script a Jenkins install and complete the first-run setup wizard.
3. [Jenkins Jobs (Part 1)](03-jenkins-jobs-part-1.md) — Create and run your first Freestyle job, and read build output and status.
4. [Jenkins Jobs (Part 2)](04-jenkins-jobs-part-2.md) — Parameterize jobs and chain multiple jobs together.
5. [Managing Users and Security](05-managing-users-and-security.md) — Authentication, authorization strategies, roles, and storing credentials safely.
6. [Pipelines](06-pipelines.md) — Move from click-configured jobs to pipeline-as-code with a `Jenkinsfile`.
7. [Source Code Management Integration](07-source-code-management-integration.md) — Connect Jenkins to a Git repository and trigger builds on push.
8. [Test Integration](08-test-integration.md) — Run test suites as build steps and publish structured, browsable results.
9. [Jenkins CLI](09-jenkins-cli.md) — Script and query Jenkins from the terminal using `jenkins-cli.jar` and the REST API.
10. [Continuous Integration with ROS](10-continuous-integration-with-ros.md) — Assemble a full Jenkins pipeline that builds and tests a ROS package.
11. [Exam](11-exam.md) — A self-assessment checklist and capstone exercise covering the whole course.
