# Web Development for Robotics — Unit 10: Creating components

A single giant component that renders your whole dashboard is no better than a single giant JavaScript file. This unit covers splitting a React app into focused, reusable components that each own one job — a status badge, a joint table, a command form — and pass data between each other cleanly.

## Breaking a dashboard into components
Look for natural boundaries: anything you could point at and give a one-sentence description ("shows the battery level", "lets the user send a velocity command") is a component candidate.

```jsx
// StatusBadge.jsx
function StatusBadge({ connected }) {
  return (
    <span className={connected ? 'badge ok' : 'badge error'}>
      {connected ? 'Connected' : 'Disconnected'}
    </span>
  );
}

// App.jsx
function App() {
  return (
    <div className="dashboard">
      <StatusBadge connected={true} />
      <JointTable />
      <VelocityForm />
    </div>
  );
}
```

Each file exports one component; `App` composes them. This mirrors how you'd split up a ROS 2 package into nodes with one responsibility each — the same instinct for decomposition applies.

## Props: passing data down
`{ connected }` in `StatusBadge`'s parameter list is a **prop** — data passed from parent to child, read-only from the child's perspective. Props are how a reusable component gets different data each time it's used:

```jsx
function JointRow({ name, position, velocity }) {
  return (
    <tr>
      <td>{name}</td>
      <td>{position.toFixed(2)}</td>
      <td>{velocity.toFixed(2)}</td>
    </tr>
  );
}

function JointTable({ joints }) {
  return (
    <table>
      <thead><tr><th>Joint</th><th>Position</th><th>Velocity</th></tr></thead>
      <tbody>
        {joints.map(j => (
          <JointRow key={j.name} name={j.name} position={j.position} velocity={j.velocity} />
        ))}
      </tbody>
    </table>
  );
}
```

`.map()` generating a list of components is the standard React pattern for rendering an array (Unit 8's array methods carry over directly). The `key={j.name}` prop is required whenever you render a list — React uses it to track which item is which across re-renders, so pick something stable and unique, never the array index if the list can reorder.

## Lifting state up and sending commands back
A component sends data back to its parent by calling a function the parent passed down as a prop — this is how a form component reports a submitted command without needing to know what happens to it:

```jsx
function VelocityForm({ onSend }) {
  const [linear, setLinear] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    onSend({ linear, angular: 0 });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={linear}
             onChange={e => setLinear(e.target.valueAsNumber)} />
      <button type="submit">Send</button>
    </form>
  );
}

function App() {
  function handleVelocityCommand(cmd) {
    console.log('Publishing to /cmd_vel:', cmd); // next step: roslibjs publish
  }
  return <VelocityForm onSend={handleVelocityCommand} />;
}
```

`App` owns the logic for what happens to a command (eventually, publishing it via roslibjs to `/cmd_vel`); `VelocityForm` only knows how to collect input and call `onSend`. This separation — state and side effects living in a parent, presentation living in children — is what keeps components reusable: the same `VelocityForm` could later report to a simulator instead of a real robot with zero changes to its own code.

## Try it yourself
Split the `BatteryDisplay` component from Unit 9 into two: a presentational `BatteryBadge({ percent })` that only renders, and a parent that owns the `useState` and passes `percent` down as a prop plus an `onDrain` callback prop that the badge calls via an internal button. Confirm the click still decreases the battery value shown.
