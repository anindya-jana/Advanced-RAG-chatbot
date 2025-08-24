import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ sessions, onNewChat, onSelectSession, activeSession, onDeleteSession, onSetModel, model }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button onClick={onNewChat} className="new-chat-button">+ New Chat</button>
          <div className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
            &#9776;
          </div>
        </div>
        <div className="sidebar-history">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${session.id === activeSession ? 'active' : ''}`}
              onClick={() => onSelectSession(session.id)}
            >
              <span>{session.messages.length > 0 ? session.messages[0].text.substring(0, 20) : 'New Chat'}</span>
              <button onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }} className="delete-session-button">
                &#10005;
              </button>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="model-toggle">
            <button onClick={() => onSetModel('gemini-2.5-flash-lite')} className={model === 'gemini-2.5-flash-lite' ? 'active' : ''}>Fast</button>
            <button onClick={() => onSetModel('gemini-2.5-pro')} className={model === 'gemini-2.5-pro' ? 'active' : ''}>Thinking</button>
          </div>
        </div>
      </div>
      <div className="hamburger-menu" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>
    </>
  );
};

export default Sidebar;
