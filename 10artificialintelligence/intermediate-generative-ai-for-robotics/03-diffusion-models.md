# Intermediate Generative AI for Robotics — Unit 3: Diffusion Models

Diffusion models are the generative technique behind most modern image synthesis systems, but their core mechanism — learning to reverse a gradual noising process — is equally useful for robotics tasks like predicting plausible next states or scoring how well a candidate view matches a goal. This unit builds that intuition from scratch and applies it to Mars rover navigation.

## What are diffusion models
A diffusion model is trained on a deceptively simple task: given data with some amount of noise added to it, predict the noise so it can be removed. Two processes define the approach:

- **Forward process (fixed, not learned):** starting from real data `x_0`, add a small amount of Gaussian noise repeatedly over `T` steps until, at step `T`, the data is indistinguishable from pure noise. Each step is defined analytically:
```
x_t = sqrt(alpha_t) * x_0 + sqrt(1 - alpha_t) * epsilon,   epsilon ~ N(0, I)
```
where `alpha_t` decreases as `t` increases according to a **noise schedule**.

- **Reverse process (learned):** a neural network `epsilon_theta(x_t, t)` is trained to predict the noise `epsilon` that was added, given the noisy sample and the timestep. Once trained, you can start from pure noise and iteratively subtract the predicted noise, step by step, to arrive at a sample from the learned data distribution.

The training objective is just regression on the noise:
```python
loss = ((epsilon_pred - epsilon_true) ** 2).mean()
```
which is why diffusion models, despite their generative power, are trained with an almost boringly simple supervised loss — all the interesting behavior emerges from *how* the noise is added and removed across many steps, not from an exotic loss function.

## Diffusion models for Mars
For rover navigation, the goal is different from image generation: rather than sampling a brand-new image, you use the diffusion model's learned representation of "what a plausible camera view looks like" to guide the rover toward a target. The pipeline:

1. **Data preprocessing.** Collect paired frames from rover traversals — a current view and a satellite/goal image of the destination — normalized to the same resolution and value range.
2. **Training.** Train the noise-prediction network on the rover's camera frames, conditioned on a timestep embedding (and optionally the goal image, for a conditional variant).
3. **Inference and goal comparison.** Rather than running the full reverse process to synthesize a new image, use the model's intermediate representations (or simply the raw current-frame and goal-frame embeddings) with **cosine similarity** to score how close the rover's current view is to the goal:
```python
import torch.nn.functional as F

def view_similarity(current_embedding, goal_embedding):
    return F.cosine_similarity(current_embedding, goal_embedding, dim=-1)
```
A similarity close to 1.0 means the rover's current view closely matches the target; the navigation controller uses this score as a reward-like signal to steer toward increasing similarity, effectively turning the diffusion model's learned representation into a lightweight goal detector.

## Exercises
- **Sinusoidal noise schedule.** Implement a cosine or sinusoidal noise schedule (as opposed to the simpler linear schedule) and compare how it changes the amount of noise present at each timestep:
```python
import math

def cosine_alpha(t, T, s=0.008):
    f = lambda x: math.cos((x / T + s) / (1 + s) * math.pi / 2) ** 2
    return f(t) / f(0)
```
Plot `alpha_t` across `t` for both schedules and note where they diverge most.
- **Cosine-similarity goal detection.** Using the `view_similarity` function above, implement a simple stopping rule: the rover halts and declares "goal reached" once similarity exceeds a threshold (e.g. 0.9) for several consecutive frames. Test how sensitive this is to lighting or viewpoint changes between the current frame and the goal image.

## Try it yourself
Take any small image dataset you have handy (even a folder of rover-sim screenshots or a public dataset like CIFAR-10), implement the forward noising process only (no training), and visualize `x_0`, `x_{T/4}`, `x_{T/2}`, and `x_T` side by side for both a linear and a cosine schedule. Seeing how quickly structure disappears under each schedule is the fastest way to build real intuition for why schedule choice matters before you ever train a reverse model.
