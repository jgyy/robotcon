# 11 ROS Debugging Tools

## Why this matters
A robot doesn't throw a clean stack trace when it fails — a topic silently stops publishing, two nodes agree on a topic name but never exchange a single message because their QoS settings don't match, or a controller node segfaults twenty minutes into a run with no obvious trigger. General-purpose programming debuggers only get you partway, because a ROS 2 system is a graph of separate processes talking over DDS, so the failure is often in the wiring between nodes rather than in any single node's code. This file is the reference for the introspection, logging, recording, and low-level debugging tools that let you find out what a running robot is actually doing, plus a catalog of the failure patterns you'll hit repeatedly so you recognize them fast instead of re-deriving the diagnosis each time.

## Core concepts
- **CLI introspection** — `ros2 node/topic/service/action list|info|echo`, the first thing to run when something seems wrong; tells you what's actually alive and talking.
- **rqt_graph** — live visualization of the node/topic/service graph; the fastest way to spot a missing connection or a topic name typo.
- **rqt_console / rqt_logger_level** — GUI log viewer with filtering, and a way to change a running node's log verbosity without restarting it.
- **Logging levels** — DEBUG/INFO/WARN/ERROR/FATAL, per-logger severity control, and the discipline of using the right level so `ros2 doctor` and log filtering are actually useful later.
- **ros2 doctor** — a built-in health check that flags common misconfigurations (missing dependencies, network setup, QoS incompatibilities) in one command.
- **rviz2 for debugging** — not just visualization: watching TF frames, markers, point clouds, and costmaps update (or fail to) is often the quickest way to see *where* a pipeline breaks.
- **ros2 bag record/replay** — capturing topic data to disk so you can replay a failure offline, deterministically, as many times as needed instead of chasing a live robot.
- **QoS introspection and mismatches** — `ros2 topic info --verbose` shows publisher/subscriber QoS profiles side by side; reliability, durability, and history settings that don't match silently drop all communication.
- **TF tree debugging** — `tf2_echo`, `view_frames` (or the current distro's equivalent), and `tf2_monitor` for finding missing, duplicate, or disconnected frames and excessive transform latency.
- **gdb for C++ node crashes** — attaching to or launching a node under gdb (`ros2 run <pkg> <exe> --prefix 'gdb -ex run --args'`), reading a backtrace, and why you need a debug build (`-DCMAKE_BUILD_TYPE=Debug` or `RelWithDebInfo`) for the symbols to mean anything.
- **valgrind / memcheck** — catching memory leaks, use-after-free, and uninitialized reads in C++ nodes, at the cost of running much slower than real time.
- **Sanitizers (ASan/UBSan/TSan)** — compiler-instrumented builds that catch memory errors, undefined behavior, and data races much faster than valgrind, at the cost of a separate build.
- **ros2_tracing / tracetools** — LTTng-based low-overhead tracing built into ROS 2 for capturing callback timing, message latency, and scheduling behavior across the whole system.
- **Component/lifecycle introspection** — `ros2 component list`, `ros2 lifecycle get/list`, useful when nodes are loaded into a shared container process or stuck in an unexpected lifecycle state.
- **Common failure pattern catalog** — recognizing "topic not publishing," "node crashed silently," "TF tree broken," and "QoS mismatch" as named categories, each with its own diagnostic path (see below).

## Common failure patterns and how to diagnose each
- **Topic not publishing / no data received** — confirm the publisher node is actually running (`ros2 node list`), confirm the topic exists and has a publisher (`ros2 topic info <topic>`, `ros2 topic hz <topic>`), then check QoS compatibility before assuming the publisher is broken.
- **Node crash / silent death** — check `ros2 node list` to confirm it's really gone, check the terminal/log output for the last message before the crash, rerun under gdb with a debug build to get a backtrace, and check `dmesg`/`journalctl` if it looks like an OOM kill rather than a segfault.
- **TF tree errors** — "frame does not exist," "lookup would require extrapolation," or a broken tree usually means a missing static/dynamic transform publisher, a typo in a frame_id, or two disconnected trees; `view_frames` gives you a picture of the whole tree at once.
- **QoS mismatches** — publisher and subscriber both exist, the graph looks connected in rqt_graph, but no messages arrive; almost always a reliability/durability/history mismatch, visible in `ros2 topic info --verbose` and often flagged directly by `ros2 doctor`.
- **Node alive but not doing anything useful** — check whether it's stuck in the wrong lifecycle state (for lifecycle nodes), blocked on a service/action call that never returns, or spinning without ever entering its callback (executor/spin setup issue).
- **Intermittent / timing-dependent bugs** — reproduce deterministically with a recorded `ros2 bag`, and reach for `ros2_tracing` or a sanitizer build (TSan for suspected races) instead of guessing from print statements.

## Resources
- docs.ros.org — official ROS 2 documentation; see the Concepts pages on logging and Quality of Service, and the Tutorials sections on CLI tools, `ros2 doctor`, `ros2 bag`, and TF2.
- ROS 2 design docs at design.ros2.org — background on why QoS and DDS work the way they do, useful when a mismatch doesn't make sense at first glance.
- REP-2003 and the ROS 2 Quality of Service policies documentation (linked from docs.ros.org) for the exact meaning of each QoS setting.
- ros2/ros2_tracing on GitHub, and the ros2_tracing documentation site, for setting up LTTng-based tracing of ROS 2 nodes.
- Eclipse Trace Compass — the standard tool for visualizing LTTng traces produced by ros2_tracing.
- Valgrind User Manual (valgrind.org) — memcheck usage and output interpretation.
- GDB documentation (sourceware.org/gdb) — backtraces, breakpoints, and core dump analysis.
- Google Sanitizers project on GitHub (AddressSanitizer, UndefinedBehaviorSanitizer, ThreadSanitizer) for build flags and output interpretation.
- Foxglove Studio and the Foxglove blog/docs (foxglove.dev) — an actively maintained alternative visualizer for inspecting live ROS 2 data and recorded bags side by side.
- Linux `perf` and flamegraph tooling for general CPU profiling of a node outside of ROS-specific tracing, when you suspect a hot loop rather than a scheduling/latency issue.

## Hands-on checkpoints
- [ ] Bring up a small multi-node demo (e.g. talker/listener or a simple sensor+processor pair) and use `ros2 node`, `ros2 topic`, and `ros2 doctor` to map out the running system before opening any GUI tool.
- [ ] Open `rqt_graph` on that system, then kill or rename a topic and confirm you can spot the break in the graph within seconds.
- [ ] Record a `ros2 bag` of a live topic set, then replay it and verify a subscriber behaves identically against the recording as it did against the live source.
- [ ] Deliberately create a QoS mismatch (e.g. reliable publisher vs. best-effort subscriber with incompatible durability) and diagnose it purely from `ros2 topic info --verbose` output.
- [ ] Write a C++ node with an intentional bug (null dereference or out-of-bounds access), build it with debug symbols, crash it, and get a readable backtrace from gdb pointing at the exact line.
- [ ] Take that same node, build it with AddressSanitizer enabled (or run it under valgrind --tool=memcheck), and find an injected memory leak or use-after-free.
- [ ] Break a TF tree on purpose (stop a transform publisher, or introduce a duplicate frame_id) and diagnose it using `tf2_echo`, a frame-tree viewer, and rviz2, without looking at the source code first.
- [ ] Capture an ros2_tracing trace of a small pipeline under load and use it (with Trace Compass or another viewer) to identify which node or callback is the actual latency bottleneck.
