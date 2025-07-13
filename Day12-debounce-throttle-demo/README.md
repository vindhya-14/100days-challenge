#  Debounce & Throttle Demo 

This project demonstrates the difference between **debouncing** and **throttling** using a clean and minimal React UI built with **Vite**.

---

##  Key Concepts (with Simple Definitions)

###  1. Debouncing
**Debouncing** means waiting for a pause before running a function.

> Example: In a search box, the app waits until the user stops typing (e.g., 500ms), then sends the API request.

<pre>
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
} 
</pre>


### 2. Throttling
Throttling means limiting how often a function is called over time.

>Example: While scrolling, throttle ensures a function runs only once every 300ms — even if the scroll fires many times.

<pre>
function throttle(func, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
</pre>
