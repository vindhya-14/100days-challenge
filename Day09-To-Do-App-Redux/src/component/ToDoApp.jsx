import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, deleteTodo } from "../redux/actions";
const ToDoApp = () => {

    const [input,setInput] = useState('');
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();

    const handleAdd = () => {
        if(input.trim())
        {
            dispatch(addTodo(input));
            setInput('');
        }
    }

    const handleDelete = (index) => {
        dispatch(deleteTodo(index));
    }

  return (
    <div>
      <h2>To-Do App</h2>
      <div>
        <input
          type="text"
          value={input}
          placeholder="Enter a new task"
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      <ul>
        {todos.length == 0 ? (
          <p>No tasks yet</p>
        ) : (
          todos.map((todo, index) => (
            <li key={index}>
              {todo}
              <button onClick={() => handleDelete(index)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ToDoApp;
