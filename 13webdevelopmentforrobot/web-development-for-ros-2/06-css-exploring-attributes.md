# Web Development for ROS 2 — Unit 6: CSS - Exploring attributes

Unit 5 covered CSS fundamentals; this unit covers the layout attributes that turn a stack of styled elements into an actual panel — controls arranged in rows, sensor readouts grouped in a grid — and makes that panel adapt to different screen sizes.

## Creating structured pages
Flexbox is the workhorse for one-dimensional layout — arranging a row of buttons, or a column of status lines:

```css
.controls {
  display: flex;
  gap: 8px;              /* spacing between children, no margin hacks needed */
  align-items: center;   /* vertical alignment within the row */
}
```

```html
<div class="controls">
  <button class="danger">Stop</button>
  <button>Forward</button>
  <button>Reverse</button>
</div>
```

Grid is the workhorse for two-dimensional layout — a dashboard of sensor tiles laid out in rows and columns:

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 equal-width columns */
  gap: 12px;
}
.tile {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
}
```

```html
<div class="dashboard">
  <div class="tile">Battery: <span id="battery">--</span>%</div>
  <div class="tile">Speed: <span id="speed">--</span> m/s</div>
  <div class="tile">Range: <span id="range">--</span> m</div>
</div>
```

`position` is the third tool worth knowing: `position: relative` on a container plus `position: absolute` on a child lets you overlay one element on another (a connection-status badge in the corner of the panel), while `position: fixed` keeps an element (a persistent emergency-stop button) glued to the viewport regardless of scrolling.

## Time to practice!
Rebuild your `panel.html` layout using flexbox for the button row and grid for the sensor readouts, replacing the plain `<table>` from Unit 3 with the `.dashboard`/`.tile` pattern above. Confirm the buttons stay in a neat row and the tiles stay evenly spaced as you resize your browser window.

## Media query: responsive web pages
A media query applies CSS rules only when a condition — most often screen width — is met, which is how the same page adapts from a wide desktop layout to a narrow phone layout:

```css
.dashboard {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 600px) {
  .dashboard {
    grid-template-columns: 1fr;   /* stack tiles in a single column */
  }
  .controls {
    flex-direction: column;       /* stack buttons vertically */
  }
}
```

This matters concretely for a robot panel: an operator glancing at a phone while standing near the robot needs large, stacked, thumb-reachable controls, not a shrunk-down copy of the desktop layout.

## Conclusions
Your panel now has real structure — grouped controls, a dashboard grid, and a layout that adapts to screen size. Everything so far is static, though: the values in your tiles don't actually change. That's what JavaScript, starting next unit, is for.
