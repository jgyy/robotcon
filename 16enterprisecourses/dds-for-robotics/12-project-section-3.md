# DDS for Robotics — Unit 12: Project - Section 3

The final section evaluates whether an alternative middleware (Zenoh) or enhanced tooling (Vulcanexus) would have avoided the Section 1 problem entirely, and closes the project with a short comparative writeup.

## Re-run the baseline scenario under Zenoh
Take your *original* Section 1 topology (same two hosts/containers, same publisher/subscriber code, same network conditions — do not carry over the Section 2 XML fix) and switch middleware instead of hand-tuning DDS:

```bash
export RMW_IMPLEMENTATION=rmw_zenoh_cpp
```

Start `zenohd` reachable from both hosts, re-run the publisher and subscriber, and capture traffic the same way as before. Record whether discovery and data flow succeed *without* the manual peer-list/QoS fix you had to apply in Section 2.

## Inspect with Vulcanexus tooling
If your environment used Fast DDS at any point, run the same scenario inside a Vulcanexus container and open Fast DDS Monitor while the nodes are running. Use it to visually confirm participant/writer/reader matching, and compare what it shows against your manual Wireshark packet analysis from Section 1/2 — note anywhere the GUI made a fault obvious faster than raw packet inspection did.

## Comparative writeup
Produce a short report (a table is fine) comparing, for your specific network environment:

| Approach | Discovery worked by default? | Manual config needed | Data flowed reliably | Notes |
|---|---|---|---|---|
| Baseline DDS (Section 1) | | | | |
| DDS + XML fix (Section 2) | | | | |
| Zenoh (Section 3) | | | | |

Alongside the table, answer in a few sentences: for *this* topology (two hosts, this network), would you recommend shipping with tuned DDS config or switching to Zenoh, and why? There's no single correct answer — the point is to justify the choice using the evidence you've gathered across all three sections, the same way you would when making this call for a real robot.

## Final project deliverables (all three sections)
1. Baseline capture + report (Section 1).
2. Diagnosis, fix, and fixed-capture (Section 2).
3. Zenoh (and optionally Vulcanexus) comparison capture + comparative report (Section 3).
4. A one-paragraph course-level reflection: which unit's skill (Linux networking, Wireshark, QoS tuning, XML config, or middleware choice) mattered most for solving *your* specific network's problem, and why.

## Try it yourself
After completing the comparison table, pick whichever approach performed worse in your environment and write two sentences on what *additional* configuration (a different XML setting, a different Zenoh router placement) might close the gap — you don't need to implement it, just demonstrate you can reason about the next diagnostic step, which is the core skill this entire course has been building.
