# Robotics Introduction For High Schoolers Part 1 — Unit 3: Advanced Utilities I

Now that you can move around and edit files, this unit covers three tools that turn you from "someone who can type Linux commands" into "someone who can build things with them": permissions, bash scripts, and environment variables.

## File permissions
Every file and directory on Linux has an owner, a group, and a set of read/write/execute permissions for owner, group, and everyone else. This matters in robotics constantly — a sensor device file under `/dev` might only be readable by a particular group, and a script won't run at all until it's marked executable.

```bash
ls -l day1.txt
# -rw-r--r-- 1 alice alice 42 Jul 22 10:00 day1.txt
#  ^^^^^^^^^
#  owner: read+write   group: read   others: read

chmod +x setup.bash        # add execute permission for everyone
chmod 644 day1.txt         # set exact permissions numerically: owner rw, group r, others r
chown alice:robotics day1.txt   # change owner and group (often needs sudo)
```

The numeric form (`644`, `755`, etc.) is worth memorizing: each digit is read(4)+write(2)+execute(1) added together, one digit each for owner/group/others. `755` (`rwxr-xr-x`) is the classic "executable script everyone can run but only the owner can edit" permission set.

## Writing bash scripts
A bash script is just a text file of the commands you'd otherwise type by hand, saved so you can run them repeatedly and share them. This is how real robots start up their software stacks.

```bash
#!/usr/bin/env bash
set -e   # exit immediately if any command fails, instead of plowing on

WORKSPACE="$HOME/robo_intro"
mkdir -p "$WORKSPACE/logs"

for sensor in lidar camera imu; do
  echo "Checking sensor: $sensor" | tee -a "$WORKSPACE/logs/startup.log"
done

echo "Startup checks complete."
```

Save that as `startup.bash`, then:

```bash
chmod +x startup.bash
./startup.bash
```

Notice the shebang line `#!/usr/bin/env bash` at the top — it tells the OS which interpreter to run the file with, `set -e` for safety, `"$VAR"` quoting to avoid word-splitting bugs, and a plain `for` loop, all of which you'll see again in real robot launch and setup scripts.

## Environment variables
Environment variables are named values that programs (and the shell itself) can read out of their surrounding environment — think of them as global configuration that follows every process you launch. ROS 2 leans on this heavily: which distro's tools are on your `PATH`, which network your nodes talk over, and more are all environment variables.

```bash
echo $HOME                     # show one variable
export ROBOT_NAME=explorer     # create/set one for this shell session and its children
echo $ROBOT_NAME
env | grep ROBOT                # list all environment variables matching a pattern
unset ROBOT_NAME                # remove it
```

`export` only affects the current shell session and anything launched from it; to make a variable available every time you open a terminal, add the `export` line to `~/.bashrc`, the script bash runs automatically at the start of every interactive session.

## Try it yourself
Write a script `~/robo_intro/check_env.bash` that exports a variable `ROBOT_NAME=explorer`, prints it, then runs `chmod +x` on itself from within the script using `chmod +x "$0"` (`$0` is the script's own path). Run it twice and confirm it still works the second time without re-running `chmod` by hand.
