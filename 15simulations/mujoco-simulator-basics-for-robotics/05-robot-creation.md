# MuJoCo Simulator Basics for Robotics — Unit 5: Robot Creation

This unit assembles the primitives from Unit 4 into an actual articulated robot, adds actuators so it can be driven rather than just falling under gravity, and places it inside the scene built in Unit 3.

## From Scene to Robot
The clean way to organize a project is to keep the robot's kinematic description in its own file and pull it into a scene with `<include>`, rather than writing one monolithic XML:

```xml
<!-- robot.xml -->
<mujoco model="my_robot">
  <worldbody>
    <body name="base" pos="0 0 0.1">
      <joint type="free"/>
      <geom type="box" size="0.15 0.1 0.05" mass="2"/>
      <body name="arm" pos="0 0 0.05">
        <joint name="shoulder" type="hinge" axis="0 1 0" range="-90 90"/>
        <geom type="capsule" size="0.03 0.15"/>
      </body>
    </body>
  </worldbody>
</mujoco>
```

```xml
<!-- scene.xml -->
<mujoco model="world">
  <include file="robot.xml"/>
  <worldbody>
    <light pos="0 0 3"/>
    <geom name="floor" type="plane" size="5 5 0.1"/>
  </worldbody>
</mujoco>
```

Splitting files this way means the same `robot.xml` can be reused across multiple scenes without duplication — exactly the workflow used by public robot-model collections such as the MuJoCo Menagerie.

## Defining Actuators
A joint with no actuator can still move (pushed by gravity, contact, or your own perturbation), but it cannot be *commanded*. Actuators live in a top-level `<actuator>` block and reference joints by name:

```xml
<actuator>
  <motor name="shoulder_motor" joint="shoulder" gear="1" ctrlrange="-1 1"/>
</actuator>
```

MuJoCo offers several actuator models beyond raw `motor` (direct torque): `position` and `velocity` actuators add built-in PD-style feedback so you command a target angle or speed instead of a raw torque, which is usually easier to work with when you are not yet writing your own controller. Once actuators exist, `data.ctrl[i]` becomes your interface for driving the robot from Python — this is the array you write to in Unit 6's control loop.

## Using MJCF `<default>` Classes
Real robots have many joints and geoms sharing similar properties (the same damping, the same collision settings), and repeating attributes on every element is error-prone. `<default>` classes let you set them once:

```xml
<default>
  <default class="robot_joint">
    <joint damping="0.2" frictionloss="0.01"/>
  </default>
  <default class="robot_geom">
    <geom contype="1" conaffinity="0" density="1000"/>
  </default>
</default>
```

Then every `<joint class="robot_joint" .../>` and `<geom class="robot_geom" .../>` inherits those defaults, and changing one line in the `<default>` block updates the whole robot at once — the same reasoning you'd apply to a shared config or base class in software.

## Testing Your Robot in the Scene
Load the combined `scene.xml` in the viewer and use perturbation (Unit 2) to confirm joints move within their expected ranges, then drive `data.ctrl` from a short Python script to confirm actuators respond as intended before adding any real control logic.

## Try it yourself
Turn the two-link pendulum from Unit 4 into a small "robot arm": add a `motor` actuator to each hinge joint, wrap the joints and geoms in `<default>` classes for shared damping and collision settings, and write a five-line Python script that sets `data.ctrl` to hold the arm level against gravity.
