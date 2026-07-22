# Web Development for Robotics — Unit 3: HTML basics

HTML is the vocabulary you use to describe what's on a page — headings, text, tables, images — so the browser (and screen readers, and search engines) understand what each piece of content actually is. This unit covers the elements you'll reuse constantly when building robot dashboards.

## Document structure and semantics
Every page needs the boilerplate from Unit 1, but the content inside `<body>` should use the element that matches the content's meaning, not just its appearance. Use `<h1>`-`<h6>` for headings in hierarchical order, `<p>` for paragraphs, `<nav>` for navigation, `<section>`/`<article>` to group related content. This "semantic HTML" matters more than it looks: it's what lets screen readers describe your page and what keeps your CSS selectors meaningful instead of a pile of generic `<div>`s.

```html
<section id="status-panel">
  <h2>Robot Status</h2>
  <p>Mode: <span id="mode">Idle</span></p>
  <p>Battery: <span id="battery">--</span>%</p>
</section>
```

## Displaying structured data with tables
Robot telemetry is naturally tabular — joint names and angles, sensor names and readings. `<table>` with `<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` is the right tool, not nested `<div>`s with CSS grid pretending to be a table.

```html
<table>
  <thead>
    <tr><th>Joint</th><th>Position (rad)</th><th>Velocity (rad/s)</th></tr>
  </thead>
  <tbody id="joint-table-body">
    <tr><td>shoulder_pan</td><td>0.42</td><td>0.00</td></tr>
    <tr><td>elbow</td><td>-1.10</td><td>0.05</td></tr>
  </tbody>
</table>
```

Later, when JavaScript reads live joint states, you'll replace the contents of `#joint-table-body` on each update rather than rewriting the whole table.

## Links, images, and media
`<img src="camera_feed.jpg" alt="Robot front camera">` embeds an image — the `alt` text matters both for accessibility and as a fallback if the feed drops. For a live MJPEG camera stream (a common ROS web_video_server output), the same `<img>` tag works directly, since MJPEG is just a sequence of JPEG frames over one long HTTP response:

```html
<img id="camera" src="http://robot.local:8080/stream?topic=/camera/image_raw" alt="Live camera feed">
```

`<a href="...">` creates links; useful for a dashboard's navigation between "Control", "Logs", and "Diagnostics" pages.

## IDs, classes, and attributes
`id="battery"` uniquely identifies one element — this is your hook for JavaScript (`document.getElementById('battery')`) and for CSS. `class="warning"` can apply to many elements at once, for shared styling or shared JavaScript selection (`document.querySelectorAll('.warning')`). Custom `data-*` attributes let you attach robot-specific metadata without inventing new tags:

```html
<tr data-joint-name="elbow" data-joint-index="1">
  <td>elbow</td><td class="position">-1.10</td>
</tr>
```

## Try it yourself
Build a page with a `<section>` containing an `<h2>`, a `<table>` listing three sensors (name, value, unit) with a unique `id` on each value cell, and an `<img>` placeholder for a camera feed with meaningful `alt` text. Validate it opens cleanly and the table renders with a header row distinct from the data rows.
