# Ai Robot Arm Project — Unit 4: Deploy Your Trained Policies on the SO-101

Training a policy is only half the job — this unit closes the loop by running your ACT or SmolVLA checkpoint against the real follower arm, both fully locally and offloaded to a remote GPU, and talks about how to evaluate whether it's actually working.

## Loading a checkpoint for inference

Deployment inverts the training data flow: instead of reading recorded (observation, action) pairs from disk, you read live camera frames and joint state from the hardware, feed them to the model, and write the predicted action back to the follower's servos.

```python
policy = ACTPolicy.from_pretrained("outputs/train/act_pick_cube/checkpoint-final")
policy.eval()

observation = {
    "image": camera.read(),
    "state": follower_bus.read("Present_Position"),
}
action = policy.select_action(observation)   # returns joint-position targets
follower_bus.write("Goal_Position", action)
```

Note that at inference time there is no leader arm in the loop at all — the model has replaced the human. This is the moment where all the calibration and dataset-alignment care from Units 1-2 either pays off or reveals itself as a problem.

## Running inference locally

A local inference loop simply repeats the read-predict-write cycle in real time, at a control rate the servos can keep up with (commonly in the 10-50 Hz range depending on hardware and model size):

```python
while not task_done:
    obs = {"image": camera.read(), "state": follower_bus.read("Present_Position")}
    action = policy.select_action(obs)
    follower_bus.write("Goal_Position", action)
    sleep_to_maintain_rate(control_hz=30)
```

ACT's smaller size usually makes local, CPU-only or modest-GPU inference practical. SmolVLA, being larger, benefits far more from a local GPU — and if you don't have one on the robot's control computer, that's exactly the gap remote execution is meant to fill.

## Remote execution via Vast.ai

For larger policies or underpowered local hardware, you can keep the model running on a rented GPU instance and stream observations to it over the network, receiving actions back: the control computer attached to the arm becomes a thin client, sending camera/state and receiving joint targets each cycle, typically over a lightweight socket or HTTP interface you wrap around the policy's `select_action` call. The practical concern here is round-trip latency: a network hop adds delay that a purely local loop doesn't have, so remote inference is a better fit for tasks that tolerate a slightly lower control rate than for tasks requiring tight, fast reactive control. Benchmark actual end-to-end latency (camera capture → prediction → servo write) before trusting a remote setup on anything delicate.

## Evaluating deployed performance

"It works" is not a metric — define success the same way you'd define it for the dataset task (e.g. "object ends up inside the bin within 15 seconds") and run enough trials (10-20 at minimum) with varied starting positions to get a real success rate rather than one lucky run. Watch for failure modes that are invisible in training loss: policies that freeze near the edge of the training distribution, grippers that close early or late, or drift that compounds over a long chunked rollout. These observations directly inform whether you need more data (back to Unit 2), a longer training run (Unit 3), or whether the task itself was too ambitious for a first policy.

## Try it yourself

Deploy your ACT checkpoint locally and run 10 trials of the task with the object placed in positions your training data did cover and 10 with positions slightly outside that range. Record a success rate for each group — the gap between them is a direct, honest measure of how well the policy generalized.
