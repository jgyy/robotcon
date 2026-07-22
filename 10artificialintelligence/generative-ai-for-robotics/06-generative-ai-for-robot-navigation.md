# Generative AI for Robotics — Unit 6: Generative AI for Robot Navigation

This closing unit brings everything together: tokenization, model fine-tuning, and natural language understanding, applied to full autonomous navigation. Instead of a robot that reacts to a single command with a velocity, you'll build one that can be told "go to the kitchen" and navigate there using ROS 2's Nav2 stack.

## Language-based autonomous navigation with Nav2
Nav2 already solves the hard geometric problem of navigation — planning a collision-free path and following it — given a target pose (`x, y, yaw` in a known frame) via its `NavigateToPose` action. What it doesn't solve is turning "go to the kitchen" into that pose. That's the gap generative AI fills here: a fine-tuned model translates a natural-language instruction into either a set of named waypoint coordinates or, more generally, the arguments Nav2's action interface expects, and a thin ROS 2 layer sends the resulting goal:
```python
from nav2_msgs.action import NavigateToPose
from geometry_msgs.msg import PoseStamped

def send_nav_goal(node, action_client, x, y, yaw):
    goal = NavigateToPose.Goal()
    goal.pose = PoseStamped()
    goal.pose.header.frame_id = "map"
    goal.pose.pose.position.x, goal.pose.pose.position.y = x, y
    goal.pose.pose.orientation = yaw_to_quaternion(yaw)
    action_client.send_goal_async(goal)
```
The model's job is entirely upstream of this: given `"go to the kitchen"`, produce `(x, y, yaw)` (or a named waypoint that's looked up in a small map). That reframing — language in, coordinates out — is what makes this a supervised sequence-to-sequence problem you can train, rather than something you'd hand-code with string matching.

## Building a large-scale navigation dataset
A model this specific needs a lot of paired examples to fine-tune well, and hand-labeling tens of thousands of `(command, waypoint)` pairs isn't realistic. The practical approach is programmatic generation: enumerate known waypoints in your environment (kitchen, charging dock, front door, ...), generate varied natural-language phrasings for each with templates, and pair them with the corresponding coordinates:
```python
waypoints = {"kitchen": (4.2, 1.1, 0.0), "charging dock": (0.0, 0.0, 3.14), "front door": (-2.5, 3.0, 1.57)}
templates = ["go to the {loc}", "navigate to the {loc}", "can you head to the {loc}?", "take me to the {loc}"]

pairs = [(t.format(loc=name), pose) for name, pose in waypoints.items() for t in templates]
```
Scaling this kind of generator up to 100,000 examples (varying phrasing, adding noise, sampling nearby offsets around each named waypoint) is what actually gives a fine-tuned model robustness to phrasing it wasn't literally trained on. Two details matter for training efficiency at that scale: **decimal reduction** — rounding coordinates to a sensible precision (robots don't need waypoint targets specified to 10 decimal places, and excess precision just adds noise for the model to fit) — and converting orientation from **quaternion to Euler yaw** before feeding it to the model, since a single yaw angle is a far easier target for a text-generation model to produce reliably than four quaternion components that must stay unit-normalized.

## Fine-tuning T5 for waypoint navigation
T5 (Text-to-Text Transfer Transformer) is a natural fit here because it's built around the exact framing this task needs: text in, text out. Format the target as a structured string the model can generate and you can parse back into numbers afterward:
```python
from transformers import T5Tokenizer, T5ForConditionalGeneration

tok = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")

# Training target format, e.g.: "x=4.20 y=1.10 yaw=0.00"
inputs = tok("navigate: go to the kitchen", return_tensors="pt")
output_ids = model.generate(**inputs, max_new_tokens=20)
print(tok.decode(output_ids[0], skip_special_tokens=True))
```
After fine-tuning on the generated dataset, parse the model's structured text output back into floats, feed them into `send_nav_goal` from above, and you have a complete pipeline: spoken or typed language in, a moving robot out. Test it first with waypoints and phrasings from the training distribution, then with paraphrases you invent yourself — that gap is the real measure of whether the model learned the *concept* of navigation commands or just memorized your templates.

## Try it yourself
Add two new named waypoints to the dataset generator (e.g. "workshop" and "meeting room"), regenerate the dataset, and fine-tune again. Then test the model with a command that references a waypoint by a synonym it never saw in training (e.g. "office" for "workshop") and observe what it predicts — this is the clearest end-of-course demonstration of both the power and the limits of fine-tuned generative models: they generalize across phrasing, but only within the concepts their training data actually covered.
