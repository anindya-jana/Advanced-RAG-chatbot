import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeBlock.css';

const CodeBlock = ({ language, value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span>{language}</span>
        <button onClick={handleCopy} className="copy-button">
          {isCopied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={atomDark}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
