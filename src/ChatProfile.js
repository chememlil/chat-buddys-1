import React from 'react';
import { useParams, Link } from 'react-router-dom';

function ChatProfile() {
  const { id } = useParams();
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    fetch(`http://localhost:3000/buddies/${id}`)
      .then(response => response.json())
      .then(data => setProfile(data));
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <img src={profile.profilePic} alt={profile.name} />
      <p>Choose a conversation topic:</p>
      <ul>
        <li><Link to={`/conversation/${id}?topic=political`}>Political</Link></li>
        <li><Link to={`/conversation/${id}?topic=emotional`}>Emotional</Link></li>
        <li><Link to={`/conversation/${id}?topic=scientific`}>Scientific</Link></li>
      </ul>
    </div>
  );
}

export default ChatProfile;
