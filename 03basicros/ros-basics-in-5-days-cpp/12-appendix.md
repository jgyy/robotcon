# ROS Basics in 5 Days (C++) — Unit 12: Appendix

The rest of this course assumed a working ROS install and an existing workspace. This appendix fills in that gap: how to actually get ROS onto your machine, and how a workspace is created and grown from nothing.

## Installing ROS on your local machine
ROS distributions are released on a roughly yearly-to-biennial cadence, each targeting specific Linux distro versions (most commonly Ubuntu LTS releases); check docs.ros.org for the current supported distro/OS pairings before installing, since installation instructions genuinely differ by distro. The general shape of installation is always: add the ROS package repository and signing key to your system's package manager, install the distro's meta-package (which pulls in the core libraries, build tools, and common packages), and install your build tool (`python3-catkin-tools` for ROS 1, `python3-colcon-common-extensions` for ROS 2). Prefer a native Linux install or a well-supported VM over exotic setups (WSL, Docker-only) while you're still learning — you'll hit enough real ROS problems without also debugging your environment.

## Confirming the install
After installing, source the distro's setup script (commonly `/opt/ros/<distro>/setup.bash`) in every terminal you use for ROS work — add it to your shell rc file so you don't forget. Confirm success the same way Unit 1 suggested: run a demo talker/listener pair and check the CLI sees them.

## Understanding the workspace layout
A workspace is a directory tree your build tool treats as one compilation unit. Before building, it typically looks like:

```
my_workspace/
└── src/
    ├── package_one/
    └── package_two/
```

You only ever put source packages under `src/`; the build tool generates the rest (`build/`, `install/` or `devel/`, and `log/`) and those generated directories should not be hand-edited or usually committed to version control.

## Creating and building a workspace
```
mkdir -p ~/my_workspace/src
cd ~/my_workspace
# ROS 2:
colcon build
# ROS 1:
catkin build
```
After a successful build, source the workspace's own generated setup script (e.g. `~/my_workspace/install/setup.bash` or `~/my_workspace/devel/setup.bash`) — this is what makes packages in *this* workspace runnable and discoverable, layered ("overlaid") on top of the base distro install you sourced earlier.

## Managing multiple workspaces (overlays)
You'll often end up with more than one workspace — say, a base distro install, a workspace of third-party packages you don't modify, and a workspace of your own code under active development. Sourcing them in order (base, then each additional workspace) creates a chain of overlays, where each later one can see and depend on packages from the ones sourced before it. The most common overlay bug is sourcing them out of order, or forgetting to re-source after a rebuild — if a node is running old code despite your changes, check which workspace's setup script is actually active in that terminal.

## Try it yourself
Create a fresh workspace from scratch, move (or re-create) one package from an earlier unit into its `src/` directory, build it, source the workspace's setup script, and confirm you can run that package's node from this new workspace rather than wherever you built it originally.
