import React from 'react';

const StatsPanel = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Task Statistics</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Completion</span>
            <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-red-600">{highPriorityTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;