import { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRepos = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn.elegantthemes.com/blog/wp-content/uploads/2013/09/bg-5-full.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="min-h-screen ">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-300">
          GitHub Repo Explorer
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-64"
          />
          <button
            onClick={fetchRepos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="border rounded-lg p-4 bg-white shadow"
              >
                <h2 className="text-xl font-semibold">{repo.name}</h2>
                <p className="text-sm text-gray-600">
                  {repo.description || "No description"}
                </p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2 block"
                >
                  View Repository
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
