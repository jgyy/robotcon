# Python 3 for Robotics — Unit 5: Python Classes & OOP

Once a robot program has more than a couple of related pieces of state and behavior — position, battery level, a list of sensors, methods to move and stop — plain variables and functions stop scaling. Classes let you bundle state and behavior together, which is also exactly the pattern ROS 2 itself uses for every node you'll write.

## Classes and objects

A class is a blueprint; an object (instance) is a concrete thing built from that blueprint. `__init__` runs when an object is created and sets up its initial state (`self` refers to the instance being built):

```python
class Robot:
    def __init__(self, name, battery_percent=100):
        self.name = name
        self.battery_percent = battery_percent
        self.is_moving = False

    def move(self):
        self.is_moving = True
        self.battery_percent -= 1
        print(f"{self.name} moving, battery at {self.battery_percent}%")

    def stop(self):
        self.is_moving = False
        print(f"{self.name} stopped")

spot = Robot("spot-01")
spot.move()
spot.stop()
```

Every method takes `self` as its first parameter so it can read and modify that particular instance's data — two `Robot` objects each keep their own independent `battery_percent`.

## Encapsulation

Python doesn't enforce private attributes the way C++ does, but it has conventions: a single leading underscore (`self._internal`) signals "internal, don't touch from outside," and the `@property` decorator lets you expose a method as if it were a plain attribute, useful for computed or validated values:

```python
class Joint:
    def __init__(self, angle_limit_rad):
        self._angle_limit_rad = angle_limit_rad
        self._angle_rad = 0.0

    @property
    def angle_rad(self):
        return self._angle_rad

    @angle_rad.setter
    def angle_rad(self, value):
        if abs(value) > self._angle_limit_rad:
            raise ValueError("angle exceeds joint limit")
        self._angle_rad = value

shoulder = Joint(angle_limit_rad=1.57)
shoulder.angle_rad = 1.0     # goes through the setter's validation
```

This is the Pythonic middle ground between "everything public" and full C++-style access control: the safety check runs automatically, but callers still use plain attribute syntax.

## Inheritance and composition

Inheritance lets a subclass reuse and specialize a parent class's behavior — useful when several sensor types share a common interface:

```python
class Sensor:
    def __init__(self, name):
        self.name = name

    def read(self):
        raise NotImplementedError("subclasses must implement read()")

class LidarSensor(Sensor):
    def read(self):
        return {"ranges": [1.2, 0.9, 3.0]}

class CameraSensor(Sensor):
    def read(self):
        return {"image_shape": (480, 640, 3)}
```

Composition — giving a class an instance of another class as an attribute, rather than inheriting from it — is often the better tool when the relationship is "has a" rather than "is a":

```python
class RobotBase:
    def __init__(self, name):
        self.name = name
        self.lidar = LidarSensor("front_lidar")
        self.camera = CameraSensor("head_camera")
```

A common guideline: prefer composition unless there's a genuine "is a kind of" relationship and you want the subclass to be usable wherever the parent is expected.

## Why this matters for ROS 2

Every ROS 2 Python node you write subclasses `rclpy.node.Node`:

```python
from rclpy.node import Node

class MyRobotNode(Node):
    def __init__(self):
        super().__init__('my_robot_node')
```

`super().__init__(...)` calls the parent class's constructor — exactly the inheritance mechanic covered above. Everything in this unit — `__init__`, instance attributes, methods, inheritance — is the exact vocabulary you'll be reading and writing the moment you open your first ROS 2 node.

## Try it yourself

Design a small class hierarchy: a base class `Actuator` with a `name` attribute and a `command(value)` method that raises `NotImplementedError`, and two subclasses `Motor` and `Gripper` that each implement `command()` differently (e.g., `Motor` stores a speed, `Gripper` stores an open/closed state). Create one instance of each, store them in a list, and loop over the list calling `command()` on every one — this is the polymorphism pattern you'll use constantly once you're managing multiple ROS 2 publishers or subscribers of different types.
