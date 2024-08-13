import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ChatConversation.css';  // Importing the CSS file

function ChatConversation() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topic = queryParams.get('topic');
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/conversations/${id}?topic=${topic}`)
      .then(response => response.json())
      .then(data => setMessages(data));

    // Fetch buddy's questions
    fetch(`http://localhost:3000/buddies/${id}`)
      .then(response => response.json())
      .then(data => setQuestions(data.questions || []));
  }, [id, topic]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add user's message
    const newMessage = { text: input };
    setMessages([...messages, newMessage]);

    // Display the next question
    if (questionIndex < questions.length) {
      setMessages(prevMessages => [...prevMessages, newMessage, { text: questions[questionIndex] }]);
      setQuestionIndex(questionIndex + 1);
    } else {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    setInput('');
  };

  return (
    <div>
      <h1>Conversation on {topic}</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.text}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatConversation;
