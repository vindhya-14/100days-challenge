import React from "react";
import AutoComplete from "./components/AutoComplete";

const countries = [
  "India",
  "Indonesia",
  "Ireland",
  "Iran",
  "Iraq",
  "Italy",
  "Iceland",
  "Israel",
  "Ivory Coast",
  "USA",
  "UK",
  "Ukraine",
  "Uganda",
  "UAE",
  "Uruguay",
];

function App() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🌍 Country Search (Typeahead)</h1>
      <AutoComplete suggestions={countries} />
    </div>
  );
}

export default App;
