import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import LoginPage from './components/LoginPage';
import ApiKeySelectionPage from './components/ApiKeySelectionPage';
import { createChatSession, initializeApi } from './api/gemini';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [model, setModel] = useState('gemini-2.5-pro');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    if (apiKey && sessions.length === 0) {
      handleNewChat();
    } else if (apiKey && !activeSession && sessions.length > 0) {
      setActiveSession(sessions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    if (sessions.length > 0) {
      const sessionsToSave = sessions.map(({ id, messages }) => ({ id, messages }));
      localStorage.setItem('chatSessions', JSON.stringify(sessionsToSave));
    }
  }, [sessions]);

  const handleNewChat = () => {
    const newSession = {
      id: Date.now(),
      chat: createChatSession(model),
      messages: [],
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
    setActiveSession(newSession.id);
  };

  const handleSelectSession = (id) => {
    setActiveSession(id);
  };

  const handleSetModel = (model) => {
    setModel(model);
  };

  const handleDeleteSession = (id) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    setSessions(updatedSessions);
    if (activeSession === id) {
      setActiveSession(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
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

  const handleApiKeySelect = (key) => {
    initializeApi(key);
    setApiKey(key);
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions.map(session => ({
        ...session,
        chat: createChatSession(model), // Re-create chat session
      })));
    } else {
      handleNewChat();
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (!apiKey) {
    return <ApiKeySelectionPage onApiKeySelect={handleApiKeySelect} />;
  }

  return (
    <div className="App">
      <Sidebar
        sessions={sessions}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        activeSession={activeSession}
        onDeleteSession={handleDeleteSession}
        onSetModel={handleSetModel}
        model={model}
      />
      {activeChat && <Chat session={activeChat} onSendMessage={handleSendMessage} />}
    </div>
  );
}

export default App;
