# Web Development for Robotics — Unit 6: CSS - Exploring attributes

With selectors and the box model covered, this unit goes deeper into the CSS attributes you'll use to actually lay a dashboard out: how elements display relative to each other, and the modern layout tools that replace old float-based hacks.

## The display property
`display` controls how an element participates in layout:
- `block` — takes the full width available, starts on a new line (`div`, `p`, `section` by default).
- `inline` — flows within text, ignores width/height (`span`, `a` by default).
- `inline-block` — flows like inline but respects width/height/padding.
- `none` — removed from layout entirely, useful for hiding a panel (`display: none` on an inactive tab).
- `flex` / `grid` — turns an element into a layout container for its children (below).

```css
.hidden { display: none; }     /* toggle with JS: el.classList.toggle('hidden') */
.badge  { display: inline-block; padding: 0.2em 0.6em; border-radius: 1em; }
```

## Flexbox for one-dimensional layout
Flexbox arranges children in a row or column and distributes space between them — ideal for a toolbar, a row of status badges, or a form's label/input pairing.

```css
.toolbar {
  display: flex;
  gap: 0.5em;
  align-items: center;       /* vertical centering, cross-axis */
  justify-content: space-between; /* spread along main axis */
}
.toolbar .spacer { flex: 1; } /* grows to push siblings apart */
```

```html
<div class="toolbar">
  <h2>Robot Dashboard</h2>
  <span class="spacer"></span>
  <span class="badge">Connected</span>
</div>
```

`gap` replaces manually adding margins between flex children — cleaner and doesn't leave stray margin on the last item.

## Grid for two-dimensional layout
CSS Grid handles rows and columns together, which suits a dashboard made of panels:

```css
.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "camera  status"
    "camera  controls";
  gap: 1em;
}
.camera-panel   { grid-area: camera; }
.status-panel   { grid-area: status; }
.controls-panel { grid-area: controls; }
```

Naming areas with `grid-template-areas` makes the layout self-documenting — you can read the CSS and see the page shape without mentally computing column numbers.

## Responsive layout with media queries
A dashboard viewed on a wall-mounted monitor and one viewed on a phone need different layouts. Media queries switch rules based on viewport width:

```css
.dashboard { grid-template-columns: 2fr 1fr; }

@media (max-width: 700px) {
  .dashboard {
    grid-template-columns: 1fr; /* stack panels on narrow screens */
    grid-template-areas:
      "camera"
      "status"
      "controls";
  }
}
```

Mobile-first is a common convention: write the narrow-screen styles as the default, then add `@media (min-width: ...)` rules to enhance for larger screens, rather than the reverse.

## Try it yourself
Build a `.dashboard` grid with two areas ("camera" and "status") side by side on wide screens, and add a media query that stacks them vertically below 600px width. Resize your browser window (or use dev tools' device toolbar) to confirm the layout switches.
