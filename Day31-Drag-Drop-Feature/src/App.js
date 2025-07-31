import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import TaskList from "./components/TaskList";
import initialData from "./data/initialData";

function App() {
  const [tasks, setTasks] = useState(initialData);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setTasks(reordered);
  };

  return (
    <div className="app-container">
      <h2>📝 Drag & Drop Task List</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <TaskList tasks={tasks} />
      </DragDropContext>
    </div>
  );
}

export default App;
