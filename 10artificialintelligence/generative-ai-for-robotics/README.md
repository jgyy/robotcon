# Generative AI for Robotics

Generative AI is the natural next step after the deep learning fundamentals: instead of models that only classify or predict a number, these are models that create — new text, new answers about images, new robot motions — from what they've learned. This course builds that capability from the ground up, starting at raw tokenization and finishing with a robot that can be told what to do and where to go in plain language. Along the way you train tokenizers and models by hand, fine-tune pretrained checkpoints efficiently, and wire the results into real ROS 2 pipelines for language-driven control, vision-language perception, and autonomous navigation.

1. [Introduction to Generative AI for Robotics](01-introduction-to-generative-ai-for-robotics.md) — Course framing, a demo of what you'll build, the roadmap ahead, and the prior knowledge you'll need.
2. [Tokenization and Data Foundations](02-tokenization-and-data-foundations.md) — How text becomes model-ready tokens, from character-level tokenizers built by hand through BPE, WordPiece, and the Hugging Face `tokenizers` library.
3. [Training and Fine-Tuning Generative Models](03-training-and-fine-tuning-generative-models.md) — Preprocessing pipelines, efficient fine-tuning of pretrained models, and training a generative model from scratch.
4. [Natural Language Robot Control](04-natural-language-robot-control.md) — Turning natural language commands into differential-drive velocities and deploying the result as a ROS 2 node.
5. [Vision-Language Models in Robotics](05-vision-language-models-in-robotics.md) — Visual question answering with ViLT and zero-shot segmentation with CLIPSeg, applied to real-time person tracking.
6. [Generative AI for Robot Navigation](06-generative-ai-for-robot-navigation.md) — Fine-tuning T5 on a large generated dataset to translate natural language into Nav2 waypoint navigation.
