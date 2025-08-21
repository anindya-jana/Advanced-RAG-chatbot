import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import LoginPage from './components/LoginPage';
import { createChatSession } from './api/gemini';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      return parsedSessions.map(session => ({
        ...session,
        chat: createChatSession(), // Re-create chat session
      }));
    }
    return [];
  });
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    } else if (!activeSession && sessions.length > 0) {
      setActiveSession(sessions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sessionsToSave = sessions.map(({ id, messages }) => ({ id, messages }));
    localStorage.setItem('chatSessions', JSON.stringify(sessionsToSave));
  }, [sessions]);

  const handleNewChat = () => {
    const newSession = {
      id: Date.now(),
      chat: createChatSession(),
      messages: [],
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
    setActiveSession(newSession.id);
  };

  const handleSelectSession = (id) => {
    setActiveSession(id);
  };

  const handleSendMessage = async (message, image) => {
    const userMessage = { text: message, sender: 'user' };
    if (image) {
      userMessage.image = image;
    }

    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        return { ...session, messages: [...session.messages, userMessage] };
      }
      return session;
    });
    setSessions(updatedSessions);

    const activeChat = sessions.find(session => session.id === activeSession);
    let response;
    if (image) {
      const imageParts = [
        {
          inlineData: {
            data: image.split(',')[1],
            mimeType: image.split(';')[0].split(':')[1],
          },
        },
      ];
      response = await activeChat.chat.sendMessage([message, ...imageParts]);
    } else {
      response = await activeChat.chat.sendMessage(message);
    }

    const aiMessage = { text: response.response.text(), sender: 'ai' };

    const finalSessions = updatedSessions.map(session => {
      if (session.id === activeSession) {
        return { ...session, messages: [...session.messages, aiMessage] };
      }
      return session;
    });
    setSessions(finalSessions);
  };

  const activeChat = sessions.find(session => session.id === activeSession);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <Sidebar
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSession={activeSession}
      />
      {activeChat && <Chat session={activeChat} onSendMessage={handleSendMessage} />}
    </div>
  );
}

export default App;
