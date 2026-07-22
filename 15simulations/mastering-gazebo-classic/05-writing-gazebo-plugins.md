# Mastering Gazebo Classic — Unit 5: Writing Gazebo Plugins

Every ROS plugin you attached in Unit 3 is just C++ compiled against Gazebo's plugin API. This unit pulls back the curtain and has you write two plugin types from scratch — one that acts on the world, one that acts on a single model — without relying on `gazebo_ros_pkgs` at all.

## Preparing the Environment

Gazebo plugins are ordinary shared libraries (`.so`) that Gazebo `dlopen`s at load time and calls into through a small set of well-known entry points. You need Gazebo's development headers and its pkg-config metadata, then a minimal CMake project:

```bash
sudo apt install libgazebo-dev   # or the matching -dev package for your Gazebo version
pkg-config --cflags gazebo       # confirm include paths resolve
```

```cmake
cmake_minimum_required(VERSION 3.10)
project(my_gazebo_plugins)
find_package(gazebo REQUIRED)
include_directories(${GAZEBO_INCLUDE_DIRS})
link_directories(${GAZEBO_LIBRARY_DIRS})
add_library(world_plugin SHARED src/world_plugin.cc)
target_link_libraries(world_plugin ${GAZEBO_LIBRARIES})
```

Build it, then point `GAZEBO_PLUGIN_PATH` (Unit 1) at the resulting `build/` directory so a world file can find it by name.

## World Plugin

A `WorldPlugin` subclass gets a handle to the entire world and a `Load()` hook called once at startup — the natural place to register a periodic callback via Gazebo's event system:

```cpp
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>

namespace gazebo {
class MyWorldPlugin : public WorldPlugin {
public:
  void Load(physics::WorldPtr world, sdf::ElementPtr /*sdf*/) override {
    this->world = world;
    this->updateConn = event::Events::ConnectWorldUpdateBegin(
        std::bind(&MyWorldPlugin::OnUpdate, this));
  }
  void OnUpdate() {
    // runs once per physics step, e.g. log sim time or spawn objects
    gzdbg << "sim time: " << this->world->SimTime().Double() << "\n";
  }
private:
  physics::WorldPtr world;
  event::ConnectionPtr updateConn;
};
GZ_REGISTER_WORLD_PLUGIN(MyWorldPlugin)
}
```

`GZ_REGISTER_WORLD_PLUGIN` is the macro that tells Gazebo's loader which class to instantiate. Attach it in a world file with `<plugin name="my_world_plugin" filename="libworld_plugin.so"/>` directly under `<world>`.

## Model Plugin

A `ModelPlugin` is scoped to one model instance and is the workhorse for custom robot behavior that doesn't fit the stock ROS plugins — the Final Project's dynamic obstacle in Unit 6 is exactly this pattern:

```cpp
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>

namespace gazebo {
class MyModelPlugin : public ModelPlugin {
public:
  void Load(physics::ModelPtr model, sdf::ElementPtr /*sdf*/) override {
    this->model = model;
    this->updateConn = event::Events::ConnectWorldUpdateBegin(
        std::bind(&MyModelPlugin::OnUpdate, this));
  }
  void OnUpdate() {
    // e.g. oscillate the model back and forth along X
    double t = this->model->GetWorld()->SimTime().Double();
    this->model->SetLinearVel(ignition::math::Vector3d(std::sin(t), 0, 0));
  }
private:
  physics::ModelPtr model;
  event::ConnectionPtr updateConn;
};
GZ_REGISTER_MODEL_PLUGIN(MyModelPlugin)
}
```

Attach it inside the specific model's SDF: `<plugin name="my_model_plugin" filename="libmy_model_plugin.so"/>` under `<model>`. If you need this plugin to also publish or subscribe to ROS topics, include `<gazebo_ros/node.hpp>` and construct a `gazebo_ros::Node` inside `Load()` — everything downstream (publishers, subscribers, parameters) then works exactly like a normal ROS node.

## Try it yourself

Write a `ModelPlugin` that logs a warning via `gzwarn` whenever the model's Z position drops below a threshold you choose — a minimal "did it fall off the table" watchdog — attach it to a box model, and confirm the message appears in the `gzserver` terminal output when you nudge the box off an edge.
