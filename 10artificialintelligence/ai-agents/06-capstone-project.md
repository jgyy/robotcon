# AI Agents — Unit 6: Capstone Project

This unit ties together perception (Unit 3), navigation (Unit 4), and multi-agent coordination (Unit 5) into one system: a lidar-equipped agent that follows language instructions and leads a small multi-agent team. The goal is integration, not new concepts — every building block here was covered in an earlier unit.

## System architecture
The capstone is one lead agent plus two or more follower agents, structured as a leader-follower topology (Unit 5). The lead agent is the only one that talks to the language interface and the only one that plans a global path; followers track the leader's published trajectory and handle their own local obstacle avoidance.

```
[language instruction] -> [lead agent: instruction_to_goal] -> [goal]
                                    |
                          [lead agent: navigation loop] --publishes--> /team/waypoint
                                    |                                        |
                          [lidar perception]                        [follower agents]
                                    |                                        |
                            re-plan on obstacle                    track waypoint, avoid locally
```

Reuse the functions you already wrote rather than rewriting them: `instruction_to_goal_safe` (Unit 4) for parsing the instruction, `cluster_obstacles` (Unit 3) for lidar perception, and `try_claim`/topic-based publishing (Unit 5) for team coordination.

## Building the lead agent
The lead agent's loop composes the pieces from earlier units in order: perceive, check for a re-plan condition, publish state for followers, act.

```python
def lead_agent_step(instruction, known_locations, nav_client, lidar_points, publisher, client):
    goal_result = instruction_to_goal_safe(instruction, known_locations, client)
    if goal_result["status"] == "clarify":
        return goal_result  # surface to a human operator instead of guessing

    obstacles = cluster_obstacles(lidar_points)
    state = {"nearest_obstacle_m": obstacles["nearest_obstacle_m"]}
    status = navigation_agent(state, goal_result["goal"], nav_client)

    publisher.publish(json.dumps({
        "leader_position": nav_client.current_position(),
        "goal": goal_result["goal"],
        "status": status,
    }))
    return {"status": status}
```

Note what's deliberately *not* delegated to the LLM: obstacle detection and the stop/replan decision are still handled by fast, deterministic code (Units 3-4's pattern), consistent with keeping the language model out of the tight real-time loop.

## Building the follower agents
Followers subscribe to the leader's published state and run their own local step: move toward the leader's last-known trajectory point while avoiding whatever their own sensors detect.

```python
def follower_agent_step(leader_state: dict, own_lidar_points, motion_client):
    own_obstacles = cluster_obstacles(own_lidar_points)
    if own_obstacles["nearest_obstacle_m"] < 0.3:
        motion_client.stop()
        return "avoiding_local_obstacle"
    motion_client.move_toward(*leader_state["leader_position"])
    return "following"
```

This keeps followers simple and robust: they never call an LLM, never plan a global path, and fail safely (stop) if they lose contact with the leader's topic.

## Bringing it together and evaluating
Run the whole team through a short scenario: give the lead agent an instruction, let it navigate while an obstacle is introduced partway through, and confirm followers react appropriately to both the leader's movement and their own local obstacles. Log every agent's status each step — this log is your primary debugging tool when something in the loop misbehaves, since multi-agent failures are much harder to reproduce than single-agent ones.

## Try it yourself
Wire up the capstone loop end-to-end with two followers and a fake lidar/nav client (stub out real sensors and motors — this is about integration, not hardware). Run one clean scenario (clear instruction, no obstacles) and one degraded scenario (an obstacle appears 3 steps in, forcing a lead-agent replan). Confirm your log shows the leader replanning and both followers correctly continuing to track its updated position.
