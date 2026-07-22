# Web Development for Robotics — Unit 7: JavaScript - Making pages dynamic

Everything so far has been static: the same HTML and CSS every time the page loads. JavaScript is what reacts to events, updates content without a page reload, and — critically for this course — talks to Rosbridge to move data between the robot and the browser. You already know how to program; this unit is about JavaScript's particular idioms, not programming from scratch.

## Variables, types, and JS's quirks
JavaScript is dynamically typed like Python, but with a few sharp edges worth knowing up front. Use `let` for variables that change and `const` for ones that don't — avoid the old `var`, which has confusing function-level (not block-level) scoping.

```js
const maxSpeed = 1.5;      // never reassigned
let currentSpeed = 0.0;    // will change

typeof maxSpeed;           // "number" — JS has one numeric type, no int/float split
typeof "hello";             // "string"
typeof true;                 // "boolean"
typeof undefined;           // "undefined" — declared but unassigned
typeof null;                 // "object" — a long-standing JS wart, not a mistake in your code

0.1 + 0.2;                  // 0.30000000000000004, same float pitfalls as any language
NaN === NaN;                 // false — always use Number.isNaN(x) to check
```

Equality: always use `===`/`!==` (strict, no type coercion), never `==`/`!=`, which silently coerce types in surprising ways (`"0" == false` is `true`).

## Objects and arrays as your main data structures
Where Python reaches for dicts and lists, JS reaches for objects and arrays — and you'll use them constantly to model robot state:

```js
const robotState = {
  battery: 87,
  mode: "manual",
  position: { x: 1.2, y: 0.4 }
};

robotState.battery;        // 87 — dot access
robotState["mode"];        // "manual" — bracket access, needed for dynamic keys

const jointNames = ["shoulder_pan", "shoulder_lift", "elbow"];
jointNames.length;          // 3
jointNames[0];               // "shoulder_pan"
```

`JSON.stringify(robotState)` and `JSON.parse(text)` convert between JS objects and JSON text — this is exactly what you'll use to build and read Rosbridge messages later in the course, since Rosbridge speaks JSON over a WebSocket.

## Functions, arrow functions, and `this`
Arrow functions (`(x) => x * 2`) are the modern default — terser, and unlike `function` they don't rebind `this`, which avoids a classic JavaScript gotcha inside callbacks:

```js
function square(x) { return x * x; }     // traditional
const squareArrow = (x) => x * x;         // equivalent, arrow form
const greet = (name) => { console.log(`Hello, ${name}`); }; // template literal
```

Template literals (backticks with `${...}`) are JS's f-strings — use them instead of string concatenation.

## The DOM and event handling
The Document Object Model is the live, in-memory tree of your HTML that JavaScript can read and mutate. This is how a page becomes dynamic:

```js
const batteryEl = document.getElementById('battery');
batteryEl.textContent = '92';                    // update displayed text

const form = document.getElementById('velocity-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();                        // stop the browser from navigating away
  const linear = form.elements['linear'].valueAsNumber;
  console.log('Sending linear velocity:', linear);
  // next unit: this becomes a Rosbridge publish call
});
```

`addEventListener` is how you hook any interaction — clicks, form submits, input changes — to a function. `event.preventDefault()` on a form's `submit` event is essential in a single-page dashboard: without it, the browser tries to reload the page as if this were a classic server-rendered form.

## Try it yourself
Wire up the form from Unit 4: add a `<script>` that listens for its `submit` event, prevents the default navigation, reads the speed and mode values, builds a JS object `{ speed, mode }`, and logs `JSON.stringify(that object)` to the console. Open your browser's dev console to confirm the JSON string appears correctly on submit.
