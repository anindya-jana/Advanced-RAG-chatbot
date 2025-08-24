import React, { useState } from 'react';
import '../styles/ApiKeySelectionPage.css';

const ApiKeySelectionPage = ({ onApiKeySelect }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSelect = (key) => {
    onApiKeySelect(key);
  };

  return (
    <div className="api-key-selection-container">
      <div className="api-key-selection-box">
        <h2>Select API Key</h2>
        <button onClick={() => handleSelect('paid')}>Use Paid API Key</button>
        <button onClick={() => handleSelect('AIzaSyDiWGlvNrM-L-H20ZoAuCjbE9FjGkJWF54')}>Use Free API Key</button>
        <div className="custom-api-key">
          <input
            type="text"
            placeholder="Enter your own API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button onClick={() => handleSelect(apiKey)}>Use Custom API Key</button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelectionPage;
