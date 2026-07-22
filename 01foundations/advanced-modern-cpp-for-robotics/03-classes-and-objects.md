# Advanced Modern C++ for Robotics — Unit 3: Classes and Objects

Almost every ROS 2 node you write will be a class. This unit covers the mechanics of C++ classes in depth — the parts that Python's classes hide from you (explicit construction/destruction order, `const` correctness, ownership semantics) but that matter enormously when you're managing hardware resources like sensors and actuators.

## Structures, classes, and access specifiers
`struct` and `class` are identical in C++ except for default access: `struct` members are `public` by default, `class` members are `private`. Convention: use `struct` for plain data bundles, `class` when you have invariants to protect.

```cpp
struct Pose2D {          // plain data, public by default
    double x, y, theta;
};

class DifferentialDriveRobot {
public:
    void setVelocity(double linear, double angular);
private:
    double linear_velocity_{0.0};   // hidden implementation detail
    double angular_velocity_{0.0};
};
```
`public`, `protected`, and `private` control which code can touch a member: `public` is the class's contract with the outside world, `private` is implementation detail, `protected` extends access to derived classes (see Unit 4).

## Member initialization, constructors, and destructors
A constructor runs when an object is created; a destructor runs when it is destroyed. Prefer the **member initializer list** over assigning inside the constructor body — it initializes members directly instead of default-constructing then reassigning, and it's the only way to initialize `const` members or references.

```cpp
class LidarDriver {
public:
    LidarDriver(std::string port, int baud_rate)
        : port_(std::move(port)), baud_rate_(baud_rate) {   // initializer list
        openConnection();
    }
    ~LidarDriver() { closeConnection(); }   // guarantees cleanup, even on exceptions
private:
    std::string port_;
    int baud_rate_;
};
```
This pattern — acquire a resource in the constructor, release it in the destructor — is RAII (Resource Acquisition Is Initialization), the backbone of safe C++ resource management and the reason smart pointers (Unit 5) work.

## Static members and const member functions
A `static` member belongs to the class itself, not to any one instance — every object shares the same storage. `static` is how you'd implement, say, a shared counter of active sensor connections. A `const` member function promises not to modify the object's observable state, which lets you call it on `const` references/objects and communicates intent to other engineers.

```cpp
class RobotFleet {
public:
    RobotFleet() { ++active_count_; }
    ~RobotFleet() { --active_count_; }
    static int activeCount() { return active_count_; }   // no `this` object needed

    double batteryLevel() const { return battery_level_; }  // read-only, safe on const refs
private:
    static int active_count_;
    double battery_level_{100.0};
};
int RobotFleet::active_count_ = 0;   // static members need an out-of-class definition
```
Related: the implicit `this` pointer inside a non-static member function points at the current object; `const` member functions are really `const this` — the compiler treats every member access as read-only.

## Copy construction, move semantics, and defaulted functions
Every class gets a compiler-generated copy constructor, copy assignment, move constructor, move assignment, and destructor ("the special member functions") unless you define your own — the *Rule of Zero/Three/Five*. **Move semantics** let a class transfer ownership of a resource (e.g. a buffer, a socket handle) instead of deep-copying it, which is essential when passing heavy sensor data (point clouds, images) around efficiently.

```cpp
class PointCloudBuffer {
public:
    PointCloudBuffer(const PointCloudBuffer&) = delete;              // disallow expensive/unsafe copies
    PointCloudBuffer(PointCloudBuffer&& other) noexcept
        : data_(std::exchange(other.data_, nullptr)) {}              // steal the pointer, null the source
    PointCloudBuffer() = default;                                    // ask compiler for the trivial default
private:
    float* data_ = nullptr;
};
```
Delegating constructors (one constructor calling another via `: ClassName(args)`) let you centralize common setup logic instead of duplicating it across overloads.

## Try it yourself
Write a `SensorLog` class that owns a `std::vector<double>` of readings, has a deleted copy constructor, an explicit move constructor, an `addReading(double)` method, and a `const` `average()` method. Verify in `main()` that `std::move`-ing a `SensorLog` into a new variable empties the original but the new one has all the data.
