# Developing Web Interfaces for ROS 2 — Unit 5: Inside the Robot! Showing the camera on the web page!

Raw `sensor_msgs/Image` data is uncompressed and far too large to push through rosbridge's JSON WebSocket at a usable frame rate, so this unit covers the actual architecture used to get a live camera feed into a browser efficiently.

It's worth doing the arithmetic once so the "too large" claim isn't just a rule of thumb. A single 640×480 RGB8 frame is `640 × 480 × 3 = 921,600` bytes uncompressed. At 30 fps that's roughly 27 MB/s of binary payload before rosbridge even touches it — and rosbridge doesn't send binary, it sends JSON, so that payload gets base64-encoded first (~33% larger) and wrapped in a JSON envelope on top of that. You're looking at 35-40 MB/s of text flowing over a single WebSocket, which will saturate the connection, spike CPU on both ends for encode/decode, and starve every other topic sharing that same rosbridge connection. A JPEG-compressed frame at the same resolution, by contrast, is typically tens of kilobytes depending on quality — one to three orders of magnitude smaller — which is why every practical camera-to-browser setup compresses first and streams second.

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

Besides `type`, the stream URL commonly accepts `quality` (JPEG quality, trading bandwidth for sharpness) and `width`/`height` (to have the server downscale before sending, rather than shipping full resolution and resizing in CSS). There's also a `/snapshot?topic=...` endpoint that returns a single JPEG instead of a continuous stream — handy for a thumbnail or a "last seen" preview that doesn't need to be live.

**Path 2 — compressed images over rosbridge.** If you subscribe to a `sensor_msgs/msg/CompressedImage` topic through `roslibjs` like any other topic, rosbridge base64-encodes each JPEG frame into the JSON payload. This keeps everything on one WebSocket connection (convenient if you're already managing reconnect logic for it) but is less bandwidth-efficient than raw MJPEG and typically caps out at a lower frame rate. Many camera drivers built on `image_transport` (`usb_cam`, `v4l2_camera`, `gscam`) publish a `.../compressed` topic automatically alongside the raw one; if yours doesn't, `image_transport`'s republish node will create one:

```bash
ros2 run image_transport republish raw compressed \
  --ros-args -r in:=/camera/image_raw -r out/compressed:=/camera/image_raw/compressed
```

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

This is the detail behind "annotate it on a canvas" from the previous section: if you later `drawImage()` that `<img>` onto a `<canvas>` and call `getImageData()` or `toDataURL()` to read pixels back out, the browser checks whether the image's origin is safe. A `data:` URI is treated as canvas-safe, so the rosbridge path just works. An `<img>` pointed at `web_video_server` on a different host or port, however, is a cross-origin resource — unless that server sends the right CORS headers, drawing it onto a canvas will leave the canvas "tainted" and any attempt to read pixels back throws a `SecurityError`, even though the image displays on the page just fine. If all you're doing is displaying the feed, this never matters; it only bites when you need pixel-level access in JavaScript.

## Try it yourself
Stand up `web_video_server` against your robot's camera topic and embed the stream as an `<img>` inside the center panel of the layout you built in Unit 1. Then, as a comparison, subscribe to the same feed's compressed-image topic via `roslibjs` and render it into a second `<img>` — watch the Network panel from Unit 2 to see the difference in per-frame payload size between the two approaches, and try adding `&quality=30` to the `web_video_server` URL to see how much further the bandwidth drops before the image quality visibly suffers.
