# AI Foundations for Robotics

This course is the mathematical substrate underneath every other AI-for-robotics course in this repo: probability (single and multiple random variables), statistics (turning observed data into model parameters), decision theory (turning probabilities into optimal robot actions), information theory (measuring and comparing uncertainty), and logistic regression (the first real trainable model built from all of the above). Each unit is strictly cumulative and worked through a single running example — a mobile robot searching a building, sensing its surroundings, and sorting what it finds — culminating in a final project that trains an image classifier and wraps it in a genuine decision policy.

1. [Introduction to AI for Robotics](01-introduction-to-ai-for-robotics.md) — What this course covers, a preview of classification-with-reject-option, and the prerequisites you need before Unit 2.
2. [Probability Through Univariate Models](02-probability-through-univariate-models.md) — Sample spaces and events, the algebra of probability, Bayes' rule, random variables, and the common discrete/continuous distributions.
3. [Probability Through Multivariate Models](03-probability-through-multivariate-models.md) — Joint/marginal/conditional distributions, covariance and correlation, the multivariate Gaussian, and a worked Bayesian position-estimation example.
4. [Statistics](04-statistics.md) — Maximum likelihood estimation, method of moments, online estimation, overfitting and regularization, and full Bayesian statistics with credible intervals.
5. [Decision Theory](05-decision-theory.md) — Actions, states, and loss functions; classification and regression as decision problems; confusion matrices and ROC curves; a worked multi-sensor classifier.
6. [Information Theory](06-information-theory.md) — Information content, entropy, joint/conditional entropy, cross-entropy, KL divergence, and why cross-entropy is the standard classification loss.
7. [Logistic Regression](07-logistic-regression.md) — The sigmoid and softmax functions, binary and multinomial logistic regression, training with gradient descent in PyTorch, and evaluation on MNIST.
8. [Final Project](08-final-project.md) — Collecting and preprocessing image data, training a softmax classifier, wrapping it in a decision policy, and evaluating the full pipeline end to end.
