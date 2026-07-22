# Docker Basics for Robotics — Unit 4: Docker Containers

With image-building covered, this unit goes deeper on the container side: the full lifecycle, how to interact with containers while they run, and how to diagnose the problems you'll inevitably hit.

## The container lifecycle
A container moves through states: created, running, paused, exited (stopped), and removed. `docker run` combines create + start; you can also do them separately.

```bash
docker create --name c1 ubuntu:22.04 sleep 300
docker start c1
docker pause c1        # freeze all processes in the container
docker unpause c1
docker stop c1          # SIGTERM, then SIGKILL after ~10s grace period
docker start c1          # a stopped container can be restarted, state preserved
docker rm c1
```

Restart policies control what happens when a container exits, which matters a lot once you're running long-lived services (covered further in Unit 10):

```bash
docker run -d --restart unless-stopped --name watcher myimage
```

Options are `no` (default), `on-failure[:max-retries]`, `always`, and `unless-stopped`.

## Attaching and executing inside running containers
`docker attach` connects your terminal to the container's main process (PID 1) — risky, because exiting the shell can stop the container. `docker exec` is almost always the better tool: it starts a *new* process inside an already-running container, leaving the main process untouched.

```bash
docker exec -it webserver bash
docker exec webserver ps aux
docker exec -e DEBUG=1 webserver python3 script.py
```

## Diagnosing problems
The most common failure mode is a container that exits immediately. Start with:

```bash
docker ps -a                          # find the exit code in the STATUS column
docker logs <container>               # see stdout/stderr from the crashed process
docker inspect <container> --format '{{.State.ExitCode}}'
```

Exit code 0 means clean exit, 137 usually means the process was killed (often an out-of-memory kill — check `docker inspect` for `OOMKilled: true`), and 1 or other nonzero codes mean the application itself errored — check the logs. For a container that's running but misbehaving, `docker stats` shows live CPU/memory usage per container, and `docker top <container>` lists its processes.

```bash
docker stats --no-stream
docker top webserver
```

## Resource limits
On a robot's onboard computer, an unbounded container can starve other critical processes. Constrain it at run time:

```bash
docker run -d --memory=512m --cpus=1.5 --name perception myimage
```

## Try it yourself
Start a container that immediately fails: `docker run --name broken ubuntu:22.04 badcommand`. Use `docker ps -a`, `docker logs broken`, and `docker inspect broken --format '{{.State.ExitCode}}'` to figure out exactly why it exited without re-running it. Then fix the command and confirm it runs cleanly.
