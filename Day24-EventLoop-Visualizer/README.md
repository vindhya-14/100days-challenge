# JavaScript Event Loop Visualizer

## Output
https://eventloop-visualizer.netlify.app/

## Overview

The JavaScript Event Loop Visualizer is an interactive tool designed to help developers understand how JavaScript's event loop, call stack, and task queues work. It provides a visual representation of code execution, showing how synchronous code, microtasks (Promises), and macrotasks (setTimeout, setInterval) are processed.

## Features

- **Interactive Code Editor**: Write and execute JavaScript code to see how it's processed by the event loop
- **Visual Components**:
  - Call Stack
  - Web APIs
  - Microtask Queue (for Promises)
  - Macrotask Queue (for setTimeout/setInterval)
- **Console Output**: See the actual execution order of your code
- **Animation Controls**: Adjust the visualization speed
- **Examples**: Pre-loaded code examples demonstrating common event loop scenarios
- **Educational Content**: Detailed explanation of how the event loop works

## How to Use

1. **Write or paste JavaScript code** in the editor
   - Focus on code that demonstrates asynchronous behavior (Promises, setTimeout, etc.)
2. **Click "Run Code"** to start the visualization
3. **Observe** how different operations move through:
   - The call stack (synchronous execution)
   - Web APIs (for asynchronous operations)
   - Task queues (microtasks and macrotasks)
4. **Adjust the speed** slider to control animation timing
5. **Try the examples** to see common event loop patterns
6. **Switch to the Explanation tab** to learn more about how the event loop works

## Examples Included

1. **Basic Example**:
   ```javascript
   console.log('A');
   setTimeout(() => console.log('B'), 0);
   Promise.resolve().then(() => console.log('C'));
   console.log('D');
   ```
   Demonstrates the basic order of operations: synchronous code → microtasks → macrotasks

2. **Promise Chain Example**:
   ```javascript
   console.log('Start');
   
   setTimeout(() => console.log('Timeout 1'), 0);
   setTimeout(() => console.log('Timeout 2'), 0);

   Promise.resolve()
     .then(() => console.log('Promise 1'))
     .then(() => console.log('Promise 2'));

   console.log('End');
   ```
   Shows how Promise chains are handled as microtasks

3. **Complex Example**:
   ```javascript
   console.log('Script start');

   setTimeout(() => console.log('setTimeout'), 0);

   Promise.resolve()
     .then(() => console.log('Promise 1'))
     .then(() => {
       console.log('Promise 2');
       return Promise.resolve();
     })
     .then(() => {
       console.log('Promise 3');
     });

   console.log('Script end');
   ```
   Demonstrates multiple levels of Promise chaining

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Responsive Design**: Works on desktop and mobile devices
- **Animation**: CSS transitions and JavaScript timing
- **Code Parsing**: Simple JavaScript code parsing to identify different types of operations

## Why This Matters

Understanding the event loop is crucial for:
- Writing efficient asynchronous JavaScript
- Debugging timing-related issues
- Optimizing application performance
- Preparing for technical interviews (this is a common interview topic)
