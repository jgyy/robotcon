# On device AI for Robotics — Unit 4: Advanced Edge AI Applications

With optimization techniques in hand from Unit 3, this final unit moves past single-label classification into the tasks that make an on-device system actually useful to a robot: detecting and localizing objects, segmenting a scene, and — pushing the hardware to its limit — running and even fine-tuning a compact language model locally. The unit culminates in the shape of a real on-device AI agent.

## Beyond classification: advanced Edge AI applications
Classification answers "what is in this image" as a single label. A robot usually needs more:
- **Object detection** — what objects are present, and *where* (bounding boxes), enabling navigation-relevant reasoning like "is that a person in front of me."
- **Semantic segmentation** — a per-pixel class label, useful for tasks like "which pixels are drivable floor vs. obstacle."
- **Local language models** — natural-language interpretation of commands and (eventually) reasoning about what to do next, without a cloud API call.

Each of these is heavier than classification, so everything from Unit 3 — quantization especially — stops being optional and becomes the only way these models fit in Pi-class memory and run at usable frame rates.

## Preparing the Raspberry Pi software environment
Beyond the Unit 2 baseline, advanced applications need a few more runtime pieces:

```bash
# Edge TPU runtime (if not already installed)
sudo apt install libedgetpu1-std

# PyCoral — high-level Python API for Coral-accelerated inference
pip3 install pycoral

# Camera support for continuous-capture pipelines
sudo apt install python3-picamera2

# Ollama, for running local LLMs later in this unit
curl -fsSL https://ollama.com/install.sh | sh
```

Confirm the Edge TPU is visible to PyCoral before moving on:

```python
from pycoral.utils.edgetpu import list_edge_tpus
print(list_edge_tpus())
```

## Real-time object detection with Coral TPU
SSD MobileNet is the standard lightweight detector for edge accelerators — a single-shot detector paired with a MobileNet backbone, small enough to run at real-time frame rates on a Coral TPU. Using PyCoral's detection API:

```python
from pycoral.adapters import common, detect
from pycoral.utils.edgetpu import make_interpreter
from PIL import Image, ImageDraw

interpreter = make_interpreter("ssd_mobilenet_v2_coco_quant_edgetpu.tflite")
interpreter.allocate_tensors()

image = Image.open("frame.jpg")
_, scale = common.set_resized_input(
    interpreter, image.size, lambda size: image.resize(size, Image.LANCZOS))
interpreter.invoke()

objects = detect.get_objects(interpreter, score_threshold=0.5, image_scale=scale)

draw = ImageDraw.Draw(image)
for obj in objects:
    bbox = obj.bbox
    draw.rectangle([bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax], outline="red", width=3)
    draw.text((bbox.xmin, bbox.ymin - 10), f"{obj.id} {obj.score:.2f}")
image.save("annotated.jpg")
```

Structure this as a loop over camera frames and you have a real-time detector — at INT8 precision on the Edge TPU, SSD MobileNet-class models typically run well above 15 FPS on this hardware, versus a small fraction of that on the Pi's CPU alone.

## Interactive photo capture and semantic segmentation
For tasks where you want a human (or a higher-level planner) to approve what gets captured rather than processing every frame, build a simple capture-then-segment workflow:

```python
from picamera2 import Picamera2

picam2 = Picamera2()
picam2.start()

input("Press Enter to capture...")
picam2.capture_file("raw_capture.jpg")

# run a semantic segmentation model (e.g. DeepLabV3 quantized to TFLite)
segmentation_mask = run_segmentation("raw_capture.jpg", model="deeplabv3_quant_edgetpu.tflite")
save_overlay("raw_capture.jpg", segmentation_mask, "segmented_output.jpg")
```

This pattern — capture, human-in-the-loop approval, process, save both raw and processed outputs — is common in exploration/inspection robots where every image is valuable and you don't want to burn compute segmenting frames nobody will look at.

## Running a compact large language model on Raspberry Pi
Running an LLM entirely on a Pi sounds implausible until you pick a model sized for the hardware. A distilled ~1.5B parameter model, quantized, fits comfortably within a 4GB RAM budget in CPU-only mode via Ollama:

```bash
ollama pull deepseek-r1:1.5b
ollama run deepseek-r1:1.5b
```

```python
import ollama

response = ollama.chat(model="deepseek-r1:1.5b", messages=[
    {"role": "user", "content": "The camera detected a red object 2 meters ahead. What should the rover do?"}
])
print(response["message"]["content"])
```

Expect noticeably slower token generation than a cloud API (a few tokens/second on Pi CPU is typical for a model this size), and correspondingly more modest reasoning quality than a full-scale model — but zero network dependency and zero per-query cost, which is the entire point of this course.

## Fine-tuning an LLM for structured function calling
A general chat model isn't directly useful for robot control — you want it to emit structured commands the rover's code can parse (`{"action": "move_to", "x": 1.2, "y": 0.4}`), not prose. LoRA (Low-Rank Adaptation) makes fine-tuning for this narrow behavior tractable even on modest hardware, since it trains a small set of low-rank adapter weights rather than the full model:

```python
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=8, lora_alpha=16,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05, task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, lora_config)
# train on a dataset of (instruction -> JSON function call) pairs
```

After training, convert to GGUF format and quantize for llama.cpp/Ollama deployment:

```bash
python convert_hf_to_gguf.py ./lora_merged_model --outfile function_caller.gguf
./llama-quantize function_caller.gguf function_caller_q4.gguf Q4_K_M
ollama create function-caller -f Modelfile
```

The dataset here is the part worth investing in: a few hundred clean (instruction, correct JSON call) pairs covering your robot's actual command vocabulary will outperform a much larger noisy dataset.

## Mastering Edge AI for real-world impact
Step back and look at what you've assembled across this course: a perception model (Unit 2-3) compressed to fit edge hardware, extended to detection and segmentation (this unit), paired with a local language model that can interpret commands and emit structured actions. That's the essential shape of an on-device AI agent — secure (no data leaves the device), responsive (no network round trip), and cost-effective (no inference bill) by construction, not as an afterthought bolted onto a cloud-first design.

## Try it yourself
Wire together a minimal version of the full stack: have a local LLM (via Ollama) take a plain-English instruction like "check if there's an obstacle ahead," call your Unit 3 object detector on the current camera frame, and have the LLM turn the detector's output into a one-sentence, structured decision (`{"action": "stop"}` or `{"action": "proceed"}`). This is the smallest possible version of the natural-language-controlled rover from Unit 1's demo.
