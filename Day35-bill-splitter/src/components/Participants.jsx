import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUser, FiX, FiCheck } from 'react-icons/fi';

export default function Participants({ participants, setParticipants }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const addParticipant = () => {
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (participants.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Participant already exists');
      return;
    }

    setParticipants([...participants, { 
      id: Date.now(),
      name: name.trim() 
    }]);
    setName('');
    setError('');
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const startEditing = (participant) => {
    setEditingId(participant.id);
    setEditName(participant.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    setParticipants(participants.map(p => 
      p.id === editingId ? { ...p, name: editName.trim() } : p
    ));
    setEditingId(null);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FiUserPlus className="text-2xl text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Participants</h2>
        <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {participants.length} {participants.length === 1 ? 'person' : 'people'}
        </span>
      </div>

      {/* Add Participant Form */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter participant name"
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addParticipant}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiUserPlus />
          Add
        </motion.button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm p-2 bg-red-50 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      {/* Participants List */}
      <div className="space-y-2">
        <AnimatePresence>
          {participants.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 text-gray-500"
            >
              No participants added yet
            </motion.div>
          )}

          {participants.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {editingId === participant.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-grow border border-gray-300 rounded px-3 py-1 mr-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="p-1 text-green-500 hover:text-green-700"
                      title="Save"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Cancel"
                    >
                      <FiX />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(participant)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <FiX />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}