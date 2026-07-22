# AI Foundations for Robotics — Unit 3: Probability Through Multivariate Models

Unit 2 handled one random variable at a time. Real robot problems almost never look like that — a robot tracks debris count *and* dust level, or fuses *multiple* sensor readings about the same quantity. This unit extends probability to several random variables at once and ends with a full worked Bayesian estimation problem you could run on a real robot.

The diagram below shows the position estimate being refined step by step as each LIDAR range reading is folded into the posterior.

```mermaid
flowchart LR
    P["Prior N(1.5, 0.30 squared)"] --> R1["Update with reading 1.62"]
    R1 --> R2["Update with reading 1.58"]
    R2 --> R3["Update with reading 1.55"]
    R3 --> Post["Posterior: mean refined, variance tightened"]
```

## Joint, marginal, and conditional distributions
Tracking two random variables at once — say `D` = debris count and `S` = dust level (low/medium/high) in a room — needs a **joint distribution** P(D, S): the probability of every (D, S) combination together. From a joint distribution you can always recover:

- **Marginal**: the distribution of one variable alone, found by summing (or integrating) out the other — `P(D) = Σ_s P(D, S=s)`. Answers "how likely is a given debris count, regardless of dust level?"
- **Conditional**: `P(D | S=s) = P(D, S=s) / P(S=s)`. Answers "given I already know the dust level, what's my updated belief about debris count?"

```python
import numpy as np
# rows = debris count (0,1,2), cols = dust level (low, med, high)
joint = np.array([[0.30, 0.05, 0.02],
                   [0.10, 0.15, 0.08],
                   [0.02, 0.08, 0.20]])
marginal_debris = joint.sum(axis=1)          # P(D)
conditional_debris_given_high_dust = joint[:, 2] / joint[:, 2].sum()  # P(D | S=high)
```

## Independence, covariance, and correlation
`D` and `S` are **independent** if knowing one tells you nothing about the other: `P(D | S) = P(D)` for every value of S, equivalently `P(D, S) = P(D) P(S)`. **Covariance** measures whether two variables move together in a linear sense: `Cov(X, Y) = E[XY] − E[X]E[Y]`. Its sign tells you direction (positive = move together), but its magnitude is hard to interpret because it depends on the variables' units. **Correlation** fixes that by normalizing: `ρ = Cov(X, Y) / (σ_X σ_Y)`, always in [−1, 1]. Independence implies zero correlation, but the converse is *not* true — two variables can be perfectly dependent (e.g. Y = X²) yet have zero linear correlation.

## Correlation is not causation
A classic trap: two variables can be strongly correlated purely because a third, unobserved variable drives both. Suppose debris count and dust level both spike sharply on days a maintenance crew works in the building — dust from drilling *and* debris from discarded materials rise together, producing a correlation of roughly 0.86 between them. It would be wrong to conclude "dust causes debris" or vice versa; the maintenance crew is the hidden common cause. Always ask whether a plausible confounder could explain an observed correlation before treating one variable as a lever you can pull to change the other.

## The multivariate Gaussian and linear Gaussian systems
The single most useful multivariate distribution is the **multivariate Gaussian**, parameterized by a mean vector μ and covariance matrix Σ:

```
p(x) = (2π)^(-k/2) |Σ|^(-1/2) exp(-½ (x-μ)ᵀ Σ⁻¹ (x-μ))
```

Its marginals and conditionals are themselves Gaussian, with closed-form mean/variance formulas — this closure property is what makes it tractable. A **linear Gaussian system** — `x ~ N(μ, Σ)` and `y | x ~ N(Ax + b, R)` (a linear sensor model with Gaussian noise) — has a closed-form posterior `p(x | y)` via **Bayes' rule for Gaussians**. This is the mathematical core of Kalman filters and most robot state estimation.

## Worked example: Bayesian position estimation from a range sensor
Scenario: the robot has lost track of its position inside a circular calibration room and must re-localize using range readings from its distance sensor. Model the unknown distance-to-wall `x` with a Gaussian **prior** `N(μ₀, σ₀²)` built from what's physically plausible, and each noisy range reading as a Gaussian **likelihood** `N(x, σ_meas²)`. The **posterior** after one measurement `z` is a precision-weighted average:

```python
def bayes_gaussian_update(prior_mean, prior_var, meas, meas_var):
    posterior_var = 1.0 / (1.0 / prior_var + 1.0 / meas_var)
    posterior_mean = posterior_var * (prior_mean / prior_var + meas / meas_var)
    return posterior_mean, posterior_var

mean, var = 1.5, 0.30**2          # prior: expect ~1.5m from center, fairly unsure
for reading in [1.62, 1.58, 1.55]:  # successive LIDAR range readings
    mean, var = bayes_gaussian_update(mean, var, reading, meas_var=0.05**2)
print(mean, var)                  # posterior tightens with each reading
```

Wired into a robot, each `reading` would come from an actual sensor topic or an action result — e.g. an `rclpy` action client requesting a LIDAR sweep and folding each returned range into `bayes_gaussian_update` before commanding the next move.

## Try it yourself
Run the loop above with only the first reading, then with all three, and print `var` after each step. Confirm that variance strictly decreases as more measurements are folded in, and that it decreases *faster* early on than later — explain why in one sentence using the precision-weighting formula.
