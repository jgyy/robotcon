# Linux for Robotics — Unit 2: Linux Essentials

This is where you start actually typing commands. You'll learn to navigate and manipulate the filesystem, and you'll kick off the course's running final project: a directory tree that stands in for a real robot software workspace.

## Setting up your workspace
Robot software projects almost always live in a "workspace" — a top-level directory holding source packages, build artifacts, and configuration. You don't need ROS installed to practice the shape of this; create it by hand:

```bash
mkdir -p ~/robot_ws/src/my_robot_bringup
mkdir -p ~/robot_ws/src/my_robot_description
cd ~/robot_ws
tree -L 3          # visualize the tree (install with: sudo apt install tree)
```

`mkdir -p` creates parent directories as needed and doesn't complain if they already exist — you'll use `-p` constantly when scripting setup steps.

## Navigating the filesystem
Linux has a single-rooted filesystem tree starting at `/`, unlike Windows' drive letters. Key locations you'll meet repeatedly in robotics: `/dev` (device files for sensors, serial ports, cameras), `/opt` (often where ROS itself is installed, e.g. `/opt/ros/<distro>`), `/etc` (system-wide config), and `~` (your home directory, shorthand for `/home/<you>`).

```bash
pwd                 # print working directory — where am I?
cd /opt              # absolute path: always starts from /
cd ros                # relative path: relative to current directory
cd ..                 # up one level
cd -                  # jump back to the previous directory
cd ~                  # back home
ls -la                # list all entries, long format, including hidden dotfiles
```

The distinction between absolute paths (start with `/`) and relative paths (don't) matters a lot once you start writing launch files and scripts that must work regardless of who runs them or from where.

## Interacting with the filesystem
Beyond looking around, you need to create, inspect, and remove things confidently:

```bash
touch ~/robot_ws/src/my_robot_bringup/README.md   # create an empty file
cp README.md README.bak                            # copy
mv README.bak old_readme.md                         # rename/move
cat README.md                                        # dump a file to stdout
less README.md                                        # page through a long file (q to quit)
find ~/robot_ws -name "*.md"                           # search by filename
grep -r "TODO" ~/robot_ws                                # search inside file contents
rm old_readme.md                                          # delete (no trash bin — be careful)
rm -rf some_directory                                       # recursive force delete — dangerous, double-check the path first
```

`rm -rf` is the single most dangerous habit-forming command in this list: it does not ask for confirmation and does not go to a recycle bin. Always run `pwd` and `ls` on the target before you `rm -rf` it.

## From shell commands to robot motion
This is the payoff moment: on a real ROS 2 robot, "moving the robot" from a terminal is *literally* running a command. For example, once ROS 2 is installed, a differential-drive robot in simulation can be nudged with:

```bash
ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist \
  "{linear: {x: 0.2}, angular: {z: 0.0}}"
```

You don't need ROS 2 installed to appreciate the point: the shell isn't just for file management, it's the same interface you use to publish commands, call services, and drive hardware. Every navigation and file-handling skill above is a prerequisite for comfortably typing commands like this one without fear.

## Try it yourself
Inside `~/robot_ws/src/my_robot_bringup`, create a `launch/` and `config/` subdirectory, add an empty `startup.bash` file and a `params.yaml` file, then use `find` to list every file under `~/robot_ws` and `grep -r` to confirm the word "TODO" doesn't appear anywhere yet. This tree is the "final project" workspace you'll extend with a real script in Unit 3.
