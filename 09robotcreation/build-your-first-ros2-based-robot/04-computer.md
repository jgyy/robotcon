# Build Your First ROS2 Based Robot — Unit 4: Computer

The onboard computer is where ROS 2 actually runs, so this unit gets a single-board computer flashed, networked, and running ROS 2, then powered cleanly from the robot's battery system.

## Install Ubuntu Server
ROS 2 has first-class support for Ubuntu, so flashing an Ubuntu Server image (headless — no desktop environment, which saves CPU and memory for actual robot workloads) to your single-board computer's SD card or eMMC is the usual starting point. The general flow:
```bash
# On your development machine, not the robot's computer:
# 1. Download the appropriate Ubuntu Server image for your board's architecture (arm64 for most SBCs).
# 2. Write it to the SD card/storage with a flashing tool, e.g.:
sudo dd if=ubuntu-server.img of=/dev/sdX bs=4M status=progress conv=fsync
# 3. Before first boot, pre-configure networking/hostname/SSH key via the
#    tool's cloud-init files (user-data/network-config), so the board is
#    reachable over Wi-Fi or Ethernet without a monitor attached.
```
Boot the board, SSH in, and immediately do a full package update (`sudo apt update && sudo apt upgrade`) so you're building ROS 2 on a current base image rather than whatever was frozen into the image months ago.

## Install ROS 2
Install ROS 2 from the official APT repositories for your Ubuntu release rather than building from source — it's faster and matches what most tutorials and packages expect. The pattern (consult docs.ros.org for the exact repository setup for your ROS 2 distribution) is:
```bash
sudo apt update && sudo apt install curl gnupg lsb-release
# Add the ROS 2 apt repository and signing key (see docs.ros.org for the current commands)
sudo apt update
sudo apt install ros-<distro>-ros-base   # ros-base: no GUI tools, ideal for a headless robot
echo "source /opt/ros/<distro>/setup.bash" >> ~/.bashrc
source ~/.bashrc
ros2 doctor --report
```
`ros2 doctor` is worth running right after install — it flags common environment problems (missing environment variables, network configuration issues) before they surface confusingly three units from now.

## Connect Raspberry Pi to DF power module
The board itself typically needs clean, regulated 5V (or whatever its input spec is) rather than raw battery voltage, which is why Unit 3 routed the battery through a power distribution/regulation board. Wiring the compute board to a DF-style power module usually means:
1. Confirm the power module's output voltage and current capability match the board's input requirements (an underpowered supply causes random reboots under load, which looks like a software bug but isn't).
2. Connect the module's regulated output to the board's power input — via its power/USB-C input pins or, on boards that support it, directly to the GPIO 5V/GND rail for more current headroom than USB alone provides.
3. Power the board from the module (not from your development machine's USB) and confirm it boots reliably and stays up under CPU load (e.g. `stress-ng --cpu 4 --timeout 60s` if installed) — catching brownouts here is much easier than debugging a robot that mysteriously reboots mid-drive.

## Conclusion
You now have a headless, networked, ROS 2-capable computer running on the robot's own power rather than a bench supply or your laptop's USB port. Unit 5 starts writing actual ROS 2 packages on top of this machine.

## Try it yourself
SSH into your freshly imaged board, run `ros2 doctor --report`, and resolve every warning it prints before moving on — treat a clean doctor report as your exit criterion for this unit.
