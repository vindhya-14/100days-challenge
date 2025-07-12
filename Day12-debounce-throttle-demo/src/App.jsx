import React from 'react';
import DebouncedSearch from './components/DebouncedSearch';
import ThrottledScroll from './components/ThrottledScroll';

function App() {
  return (
    <div>
      <h1>Debounce & Throttle Demo</h1>
      <DebouncedSearch />
      <ThrottledScroll />
    </div>
  );
}

export default App;
