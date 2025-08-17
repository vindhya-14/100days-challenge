import { useState } from "react";
import {
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";

export default function ProtectedNote({ notes }) {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");

  const handleUnlock = (e) => {
    e.preventDefault();

    // Simple rate limiting
    if (attempts >= 3) {
      setError("Too many attempts. Try again later.");
      return;
    }

    if (password === "admin123") {
      setUnlocked(true);
      setError("");
      setAttempts(0);
    } else {
      setAttempts(attempts + 1);
      setError(`Wrong password! ${3 - attempts} attempts remaining.`);
    }
  };

  const handleLock = () => {
    setUnlocked(false);
    setPassword("");
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
        <FiLock className="mr-2 text-gray-600" />
        <h3 className="font-medium text-gray-800">Protected Notes</h3>
      </div>

      {!unlocked ? (
        <div className="p-4">
          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && (
              <div className="flex items-center text-red-500 text-sm">
                <FiAlertCircle className="mr-1" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!password || attempts >= 3}
              className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                !password || attempts >= 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FiUnlock className="mr-2" />
              Unlock
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {notes.length} protected note{notes.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={handleLock}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiLock className="mr-1" />
              Lock
            </button>
          </div>

          <ul className="divide-y">
            {notes.length > 0 ? (
              notes.map((note, idx) => (
                <li key={idx} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                      {idx + 1}
                    </span>
                    <p className="text-gray-800">{note}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-gray-500">
                No protected notes available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
