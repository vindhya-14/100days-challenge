import { useState } from "react";

export default function NoteForm({ addNote }) {
  const [text, setText] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await addNote({
        text,
        isEncrypted,
        priority,
        category,
        createdAt: new Date().toISOString(),
      });
      setText("");
      setIsEncrypted(false);
      setPriority("medium");
      setCategory("general");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <textarea
          placeholder="Write your note here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="ideas">Ideas</option>
            <option value="reminders">Reminders</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="encrypt"
          checked={isEncrypted}
          onChange={(e) => setIsEncrypted(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="encrypt" className="ml-2 block text-sm text-gray-700">
          Encrypt note
        </label>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {text.length}/1000 characters
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            !text.trim() || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
