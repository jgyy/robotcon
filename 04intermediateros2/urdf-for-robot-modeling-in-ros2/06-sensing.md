# URDF for Robot Modeling in ROS2 — Unit 6: Sensing

A robot that can move but can't perceive anything is only half-useful. This unit adds simulated sensors to the URDF you've been building, using the same `<gazebo>` plugin pattern you saw for movement in the previous unit.

## The general pattern: sensor link + plugin

Every simulated sensor in this course follows the same two-step recipe: (1) add a small link to the URDF at the physical location where the sensor sits (a `fixed` joint to the chassis, typically), and (2) attach a `<sensor>` block with a simulator plugin to that link, configured with the sensor's update rate, field of view, range, and the ROS2 topic it should publish to. Because the sensor lives on its own link with its own `fixed` joint, it also gets its own `tf2` frame for free — this is exactly why sensor messages in ROS2 always carry a `frame_id`: it's the name of that link.

## Lidar Plugin

A 2D lidar plugin scans a horizontal arc and publishes a `sensor_msgs/msg/LaserScan`. The key parameters are the angular range and resolution (how many rays, spread across what field of view) and the minimum/maximum sensing range:

```xml
<gazebo reference="lidar_link">
  <sensor name="lidar" type="gpu_lidar">
    <update_rate>10</update_rate>
    <lidar>
      <scan><horizontal><samples>360</samples><min_angle>-3.14</min_angle><max_angle>3.14</max_angle></horizontal></scan>
      <range><min>0.1</min><max>10.0</max></range>
    </lidar>
    <topic>scan</topic>
  </sensor>
</gazebo>
```

## Camera Sensor Plugin and PointCloud camera

The **Camera Sensor plugin** publishes `sensor_msgs/msg/Image` (and typically a matching `CameraInfo` with intrinsics) at a configured resolution and frame rate — the RGB equivalent of the lidar block above, just with `image_width`/`image_height`/`horizontal_fov` in place of scan parameters. A **PointCloud (depth) camera** variant publishes `sensor_msgs/msg/PointCloud2` instead, giving you per-pixel 3D position rather than (or in addition to) color — the same sensor family that powers depth cameras used for obstacle avoidance and 3D perception.

## IMU Plugin

An IMU plugin publishes `sensor_msgs/msg/Imu` — orientation, angular velocity, and linear acceleration — sampled directly from the simulated physics state of the link it's attached to. Because it needs no external geometry to "see" anything, it's the simplest sensor plugin to configure, but it's also where simulated noise parameters (`<noise>` blocks with a Gaussian standard deviation) matter most: a perfectly noiseless simulated IMU will make any state-estimation code you write behave more optimistically than it will on real hardware, so adding realistic noise here pays off later.

## Verifying a sensor is working

Regardless of which sensor you add, the verification loop is the same: spawn the robot, then inspect the topic directly rather than trusting that the plugin loaded silently:

```bash
ros2 topic echo /scan --once
ros2 topic hz /camera/image_raw
```

and, for anything with a spatial frame, confirm it shows up correctly in the `tf2` tree with `ros2 run tf2_tools view_frames`.

## Try it yourself

Add an IMU to the robot from Unit 5, mounted at the chassis center via a `fixed` joint. Drive the robot in a circle using the differential drive plugin from Unit 5 and `ros2 topic echo /imu` at the same time — confirm the angular velocity Z component changes sign correctly if you reverse the turn direction.
