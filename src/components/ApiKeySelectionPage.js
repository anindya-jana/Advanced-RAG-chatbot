import React, { useState } from 'react';
import '../styles/ApiKeySelectionPage.css';

const ApiKeySelectionPage = ({ onApiKeySelect }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSelect = () => {
    if (apiKey.trim() !== '') {
      onApiKeySelect(apiKey);
    }
  };

  return (
    <div className="api-key-selection-container">
      <div className="api-key-selection-box">
        <h2>Enter Your API Key</h2>
        <div className="custom-api-key">
          <input
            type="text"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSelect()}
          />
          <button onClick={handleSelect}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelectionPage;
