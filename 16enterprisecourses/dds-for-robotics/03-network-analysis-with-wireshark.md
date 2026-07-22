# DDS for Robotics — Unit 3: Network Analysis with Wireshark

Wireshark is the tool that turns "the topic just isn't showing up" into "here is the exact RTPS packet where discovery failed" — this unit teaches you to capture and read the wire protocol DDS actually speaks.

## Capturing the right traffic
DDS implementations speak RTPS (Real-Time Publish-Subscribe protocol) over UDP by default. Start a capture scoped to the interface and ports your robot uses, rather than capturing everything:

```bash
sudo wireshark -i wlan0 -k -f "udp portrange 7400-7500" &
# or headless, to a file you open later:
sudo tcpdump -i wlan0 -w dds_capture.pcapng udp portrange 7400-7500
```

Wireshark ships an RTPS dissector out of the box, so once you open the capture, packets show up decoded as `RTPS` in the protocol column rather than raw `UDP`, with fields for the submessage type (`DATA`, `HEARTBEAT`, `ACKNACK`, `INFO_TS`) already parsed.

## Reading an RTPS packet
Each RTPS packet carries one or more *submessages*. The ones you'll see constantly:
- **DATA** — an actual sample (your ROS 2 message payload) or metadata about a discovered entity.
- **HEARTBEAT** — sent by a reliable writer to tell readers what sample sequence numbers are available, so readers can request retransmission of anything missed.
- **ACKNACK** — a reader's response, acknowledging received samples or requesting lost ones by sequence number.
- **INFO_TS** — a timestamp attached to the following submessage.

Use Wireshark's filter bar to isolate just discovery or just user data:

```
rtps.submessageId == 0x15        # filter to HEARTBEAT submessages
rtps                              # all RTPS traffic
udp.port == 7400                  # traffic on the default discovery multicast port
```

Follow *UDP Stream* (right-click a packet) to see the whole conversation between a specific writer and reader in order — this is how you confirm whether a reader is actually ACKing samples or silently stuck.

## Correlating packets back to ROS 2 entities
RTPS `DATA(p)` submessages (participant discovery) and `DATA(w)`/`DATA(r)` (writer/reader discovery) contain the GUID, topic name, and type name of each ROS 2 publisher/subscriber as plain readable strings inside the packet — you can literally search a capture for your topic name:

```
rtps.param.topicName contains "cmd_vel"
```

This lets you answer, packet-by-packet, questions like: did the participant discovery packet ever leave this host? Did the remote participant's reply ever arrive? Did the two sides agree on QoS (Unit 5/7 build on this)?

## Try it yourself
Start `ros2 run demo_nodes_cpp talker` on one terminal, capture traffic with `sudo tcpdump -i lo -w talker.pcapng udp portrange 7400-7500` for 15 seconds, then open the file in Wireshark and apply the filter `rtps.param.topicName contains "chatter"`. Identify at least one `DATA(w)` packet (writer announcement) and note the GUID prefix it advertises — you'll need to recognize this pattern again in Unit 6 on discovery.
