# Docker Basics for Robotics — Unit 2: Introduction to Docker

Before you can build anything with Docker, you need fluency with its core objects — images and containers — and the everyday commands for pulling, running, and inspecting them.

## Images vs. containers
An **image** is a read-only template: a snapshot of a filesystem plus metadata (default command, exposed ports, environment variables). A **container** is a running (or stopped) instance of an image, with its own writable layer on top. This is the same relationship as a class and an object — you can start many containers from one image, and each one is isolated from the others.

```bash
docker pull ubuntu:22.04     # download the image
docker images                # list images stored locally
docker run ubuntu:22.04 echo "hi from a container"   # run once and exit
docker ps -a                 # list all containers, including stopped ones
```

## Pulling public images
Public images live in registries — Docker Hub is the default one. Images are named as `repository:tag`, e.g. `ubuntu:22.04` or `osrf/ros:humble-desktop`. Omitting the tag defaults to `latest`, which is convenient for experimentation but a bad idea for anything you want to be reproducible — pin a specific tag.

```bash
docker search ros           # search Docker Hub from the CLI
docker pull osrf/ros:humble-desktop
docker image inspect osrf/ros:humble-desktop | less
```

`docker image inspect` dumps the full metadata: layers, environment variables, entrypoint, exposed ports — useful for understanding an image you didn't build yourself.

## Running and interacting with containers
The `docker run` command has a handful of flags you'll use constantly:

| Flag | Meaning |
|---|---|
| `-it` | interactive terminal (combine `-i` and `-t`) |
| `-d` | detached, runs in the background |
| `--name` | assign a readable container name |
| `--rm` | automatically remove the container when it exits |
| `-e KEY=VALUE` | set an environment variable |
| `-v` | mount a volume (covered in Unit 5) |
| `-p host:container` | publish a port |

```bash
docker run -it --rm ubuntu:22.04 bash      # interactive shell, cleaned up on exit
docker run -d --name webserver nginx:alpine
docker exec -it webserver bash             # get a shell inside an already-running container
docker logs webserver                      # view stdout/stderr
docker stop webserver                      # send SIGTERM, then SIGKILL after a grace period
docker rm webserver                        # remove the stopped container
```

## Try it yourself
Pull `osrf/ros:humble-desktop` (or another ROS distro image you're interested in), start it interactively with `docker run -it --rm osrf/ros:humble-desktop bash`, and inside the container run `printenv | grep ROS` to see which ROS environment variables the image already sets up for you. Exit, then run `docker images` and note the image size — this is worth remembering as motivation for Unit 3, where you'll learn why image size matters.
