# ROS2 Security — Unit 2: Activating security in ROS2

Security in ROS 2 is entirely opt-in: unless you set a specific environment variable and point it at a directory of keys, every node runs exactly as it did before, wide open. This unit walks through the minimum steps to flip that switch and get a secured node talking to another secured node.

## The `sros2` package and prerequisites

The tooling lives in the `sros2` package, which ships as part of a standard ROS 2 install (or is installable via your package manager, e.g. `apt install ros-<distro>-sros2` if it isn't already present). It wraps OpenSSL certificate generation and DDS-Security XML permission files behind a friendlier `ros2 security` CLI verb.

Check it's available:

```bash
ros2 security --help
```

You should see subcommands like `create_keystore`, `create_key`, `create_permission`, `generate_artifacts`, and `list_keys`.

## Creating a keystore

Everything starts with a keystore — a directory holding a Certificate Authority and the per-identity keys/certificates that CA signs. Create one:

```bash
ros2 security create_keystore demo_keystore
```

This produces a `demo_keystore/` directory containing the CA's own certificate and private key, plus an empty structure ready to hold node identities (you'll examine this layout in detail in Unit 3).

## Creating a key (identity) for a node

Each node that will run securely needs its own identity — a keypair and certificate signed by your keystore's CA, tied to a specific "enclave" name (conventionally matching the node's namespace):

```bash
ros2 security create_key demo_keystore /talker
ros2 security create_key demo_keystore /listener
```

## Turning security on for a run

Two environment variables control whether a `ros2 run` invocation uses security, and where it looks for keys:

```bash
export ROS_SECURITY_KEYSTORE=$(pwd)/demo_keystore
export ROS_SECURITY_ENABLE=true
export ROS_SECURITY_STRATEGY=Enforce   # refuse to run if permissions/certs are missing or invalid
```

With those set, launch a node passing its enclave name so it picks up the matching identity:

```bash
ros2 run demo_nodes_cpp talker --ros-args --enclave /talker
```

In a second terminal (with the same three environment variables exported), start the matching listener the same way. If both sides have valid, matching certificates issued by the same CA, communication proceeds as normal — except now it's authenticated and, depending on your access-control settings, encrypted. If you unset `ROS_SECURITY_ENABLE` in one terminal and leave it set in the other, the two nodes will fail to discover each other at all, which is the expected, secure-by-default behavior.

## Verifying it actually took effect

`ROS_SECURITY_STRATEGY=Enforce` is worth calling out: with it set, a node that's missing a valid identity or permission file refuses to start rather than silently falling back to insecure communication. Leaving it unset (or `Permissive`) is easier for debugging but defeats the purpose in production — always run `Enforce` once you're past initial setup.

You can sanity-check what keys exist in a keystore at any point with:

```bash
ros2 security list_keys demo_keystore
```

## Try it yourself

Create a keystore, generate identities for two nodes named `/writer` and `/reader`, and get a `talker`/`listener` pair running with `ROS_SECURITY_ENABLE=true` and `ROS_SECURITY_STRATEGY=Enforce`. Then delete or rename one node's certificate file inside the keystore and re-run it — confirm that `Enforce` refuses to start the node instead of silently connecting insecurely.
