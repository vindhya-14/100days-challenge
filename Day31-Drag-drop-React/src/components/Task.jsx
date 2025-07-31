import React from "react";
import { Draggable } from "react-beautiful-dnd";

function Task({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: "none",
            padding: 16,
            margin: "0 0 8px 0",
            borderRadius: 4,
            background: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            ...provided.draggableProps.style,
          }}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
