# MujocoLab for Robotics — Unit 3: Terrains

A policy that only ever learns on flat ground is brittle — it hasn't learned to handle a slope, a gap, or an obstacle it never saw. This unit teaches you how MJLab organizes custom scenes so you can go beyond the default flat plane from Unit 2, and how to populate those scenes with static and dynamic objects before generating actual custom terrain geometry.

## Structuring a project for custom scenes
A scene that MJLab can discover and reuse isn't just a script — it's a small package with a predictable layout: a module for your terrain/scene definitions, one for task configs, and an `__init__.py` (or equivalent package metadata) that registers your custom environment under a task name, the same way the built-in `Mjlab-Velocity-G1` task from Unit 2 is registered. A typical layout looks like:

```text
mjlab-basics/
├── src/
│   └── my_scenes/
│       ├── __init__.py        # registers custom tasks with MJLab's registry
│       ├── terrains.py        # terrain/scene definitions
│       └── objects.py         # object/asset definitions
└── pyproject.toml
```

The registration step matters more than it looks: without it, your terrain module is just Python code that happens to import `mjlab` — the training/play scripts from Unit 2 have no way to find a task they don't know exists. Once registration is in place, verify it the same way you verified Unit 2's setup: run play mode against your new task name with the policy you already trained on flat ground.

```bash
uv run python scripts/play.py --task My-Custom-Terrain-Play --checkpoint runs/velocity-g1/last.pt
```

If the robot loads into your new scene and still stands (even if it eventually struggles on uneven ground), your scene registration and the checkpoint-loading path both work — a useful checkpoint before you add anything more complex.

## Populating a scene with objects
Objects come in three flavors of increasing complexity, and MJLab scenes typically support all three:

- **Static primitives** — boxes, spheres, cylinders defined directly in your scene config with a fixed pose. Good for walls, ramps, or fixed obstacles a policy must step around.
- **Dynamic primitives** — the same primitive shapes, but given mass and free joints so physics moves them: they roll, fall, and collide like any other body in the simulation. These are what you'd use for a scene where the robot has to push, avoid, or interact with movable clutter.
- **Mesh-based objects** — arbitrary 3D geometry loaded from a mesh file (e.g. an STL or OBJ) instead of a primitive shape, for objects too irregular to approximate with a box or sphere — a chair, a rock, a piece of debris.

```python
# objects.py — illustrative shape of static vs. dynamic object definitions
static_box = dict(type="box", size=[0.3, 0.3, 0.1], pos=[1.0, 0.0, 0.05])

dynamic_ball = dict(
    type="sphere", size=[0.1], pos=[1.5, 0.0, 0.5],
    free_joint=True, mass=0.5,   # free_joint + mass -> physics moves it
)

mesh_object = dict(type="mesh", mesh_file="assets/crate.obj", pos=[2.0, 0.0, 0.0])
```

The distinction between static and dynamic is the one to internalize: forgetting a free joint on an object you intended to be dynamic is the single most common reason a "physics object" in a new scene just sits there like a static one.

## Generating custom terrain
Beyond discrete objects, MJLab scenes support procedurally generated terrain — height fields or tiled terrain patches (flat, slopes, stairs, stepping stones) assembled algorithmically rather than hand-placed, often with a difficulty parameter so a curriculum can start policies on easy terrain and progress them to harder terrain as training improves. This is the same idea used across most legged-locomotion RL work: train on a *distribution* of terrain difficulty, not one fixed scene, so the resulting policy generalizes instead of memorizing a single ground shape.

A terrain generator is typically configured with a small set of parameters — patch size, number of terrain types, difficulty range — rather than authored mesh-by-mesh, which is what makes it practical to regenerate variations quickly while iterating on a training run.

## Combining custom scenes with motion tracking
The motion-imitation task from Unit 2 assumed flat ground; nothing about it is actually tied to flat ground specifically. Because MJLab scenes and tasks are composed rather than hard-wired together, you can point the same motion-imitation task config at your custom terrain scene instead of the default one — the reward function (tracking error against the reference clip) is unchanged, only the ground under the robot's feet is different. This is a good sanity check that your terrain integrates cleanly: a motion-imitation policy trained on flat ground should still mostly track the reference motion on gently uneven custom terrain, even if less precisely.

## Try it yourself
Build a small scene with three dynamic spheres of different colors, released from slightly different heights above a shallow static-box "pool" (four boxes arranged as walls, no lid). Run play mode with a random policy and confirm two things visually: (1) the spheres fall, bounce, and settle inside the pool rather than passing through the walls, and (2) removing the `free_joint` from one sphere turns it back into an immovable obstacle the others collide against but that never moves itself.
