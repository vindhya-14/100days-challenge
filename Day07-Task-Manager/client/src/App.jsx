import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsPanel from './components/StatsPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'https://task-manager-hc0x.onrender.com/api/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setTasks(res.data);
      setIsLoading(false);
    } catch {
      toast.error('⚠️ Failed to fetch tasks');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await axios.post(BASE_URL, task);
      setTasks([...tasks, res.data]);
      toast.success('🎉 Task added!');
    } catch {
      toast.error('❌ Error adding task');
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
      toast.success('✅ Task updated!');
    } catch {
      toast.error('⚠️ Update failed');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('🗑️ Task deleted');
    } catch {
      toast.error('❌ Could not delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'pending') return task.status === 'Pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">✨ Smart Task Manager</h1>
          <p className="text-md text-gray-600 mt-2">Stay organized. Prioritize smartly.</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl mb-6">
          <TaskForm onAdd={addTask} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-md">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
                <div className="flex gap-2">
                  {['all', 'pending', 'completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-sm rounded-full transition-all ${
                        filter === f
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <TaskList tasks={filteredTasks} onUpdate={updateTask} onDelete={deleteTask} />
              )}
            </div>
          </div>
          <div>
            <StatsPanel tasks={tasks} />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default App;
