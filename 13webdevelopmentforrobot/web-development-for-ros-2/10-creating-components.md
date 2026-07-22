# Web Development for ROS 2 — Unit 10: Creating components

A single `App` component holding every button, tile, and piece of state becomes unmanageable fast. This unit splits your panel into focused, reusable components — the same organizational instinct as breaking a large ROS 2 node into smaller classes or functions — and covers how those components talk to each other.

## Creating a new component
A component is just a function that returns JSX, imported and used like an HTML tag. Pull the battery readout out of `App` into its own file:

```jsx
// src/BatteryTile.jsx
function BatteryTile({ percentage }) {
  return (
    <div className="tile">
      Battery: {percentage ?? '--'}%
    </div>
  );
}

export default BatteryTile;
```

```jsx
// src/App.jsx
import BatteryTile from './BatteryTile';

function App() {
  const [battery, setBattery] = useState(null);
  return (
    <div className="dashboard">
      <BatteryTile percentage={battery} />
    </div>
  );
}
```

`percentage` here is a **prop** — data passed from parent to child, read-only from the child's side. This mirrors passing a parameter into a function: `BatteryTile` doesn't know or care where `battery` came from, which makes it reusable for any numeric readout, not just battery.

## Time to practice!
Create a `LaserTile` component that takes a `closest` prop (the nearest-obstacle distance from Unit 8) and displays it, then render it alongside `BatteryTile` inside `App`'s dashboard `<div>`.

## Fragments
JSX requires a component to return a single root element — wrapping everything in an extra `<div>` just to satisfy that rule adds nodes to the DOM you don't actually want (and can break CSS that assumes a specific parent-child structure). A Fragment (`<>...</>`) groups elements without adding a wrapper node:

```jsx
function ControlButtons() {
  return (
    <>
      <button>Forward</button>
      <button>Stop</button>
    </>
  );
}
```

## Component callbacks
Props flow down (parent to child); a child triggers behavior in its parent by calling a **function passed down as a prop** — there's no other direction for data to travel in React's model:

```jsx
// src/StopButton.jsx
function StopButton({ onStop }) {
  return <button onClick={onStop}>Stop</button>;
}
```

```jsx
// src/App.jsx
function App() {
  const handleStop = () => {
    console.log('sending zero-velocity command');
    // ros.send(JSON.stringify({ op: 'publish', topic: '/cmd_vel', msg: zeroTwist }));
  };

  return <StopButton onStop={handleStop} />;
}
```

`StopButton` doesn't know what "stopping" means — it just calls whatever function `App` handed it. This is exactly how you'll wire real Rosbridge publishing: the WebSocket connection and message logic live in (or near) `App`, and individual button components stay simple and reusable, unaware of ROS 2 entirely.

## Quick exercise
`useEffect` runs code in response to a component mounting (appearing on screen) or a value changing, and its return value, if a function, runs on unmount (the component disappearing) — the right place to open and close a WebSocket connection cleanly:

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const ros = new WebSocket('ws://localhost:9090');
    console.log('connecting');

    return () => {
      ros.close();          // cleanup: runs when App unmounts
      console.log('disconnected');
    };
  }, []);   // empty dependency array: run once on mount, cleanup once on unmount

  return <div>Robot Panel</div>;
}
```

Add this effect to your `App` component and confirm, via the console, that "connecting" logs once when the page loads. This is the foundation the rest of your Rosbridge-connected panel builds on going forward.

## Conclusions
You've broken a monolithic component into small, prop-driven pieces that communicate through props down and callbacks up, with `useEffect` handling connection lifecycle correctly. That's the full toolkit this course set out to teach: HTML structure, CSS styling, JavaScript behavior, Rosbridge connectivity, and React component architecture — enough to build and extend a real ROS 2 web panel on your own.
