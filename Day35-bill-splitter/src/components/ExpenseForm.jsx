import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiDollarSign, FiUser } from 'react-icons/fi';

export default function ExpenseForm({ participants, setExpenses }) {
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [error, setError] = useState('');

  const addExpense = () => {
    if (!payer) {
      setError('Please select a payer');
      return;
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!expenseName.trim()) {
      setError('Please enter an expense description');
      return;
    }
    if (selectedParticipants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    setExpenses((prev) => [
      ...prev,
      {
        name: expenseName.trim(),
        payer,
        amount: parseFloat(amount),
        participants: selectedParticipants,
        date: new Date().toISOString()
      }
    ]);
    
    // Reset form
    setPayer('');
    setAmount('');
    setExpenseName('');
    setSelectedParticipants([]);
    setError('');
  };

  const toggleParticipant = (participant) => {
    setSelectedParticipants(prev =>
      prev.includes(participant)
        ? prev.filter(p => p !== participant)
        : [...prev, participant]
    );
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <FiPlus className="text-green-500" />
        Add New Expense
      </h2>

      <div className="space-y-4">
        {/* Expense Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expense Description</label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            placeholder="e.g. Dinner, Taxi, Groceries"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
        </div>

        {/* Payer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payer</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-10 py-2 appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            >
              <option value="">Who paid for this?</option>
              {participants.map((p, index) => (
                <option key={index} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            />
          </div>
        </div>

        {/* Participants Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Split Between</label>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleParticipant(participant)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition ${selectedParticipants.includes(participant) ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}
              >
                {selectedParticipants.includes(participant) && (
                  <span className="text-green-500">✓</span>
                )}
                {participant}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm p-2 bg-red-50 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addExpense}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-colors mt-4 flex items-center justify-center gap-2"
        >
          <FiPlus />
          Add Expense
        </motion.button>
      </div>
    </motion.div>
  );
}