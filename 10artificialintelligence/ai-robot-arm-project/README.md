# Ai Robot Arm Project

This course is a hands-on, physical-hardware follow-up to your earlier VLA (vision-language-action) work: instead of training on existing datasets or in simulation, you build and calibrate a real leader/follower SO-101 arm pair, collect your own manipulation dataset by teleoperation and automated computer-vision-plus-inverse-kinematics collection, train ACT and SmolVLA policies on that data, and deploy the trained policies both on local/cloud compute and on a Hailo edge NPU attached to a Raspberry Pi — taking a task from "arm in a box" all the way to an autonomous, edge-deployed pick-and-place policy.

1. [Hardware Setup, BOM, and First Bring-Up](01-hardware-setup-bom-and-first-bring-up.md) — Follow the instructions for setting up and assembling the robot arm environment and system.
2. [Task Definition and Dataset Generation](02-task-definition-and-dataset-generation.md) — Define the task to be accomplished and learn how to generate the training dataset, both manually by teleoperation and through automatic systems with computer vision and inverse kinematics.
3. [Train ACT and SmolVLA on Your Datasets](03-train-act-and-smolvla-on-your-datasets.md) — Learn how to train ACT and SmolVLA, their structure, and the differences between them.
4. [Deploy Your Trained Policies on the SO-101](04-deploy-your-trained-policies-on-the-so-101.md) — Learn how to deploy the trained policies and execute them on local hardware or via Vast.ai remote execution for better performance.
5. [Run Your ACT Policy on the Hailo-10H Edge NPU](05-run-your-act-policy-on-the-hailo-10h-edge-npu.md) — Learn how to run the ACT policy on a Hailo AI edge system plugged into the Raspberry Pi.
