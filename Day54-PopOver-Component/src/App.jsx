import React from "react";
import Popover from "./components/popover/Popover";

function App() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Popover Demo</h1>
      <Popover buttonLabel="Show Info">
        <p>This is a simple popover content 🎉</p>
      </Popover>
    </div>
  );
}

export default App;
