# Machine Learning for Robotics — Unit 4: Supervised Learning II

Unit 3 gave you a raw sensor dataset; this unit turns it into deployed models. You'll clean and scale the data, engineer spatial features from raw LiDAR, train both a Ridge Regression model and a TensorFlow neural network on the raw and feature-engineered variants, and wire the result back into ROS 2 as a live velocity-publishing node.

The diagram below traces this unit's full pipeline from raw dataset to a deployed velocity-publishing ROS 2 node.

```mermaid
flowchart LR
    Raw[Raw Dataset] --> Prep[Preprocessing & Scaling]
    Prep --> Feat[Feature Engineering: Regions]
    Feat --> Aug[Mirroring Augmentation]
    Aug --> Train[Train Ridge / TensorFlow NN]
    Train --> Node[ROS 2 Inference Node]
    Node --> CmdVel[/cmd_vel/]
```

## Data preprocessing
Raw LiDAR readings need cleaning before they're usable: invalid returns (`inf`, `nan`, or sensor-specific error codes) must be replaced with a sensible fill value (often the sensor's max range, since an invalid return usually means "no obstacle within range"), and columns that don't carry signal (timestamps, frame IDs) get dropped.

Scaling matters because LiDAR ranges and odometry velocities live on very different numeric scales, and most models (especially neural networks) train better when inputs are normalized. Apply separate scalers to each group rather than one global scaler, since they have different physical meaning and range:

```python
from sklearn.preprocessing import MinMaxScaler

lidar_scaler = MinMaxScaler(feature_range=(0, 1))
odom_scaler = MinMaxScaler(feature_range=(-1, 1))

df[lidar_cols] = lidar_scaler.fit_transform(df[lidar_cols])
df[odom_cols] = odom_scaler.fit_transform(df[odom_cols])
```

Save the fitted scalers (e.g., with `joblib.dump`) — you'll need the exact same transform at inference time, applied to live sensor data before it hits the model.

## Feature engineering
Feeding 360 raw LiDAR values directly into a model works, but it's high-dimensional and doesn't encode spatial structure explicitly. A common improvement is to divide the scan into directional regions — front, left, back, right — and compute summary statistics (min, mean, variance) per region:

```python
import numpy as np

def region_features(ranges, n=360):
    ranges = np.array(ranges)
    front = ranges[np.r_[n-45:n, 0:45]]
    left  = ranges[45:135]
    back  = ranges[135:225]
    right = ranges[225:315]
    feats = {}
    for name, region in [("front", front), ("left", left), ("back", back), ("right", right)]:
        feats[f"{name}_min"] = region.min()
        feats[f"{name}_mean"] = region.mean()
        feats[f"{name}_var"] = region.var()
    return feats
```

This turns 360 raw numbers into 12 semantically meaningful features, which is both easier for a linear model like Ridge Regression to exploit and cheaper to compute at inference time.

## Data augmentation via mirroring
Real-world driving data is rarely balanced — the robot may have turned left far more often than right during collection. Mirroring exploits the left-right symmetry of the robot's steering geometry: for every recorded sample, produce a mirrored sample by reversing the LiDAR scan order and negating angular velocity (and, where useful, negating linear velocity to synthesize reverse-driving samples):

```python
def mirror_sample(ranges, linear_v, angular_v):
    mirrored_ranges = ranges[::-1]
    return mirrored_ranges, linear_v, -angular_v
```

This single technique doubles the effective dataset size and directly corrects a left/right imbalance without collecting a single additional real sample — a cheap first step before the heavier synthetic-data techniques in Unit 5.

## Building and deploying a Ridge Regression model
Ridge Regression is ordinary linear regression with an L2 penalty on the coefficients, which keeps the model from overfitting to noisy sensor readings. Cross-validated hyperparameter search picks the regularization strength `alpha`:

```python
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV

param_grid = {"alpha": [0.01, 0.1, 1.0, 10.0, 100.0]}
grid = GridSearchCV(Ridge(), param_grid, cv=5, scoring="neg_mean_squared_error")
grid.fit(X_train, y_train)
best_model = grid.best_estimator_
```

Once trained, the model gets wrapped in a ROS 2 node: subscribe to `/scan`, apply the saved scaler (and feature extraction, for the feature-engineered variant), call `model.predict(...)`, and publish the result on `/cmd_vel`:

```python
from geometry_msgs.msg import Twist

class RegressionDriver(Node):
    def __init__(self, model, scaler):
        super().__init__("regression_driver")
        self.model, self.scaler = model, scaler
        self.cmd_pub = self.create_publisher(Twist, "/cmd_vel", 10)
        self.create_subscription(LaserScan, "/scan", self.on_scan, 10)

    def on_scan(self, msg):
        x = self.scaler.transform([msg.ranges])
        lin_v, ang_v = self.model.predict(x)[0]
        cmd = Twist()
        cmd.linear.x, cmd.angular.z = float(lin_v), float(ang_v)
        self.cmd_pub.publish(cmd)
```

Repeat the same train-and-deploy pipeline using the feature-engineered dataset instead of the raw one, and compare: does the 12-feature Ridge model drive as smoothly as the 360-feature one, with a fraction of the inference cost?

## Training a TensorFlow neural network
Ridge Regression can only capture linear relationships between inputs and outputs. A neural network handles the non-linear cases Ridge struggles with — e.g., the sharp velocity changes needed when an obstacle suddenly appears close on one side:

```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation="relu", input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(2),  # linear_v, angular_v
])
model.compile(optimizer="adam", loss="mse", metrics=["mae"])

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint("best_model.keras", save_best_only=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5),
]
model.fit(X_train, y_train, validation_split=0.2, epochs=100, callbacks=callbacks)
```

`EarlyStopping` prevents overfitting on a dataset that, even after augmentation, is still relatively small; `ReduceLROnPlateau` helps the optimizer settle when progress stalls. As with Ridge, train this same architecture twice — once on raw preprocessed data, once on the feature-engineered and augmented dataset — and compare validation MAE between the four total model variants (Ridge x2, neural net x2).

## Verifying your work
When comparing model variants, don't rely on a single scalar metric. Log validation MSE/MAE for all four combinations (Ridge/NN x raw/engineered) in one table, and — where possible — run each deployed model in the simulator and watch for qualitative failures a metric alone won't catch (oscillating steering, refusal to turn sharply enough near a wall). A model with slightly worse MAE that drives smoothly is often more useful than one with better MAE that jitters.

## Try it yourself
Take your raw preprocessed dataset and train a plain `LinearRegression` (no regularization) alongside your `Ridge` model. Compare their coefficients and validation MSE. If Ridge doesn't meaningfully outperform plain linear regression, what does that tell you about how noisy or collinear your engineered features are?
