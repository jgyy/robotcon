# Web Development for ROS 2 — Unit 5: CSS - Styles for webpages

Unstyled HTML is functional but unreadable at a glance, which matters for a robot panel someone might check quickly before hitting an emergency stop. CSS (Cascading Style Sheets) is how you control color, spacing, and layout without touching your HTML's structure.

## What is CSS used for?
CSS lets you separate *what a page contains* from *how it looks*: the same `<button id="stop">` markup can render as a small gray rectangle or a large red attention-grabbing control purely through CSS, with no HTML changes. For a robot interface this separation pays off directly — you can restyle the entire panel (say, a high-contrast "outdoor" theme vs. a compact "desktop" theme) by swapping one stylesheet.

## How to apply CSS
Three ways to attach CSS to HTML, in increasing order of how much you'll actually use them:

```html
<!-- Inline: avoid except for quick debugging -->
<p style="color: red;">Warning</p>

<!-- Internal: fine for a single-file demo -->
<head>
  <style> p { color: red; } </style>
</head>

<!-- External: the standard approach for real projects -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

An external stylesheet is what you want going forward — it keeps `panel.html` readable and lets every future page in your project share the same `style.css`.

## CSS selectors
Selectors decide *which* elements a rule applies to:

```css
/* Element selector: every button */
button { padding: 0.5rem 1rem; }

/* Class selector: only elements with class="danger" */
.danger { background: crimson; color: white; }

/* ID selector: exactly one element, by id */
#status { font-weight: bold; }

/* Descendant selector: buttons inside .controls */
.controls button { margin-right: 0.5rem; }

/* Attribute selector: inputs of a given type */
input[type="range"] { width: 100%; }
```

Prefer classes over IDs for styling (reserve `id` for JavaScript hooks and reuse `class` freely across similar elements) — apply `class="danger"` to your Unit 3 "Stop" button and it's visually distinct with no new markup.

## CSS Box Model
Every element is a box made of four layered regions, from the inside out: **content** (the text or child elements), **padding** (space between content and border), **border**, and **margin** (space outside the border, between this element and its neighbors):

```css
button {
  padding: 8px 16px;   /* space inside the border */
  border: 1px solid #333;
  margin: 4px;          /* space outside the border */
  box-sizing: border-box; /* width/height include padding+border */
}
```

`box-sizing: border-box` is worth setting globally (`* { box-sizing: border-box; }`) — without it, `width: 200px` plus padding makes an element wider than 200px on screen, which causes no end of layout confusion when you get to responsive design in Unit 6.

## Time to practice!
Create `style.css`, link it from `panel.html`, and style your Unit 4 form: give the "Send command" button a distinct background color, add padding and spacing around your table and form controls using the box model, and add a `.danger` class you apply to the "Stop" button to make it visually stand out (e.g. red background, white bold text).

## Conclusions
Your panel now looks like a deliberate interface instead of raw HTML. Unit 6 goes deeper into layout-oriented CSS attributes — including making this panel usable on a phone screen, not just a desktop monitor.
