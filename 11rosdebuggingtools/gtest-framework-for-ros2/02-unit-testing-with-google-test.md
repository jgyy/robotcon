# GTest Framework for ROS2 — Unit 2: Unit Testing with Google Test

This unit gets your hands dirty: setting up a build that produces a testable library, wiring GTest into it through CMake, and writing your first real assertions. Everything here works even on a machine with no robot or simulator attached.

## CMake basics: shared libraries and linking

Before you can unit-test code, the code under test usually needs to live in a library rather than directly inside an executable's `main()` — you cannot easily link a test binary against logic that is trapped inside another executable. The standard pattern is to build your logic as a shared (or static) library and link both your real executable and your test executable against it:

```cmake
add_library(my_robot_core SHARED
  src/path_planner.cpp
  src/kinematics.cpp
)
target_include_directories(my_robot_core PUBLIC include)
ament_target_dependencies(my_robot_core rclcpp)

add_executable(my_robot_node src/main.cpp)
target_link_libraries(my_robot_node my_robot_core)
```

Once `my_robot_core` exists as its own target, a test executable can link against it the same way `my_robot_node` does — that is the whole trick that makes unit testing possible without spinning up ROS.

## Wiring GTest into a ROS2 package

ROS2's build tooling ships `ament_cmake_gtest`, a thin CMake wrapper that finds GTest, builds your test file into an executable, and registers it with `colcon test` / CTest automatically:

```cmake
find_package(ament_cmake_gtest REQUIRED)
ament_add_gtest(test_kinematics test/test_kinematics.cpp)
target_link_libraries(test_kinematics my_robot_core)
```

Declare `ament_cmake_gtest` as a `test_depend` in `package.xml`. With this in place, `colcon build` compiles `test_kinematics` as an ordinary executable, and `colcon test` runs it and captures pass/fail plus a JUnit-style XML report.

## Writing your first test: TEST() and assertions

A minimal GTest file looks like this:

```cpp
#include <gtest/gtest.h>
#include "my_robot_core/kinematics.hpp"

TEST(KinematicsTest, ForwardKinematicsAtZero) {
  Kinematics k;
  auto pose = k.forward({0.0, 0.0, 0.0});
  EXPECT_NEAR(pose.x, 0.0, 1e-6);
  EXPECT_NEAR(pose.y, 0.0, 1e-6);
}

TEST(KinematicsTest, RejectsOutOfRangeJoint) {
  Kinematics k;
  EXPECT_THROW(k.forward({10.0, 0.0, 0.0}), std::out_of_range);
}
```

The key distinction is `EXPECT_*` vs `ASSERT_*`: `EXPECT_EQ`/`EXPECT_NEAR`/`EXPECT_TRUE` record a failure and let the test keep running (useful for checking several independent things in one test), while `ASSERT_*` variants abort the current test immediately on failure (use these when a later check would crash or be meaningless without the earlier condition holding, e.g. `ASSERT_TRUE(ptr != nullptr)` before dereferencing `ptr`). Other common assertions worth knowing: `EXPECT_FLOAT_EQ`/`EXPECT_DOUBLE_EQ` for exact float comparison, `EXPECT_NEAR` for tolerance-based comparison (almost always what you want with robotics math), and `EXPECT_THROW`/`EXPECT_NO_THROW` for exception behavior.

## Test fixtures and running your tests

When multiple tests need the same setup/teardown, use a fixture class derived from `::testing::Test`:

```cpp
class KinematicsTest : public ::testing::Test {
protected:
  void SetUp() override { k_ = std::make_unique<Kinematics>(); }
  std::unique_ptr<Kinematics> k_;
};

TEST_F(KinematicsTest, HandlesZeroJoints) {
  EXPECT_TRUE(k_->forward({0, 0, 0}).is_valid());
}
```

`SetUp()`/`TearDown()` run before/after every `TEST_F` in that fixture, so shared state never leaks between tests. Build and run with the same loop from Unit 1:

```bash
colcon build --packages-select my_robot_pkg
colcon test --packages-select my_robot_pkg
colcon test-result --verbose
```

You can also run the compiled test binary directly for faster iteration and to filter by name: `./build/my_robot_pkg/test_kinematics --gtest_filter=KinematicsTest.RejectsOutOfRangeJoint`.

## Try it yourself

Take any small piece of pure logic you have (or invent one, e.g. a function that clamps a velocity command to a max speed). Put it in a library target, add an `ament_add_gtest` test target, and write at least three tests: one normal case, one boundary case (exactly at the limit), and one that should throw or reject invalid input. Run it through `colcon test` and confirm all three show up in `colcon test-result --verbose`.
