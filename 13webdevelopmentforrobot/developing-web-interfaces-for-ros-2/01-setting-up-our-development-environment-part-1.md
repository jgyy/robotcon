# Developing Web Interfaces for ROS 2 — Unit 1: Setting Up Our Development Environment (Part 1)

Before touching ROS at all, this unit gets a plain web page running and styled — the shell every later unit will drop ROS-connected widgets into.

## Creating and running a web page
A ROS-connected interface is still, first and foremost, a normal static web page: an `index.html` file plus whatever CSS/JS it references, served by any HTTP server. You don't need a build pipeline for this course — a folder and a simple server are enough:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Robot Console</title>
</head>
<body>
  <h1>Robot Console</h1>
  <p id="status">Not connected</p>
</body>
</html>
```

```bash
# serve the folder on http://localhost:8000
python3 -m http.server 8000
```

Browsers restrict some features (loading local files via `file://`, WebSocket origin checks in stricter setups) unless the page is served over HTTP, so get in the habit of running a local server from Unit 1 onward rather than double-clicking the HTML file.

## Adding some styles to the page
Hand-rolling CSS for every control eats time you'd rather spend on the ROS integration, so this course uses Bootstrap as a ready-made component and layout library. Pull in its stylesheet (and optionally its JS bundle for interactive components like modals) and you immediately get a responsive grid, buttons, and form controls that look reasonable with no custom CSS:

```html
<link rel="stylesheet" href="css/bootstrap.min.css">
...
<button class="btn btn-primary">Move Forward</button>
<div class="container">
  <div class="row">
    <div class="col-md-6">Left panel</div>
    <div class="col-md-6">Right panel</div>
  </div>
</div>
```

The `container` / `row` / `col-*` classes are Bootstrap's grid system: a row splits into 12 columns, and `col-md-6` claims half of them on medium-and-larger screens. This is the layout mechanism you'll use to arrange camera feeds, maps, and control panels side by side in later units.

## Practice: Bootstrap grid layouts
Lay out a page with three panels using Bootstrap's grid: a narrow left sidebar for buttons (`col-md-3`), a wide center panel for a future map/camera view (`col-md-6`), and a right sidebar for telemetry readouts (`col-md-3`). Getting comfortable with this grid now means you won't be fighting CSS later when the panels start holding live ROS data.

## Try it yourself
Build the three-panel layout described above as a static page (no ROS yet), with placeholder text in each panel and a Bootstrap-styled heading and navbar at the top. Confirm it stays readable when you resize the browser window narrower than a typical laptop screen.
