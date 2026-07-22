# AI Foundations for Robotics — Unit 6: Information Theory

Decision theory told you how to act on a posterior; information theory gives you the tools to measure *how uncertain* that posterior is, and — as the payoff at the end of this unit — hands you the standard loss function used to train the logistic regression model in Unit 7.

## Information content and entropy
The **information content** (or "surprise") of an event with probability p is defined as `I(x) = -log₂ P(x)`. Rare events (small p) carry high information — learning that a low-probability event occurred tells you a lot; a near-certain event (p close to 1) carries almost none. **Entropy** is the *expected* information content of a random variable — the average number of bits of surprise you'd get from observing it:

```
H(X) = E[I(X)] = -Σ p(x) · log₂ p(x)
```

A fair coin (p=0.5) has maximum entropy for a binary variable (1 bit); a heavily biased coin (p=0.99) has low entropy — you already know almost certainly what will happen, so there's little left to learn.

```python
import numpy as np
def entropy(probs):
    probs = np.asarray(probs)
    probs = probs[probs > 0]              # 0·log(0) is defined as 0
    return -np.sum(probs * np.log2(probs))

print(entropy([0.5, 0.5]))     # 1.0 bit — maximally uncertain
print(entropy([0.99, 0.01]))   # ~0.08 bits — nearly certain
```

## Joint and conditional entropy
Entropy extends to two variables jointly: **joint entropy** H(X, Y) measures total uncertainty in the pair (e.g. a room's debris count and dust level together). **Conditional entropy** H(Y | X) = H(X, Y) − H(X) is the *average remaining* uncertainty in Y once you already know X. Two clean special cases: if Y is fully determined by X, H(Y | X) = 0 (learning X leaves nothing left to learn about Y); if X and Y are independent, H(Y | X) = H(Y) (knowing X tells you nothing about Y, so its uncertainty is unaffected).

## Cross-entropy and KL divergence
**Cross-entropy** measures the cost of using the *wrong* distribution to describe data drawn from the *true* one:

```
H(p, q) = -Σ p(x) · log q(x)
```

Interpretation: if the robot designs an efficient message code assuming waste types follow distribution q, but the real distribution is p, H(p, q) is the average number of bits actually spent per message — always ≥ H(p), the true entropy, with equality only when q = p. The gap between them is the **KL divergence**: `D_KL(p‖q) = H(p, q) − H(p)`, always non-negative, quantifying exactly how many extra bits are wasted by using q instead of p.

## Why cross-entropy is the loss function of choice
This is the payoff: minimizing cross-entropy between the true label distribution (a one-hot vector — 100% probability on the correct class) and a model's predicted probability distribution is *mathematically identical* to maximum likelihood estimation for a categorical model (Unit 4). That's not a coincidence or convention — it's why virtually every classifier you'll ever train, including the logistic regression in the next unit, uses cross-entropy as its training loss.

```python
import numpy as np

def cross_entropy(y_true_onehot, y_pred_probs, eps=1e-12):
    y_pred_probs = np.clip(y_pred_probs, eps, 1 - eps)   # avoid log(0)
    return -np.sum(y_true_onehot * np.log(y_pred_probs))

y_true = np.array([0, 1, 0, 0])            # true class = index 1
y_pred = np.array([0.1, 0.6, 0.2, 0.1])    # model's predicted probabilities
print(cross_entropy(y_true, y_pred))        # penalizes low confidence on the true class
```

## Try it yourself
Design two search strategies for locating debris across 8 rooms using yes/no questions: (a) a poor strategy that asks about rooms one at a time in fixed order, and (b) bisection ("is it in the first half of the remaining rooms?"). Compute the entropy of the uniform prior over 8 equally-likely rooms (`entropy([1/8]*8)`) and reason about why bisection's expected number of questions is close to that entropy value while the linear strategy's is not.
