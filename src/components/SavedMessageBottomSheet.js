import React, { useState } from 'react';
import './SavedMessageBottomSheet.css';

const SavedMessageBottomSheet = ({ onContinue, onClose }) => {
  const [selectedDraft, setSelectedDraft] = useState(0); // null when compose is active
  const [isComposeExpanded, setIsComposeExpanded] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true); // Default checked
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isComposeActive, setIsComposeActive] = useState(false); // Track if compose message is being used

  const draftMessages = [
    "Hi! I came across your profile and found it interesting. Would love to connect and know more about you.",
    "Your profile caught my attention. I believe we share similar values and interests. Looking forward to hearing from you!",
    "Hello! I'm interested in getting to know you better. Let's connect and see if we're a good match."
  ];

  // Handle radio button selection
  const handleRadioSelect = (index) => {
    setSelectedDraft(index);
    setIsComposeActive(false); // Deactivate compose
    setIsComposeExpanded(false); // Collapse compose section
    setCustomMessage(''); // Clear custom message
  };

  // Handle custom message change - deselect radio buttons when typing
  const handleCustomMessageChange = (value) => {
    setCustomMessage(value);
    if (value.trim()) {
      setIsComposeActive(true); // Activate compose mode
      setSelectedDraft(null); // Deselect all radio buttons
    } else {
      // If cleared, reselect first radio
      setIsComposeActive(false);
      setSelectedDraft(0);
    }
  };

  // Get the message to send based on current selection
  const getMessageToSend = () => {
    if (isComposeActive && customMessage.trim()) {
      return customMessage.trim();
    }
    return draftMessages[selectedDraft] || draftMessages[0];
  };

  const handleContinue = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = () => {
    const messageToSend = getMessageToSend();
    onContinue(messageToSend);
  };

  if (showConfirmation) {
    return (
      <div className="bottom-sheet-overlay" onClick={onClose}>
        <div className="bottom-sheet confirmation-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="bottom-sheet-header">
            <h3 className="bottom-sheet-title">Confirmation</h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="confirmation-content">
            <p className="confirmation-text">This message will be sent to all of your further connection request</p>
            
            <div className="selected-message-display">
              <p>{getMessageToSend()}</p>
            </div>

            <button className="tertiary-btn" onClick={() => setShowConfirmation(false)}>
              <span>Change message</span>
              <span className="arrow-icon">∨</span>
            </button>

            <button className="primary-btn" onClick={handleConfirmation}>
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-header">
          <h3 className="bottom-sheet-title">Saved Message</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="bottom-sheet-subtext">
          Pick a message well-suited and will be sending the same message to all of your interested prospects
        </p>

        <div className="saved-messages-section">
          <h4 className="section-heading">Saved Message</h4>
          
          {draftMessages.map((message, index) => (
            <div key={index} className="message-draft">
              <input
                type="radio"
                id={`draft-${index}`}
                name="draft-message"
                checked={selectedDraft === index && !isComposeActive}
                onChange={() => handleRadioSelect(index)}
                className="radio-input"
              />
              <label htmlFor={`draft-${index}`} className="message-label">
                <span className="message-text">{message}</span>
                {selectedDraft === index && !isComposeActive && <span className="default-badge">Default</span>}
              </label>
            </div>
          ))}
        </div>

        <div className="compose-section">
          <div 
            className="compose-header" 
            onClick={() => setIsComposeExpanded(!isComposeExpanded)}
          >
            <h4 className="compose-title">Compose Message</h4>
            <span className="expand-icon">{isComposeExpanded ? '∧' : '∨'}</span>
          </div>

          {isComposeExpanded && (
            <div className="compose-content">
              <textarea
                className="compose-textarea"
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => handleCustomMessageChange(e.target.value)}
                rows={4}
              />
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="set-default"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                />
                <label htmlFor="set-default">Set as default message for all future interest</label>
              </div>
            </div>
          )}
        </div>

        <button 
          className="primary-btn" 
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SavedMessageBottomSheet;
