
import React, { useState } from "react";
import FileExplorer from "./components/FileExplorer";
import "./App.css";

const initialData = [
  {
    type: "folder",
    name: "Projects",
    children: [
      {
        type: "folder",
        name: "ReactApp",
        children: [{ type: "file", name: "App.jsx" }],
      },
    ],
  },
  {
    type: "folder",
    name: "Notes",
    children: [],
  },
];

function App() {
  const [fileData, setFileData] = useState(initialData);

  return (
    <div className="App">
      <h1>📁 React File Explorer with Upload</h1>
      <FileExplorer data={fileData} setData={setFileData} />
    </div>
  );
}

export default App;
