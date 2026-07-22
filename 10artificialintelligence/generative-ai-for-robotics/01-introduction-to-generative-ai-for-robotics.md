# Generative AI for Robotics — Unit 1: Introduction to Generative AI for Robotics

This unit sets expectations for the whole course: what "generative AI" adds on top of the classification and regression models you may already know, what you'll be able to build by the end, and what you should already be comfortable with before diving in.

## From discriminative to generative models
Most of the machine learning you meet early on is **discriminative**: given an input, predict a label or a number (is this a cat? what's the distance to that obstacle?). **Generative** models instead learn the distribution the data came from, so they can *produce* new, plausible outputs — new text, new images, new trajectories — rather than just scoring existing ones. Large language models (LLMs) generate the next token in a sequence; diffusion models generate images (or, increasingly, robot actions) by iteratively refining noise; vision-language models (VLMs) generate text conditioned on an image.

For robotics, this shift matters because it replaces a lot of brittle, hand-written glue code. Instead of writing a parser for a fixed vocabulary of voice commands, a fine-tuned language model can map open-ended natural language directly onto structured robot actions. Instead of hand-coding "if you see a red object, do X," a vision-language model can answer "where is the red object?" about a scene it has never seen configured that way before.

## What you'll be able to build
By the end of this course you will have built, end to end:
- A tokenizer and a small generative language model trained from raw text, so you understand what's actually happening inside the libraries you'll use later.
- A fine-tuned model that translates natural language commands ("move forward and turn left") into differential-drive wheel velocities, wired into a ROS 2 node.
- A vision-language pipeline that lets a robot answer questions about what its camera sees and segment objects it was never explicitly trained to detect.
- A natural-language navigation system on top of ROS 2's Nav2 stack, so a robot can be told "go to the kitchen" instead of being given raw coordinates.

Each of these is a real, runnable pipeline, not a toy demo — you will train models, save checkpoints, and deploy them into simulation and (where hardware is available) onto a real robot.

## How the course is organized
The units build directly on each other:
1. **Tokenization and Data Foundations** (Unit 2) — how raw text becomes numbers a model can learn from.
2. **Training and Fine-Tuning Generative Models** (Unit 3) — how those numbers become a trained model, from fine-tuning to training from scratch.
3. **Natural Language Robot Control** (Unit 4) — applying that machinery to turn commands into motion.
4. **Vision-Language Models in Robotics** (Unit 5) — adding perception into the loop.
5. **Generative AI for Robot Navigation** (Unit 6) — combining language, perception, and navigation into one system.

## Prerequisites
This course assumes you can already program comfortably (this repo assumes Python and general programming fluency) and that you're not learning ROS 2 for the first time — you should know what a node, topic, and message are. It does **not** assume prior deep learning experience, though if you've been through this repo's Deep Learning Basics and PyTorch Essentials material first, the early units will move faster for you. A working GPU is helpful for Unit 3 onward but not required to follow along; smaller examples run fine on CPU, just slower.

## Try it yourself
Set up the environment you'll use for the rest of the course before moving on:
```bash
python3 -m venv genai-robotics
source genai-robotics/bin/activate
pip install torch transformers tokenizers datasets
```
Then verify it works end to end with a five-line smoke test:
```python
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("bert-base-uncased")
print(tok.tokenize("Robot, please pick up the red block."))
```
If you see a list of subword tokens printed out, your environment is ready for Unit 2, where you'll learn exactly what that call just did under the hood.
