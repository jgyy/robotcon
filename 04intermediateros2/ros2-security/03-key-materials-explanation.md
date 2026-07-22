# ROS2 Security — Unit 3: Key Materials Explanation

Now that you've enabled security once, this unit opens up the keystore and looks at exactly what's inside it: the certificates, keys, and permission files that make authentication and access control work, and how to inspect and validate them by hand rather than treating the CLI as a black box.

## Anatomy of a keystore

A keystore created with `ros2 security create_keystore` is just a directory tree. At the top level it holds the Certificate Authority material:

```
demo_keystore/
├── public/
│   ├── ca.cert.pem          # the CA's public certificate
│   └── governance.p7s       # signed domain-wide governance rules
├── private/
│   └── ca.key.pem           # the CA's private key — never share this
└── enclaves/
    └── talker/
        ├── cert.pem         # this enclave's certificate, signed by ca.cert.pem
        ├── key.pem           # this enclave's private key
        ├── governance.p7s
        └── permissions.p7s   # this enclave's specific access-control rules, signed
```

The CA's private key (`private/ca.key.pem`) is the crown jewel of the whole system: anyone who has it can mint a trusted identity for any node. In a real deployment it should be generated and stored offline, not shipped alongside the robot's runtime keystore.

## Enclaves

An "enclave" is ROS 2's name for a security identity scoped to (usually) a single node, identified by a path-like name such as `/talker` or `/robot1/navigation`. When you ran `ros2 security create_key demo_keystore /talker`, you asked the CA to mint a certificate for the `/talker` enclave and drop it, along with a fresh private key, under `enclaves/talker/`. A node started with `--ros-args --enclave /talker` looks up its identity there.

Enclaves let you scope permissions tightly: a perception node's enclave might be allowed to publish sensor topics but not to publish to `/cmd_vel`, while a teleop node's enclave has the reverse permissions. This is the access-control half of SROS2, expressed as XML rules that get compiled and signed into `permissions.p7s`.

## Certificates: inspecting and validating

Every certificate in the keystore is a standard X.509 certificate, so standard OpenSSL tooling works on it directly — SROS2 doesn't invent its own certificate format. To read a certificate's contents (issuer, subject, validity dates):

```bash
openssl x509 -in demo_keystore/enclaves/talker/cert.pem -noout -text
```

Look particularly at the `Validity` block (certificates expire — an expired cert is a common cause of a node that "used to work" suddenly failing to connect) and the `Issuer` field (it should match your CA's subject).

To validate that a given enclave certificate is genuinely signed by your keystore's CA (and not, say, a certificate someone slipped in from elsewhere):

```bash
openssl verify -CAfile demo_keystore/public/ca.cert.pem demo_keystore/enclaves/talker/cert.pem
```

A successful validation prints `cert.pem: OK`. If someone swapped in a self-signed or differently-issued certificate, this command fails immediately — this is exactly the check DDS-Security performs automatically during discovery, just made visible.

## Adding a new custom node to an existing keystore

Extending a keystore with a new node's identity — for example when you add a `turtlebot_keystore` entry for a new custom node in a turtlebot3 setup — is the same `create_key` step from Unit 2, just run again against the existing keystore and a new enclave name:

```bash
ros2 security create_key turtlebot_keystore /turtlebot3/my_custom_node
```

This mints a new certificate/key pair under `turtlebot_keystore/enclaves/turtlebot3/my_custom_node/`, signed by the same CA as every other enclave in that keystore, so it's immediately trusted by every other node already using it. You'll still need to author (or generate) a `permissions.p7s` for the node describing what topics/services it's allowed to touch — an enclave with no permissions file, under `Enforce`, is treated as having no rights at all.

## Try it yourself

Using a keystore you created in Unit 2, run `openssl x509 -noout -dates -in <path-to-a-cert>` to print just the validity window of one enclave's certificate, then run `openssl verify` against it with the keystore's CA certificate to confirm the chain of trust. Finally, add one new enclave to the same keystore for an imaginary `/inspector` node and verify its certificate the same way.
