import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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
        <h2>Gemini 2.5 Pro Chat v1.2</h2>
        <p>(Created by Anindya)</p>
      </div>
      <div className="chat-messages">
        {session.messages.length === 0 && !loading && (
          <div className="welcome-message">
            <h2>What can I help with?</h2>
          </div>
        )}
        {session.messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5em', margin: 0 }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.3em', margin: 0 }} {...props} />,
                h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1em', fontWeight: 'bold', margin: 0 }} {...props} />,
                p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
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
