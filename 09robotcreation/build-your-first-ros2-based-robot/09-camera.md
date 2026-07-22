# Build Your First ROS2 Based Robot — Unit 9: Camera

LiDAR tells your robot *where* things are; a camera tells it *what* they are. This unit adds visual perception, from picking a camera module to getting standard ROS 2 image messages flowing.

## Raspicam
The Raspberry Pi Camera Module (raspicam) is a natural pairing for a Raspberry Pi-based robot: it connects over the dedicated CSI (Camera Serial Interface) ribbon connector rather than USB, which frees up a USB port and generally gives lower CPU overhead than a USB webcam for the same resolution. Reasons it's a common first choice for a small robot:
- **Low latency, dedicated interface** — CSI bypasses the USB stack entirely, which matters once you're doing anything reactive with vision.
- **Well-documented mounting and lens options** — standard and wide-angle/fisheye variants exist, useful if you want a wider field of view for obstacle detection versus a narrower one for closer inspection tasks.
- **Good driver support** — because it's the "native" camera for its board family, driver support tends to be more consistently maintained than for arbitrary USB webcams.

Whatever camera you choose, note its resolution options, frame rate at each resolution, and field of view — a robot doing close-range object detection wants different specs than one just doing rough visual obstacle avoidance.

## ROS 2 driver
Rather than talking to the camera's raw kernel interface yourself, use an existing ROS 2 camera driver package that publishes standard `sensor_msgs/Image` (and typically `sensor_msgs/CameraInfo`, carrying calibration data) messages on a topic like `/image_raw`. Standardizing on these message types matters because every downstream perception tool — OpenCV bridges, camera calibration tools, object detection packages — expects them, so you never have to write custom glue code just to move pixels from the driver to the rest of your stack. Typical usage:
```bash
ros2 run <camera_driver_package> camera_node --ros-args -p width:=640 -p height:=480 -p framerate:=30.0
ros2 topic echo /camera/camera_info --once   # confirm calibration data is being published
ros2 run rqt_image_view rqt_image_view       # visually confirm the image stream looks correct
```
Add the camera node to your bringup launch file, and give it its own `fixed` joint and link in the URDF (as with the LiDAR in Unit 8), so its frame is correctly placed in the TF tree — any perception code that later needs to relate a detected pixel to a real-world position depends on that placement being accurate.

## ros2_v4l2_camera raspicam support
`v4l2_camera` (built on Linux's Video4Linux2 subsystem) is a widely used, general-purpose ROS 2 camera driver — but by default it targets standard USB/V4L2 webcams, and the Raspberry Pi's CSI camera stack has needed specific adaptation to work correctly through it (differences in how the CSI camera exposes itself as a V4L2 device compared to a USB webcam, particularly around the newer `libcamera`-based stack on recent Raspberry Pi OS releases). Practical steps when using `v4l2_camera` with a raspicam-family camera:
- Confirm the camera is visible at the OS level first, independent of ROS 2, with a tool like `v4l2-ctl --list-devices` and `v4l2-ctl --list-formats-ext`, before assuming a ROS-level problem.
- Check the driver package's documentation/issue tracker for the current recommended configuration for Raspberry Pi CSI cameras, since the underlying camera stack (`libcamera` vs. the legacy stack) has changed across Raspberry Pi OS releases and affects which device node and pixel format work.
- If `v4l2_camera` doesn't cooperate with your specific camera/OS combination, a `libcamera`-aware ROS 2 camera package is the alternative path — the goal either way is the same standard `Image`/`CameraInfo` output described above.

## Conclusion
The robot now publishes standard, calibration-aware image data on a well-known topic, correctly placed in the TF tree. Combined with the LiDAR from Unit 8, your robot has both a geometric sense (distance) and a visual sense (appearance) of its surroundings — the two senses most perception and navigation stacks are built around.

## Try it yourself
Bring up your camera driver and use `rqt_image_view` (or `ros2 topic echo /camera/camera_info --once`) to confirm both a live image stream and non-empty calibration data are being published before wiring the camera node into your main bringup launch file.
