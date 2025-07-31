import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

function TaskList({ tasks }) {
  return (
    <Droppable droppableId="taskList">
      {(provided) => (
        <div
          className="task-list"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: "#e0f7fa",
            padding: 16,
            borderRadius: 8,
            minHeight: 200,
          }}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskList;
