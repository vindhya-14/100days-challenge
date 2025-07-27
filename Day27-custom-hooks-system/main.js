import { useState, useEffect, resetHooks } from './reactClone/customReact.js';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.getElementById('counter').textContent = `Counter: ${count}`;
    console.log(`Counter updated to ${count}`);
  }, [count]);

  document.getElementById('increment').onclick = () => {
    setCount(count + 1);
    render(); 
  };
}

function render() {
  resetHooks();
  App();
}

render();
