# Intermediate Generative AI for Robotics — Unit 4: Transformers

The transformer architecture's ability to model long-range relationships in data — without the locality bias baked into convolutions — makes it a natural fit for object detection tasks where a robot needs to relate distant parts of a scene. This unit builds transformer fundamentals from the ground up and applies them via DETR to Mars rover object detection.

## What are transformers
At the core of a transformer is **self-attention**: for each element in a sequence (a word, an image patch), compute a weighted combination of *all other elements*, where the weights are learned based on relevance. Concretely, each input is projected into a query (`Q`), key (`K`), and value (`V`):
```python
attention_weights = softmax(Q @ K.T / sqrt(d_k))
output = attention_weights @ V
```
This single mechanism is what gives transformers their long-range modeling power: a pixel in the top-left corner of an image can directly attend to a pixel in the bottom-right, in one layer, with no locality constraint — unlike a CNN, where information from distant regions only mixes after many stacked convolutional layers.

**Multi-head attention** runs several attention operations in parallel with different learned projections, letting the model attend to different kinds of relationships (e.g. one head tracking color similarity, another tracking spatial proximity) simultaneously, then concatenates the results.

Because attention itself has no notion of order or position — it treats the input as an unordered set — transformers need **positional encodings** added to the input embeddings to inject that information:
- **Sinusoidal encodings** use fixed sine/cosine functions of different frequencies, requiring no learned parameters and generalizing reasonably to sequence lengths not seen during training.
- **Learned encodings** are trainable embedding vectors per position, often fitting the training distribution slightly better but generalizing worse to unseen lengths.

## Transformers for Mars: DETR for object detection
DETR (**DE**tection **TR**ansformer) reframes object detection as a set-prediction problem: instead of the anchor boxes and non-max suppression used by classic detectors, a CNN backbone (commonly ResNet) extracts features, positional encodings are added, and a transformer encoder-decoder directly predicts a fixed-size set of `(class, bounding box)` pairs:
```python
features = backbone(image)                      # CNN feature map
features = features + positional_encoding(features.shape)
memory = transformer_encoder(features)
object_queries = learned_query_embeddings        # fixed-size set, e.g. 100 queries
detections = transformer_decoder(object_queries, memory)
boxes, classes = detection_head(detections)      # per-query predictions
```
Training uses **bipartite matching** (via the Hungarian algorithm) to assign each ground-truth object to the predicted query that best matches it, then applies a combined classification + box regression loss on those matched pairs — this is what lets DETR skip hand-designed anchors entirely.

For the rover, DETR is applied to the forward camera feed to detect obstacles, rocks, or landmarks, giving the navigation system structured `(class, location)` outputs rather than raw pixels.

## Sinusoidal vs. learned positional encoding — a direct comparison
Because positional encoding choice measurably affects detection quality, it's worth training the same DETR setup twice, changing only this component:
```python
def sinusoidal_pe(height, width, dim):
    # fixed, no gradient — same formula as the original Transformer paper
    ...

class LearnedPE(nn.Module):
    def __init__(self, height, width, dim):
        super().__init__()
        self.pe = nn.Parameter(torch.randn(height, width, dim))
    def forward(self):
        return self.pe
```
On the Mars rover's terrain, sinusoidal encodings tend to generalize better as the camera's field of view or resolution changes between deployments, while learned encodings can slightly outperform on a fixed camera configuration matching the training data — a small but instructive case study in the general accuracy-vs-generalization tradeoff.

Transformers also make a useful contrast point with CNNs here: CNNs build up receptive field gradually through stacked local convolutions, which works well for texture-heavy classification but struggles to relate a rock in the near field to a ridge line far in the background in a single layer. A rover navigating long, open Martian terrain benefits from the transformer's ability to relate distant scene elements directly.

## Exercises
- **Crop wheel noise.** The rover's own wheels are visible at the bottom of its camera frame and can trigger spurious detections. Add a preprocessing step that crops (or masks) the bottom strip of each frame before it reaches the backbone, and compare detection precision with and without it.
- **Hybrid positional encoding.** Implement a positional encoding that sums a fixed sinusoidal component with a small learned residual (`pe = sinusoidal_pe(...) + learned_residual`), and compare its detection performance against each pure approach.

## Try it yourself
Using a pretrained DETR checkpoint (available via `torchvision` or Hugging Face's `transformers` library) and any set of images with a repeating background pattern (a hallway, an outdoor path), visualize the decoder's attention weights for a single detected object query overlaid on the input image. Confirm for yourself that the highlighted attention region corresponds to the object being detected — this is the clearest way to see self-attention doing real work, not just as a diagram.
