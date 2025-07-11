import React from 'react';

const StatsPanel = ({ tasks }) => {
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const high = tasks.filter((t) => t.priority === 'high').length;

  const percentage = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-700 mb-2">📊 Statistics</h2>

      <div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Completion</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-indigo-500 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-sm">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-gray-600">Total</p>
          <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-red-600">{high}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
