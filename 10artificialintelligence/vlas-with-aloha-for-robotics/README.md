# VLAs with ALOHA for robotics

Vision-Language-Action (VLA) models are a broad and fast-moving family of approaches for teaching robots to act from vision and language, and this course narrows that huge space down to one concrete, well-documented implementation path: ALOHA, the low-cost bimanual teleoperation platform, trained with the Action Chunking Transformer (ACT) algorithm. Rather than jumping straight to ACT, the course builds it up from first principles — starting with behavioral cloning as the simplest form of imitation learning, adding actor-critic reinforcement learning as a reward-driven alternative, and finally combining the lessons of both into ACT's chunked, transformer-based approach to dexterous manipulation.

1. [Introduction to the Course](01-introduction-to-the-course.md) — What a VLA is, why ALOHA became a reference platform, and how imitation learning, actor-critic RL, and ACT relate to each other.
2. [Imitation Learning](02-imitation-learning.md) — Behavioral cloning as supervised learning over demonstrations, how to collect demonstrations, and the compounding-error problem it causes.
3. [Actor-Critic Reinforcement Learning](03-actor-critic-reinforcement-learning.md) — Reward-driven policy learning for a pick-and-place task, the actor/critic split, and reward shaping trade-offs.
4. [ACT Imitation Learning](04-act-imitation-learning.md) — Building ALOHA-style policies with the Action Chunking Transformer: chunked prediction, the CVAE architecture, and the full training-to-deployment pipeline.
