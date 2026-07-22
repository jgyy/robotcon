# Kalman Filters in ROS 2 — Unit 5: Particle Filter

Every filter so far assumes belief is a single Gaussian hump. Real global localization often isn't: dropped into an unknown spot in a symmetric building, a robot might genuinely believe it's in one of three nearly-identical rooms simultaneously. A particle filter represents belief as a swarm of weighted samples instead of a formula, so it can represent that kind of multimodal uncertainty directly — at the cost of needing many samples instead of two numbers.

## The generic particle filter algorithm

A particle filter keeps `N` "particles," each a full hypothesis of the robot's state (e.g. `x, y, θ`) plus a weight representing how plausible that hypothesis currently is. The loop mirrors the Bayes filter from Unit 2 almost exactly, just implemented by sampling instead of by working with an explicit distribution:

1. **Predict** — move every particle according to the motion model, plus independent random noise per particle (this is what keeps the swarm spread out appropriately).
2. **Correct** — reweight every particle by how well its hypothesis matches the actual sensor reading.
3. **Resample** — probabilistically keep more copies of high-weight particles and drop low-weight ones, so the swarm concentrates where the true state most likely is.

## Initialization

For global localization (no idea where the robot starts), initialize particles uniformly across the entire known map with equal weights:

```python
import numpy as np

N = 500
particles = np.column_stack([
    np.random.uniform(x_min, x_max, N),
    np.random.uniform(y_min, y_max, N),
    np.random.uniform(-np.pi, np.pi, N),
])
weights = np.ones(N) / N
```

If you already have a rough starting pose (e.g. from RViz's "2D Pose Estimate"), initialize particles as a tight Gaussian cloud around it instead — far fewer particles are then needed to converge.

## Predict step

Apply the motion model to every particle independently, injecting per-particle noise so the swarm's spread reflects genuine motion uncertainty:

```python
def predict(particles, v, w, dt, noise_std):
    n = len(particles)
    v_noisy = v + np.random.normal(0, noise_std[0], n)
    w_noisy = w + np.random.normal(0, noise_std[1], n)
    particles[:, 0] += v_noisy * np.cos(particles[:, 2]) * dt
    particles[:, 1] += v_noisy * np.sin(particles[:, 2]) * dt
    particles[:, 2] += w_noisy * dt
    return particles
```

## Correct step and resampling

Weight each particle by how consistent a real sensor reading (e.g. a lidar scan) is with what that particle *would* have sensed at its hypothesized pose — this needs a sensor model, typically comparing expected vs. actual range readings against the known map:

```python
def correct(particles, weights, sensor_model, observation):
    likelihoods = np.array([sensor_model(p, observation) for p in particles])
    weights = weights * likelihoods
    return weights / weights.sum()
```

Left alone, a few particles accumulate nearly all the weight while the rest become dead computational weight — **resampling** fixes this by drawing a new particle set proportional to the current weights:

```python
def resample(particles, weights):
    idx = np.random.choice(len(particles), size=len(particles), p=weights)
    return particles[idx], np.ones(len(particles)) / len(particles)
```

This predict → correct → resample cycle is exactly what collapses an initially uniform, multimodal cloud down onto the true pose after the robot moves through a few asymmetric features that break the ambiguity.

## Configuring and testing AMCL

You won't hand-roll this for real robots — `nav2_amcl` (Adaptive Monte Carlo Localization) implements a tuned particle filter that fuses lidar scans against a known occupancy grid map. Key parameters, typically set in your Nav2 YAML config:

```yaml
amcl:
  ros__parameters:
    min_particles: 500
    max_particles: 2000
    laser_model_type: "likelihood_field"
    update_min_d: 0.2      # min translation (m) before triggering a filter update
    update_min_a: 0.2      # min rotation (rad) before triggering a filter update
```

"Adaptive" means the particle count shrinks automatically as confidence grows (fewer particles needed once the swarm converges), between `min_particles` and `max_particles`. After launching AMCL against a map, publish an initial pose estimate and drive the robot:

```bash
ros2 topic echo /amcl_pose
ros2 topic echo /particle_cloud
```

`/amcl_pose` gives you the fused pose with covariance; visualizing `/particle_cloud` in RViz is the clearest way to *see* the swarm collapse from a spread-out cloud to a tight cluster as the robot moves and observes distinguishing features.

## Try it yourself

Using the `predict`/`correct`/`resample` functions above, simulate a robot in a 1D world with two indistinguishable-looking "rooms" (define a sensor model that returns high likelihood in either of two disjoint position ranges). Initialize particles uniformly, run a few predict/correct/resample cycles as the simulated robot moves toward one room, and confirm the particle cloud starts bimodal (clustered near both candidate rooms) and collapses to a single mode once motion disambiguates which room the robot is actually in.
