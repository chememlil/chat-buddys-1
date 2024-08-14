import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ChatConversation.css';

function ChatConversation() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topic = queryParams.get('topic');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [needsExplanation, setNeedsExplanation] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('/db.json')
      .then(response => response.json())
      .then(data => {
        setMessages(data.conversations[id] ? data.conversations[id][topic] : []);
        if (data.buddies[id]) {
          setQuestions(data.buddies[id].questions || []);
        }
      });
  }, [id, topic]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const userMessage = input.trim();
    if (!userMessage) return;
  
    const newMessage = { text: userMessage, sender: 'user' };
  
    if (needsExplanation) {
      if (userMessage.toLowerCase() === 'no') {
        const explanation = getExplanation(currentFact, topic);
        setMessages([...messages, newMessage, { text: `No problem! Here's more information: ${explanation}`, sender: 'buddy' }]);
        setNeedsExplanation(false);
        setCurrentFact('');
      } else if (userMessage.toLowerCase() === 'yes') {
        setMessages([...messages, newMessage, { text: "That's nice! You're quite knowledgeable!", sender: 'buddy' }]);
        setNeedsExplanation(false);
        setCurrentFact('');
      } else {
        setMessages([...messages, newMessage, { text: "Got it! Feel free to ask for another fact.", sender: 'buddy' }]);
        setNeedsExplanation(false);
        setCurrentFact('');
      }
      setInput('');
      return;
    }
  
    const greetingResponse = getGreetingResponse(userMessage);
    if (greetingResponse) {
      setMessages([...messages, newMessage, { text: greetingResponse, sender: 'buddy' }]);
    } else {
      setMessages([...messages, newMessage]);
  
      const response = getAIResponse(userMessage, topic);
      if (response) {
        setMessages(prevMessages => [...prevMessages, { text: response, sender: 'buddy' }]);
        setCurrentFact(response);  // Store the current fact for future explanation
        setNeedsExplanation(true); // Flag for explanation
      }
  
      if (questionIndex < questions.length) {
        setMessages(prevMessages => [...prevMessages, { text: questions[questionIndex], sender: 'buddy' }]);
        setQuestionIndex(questionIndex + 1);
      }
    }
  
    setInput('');
  };
  

  const getAIResponse = (userInput, topic) => {
    const responses = {
      political: [
        "Did you know that the United Nations was founded in 1945?",
        "Did you know that democracy originated in ancient Greece?",
        "Did you know that the United States has a two-party system?",
        "Did you know that the European Union is a political and economic union?",
        "Did you know that the Cold War was a period of geopolitical tension between the US and USSR?"
      ],
      emotional: [
        "Did you know that expressing gratitude can increase happiness?",
        "Did you know that laughter triggers the release of endorphins?",
        "Did you know that music can influence your emotions?",
        "Did you know that talking to friends can reduce stress?",
        "Did you know that physical touch can lower blood pressure?"
      ],
      scientific: [
        "Did you know that water makes up about 71% of the Earth's surface?",
        "Did you know that the speed of light is approximately 299,792 kilometers per second?",
        "Did you know that humans share 60% of their DNA with bananas?",
        "Did you know that the universe is estimated to be 13.8 billion years old?",
        "Did you know that honey never spoils?"
      ]
    };

    const facts = responses[topic] || [];
    return facts[Math.floor(Math.random() * facts.length)];
  };

  const getGreetingResponse = (userInput) => {
    const greetings = {
      'hey': 'Hey there! How can I help you today?',
      'morning': 'Good morning! How’s your day going?',
      'hello': 'Hello! What’s up?',
      'hi': 'Hi! What can I do for you today?',
      'good evening': 'Good evening! How was your day?'
    };

    const lowerInput = userInput.toLowerCase();
    return greetings[lowerInput];
  };

  const getExplanation = (fact, topic) => {
    const explanations = {
      political: {
        "Did you know that the United Nations was founded in 1945?": "The United Nations was established in 1945 to promote peace and cooperation among countries following the devastation of World War II.",
        "Did you know that democracy originated in ancient Greece?": "Ancient Greece is often credited as the birthplace of democracy, where citizens had a direct role in decision-making.",
        "Did you know that the United States has a two-party system?": "The U.S. political system is dominated by two major parties, the Democratic Party and the Republican Party, which influence much of its politics.",
        "Did you know that the European Union is a political and economic union?": "The EU is a unique political and economic partnership between European countries that work together on various policies and regulations.",
        "Did you know that the Cold War was a period of geopolitical tension between the US and USSR?": "The Cold War was a state of political and military tension between the United States and the Soviet Union from the end of World War II until the collapse of the Soviet Union."
      },
      emotional: {
        "Did you know that expressing gratitude can increase happiness?": "Gratitude is linked to increased well-being and happiness because it shifts focus from what is lacking to what is present.",
        "Did you know that laughter triggers the release of endorphins?": "Laughter triggers the release of endorphins, which are natural chemicals in the brain that promote a sense of well-being.",
        "Did you know that music can influence your emotions?": "Music has the ability to evoke and modulate emotions, helping people manage feelings and enhance moods.",
        "Did you know that talking to friends can reduce stress?": "Social interactions and support from friends can lower stress levels and improve mental health.",
        "Did you know that physical touch can lower blood pressure?": "Physical touch, such as hugging or holding hands, can lower blood pressure and decrease stress levels."
      },
      scientific: {
        "Did you know that water makes up about 71% of the Earth's surface?": "Water covers a majority of the Earth's surface, with oceans making up about 71% of it, which is crucial for sustaining life.",
        "Did you know that the speed of light is approximately 299,792 kilometers per second?": "The speed of light is a fundamental constant in physics, essential for our understanding of the universe's structure.",
        "Did you know that humans share 60% of their DNA with bananas?": "Many basic biological processes are shared across species, including some fundamental genetic components.",
        "Did you know that the universe is estimated to be 13.8 billion years old?": "This estimate comes from observations of cosmic background radiation and the expansion of the universe.",
        "Did you know that honey never spoils?": "Honey's natural composition and low moisture content prevent bacterial growth, allowing it to remain edible indefinitely."
      }
    };

    return explanations[topic][fact] || "No additional information available.";
  };

  return (
    <div className="chat-conversation">
      <h1>Conversation on {topic}</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* This div helps to scroll to the bottom */}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="input-field"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default ChatConversation;