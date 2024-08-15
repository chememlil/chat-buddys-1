import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChatList() {
  const [buddies, setBuddies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedBuddies = localStorage.getItem('chatBuddies');
    if (cachedBuddies) {
      setBuddies(JSON.parse(cachedBuddies));
      setLoading(false);
    } else {
      fetchBuddies();
    }
  }, []);

  const fetchBuddies = () => {
    fetch("http://localhost:3000/buddies")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBuddies(data);
        localStorage.setItem('chatBuddies', JSON.stringify(data));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Chat Buddies</h1>
      <ul>
        {buddies.map(buddy => (
          <li key={buddy.id}>
            <Link to={`/profile/${buddy.id}`}>
              <img src={buddy.profilePic} alt={buddy.name} />
              {buddy.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;