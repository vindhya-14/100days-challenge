import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    const res = await axios.get(`https://randomuser.me/api/?page=${page}&results=10`);
    setUsers(prev => [...prev, ...res.data.results]);
  };

  
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <div style={{ padding: '20px' }}>
      <h1> Infinite Scroll Users</h1>
      {users.map((user, idx) => (
        <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <strong>{user.name.first} {user.name.last}</strong> - {user.email}
        </div>
      ))}
      <div ref={loader} style={{ height: '100px' }}>
        <p>Loading more users...</p>
      </div>
    </div>
  );
}

export default App;
