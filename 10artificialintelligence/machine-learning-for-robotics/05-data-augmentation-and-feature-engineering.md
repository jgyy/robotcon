# Machine Learning for Robotics — Unit 5: Data Augmentation and Feature Engineering

Unit 4 focused on model architecture; this unit turns back to the dataset itself. Even a well-tuned model can't compensate for a dataset that's noisy, unbalanced, or missing whole categories of situation — so here you'll systematically audit dataset quality, generate synthetic samples to fill the gaps, and derive clustering-based features from LiDAR geometry.

## Revisiting dataset quality
Go back to the dataset from Unit 3/4 with a specific checklist rather than a general "does it look okay":
- **Noise** — are LiDAR readings jittery frame-to-frame in ways that don't correspond to real motion? Plot a short time window of a single LiDAR beam's range over consecutive frames and look for physically implausible jumps.
- **Scenario coverage** — does the dataset include tight turns, near-collision recoveries, and open-space cruising, or mostly one driving style? A histogram of angular velocity is a fast diagnostic.
- **Temporal consistency** — do consecutive samples represent a smooth trajectory, or are there gaps/jumps suggesting dropped messages or resets?

```python
df["scan_diff"] = df["front_min"].diff().abs()
print(df["scan_diff"].describe())
print((df["angular_velocity"].abs() > 0.5).mean())  # fraction of "sharp turn" samples
```

A dataset that fails this audit isn't necessarily useless, but it tells you exactly which augmentation techniques below are worth prioritizing.

## Enhanced dataset augmentation
Beyond the mirroring from Unit 4, systematically simulate variation that's expensive or slow to collect for real:
- **Noise injection** — add small Gaussian perturbations to LiDAR ranges to simulate sensor variance across runs, so the model doesn't overfit to one simulation's exact noise fingerprint.
- **Speed randomization** — scale recorded velocity samples up/down within physically plausible bounds to broaden the range of speeds represented.
- **Dynamic obstacle simulation** — synthetically shrink a range of LiDAR beams to simulate an obstacle that wasn't present during the original collection run.

```python
import numpy as np

def inject_noise(ranges, sigma=0.02):
    noisy = ranges + np.random.normal(0, sigma, size=ranges.shape)
    return np.clip(noisy, 0.0, None)

def simulate_obstacle(ranges, start_idx, width, distance):
    ranges = ranges.copy()
    ranges[start_idx:start_idx + width] = distance
    return ranges
```

## Synthetic data generation
Where augmentation perturbs existing samples, synthetic generation constructs new ones targeted at specific gaps — rare conditions, edge cases, or class imbalance (e.g., very few samples with an obstacle directly ahead at close range). A simple targeted approach: take under-represented samples (identified from the audit above), apply a combination of noise injection and boundary-value substitution, and append the results to the training set rather than replacing anything:

```python
rare_mask = df["front_min"] < 0.3  # close-obstacle samples are rare
rare_samples = df[rare_mask]
synthetic = rare_samples.copy()
synthetic["front_min"] = inject_noise(synthetic["front_min"].values, sigma=0.05)
augmented_df = pd.concat([df, synthetic], ignore_index=True)
```

The goal is a training set where "obstacle close ahead" is no longer a rare event the model can safely ignore to minimize average loss.

## Clustering-based features
K-Means clustering can turn a raw LiDAR scan into obstacle-level structure instead of per-beam readings. The key step is converting from the sensor's native polar representation (angle, range) to Cartesian (x, y) coordinates, since Euclidean clustering assumes a Cartesian space:

```python
import numpy as np
from sklearn.cluster import KMeans

def polar_to_cartesian(ranges, angle_min, angle_increment):
    angles = angle_min + np.arange(len(ranges)) * angle_increment
    valid = np.isfinite(ranges)
    x = ranges[valid] * np.cos(angles[valid])
    y = ranges[valid] * np.sin(angles[valid])
    return np.column_stack([x, y])

points = polar_to_cartesian(np.array(scan.ranges), scan.angle_min, scan.angle_increment)
clusters = KMeans(n_clusters=5, n_init="auto").fit(points)
cluster_features = {
    "n_clusters": len(np.unique(clusters.labels_)),
    "cluster_centers": clusters.cluster_centers_,
}
```

Invalid readings (`inf`/`nan`, filtered out by the `valid` mask above) must be excluded before clustering — feeding them in as literal coordinates would badly distort cluster centers. The resulting cluster count and centers are useful downstream features for navigation and path planning: "how many distinct obstacles nearby" and "where are they" is a much more directly actionable signal than 360 raw ranges.

## Try it yourself — capstone exercise
Using your Unit 3 dataset: (1) run the dataset-quality audit above and write down which of noise, coverage, or temporal consistency is weakest; (2) apply the augmentation technique that best addresses that weakness; (3) compute clustering-based obstacle features for every sample; (4) retrain one of your Unit 4 models on the resulting dataset and compare validation MAE against the Unit 4 baseline. Summarize in a few sentences which change — augmentation or clustering features — moved the metric more, and whether that matches your intuition about the original dataset's weakest point.
