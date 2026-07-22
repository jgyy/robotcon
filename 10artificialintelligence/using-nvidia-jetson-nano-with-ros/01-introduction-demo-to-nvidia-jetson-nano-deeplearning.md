# Using NVIDIA Jetson Nano with ROS — Unit 1: Introduction Demo to NVIDIA Jetson Nano DeepLearning

This unit gets you oriented on the Jetson Nano as a piece of robotics hardware: what makes it different from the laptop or desktop you've been developing on, how to get it running, and how to prove that both CUDA and ROS are alive on it before you build anything on top.

## What the Jetson Nano actually is

The Jetson Nano is a small single-board computer with an ARM CPU and an onboard NVIDIA GPU (128 CUDA cores), designed to run inference (and light training) for neural networks directly on a robot instead of shipping camera frames to a remote server. That matters for robotics specifically because perception loops — object detection, segmentation, depth estimation — need to run at tens of Hz with low latency, and round-tripping to the cloud adds latency and a network dependency you don't want on a mobile platform. Compared to a Raspberry Pi, the Nano trades some general-purpose CPU headroom for a GPU that can run a ResNet-sized model in real time. Compared to your desktop, you're now working with an aarch64 CPU, a fixed and fairly small amount of RAM, and thermal/power limits that mean you can't just "throw more compute at it."

## Flashing and first boot

JetPack (NVIDIA's Linux distribution bundling CUDA, cuDNN, and TensorRT) is what you flash onto an SD card:

```bash
# On your host machine, after downloading the JetPack SD card image
sudo dd if=jetson-nano-jp-sd-card-image.img of=/dev/sdX bs=1M status=progress
sync
```

After first boot (headless is fine over SSH once you set up Wi-Fi or plug in Ethernet), check the two things that matter most for a robotics workload: power mode and thermal headroom.

```bash
# List available power modes (5W vs 10W barrel-jack mode)
sudo nvpmodel -q
sudo nvpmodel -m 0        # 0 = max performance (10W), 1 = 5W mode
sudo jetson_clocks         # lock clocks to max for consistent benchmarking

# Live view of CPU/GPU load, temperature, and RAM — install jtop for a nicer view
sudo pip3 install -U jetson-stats
sudo reboot
jtop
```

Run a fan or heatsink if you're doing anything sustained — the Nano throttles hard once it gets hot, and a throttled inference loop is a confusing bug if you don't know to check `tegrastats` first.

## Verifying CUDA and TensorRT are reachable

Before touching ROS, confirm the deep learning stack actually sees the GPU. This is the single most useful five minutes you'll spend in this course, because every later unit assumes it's true:

```bash
python3 -c "import torch; print(torch.__version__, torch.cuda.is_available())"
python3 -c "import tensorrt; print(tensorrt.__version__)"
```

If `torch.cuda.is_available()` returns `False`, it almost always means you installed a generic pip wheel instead of the NVIDIA-provided aarch64 build for your JetPack version — a common enough trap that it's worth checking first whenever inference is mysteriously slow.

## Connecting the Nano into your ROS network

The Nano is a normal Linux box from ROS's point of view — the only real wrinkle is that it typically lives on the robot while you develop/visualize from a workstation, so you need multi-machine communication working:

```bash
# ROS 2: nodes discover each other over the LAN automatically via DDS;
# just make sure both machines agree on a domain so you don't cross-talk
# with someone else's robot on the same network
export ROS_DOMAIN_ID=42          # set identically on Nano and workstation

# ROS 1: point every machine at one master, and tell the Nano what
# hostname/IP to advertise itself as
export ROS_MASTER_URI=http://<nano-ip>:11311
export ROS_HOSTNAME=<nano-ip>
```

Test it with a trivial pub/sub across the two machines (`ros2 topic pub`/`ros2 topic echo`, or `rostopic pub`/`rostopic echo`) before you trust anything more complex.

## Try it yourself

Flash JetPack, boot the Nano, and produce a short log showing: `nvpmodel -q` output, `torch.cuda.is_available()` returning `True`, and a `ros2 topic echo` (or `rostopic echo`) on your workstation successfully receiving messages published from a node running on the Nano. Keep that log — it's your baseline for diagnosing every "why is this slow / why can't they see each other" problem in later units.
