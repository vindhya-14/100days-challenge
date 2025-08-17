import { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ProtectedNote from "./components/ProtectedNote";
import { encryptData, decryptData } from "./utils/crypto";
import { FiPlus, FiShield, FiList } from "react-icons/fi";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("secureNotes");
      if (saved) {
        const decrypted = decryptData(saved);
        setNotes(Array.isArray(decrypted) ? decrypted : []);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("secureNotes", encryptData(notes));
      } catch (error) {
        console.error("Failed to save notes:", error);
      }
    }
  }, [notes, isLoading]);

  const addNote = (newNote) => {
    setNotes([...notes, { ...newNote, id: Date.now() }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes =
    activeTab === "protected"
      ? notes.filter((note) => note.isEncrypted)
      : notes;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <FiShield className="mr-2 text-blue-600" />
            Secure Notes
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your thoughts, encrypted and protected
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <NoteForm addNote={addNote} />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiList className="mr-2" />
                All Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab("protected")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                  activeTab === "protected"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FiShield className="mr-2" />
                Protected ({notes.filter((n) => n.isEncrypted).length})
              </button>
            </nav>
          </div>

          <div className="p-4">
            <NoteList notes={filteredNotes} deleteNote={deleteNote} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <ProtectedNote notes={notes.filter((note) => note.isEncrypted)} />
        </div>
      </div>
    </div>
  );
}
