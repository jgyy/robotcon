# Robotics Introduction For High Schoolers Part 1 — Unit 2: Linux Essentials

This is where you start typing for real. You'll learn the small set of commands and tools that account for the vast majority of everything you do at a Linux prompt, and you'll build a little practice workspace you'll keep extending in later units.

## Finding your way around the filesystem
Linux has one filesystem tree, rooted at `/` — there's no `C:\` or `D:\`, just one tree that everything (including USB drives and network folders) gets attached into. Your personal files live under `/home/<you>`, shortened to `~`.

```bash
pwd            # print working directory — "where am I right now?"
ls -la         # list everything in the current directory, including hidden dotfiles
cd /opt        # absolute path: always starts from / and means the same thing everywhere
cd ..          # relative path: go up one directory
cd -           # jump back to whatever directory you were just in
cd ~            # go home
```

Get comfortable with the difference between absolute and relative paths early — it matters a lot once you start writing scripts and configuration files that need to work no matter who runs them or from where.

## Creating, moving, and reading files
```bash
mkdir -p ~/robo_intro/notes         # -p creates parent dirs too, no error if it already exists
touch ~/robo_intro/notes/day1.txt   # create an empty file
echo "hello, robots" > ~/robo_intro/notes/day1.txt   # write a line, overwriting the file
echo "second line" >> ~/robo_intro/notes/day1.txt    # append instead of overwrite
cat ~/robo_intro/notes/day1.txt     # dump the whole file to the screen
cp day1.txt day1.bak                # copy
mv day1.bak old_day1.txt            # rename / move
rm old_day1.txt                     # delete — no recycle bin, this is permanent
```

Two commands you'll use constantly for searching: `find` locates files by name or type, `grep` searches *inside* file contents.

```bash
find ~/robo_intro -name "*.txt"
grep -rn "robots" ~/robo_intro
```

## Editing text without leaving the terminal
Sooner or later you need to edit a file on a machine with no graphical editor — for example, a robot's onboard computer reached over SSH. The classic tool for this is `vi` (or its friendlier descendant `vim`); a much gentler alternative most systems also ship is `nano`.

```bash
vi ~/robo_intro/notes/day1.txt
# vi has two modes: press i to INSERT text, Esc to leave insert mode,
# then :wq  to write (save) and quit, or :q! to quit without saving.

nano ~/robo_intro/notes/day1.txt
# nano is modeless — just start typing; Ctrl+O saves, Ctrl+X exits.
```

You don't need to master every `vi` keybinding today — just get to the point where you can open a file, change one line, save, and exit without panicking. That single skill will save you the day you're stuck editing a config file on a robot with no other option.

## Try it yourself
Create `~/robo_intro/config.yaml`, open it in `vi` (or `nano`), add the lines `robot_name: explorer` and `max_speed: 1.5`, save and exit, then use `cat` to confirm the contents and `grep "speed"` to confirm the second line is findable by search alone.
