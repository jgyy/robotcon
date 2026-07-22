# Linux for Robotics — Unit 3: Advanced Utilities I

With filesystem basics down, this unit covers the tools that make Linux *programmable*: permissions, bash scripts, `.bashrc`, and environment variables. These are the mechanisms every ROS installation and every robot startup sequence relies on under the hood.

## Permissions
Every file has an owner, a group, and permission bits for read/write/execute, shown by `ls -l`:

```bash
ls -l startup.bash
# -rw-r--r-- 1 you you 0 Jul 22 10:00 startup.bash
```

The ten characters break down as: file type, then three read/write/execute triplets for owner, group, and others. Two commands you'll use constantly:

```bash
chmod +x startup.bash        # make a script executable
chmod 644 params.yaml         # rw-r--r-- : numeric form (owner=6, group=4, other=4)
chown $USER:$USER params.yaml  # change owner:group
```

Robotics-specific reason this matters: hardware devices like `/dev/ttyUSB0` (a USB-serial adapter for a microcontroller or LIDAR) are permission-gated. If your user isn't in the right group (often `dialout`), you'll get "Permission denied" trying to open the port — the fix is `sudo usermod -aG dialout $USER` followed by logging out and back in, not `sudo`-ing your whole program.

## Bash scripts
A bash script is just a text file of commands, made runnable with a shebang and the execute bit:

```bash
#!/usr/bin/env bash
set -e   # exit immediately if any command fails
WORKSPACE=~/robot_ws
echo "Checking workspace at $WORKSPACE"
if [ -d "$WORKSPACE" ]; then
  echo "Found $(find "$WORKSPACE" -type f | wc -l) files."
else
  echo "Workspace missing!" >&2
  exit 1
fi
```

Save this as `check_ws.bash`, `chmod +x check_ws.bash`, then run it with `./check_ws.bash`. `set -e` is worth adopting as a default habit — without it, a script silently keeps going after a failed command, which is a common source of robots that "start" but never actually launch anything. Loops and variables work much like any other scripting language you already know: `for f in "$WORKSPACE"/*.md; do echo "$f"; done`.

## Learn about bashrc
`~/.bashrc` is a script that runs automatically every time you open a new interactive shell. It's where you put anything you want available in *every* terminal session: aliases, `PATH` additions, and — critically for ROS — sourcing the ROS environment setup script so `ros2` commands and package paths work without you typing anything:

```bash
# added to ~/.bashrc
alias cw='cd ~/robot_ws'
alias build='colcon build --symlink-install'
# source /opt/ros/<distro>/setup.bash   # the single most common line in any ROS developer's .bashrc
```

After editing `.bashrc`, run `source ~/.bashrc` to apply it to your current session without opening a new terminal.

## Environment variables
Environment variables are key-value pairs available to every process launched from your shell. `PATH` (where the shell looks for executables) is the classic example; ROS 2 adds its own, like `ROS_DISTRO` and `ROS_DOMAIN_ID` (which partitions robots on the same network so they don't cross-talk).

```bash
export MY_ROBOT_NAME=turtlebot   # set for this session and child processes
echo $MY_ROBOT_NAME
printenv | grep ROS               # inspect ROS-related variables once ROS is sourced
unset MY_ROBOT_NAME                # remove it
```

`export`-ed variables set in one terminal do not appear in another already-open terminal — that's exactly why persistent settings belong in `.bashrc`, not typed ad hoc.

## Try it yourself
Write `check_ws.bash` (above) into your `~/robot_ws` project, make it executable, and add an alias `cw` for jumping to the workspace plus an `export ROBOT_NAME=my_robot` line to your `.bashrc`. Source it, open a fresh terminal to confirm the alias and variable persist, then run `check_ws.bash` and confirm it reports the file count from Unit 2's exercise.
