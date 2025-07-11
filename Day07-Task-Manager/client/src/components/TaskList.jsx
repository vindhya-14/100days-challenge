import React, { useState } from 'react';
import { format } from 'date-fns';

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');
  const [editPriority, setEditPriority] = useState('medium');

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditPriority(task.priority || 'medium');
  };

  const handleSave = () => {
    onUpdate(editId, {
      title: editTitle,
      status: editStatus,
      priority: editPriority,
    });
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const getPriorityBadge = (priority) => {
    const baseStyle = "text-xs px-2 py-1 rounded-full font-semibold capitalize";
    const styles = {
      high: `bg-red-100 text-red-700 border border-red-300`,
      medium: `bg-yellow-100 text-yellow-700 border border-yellow-300`,
      low: `bg-green-100 text-green-700 border border-green-300`,
    };
    return (
      <span className={`${baseStyle} ${styles[priority] || 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="divide-y divide-gray-100">
      {tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>📭 No tasks yet. Start by adding one!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-gray-50 transition rounded-lg">
            {editId === task.id ? (
              <div className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-3">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="text-sm px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-sm px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() =>
                      onUpdate(task.id, {
                        title: task.title,
                        status: task.status === 'Completed' ? 'Pending' : 'Completed',
                        priority: task.priority,
                      })
                    }
                    className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                      task.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {task.status === 'Completed' && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <div>
                    <p
                      className={`font-semibold ${
                        task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="text-sm mt-1 flex items-center gap-2 text-gray-500">
                      {getPriorityBadge(task.priority)}
                      <span className="text-xs">{format(new Date(task.createdAt), 'MMM d, yyyy • h:mm a')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => handleEdit(task)}
                    title="Edit Task"
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    title="Delete Task"
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
