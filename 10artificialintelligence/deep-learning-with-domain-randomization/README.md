# Deep Learning with Domain Randomization

This course builds a full simulation-to-perception pipeline in Keras: you generate labeled training data straight out of a Gazebo simulation, train a MobileNetV2-based network to locate an object in 3D space from a single RGB frame, and progressively harden that model against motion, visually similar distractors, and — the technique the course is named for — domain randomization, where the simulation's lighting, textures, and backgrounds are deliberately randomized far beyond realistic bounds so the trained model transfers to conditions it never saw during training. The course ends with a microproject that wires the finished perception model into a working "garbage collector" robot behavior: find the target among distractors, approach it, and pick it up.

1. [Quick Demo](01-quick-demo.md) — Preview the finished pipeline by running a pre-trained detector against a live Gazebo camera feed.
2. [Step By Step Simple Guide](02-step-by-step-simple-guide.md) — Build the core loop from scratch: collect labeled sim data, fine-tune MobileNetV2, and train a 3D position regressor.
3. [Exercises For XY motion Spam](03-exercises-for-xy-motion-spam.md) — Retrain the model on a continuously moving target and learn the fine-tuning tradeoffs versus training from scratch.
4. [Exercises for Spam and a Distractor](04-exercises-for-spam-and-a-distractor.md) — Add a second, confusable object and extend the model to a multi-task classification-plus-localization head.
5. [Exercises with Distractor and Random Env](05-exercises-with-distractor-and-random-env.md) — Apply domain randomization to lighting, textures, and backgrounds to close the sim-to-real gap.
6. [Microproject Garbage Collector](06-microproject-garbage-collector.md) — Assemble perception, decision, and action into a complete pick-the-target-not-the-distractor robot pipeline.
