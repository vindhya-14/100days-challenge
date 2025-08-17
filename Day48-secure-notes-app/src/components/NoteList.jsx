export default function NoteList({ notes, deleteNote }) {
  return (
    <div className="space-y-4 mt-6">
      {notes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No notes yet. Add your first note!</p>
        </div>
      ) : (
        notes.map((note, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm border-l-4 ${getPriorityBorder(
              note.priority
            )} bg-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-800">{note.text}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getCategoryBadge(
                      note.category
                    )}`}
                  >
                    {note.category}
                  </span>
                  {note.isEncrypted && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      🔒 Encrypted
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteNote(index)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                aria-label="Delete note"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Helper functions for styling
function getPriorityBorder(priority) {
  switch (priority) {
    case "high":
      return "border-red-500";
    case "medium":
      return "border-yellow-500";
    case "low":
      return "border-green-500";
    default:
      return "border-gray-300";
  }
}

function getCategoryBadge(category) {
  switch (category) {
    case "work":
      return "bg-blue-100 text-blue-800";
    case "personal":
      return "bg-green-100 text-green-800";
    case "ideas":
      return "bg-yellow-100 text-yellow-800";
    case "reminders":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
