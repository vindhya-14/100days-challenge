import React, { useEffect, useState } from 'react';
import API from '../services/api';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ waterIntake: '', sleepHours: '', exercise: '', mood: '', date: '' });

  const fetchLogs = async () => {
    const res = await API.get('/health');
    setLogs(res.data);
  };

  const handleSubmit = async () => {
    await API.post('/health', form);
    setForm({ waterIntake: '', sleepHours: '', exercise: '', mood: '', date: '' });
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Daily Health Log</h2>

      <div className="grid gap-4">
        <input className="border p-2 rounded" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Water Intake (liters)" value={form.waterIntake} onChange={(e) => setForm({ ...form, waterIntake: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Sleep Hours" value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Exercise" value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Mood" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Add Entry
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Your Logs:</h3>
      {logs.map(log => (
        <div key={log._id} className="bg-gray-100 p-3 rounded mb-2">
          <p><strong>Date:</strong> {log.date?.slice(0, 10)}</p>
          <p><strong>Mood:</strong> {log.mood}</p>
          <p><strong>Water:</strong> {log.waterIntake} L</p>
          <p><strong>Sleep:</strong> {log.sleepHours} h</p>
          <p><strong>Exercise:</strong> {log.exercise}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
