import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatsPanel from './components/StatsPanel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', task);
      setTasks([...tasks, res.data]);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'Completed';
    if (filter === 'pending') return task.status === 'Pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Task Manager
          </h1>
         

          <p className="text-lg text-gray-600">
            Organize your work and boost productivity
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <TaskForm onAdd={addTask} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1 rounded-full text-sm ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 rounded-full text-sm ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Completed
                  </button>
                </div>
              </div>
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <TaskList 
                  tasks={filteredTasks} 
                  onUpdate={updateTask} 
                  onDelete={deleteTask} 
                />
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <StatsPanel tasks={tasks} />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default App;