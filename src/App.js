import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatList from './ChatList';
import ChatProfile from './ChatProfile';
import ChatConversation from './ChatConversation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatList />} />
          <Route path="/profile/:id" element={<ChatProfile />} />
          <Route path="/conversation/:id" element={<ChatConversation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;