# Build Your First ROS2 Based Robot — Unit 8: LiDAR

Your robot can now move and knows its own shape; this unit gives it its first real sense of the world outside — a 2D LiDAR that measures distance to obstacles in a full sweep around itself.

## LSLiDAR N-10
A 2D LiDAR like the LSLiDAR N-10 spins a laser rangefinder and reports distance measurements at many angles per revolution, producing exactly the kind of data ROS 2's `sensor_msgs/LaserScan` message is built for: a starting angle, an angular step, and an array of ranges. When evaluating any LiDAR (this one or another), the specs that matter for a small indoor robot are:
- **Range** (minimum and maximum reliable distance) — determines how early it sees obstacles and how close it can safely get.
- **Angular resolution** — how many samples per full rotation; finer resolution means smaller obstacles and thinner walls are detected reliably.
- **Scan rate (Hz)** — how many full rotations per second; this bounds how quickly your robot can react to new obstacles, especially at speed.
- **Interface** — most low-cost LiDARs connect over USB-to-serial and are treated by the OS as a serial device, which is why the next section matters.

## Udev rules
By default, Linux assigns serial devices names like `/dev/ttyUSB0` in whatever order they were plugged in or enumerated at boot — plug in a second USB-serial device, or reboot with things connected in a different order, and your LiDAR might jump to `/dev/ttyUSB1`, silently breaking any launch file that hardcodes `/dev/ttyUSB0`. A **udev rule** fixes this by matching the device's stable identifiers (vendor ID, product ID, or serial number) and giving it a persistent symlink instead:
```bash
# Find identifying info for your connected LiDAR:
udevadm info -a -n /dev/ttyUSB0 | grep -E 'idVendor|idProduct|serial'

# Create a rule, e.g. /etc/udev/rules.d/99-lidar.rules:
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", SYMLINK+="lidar"

# Reload rules without rebooting:
sudo udevadm control --reload-rules && sudo udevadm trigger
```
After this, `/dev/lidar` always points at your LiDAR regardless of enumeration order, and every launch file and node parameter should reference `/dev/lidar` rather than the raw `/dev/ttyUSBx` device. This same technique is worth applying to every serial device on the robot (the motor microcontroller from Unit 2, the LiDAR here) so your bringup launch file never breaks because of USB plug order.

## ROS 2 driver
Rather than writing a LiDAR driver from scratch, use the manufacturer's or community's open-source ROS 2 driver package for your specific model — parsing a LiDAR's raw serial protocol correctly (handling checksums, partial-packet framing, intensity data) is fiddly work that's almost always already been done well. The general integration pattern:
```bash
# Clone the driver into your workspace source directory
cd ~/robot_ws/src
git clone <driver-repository-url>
cd ~/robot_ws && colcon build --packages-select <driver_package_name>
source install/setup.bash
ros2 launch <driver_package_name> lidar.launch.py serial_port:=/dev/lidar
```
Once running, confirm it's actually producing data before trusting it downstream:
```bash
ros2 topic echo /scan --once     # inspect one LaserScan message
ros2 topic hz /scan              # confirm the scan rate matches the datasheet
```
Add the driver's launch actions into your Unit 5 bringup launch file, and make sure the LiDAR's URDF link (a `fixed` joint from Unit 7, since it doesn't move relative to the chassis) matches where the sensor physically sits — a `LaserScan`'s ranges are only meaningful once TF knows where the sensor frame is.

## Conclusion
The robot can now perceive distances to obstacles around it, published reliably on `/scan` regardless of USB enumeration order, and correctly located in the TF tree. This is the sensor foundation that mapping and navigation (built in other courses in this series) depend on directly.

## Try it yourself
With the LiDAR running, use `ros2 topic echo /scan --once` to read one message, and manually verify one range value against a physical measurement (e.g. place an object exactly 1m in front of the sensor and confirm the corresponding range reading is close to 1.0).
