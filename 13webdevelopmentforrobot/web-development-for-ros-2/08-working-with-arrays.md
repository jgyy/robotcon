# Web Development for ROS 2 — Unit 8: Working with Arrays

A single number like battery percentage fits in a variable; a laser scan's hundreds of range readings do not. This unit covers JavaScript's `Array` type and the methods you'll use to process the array-shaped data ROS 2 sensor messages actually send.

## Creating arrays
Arrays hold an ordered list of values, declared with literal syntax:

```javascript
const ranges = [1.2, 1.3, 1.25, 0.9, 5.0];   // a tiny laser scan, for illustration
const emptyLog = [];
```

A real `sensor_msgs/msg/LaserScan` message arriving over Rosbridge lands in JavaScript as a plain object whose `ranges` field is already an array — no parsing required:

```javascript
ros.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.topic === '/scan') {
    console.log(data.msg.ranges.length, 'range readings received');
  }
};
```

## Array index access and iteration
Arrays are zero-indexed, and `.length` gives the element count:

```javascript
console.log(ranges[0]);          // 1.2 — first reading
console.log(ranges[ranges.length - 1]);  // 5.0 — last reading

for (const r of ranges) {
  console.log(r);                // for...of: cleanest way to visit every element
}

ranges.forEach((r, i) => {
  console.log(`reading ${i}: ${r}`);   // forEach gives you the index too
});
```

Prefer `for...of` or `forEach` over a classic indexed `for` loop unless you specifically need the index arithmetic — they're less error-prone and read closer to intent.

## Array methods
A handful of methods cover almost everything you'll do with sensor data:

```javascript
// filter: keep only readings within a sane range (LaserScan uses range_min/range_max)
const valid = ranges.filter(r => r > 0.05 && r < 10.0);

// map: transform every element — e.g. convert meters to centimeters
const cm = ranges.map(r => r * 100);

// reduce: fold into a single value — e.g. the closest obstacle
const closest = ranges.reduce((min, r) => Math.min(min, r), Infinity);

// find: first element (or reading index) matching a condition
const firstClose = ranges.find(r => r < 0.3);
```

`filter`, `map`, and `reduce` each return a *new* array or value rather than mutating the original — this matters once you're re-rendering the DOM from `ranges` on every incoming message, since you can freely derive `valid`/`closest`/etc. without corrupting the data you just received.

## Time to Practice!
Extend your `app.js` to subscribe to your robot's laser scan topic (using the same `op: 'subscribe'` Rosbridge message pattern from Unit 3/7, adapted for subscribing instead of publishing), and on each incoming message: compute the closest reading with `reduce`, and write it into a `<span id="range">` element from your Unit 6 dashboard tile. Confirm the number updates live as an obstacle moves closer to or farther from the robot.

## Conclusions
You can now turn a stream of array-shaped ROS 2 sensor data into live numbers on screen. Everything from Unit 3 through Unit 8 has been hand-written DOM manipulation — from Unit 9 onward you'll rebuild these same ideas using React, which manages the DOM updates for you.
