# Advanced Modern C++ for Robotics — Unit 1: Build Tools

Before you can write serious C++ for a robot, you need to understand what actually happens between saving a `.cpp` file and having an executable (or a library) that ROS 2 can load. This unit demystifies the toolchain so that CMake errors and linker failures stop feeling like magic.

## Compilers and the compilation pipeline
A compiler (GCC, Clang, MSVC) translates C++ source into machine code. But "compiling" a single translation unit is really four separate stages: preprocessing, compilation proper, assembly, and linking. You can see each stage explicitly with Clang or GCC:

```bash
clang++ -E main.cpp -o main.i      # 1. Preprocessing: expand #include, #define, macros
clang++ -S main.i -o main.s        # 2. Compilation: source -> assembly
clang++ -c main.s -o main.o        # 3. Assembly: assembly -> object code (machine code, unlinked)
clang++ main.o -o main             # 4. Linking: resolve symbols, produce an executable
```
Normally `clang++ main.cpp -o main` does all four steps for you. Knowing they exist matters the moment something goes wrong — a "preprocessor" bug (missing header) looks completely different from a "linker" bug (undefined reference).

## Compilation flags
Flags change what the compiler does at each stage without changing your source. The ones you will use constantly in robotics code:

- `-Wall -Wextra` — enable warnings; treat every warning as a bug report from the compiler.
- `-std=c++17` (or `c++20`) — pick the language standard; ROS 2 code commonly targets C++17.
- `-O0` / `-O2` / `-O3` — optimization level; use `-O0` with `-g` while debugging, `-O2`/`-O3` for release builds.
- `-g` — embed debug symbols so `gdb`/`lldb` can map machine code back to source lines.
- `-I<path>` — add a directory to the header search path.
- `-fsanitize=address,undefined` — catch memory corruption and undefined behavior at runtime; invaluable in a language with manual memory management.

```bash
clang++ -std=c++17 -Wall -Wextra -O0 -g -fsanitize=address main.cpp -o main
```

## Libraries and linking
A library is compiled code packaged for reuse instead of recompiling from source every time. **Static libraries** (`.a`) are copied directly into your executable at link time; **shared/dynamic libraries** (`.so`) are loaded at runtime and can be shared across processes. ROS 2 packages are almost always built and consumed as shared libraries.

```bash
# Build a static library from two object files
ar rcs libmath.a add.o sub.o

# Build a shared library
clang++ -shared -fPIC add.cpp sub.cpp -o libmath.so

# Link an executable against it
clang++ main.cpp -L. -lmath -o main
```
Linking is the stage where the linker matches every function/symbol your code *calls* against a symbol some object file or library *defines*. "Undefined reference to `foo()`" means the linker searched everywhere you told it to (`-L`, `-l`) and never found a definition of `foo`.

## Build systems: CMake and using your library with ROS 2
Typing compiler invocations by hand doesn't scale past one file. A build system (CMake, Bazel, Meson) describes *what* to build declaratively and generates the actual build commands. CMake is the de-facto standard for ROS 2 packages (`ament_cmake`).

```cmake
cmake_minimum_required(VERSION 3.8)
project(my_robot_lib)

add_library(my_robot_lib src/kinematics.cpp)
target_include_directories(my_robot_lib PUBLIC include)

add_executable(my_node src/main.cpp)
target_link_libraries(my_node my_robot_lib)
```
In a ROS 2 package, `find_package(ament_cmake REQUIRED)`, `ament_target_dependencies(...)`, and `install(TARGETS ...)` wire your library into the ROS 2 build graph (`colcon build`) so other packages can `find_package(my_robot_lib)` and link against it too.

## Try it yourself
Write a two-file "distance calculator" (`distance.cpp`/`.hpp` with a `double euclidean(double,double,double,double)` function and a `main.cpp` that calls it). Build it three ways: (1) a single `clang++` command, (2) manually as a static library linked into `main`, (3) via a minimal `CMakeLists.txt` with `add_library` + `add_executable`. Confirm all three produce the same output.
