# Web Development for ROS 2 — Unit 7: JavaScript - Making pages dynamic

Everything so far has been static: HTML that never changes and CSS that styles it once. JavaScript is what lets your panel react — to a button click, to an incoming Rosbridge message, to the passage of time. This is the language unit of the course; because you already know how to program, the goal here is JavaScript's specific syntax and quirks, not programming from scratch.

## Initial Setup
Link a script file the same way you link a stylesheet, at the end of `<body>` so the DOM exists before your script runs:

```html
<body>
  ...
  <script src="app.js"></script>
</body>
```

Placing `<script>` last (or adding the `defer` attribute) avoids the classic bug of JavaScript trying to grab an element that hasn't been parsed yet.

## JavaScript lifecycle in webpages
A browser executes your script top-to-bottom once the page loads, then goes idle — after that, code only runs in response to *events* (a click, a WebSocket message, a timer firing). This event-driven model is the mental shift from writing a script that runs once: most of your panel's logic will live inside callback functions attached to events, not in top-level code.

```javascript
console.log('script loaded');   // runs immediately

document.getElementById('stop').addEventListener('click', () => {
  console.log('stop clicked');  // runs later, on click
});
```

## JavaScript DOM
The DOM (Document Object Model) is the live, in-memory tree of your HTML that JavaScript can read and mutate. This is how a Rosbridge message ends up visible on screen:

```javascript
const el = document.getElementById('battery');
el.textContent = '87';               // update displayed text
el.classList.add('low-battery');     // toggle a CSS class based on logic
```

`querySelector`/`querySelectorAll` accept the same selector syntax as CSS, which is often more convenient than chaining `getElementById` calls:

```javascript
document.querySelectorAll('.controls button').forEach(btn => {
  btn.addEventListener('click', () => console.log(btn.textContent));
});
```

## JavaScript Variables and DataTypes
Use `const` by default and `let` only for values you'll reassign; avoid `var` (it has confusing function-level, rather than block-level, scoping). JavaScript's primitive types are `number` (no separate int/float), `string`, `boolean`, `null`, and `undefined`:

```javascript
const topicName = '/cmd_vel';   // string
let linearSpeed = 0.2;          // number
const connected = false;        // boolean
let lastMessage;                // undefined until assigned
```

Template literals (backticks) beat string concatenation for building messages:

```javascript
console.log(`Publishing to ${topicName} at ${linearSpeed} m/s`);
```

## JavaScript Functions
Prefer arrow functions for callbacks — they're concise and, unlike `function`, don't rebind `this`:

```javascript
function publishVelocity(linear, angular) {   // named function
  console.log(`linear=${linear} angular=${angular}`);
}

const stop = () => publishVelocity(0, 0);      // arrow function, no args
document.getElementById('stop').addEventListener('click', stop);
```

## JavaScript Objects
Objects are JavaScript's key-value structure, and they map directly onto the JSON messages Rosbridge sends and expects:

```javascript
const twist = {
  linear: { x: 0.2, y: 0, z: 0 },
  angular: { x: 0, y: 0, z: 0 }
};

console.log(twist.linear.x);           // dot access
console.log(twist['angular']['z']);    // bracket access

const rosbridgeMsg = {
  op: 'publish',
  topic: '/cmd_vel',
  msg: twist
};
```

`JSON.stringify(rosbridgeMsg)` turns this object into the exact text string a WebSocket `send()` call needs — which is precisely what you did by hand in Unit 3.

## Time to Practice!
Replace the raw WebSocket snippet from Unit 3 with a proper `app.js`: on `DOMContentLoaded`, open the Rosbridge WebSocket, and attach a click listener to your "Stop" button that sends a zero-velocity `Twist` message using the object/`JSON.stringify` pattern above. Confirm the robot stops on click.

## Conclusions
You can now read from and write to the DOM, and you have the JavaScript fundamentals — variables, functions, objects — to build a real Rosbridge client instead of pasting commands into the console. Unit 8 adds arrays, needed for anything that streams a *list* of values, like a laser scan.
