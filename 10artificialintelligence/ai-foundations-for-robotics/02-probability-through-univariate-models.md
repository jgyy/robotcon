# AI Foundations for Robotics — Unit 2: Probability Through Univariate Models

Every downstream unit — statistics, decision theory, information theory, logistic regression — is built on the probability vocabulary introduced here. Running example: a cleaning robot searching a building room by room for debris, where "does this room have debris?" and "how many rooms until I find some?" are the questions probability answers.

The diagram below traces how this unit's concepts build on each other, from raw sample spaces up to the distributions you'll reuse throughout the course.

```mermaid
flowchart LR
    A["Sample Space & Events"] --> B["Algebra of Events"]
    B --> C["Conditional Probability"]
    C --> D["Product Rule & Total Probability"]
    D --> E["Bayes' Rule"]
    E --> F["Random Variables & Moments"]
    F --> G["Common Distributions"]
```

## Sample spaces, events, and two views of probability
An **experiment** is any process with an uncertain outcome (searching one room). The **sample space** Ω is the set of all possible outcomes; an **event** is any subset of Ω you care about — e.g. `A = "room contains debris"`. Two outcomes on what a probability *means*:

- **Frequentist**: P(A) is the long-run fraction of times A happens if you repeated the experiment forever (search 1,000 similar rooms, count how many had debris).
- **Bayesian**: P(A) is a degree of belief, updatable as evidence arrives — useful even for one-off events ("I believe there's a 70% chance *this specific* room has debris, given what I've seen so far").

Both interpretations obey the same math; this course leans Bayesian starting in Unit 3 because a robot updating beliefs online is exactly what Bayesian probability formalizes.

## The algebra of events
Formal rules that any valid probability assignment must satisfy: 0 ≤ P(A) ≤ 1, P(Ω) = 1, and for disjoint events P(A ∪ B) = P(A) + P(B). In general (not necessarily disjoint):

```
P(A ∪ B) = P(A) + P(B) − P(A ∩ B)          # avoid double-counting the overlap
P(A^c)   = 1 − P(A)                        # complement
P(A | B) = P(A ∩ B) / P(B)                 # conditional, requires P(B) > 0
```

Picture two rooms with a shared doorway (the overlap) — if you counted debris probability in each room separately and just added them, you'd double-count debris sitting in the doorway. That's exactly what the `− P(A ∩ B)` correction removes.

## The product rule, total probability, and Bayes' rule
Rearranging the conditional-probability definition gives the **product rule**: `P(A ∩ B) = P(A|B) P(B)`. Chaining it over a full partition of the sample space gives the **total probability theorem**, and combining both gives **Bayes' rule** — the single most important formula in this course:

```
P(A | B) = P(B | A) P(A) / P(B)
```

Concretely: if the robot knows the base rate of debris rooms (`P(debris)`, the *prior*) and how reliable a floor sensor is (`P(sensor beeps | debris)`, the *likelihood*), Bayes' rule tells it how to update to `P(debris | sensor beeps)` — the *posterior*. This exact pattern (prior → likelihood → posterior) reappears in every remaining unit.

## Random variables and their moments
A **random variable** (RV) X is a function mapping outcomes in Ω to real numbers — e.g. `X = number of debris items in a room`. It's discrete if it takes countable values, continuous otherwise. Two summary statistics describe a distribution compactly:

```
Mean (expected value):  E[X] = Σ x · P(X = x)          (discrete)
Variance:                Var(X) = E[(X − E[X])²]
```

The mean is the "center of mass" of the distribution; the variance measures spread. You'll use both constantly — a low-variance sensor reading is one you can trust more.

## Common distributions you'll reuse constantly
**Discrete:** Bernoulli (single yes/no trial, e.g. "does this room have debris?"), Binomial (count of successes over n Bernoulli trials, e.g. "how many of 8 rooms had debris?"), Geometric (trials until first success, e.g. "how many rooms until the first debris find?"), Poisson (count of rare events per unit time/area), Categorical and Multinomial (Bernoulli/Binomial generalized to more than two outcomes, e.g. debris type).

**Continuous:** Uniform (all values in a range equally likely), Gaussian/Normal (the ubiquitous bell curve — sensor noise is almost always modeled this way), Exponential (waiting time between events), Beta (a distribution *over probabilities themselves* — you'll meet this again as a Bayesian prior in Unit 4).

```python
from scipy import stats

room_has_debris = stats.bernoulli(p=0.3)
print(room_has_debris.pmf(1))            # P(debris) = 0.3

rooms_until_first_debris = stats.geom(p=0.3)
print(rooms_until_first_debris.mean())   # expected rooms searched, = 1/0.3

sensor_noise = stats.norm(loc=0.0, scale=0.05)  # meters
print(sensor_noise.pdf(0.1))
```

## Try it yourself
The robot searches 8 independent rooms, each with a 40% chance of containing debris (`stats.binom(n=8, p=0.4)`). Compute the probability of finding debris in *at least* 3 rooms two ways — once using `1 - binom.cdf(2, 8, 0.4)` and once by summing `binom.pmf(k, 8, 0.4)` for k = 3..8 — and confirm they agree.
