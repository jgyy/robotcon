# Advanced Modern C++ for Robotics

C++ is the language most industrial and research robots actually run on, and ROS 2's core client library (`rclcpp`) is written and used idiomatically in modern C++. This course goes beyond basic syntax into the features that matter for real robotics code: the build toolchain that turns source into a linkable library, the STL containers and iterators that replace hand-rolled data structures, classes and object-oriented design for modeling sensors and actuators, precise pointer/reference/smart-pointer semantics for safe memory management, templates and lambdas for generic and callback-driven code, threads for concurrent sensor and control loops, and exception handling for the messy failure modes of physical hardware.

1. [Build Tools](01-build-tools.md) — Compilers, compilation flags, libraries, linking, and CMake, from source file to ROS 2-ready library.
2. [The STL Library](02-the-stl-library.md) — Sequence and associative containers, and the iterators that let algorithms work across all of them.
3. [Classes and Objects](03-classes-and-objects.md) — Access specifiers, constructors/destructors, static and const members, copy vs. move semantics.
4. [Object Oriented Programming (OOP)](04-object-oriented-programming-oop.md) — Composition, inheritance, overriding vs. overloading, abstract classes, and polymorphism.
5. [Pointers and References](05-pointers-and-references.md) — Raw pointers, const-correctness, references, and smart pointers as used throughout ROS 2.
6. [Templates and Lambda expressions](06-templates-and-lambda-expressions.md) — Function and class templates, specialization, and lambda captures for generic, reusable code.
7. [Concurrency (threads in C++)](07-concurrency-threads-in-cpp.md) — std::thread, mutexes and condition variables, task-based concurrency, and how ROS 2 executors run callbacks.
8. [Exception handling](08-exception-handling.md) — Throwing and catching exceptions, custom exception hierarchies, and the std::exception class tree.
