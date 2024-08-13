import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ChatList() {
  const [buddies, setBuddies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/buddies")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setBuddies(data))
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Chat Buddies</h1>
      {error ? (
        <p>Error loading buddies: {error}</p>
      ) : (
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
      )}
    </div>
  );
}

export default ChatList;
