# AI Agents — Unit 3: AI Agents for Perception

Before an agent can reason about the world, it needs the world turned into something reason-able: structured facts rather than raw pixels or point clouds. This unit covers how perception feeds an agent's decision loop, using vision and lidar as the two running examples.

## From raw sensor data to structured facts
A camera frame is a few million numbers; an LLM-driven agent can't (and shouldn't) reason directly over raw pixels in every decision cycle. The standard pattern is a **perception pipeline** that compresses raw sensor data into a small set of labeled facts, which then become the "state" the agent reasons over — the same `state` dict from Unit 2, just populated by real sensors instead of hard-coded values.

```python
# perception.py — turns a camera frame into agent-consumable facts
def perceive_scene(frame, detector) -> dict:
    detections = detector.run(frame)  # e.g. a YOLO-style object detector
    return {
        "objects": [{"label": d.label, "distance_m": d.distance, "bbox": d.bbox}
                    for d in detections],
        "num_people": sum(1 for d in detections if d.label == "person"),
    }
```

This separation matters: the perception module can be swapped (a different detector, a different camera) without touching the agent's reasoning code, as long as the output dict shape stays stable. Treat that dict shape as a contract.

## Vision agents
A vision agent wraps a perception pipeline plus a reasoning step focused on visual understanding — "what is in front of me and does it matter?" Beyond object detection, vision-language models (VLMs) let you ask open-ended questions about a frame directly, which is useful for cases too varied to hand-code a detector for.

```python
def describe_scene(image_bytes, vlm_client) -> str:
    response = vlm_client.messages.create(
        model="claude-sonnet-4-5",
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
                                              "data": image_bytes}},
                {"type": "text", "text": "List anything blocking a straight path forward."},
            ],
        }],
        max_tokens=300,
    )
    return response.content[0].text
```

Use dedicated detectors (OpenCV, a trained YOLO model) for things you need at high frequency and low latency — obstacle bounding boxes at 20Hz, say — and reserve VLM calls for lower-frequency, higher-ambiguity questions, since a network round-trip to a large model is far slower than a local detector pass.

## Lidar agents
Lidar gives distance directly, without the depth-estimation problem cameras face, but the raw output is a point cloud — thousands of `(x, y, z)` points per scan. A lidar agent typically reduces this to something like an occupancy grid or a set of clustered obstacles before handing it to the reasoning layer.

```python
import numpy as np

def cluster_obstacles(points: np.ndarray, cell_size=0.2) -> dict:
    # crude 2D occupancy grid from a point cloud's (x, y) columns
    xy = points[:, :2]
    cells = np.floor(xy / cell_size).astype(int)
    occupied = {tuple(c) for c in cells}
    nearest = float(np.min(np.linalg.norm(xy, axis=1))) if len(xy) else float("inf")
    return {"occupied_cells": len(occupied), "nearest_obstacle_m": nearest}
```

Fusing lidar and vision (a common pattern: use lidar for "how far" and vision for "what is it") gives an agent both accurate geometry and semantic labels — critical when the decision depends on *what* is close, not just *that* something is close.

## Try it yourself
Write a `perceive(camera_facts, lidar_facts) -> dict` function that merges the two example dicts above into one state dict, then feed it into the `llm_agent` function from Unit 2's exercise. Test it with a case where lidar reports something close (`nearest_obstacle_m: 0.4`) but vision reports no people — confirm the agent's decision differs from a case where the close object is labeled `person`.
