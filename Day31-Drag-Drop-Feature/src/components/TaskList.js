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
