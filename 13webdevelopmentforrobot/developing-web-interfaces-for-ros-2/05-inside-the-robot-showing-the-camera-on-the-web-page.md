# Developing Web Interfaces for ROS 2 — Unit 5: Inside the Robot! Showing the camera on the web page!

Raw `sensor_msgs/Image` data is uncompressed and far too large to push through rosbridge's JSON WebSocket at a usable frame rate, so this unit covers the actual architecture used to get a live camera feed into a browser efficiently.

The diagram below contrasts the two video paths this unit covers: MJPEG over plain HTTP via `web_video_server`, versus compressed images relayed through rosbridge as base64 JSON.

```mermaid
flowchart LR
    Cam[/camera/image_raw] --> WVS[web_video_server]
    WVS -->|MJPEG over HTTP :8080| ImgTag[img tag: src = stream URL]

    Cam --> Comp[/camera/image_raw/compressed]
    Comp -->|CompressedImage over rosbridge| RJS[roslibjs Topic.subscribe]
    RJS -->|base64 JPEG in JSON| DataURI[img.src = data:image/jpeg;base64,...]
```

## Video streaming architecture
There are two common paths, and it's important to know which one you're using because they have very different performance characteristics.

**Path 1 — MJPEG over plain HTTP, via `web_video_server`.** This package subscribes to an image topic on the ROS side, re-encodes each frame as JPEG, and serves it as a standard multipart MJPEG HTTP stream on its own port (default 8080). Your browser doesn't need rosbridge or roslibjs for this at all — an `<img>` tag pointed at the right URL is a native MJPEG consumer:

```bash
ros2 run web_video_server web_video_server --ros-args -p port:=8080
```

```html
<img src="http://localhost:8080/stream?topic=/camera/image_raw&type=mjpeg" width="640">
```

**Path 2 — compressed images over rosbridge.** If you subscribe to a `sensor_msgs/msg/CompressedImage` topic through `roslibjs` like any other topic, rosbridge base64-encodes each JPEG frame into the JSON payload. This keeps everything on one WebSocket connection (convenient if you're already managing reconnect logic for it) but is less bandwidth-efficient than raw MJPEG and typically caps out at a lower frame rate.

For most dashboards, `web_video_server` (Path 1) is the better default — reserve the rosbridge-based approach for cases where you specifically need the frame data available to JavaScript (e.g., to draw annotations on a canvas), not just to display it.

## Embedding images on the web page
With `web_video_server`, embedding the stream is literally an `<img>` tag — no JavaScript required for the video itself:

```html
<div class="card">
  <div class="card-header">Front Camera</div>
  <img id="cam" src="http://localhost:8080/stream?topic=/camera/image_raw&type=mjpeg" class="img-fluid">
</div>
```

With the rosbridge/compressed-image approach, you assign the base64 payload to an `<img>`'s `src` as a data URI on every incoming message instead:

```javascript
const imgTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/camera/image_raw/compressed',
  messageType: 'sensor_msgs/msg/CompressedImage'
});

imgTopic.subscribe((message) => {
  document.getElementById('cam').src = 'data:image/jpeg;base64,' + message.data;
});
```

## Try it yourself
Stand up `web_video_server` against your robot's camera topic and embed the stream as an `<img>` inside the center panel of the layout you built in Unit 1. Then, as a comparison, subscribe to the same feed's compressed-image topic via `roslibjs` and render it into a second `<img>` — watch the Network panel from Unit 2 to see the difference in per-frame payload size between the two approaches.
