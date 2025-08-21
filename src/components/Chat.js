import React, { useState } from 'react';
import '../styles/Chat.css';
import CodeBlock from './CodeBlock';

const Chat = ({ session, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (upload) => {
        setImage(upload.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (input.trim() !== '' || image) {
      setLoading(true);
      await onSendMessage(input, image);
      setInput('');
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h2>Gemini 2.5 Pro Chat</h2>
        <p>(Created by Anindya)</p>
      </div>
      <div className="chat-messages">
        {session.messages.length === 0 && !loading && (
          <div className="welcome-message">
            <h2>What can I help with?</h2>
          </div>
        )}
        {session.messages.map((msg, index) => {
          const parts = msg.text.split(/(```[\s\S]*?```)/g);
          return (
            <div key={index} className={`message ${msg.sender}`}>
              {parts.map((part, i) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                  const language = part.match(/```(\w+)/)?.[1] || 'javascript';
                  const code = part.slice(language.length + 3, -3);
                  return <CodeBlock key={i} language={language} value={code} />;
                }
                return part;
              })}
            </div>
          );
        })}
        {loading && <div className="message ai">Thinking...</div>}
      </div>
      <div className="chat-input-container">
        <div className="chat-input">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <button className="attach-button" onClick={() => fileInputRef.current.click()}>+</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button className="send-button" onClick={handleSend} disabled={loading}>
            >
          </button>
        </div>
        {image && (
          <div className="image-preview">
            <img src={image} alt="preview" />
            <button onClick={() => setImage(null)}>x</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
