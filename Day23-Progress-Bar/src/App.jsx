import React, { useState } from 'react';
import ProgressBar from './components/ProgressBar';

function App() {
  const [value, setValue] = useState(70);

  return (
    <div style={{ padding: '20px' }}>
      <h2> Progress Bar </h2>
      <ProgressBar value={value} width="60%" height="25px" />

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '60%', marginTop: '20px' }}
      />
    </div>
  );
}

export default App;
