import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

const DebouncedSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('API Call with:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <h2>🔍 Debounced Search</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing..."
      />
    </div>
  );
};

export default DebouncedSearch;
