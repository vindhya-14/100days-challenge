import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, loading, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('githubSearchHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // Save to history when a new search is made
  const addToHistory = (username) => {
    if (!username.trim()) return;
    
    const updatedHistory = [
      username,
      ...history.filter(item => item.toLowerCase() !== username.toLowerCase())
    ].slice(0, 5); // Keep only 5 most recent
    
    setHistory(updatedHistory);
    localStorage.setItem('githubSearchHistory', JSON.stringify(updatedHistory));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const searchValue = extractUsername(value);
    if (searchValue) {
      onSearch(searchValue);
      addToHistory(searchValue);
    }
  };

  // Extract username from URL or return the input as is
  const extractUsername = (input) => {
    if (!input) return null;
    
    // If it's a GitHub URL, extract the username
    const urlMatch = input.match(/github\.com\/([^\/]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
    
    // Otherwise return the trimmed input
    return input.trim();
  };

  const handleHistorySelect = (username) => {
    setValue(username);
    onSearch(username);
    addToHistory(username);
    setShowHistory(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={onSubmit} 
        aria-label="Search GitHub user"
        className="space-y-2"
      >
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <input
            className={`block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out ${isFocused ? 'border-indigo-300' : 'border-gray-300'}`}
            placeholder="Enter GitHub username or profile URL"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowHistory(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowHistory(false), 200);
            }}
            aria-label="GitHub username or URL"
          />
          
          {value && (
            <button 
              type="button" 
              className="absolute right-24 inset-y-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setValue("")}
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          
          <button 
            type="submit" 
            className="ml-2 inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            disabled={loading || !value.trim()}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                Get Repos
              </>
            )}
          </button>
        </div>
        
        {showHistory && history.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Recent searches</div>
            {history.map((item, index) => (
              <button
                key={index}
                type="button"
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                onClick={() => handleHistorySelect(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        
        
      </form>
    </div>
  );
}