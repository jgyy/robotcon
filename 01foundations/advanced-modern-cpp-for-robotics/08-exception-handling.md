# Advanced Modern C++ for Robotics — Unit 8: Exception handling

Robots interact with the physical world, which fails in ways your code must handle gracefully: a serial port disconnects, a config file is malformed, a planner is asked for an unreachable pose. This unit covers C++ exceptions — how to raise them, catch them, and design your own — as the mechanism for separating error-handling code from the normal control flow.

## Throwing exceptions and basic try/catch
`throw` raises an exception of any type (though in practice you should throw objects derived from `std::exception`); a `try`/`catch` block catches it, unwinding the stack and running destructors along the way (which is exactly why RAII from Unit 3 matters — resources get cleaned up automatically even mid-throw).

```cpp
#include <stdexcept>

double computeInverseKinematics(double reach) {
    if (reach > MAX_ARM_LENGTH) {
        throw std::out_of_range("target pose is outside the arm's workspace");
    }
    return solveIK(reach);
}

try {
    double angle = computeInverseKinematics(2.5);
} catch (const std::out_of_range& e) {
    std::cerr << "IK failed: " << e.what() << "\n";
}
```
Always catch by `const&` — catching by value slices derived exception types down to the base, and copies unnecessarily.

## Handling multiple exceptions
A single `try` block can have several `catch` clauses; the first matching type (checked top to bottom) handles it. Order matters: put more-derived types before more-general ones, since a `catch (const std::exception&)` would otherwise swallow everything below it.

```cpp
try {
    openSerialPort("/dev/ttyUSB0");
} catch (const std::invalid_argument& e) {
    std::cerr << "bad port name: " << e.what() << "\n";
} catch (const std::system_error& e) {
    std::cerr << "OS-level failure: " << e.what() << "\n";
} catch (const std::exception& e) {
    std::cerr << "unexpected error: " << e.what() << "\n";
} catch (...) {
    std::cerr << "unknown exception type\n";   // catches literally anything, last resort
}
```

## User-defined exception classes and class-level handling
Deriving your own exception type from `std::exception` (or a more specific standard type like `std::runtime_error`) lets callers catch precisely the failure category they care about, and lets you attach robot-specific context.

```cpp
class SensorTimeoutException : public std::runtime_error {
public:
    explicit SensorTimeoutException(const std::string& sensor_name)
        : std::runtime_error("timeout waiting for sensor: " + sensor_name) {}
};

void LidarDriver::read() {
    if (timedOut()) {
        throw SensorTimeoutException("front_lidar");
    }
}
```
A class can also handle exceptions internally — e.g. a driver's `read()` might catch a low-level I/O exception, log it, and rethrow a higher-level `SensorTimeoutException` instead, so callers never need to know about the underlying transport.

## The std::exception class hierarchy
The standard library organizes its exceptions into a hierarchy rooted at `std::exception`, which declares a single virtual `const char* what() const noexcept` method. The two main branches are `std::logic_error` (bugs detectable before runtime — `std::out_of_range`, `std::invalid_argument`, `std::domain_error`) and `std::runtime_error` (conditions only detectable while running — `std::overflow_error`, `std::system_error`). Deriving your own exceptions from the branch that best matches the failure's nature lets generic `catch (const std::exception&)` handlers still work, while specific handlers can target exactly your type.

```cpp
try {
    robot.move(target);
} catch (const std::exception& e) {   // catches std + your own derived exceptions alike
    std::cerr << "move failed: " << e.what() << "\n";
}
```

## Try it yourself
Define a `NavigationException` (derived from `std::runtime_error`) and a more specific `GoalUnreachableException` (derived from `NavigationException`). Write a function `planPath(double distance)` that throws `GoalUnreachableException` if `distance > 100.0`, otherwise a plain `NavigationException` if `distance < 0`. Call it with three different inputs inside try/catch blocks ordered from most- to least-specific, and confirm each takes the right branch.
