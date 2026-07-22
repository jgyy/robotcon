# ROS Basics in 5 Days (C++) — Unit 2: ROS Deconstruction

Before writing any node, it helps to pull ROS apart into its four layers so that when something goes wrong later you know *which layer* to go looking in. This unit builds that mental map; Units 3 onward fill in the details of each piece.

## Layer 1: the computation graph
The computation graph is the live, running system: a set of **nodes** (processes) exchanging data over **topics** (streaming pub/sub), **services** (request/response), and **actions** (long-running goals), plus a mechanism for **parameters** (per-node or global configuration values). This is the layer you reason about when you ask "what is my robot doing right now" — and it's entirely separate from the code on disk that produced it. Two different pieces of source code can produce the same graph shape, and the same source code can produce different graphs depending on remapping and launch configuration.

## Layer 2: the tooling layer
On top of the graph sits a set of command-line and GUI tools that let you inspect it without reading source: node/topic/service/param listing commands, message echoing, a graph visualizer, a plotting tool, and a 3D visualizer (RViz) for anything spatial. You'll use these constantly starting in Unit 3 — a large fraction of "ROS debugging skill" is really just fluency with this tool layer, which is why Unit 11 is dedicated to it.

## Layer 3: the filesystem layer
On disk, ROS code lives in **packages** — self-contained units with a manifest file (`package.xml`) declaring dependencies and a build description (`CMakeLists.txt` for C++). Packages live inside a **workspace**, a directory tree that your build tool (`catkin` or `colcon`) compiles as a unit and that you "source" to make its packages runnable. A typical package for this course looks like:

```
my_package/
├── CMakeLists.txt
├── package.xml
├── include/my_package/
├── src/
│   └── my_node.cpp
├── msg/            # optional: custom message definitions
└── launch/         # optional: launch files
```

## Layer 4: documentation and conventions
ROS documentation (docs.ros.org) is organized around this same graph/tooling/filesystem split, plus per-package reference pages. Package-level docs generally answer "what topics/services/params does this node expose," which is exactly the interface you need to use it — you rarely need to read a package's C++ source to use it, only its declared interface.

## Try it yourself
Pick any package already installed on your system (or the demo package from Unit 1) and inspect it from all four layers: find its `package.xml` and `CMakeLists.txt` on disk, list the nodes it provides via the CLI, run one and list the topics/services it creates, and note what you'd have to read to understand its interface without opening its `.cpp` files.
