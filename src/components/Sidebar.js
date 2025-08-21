import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ sessions, onNewChat, onSelectSession, activeSession }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button onClick={onNewChat} className="new-chat-button">+ New Chat</button>
      </div>
      <div className="sidebar-history">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`session-item ${session.id === activeSession ? 'active' : ''}`}
            onClick={() => onSelectSession(session.id)}
          >
            {session.messages.length > 0 ? session.messages[0].text.substring(0, 20) : 'New Chat'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
