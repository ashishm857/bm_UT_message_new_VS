import React, { useState, useEffect, useRef } from 'react';
import './MessageWindow.css';
import SavedMessageBottomSheet from './SavedMessageBottomSheet';

const MessageWindow = ({ profile, onClose, onSendMessage, onViewProfile }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'profile'
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [defaultMessage, setDefaultMessage] = useState('');
  const [showSavedMessageSheet, setShowSavedMessageSheet] = useState(false);
  const [initialComposeMessage, setInitialComposeMessage] = useState('');
  const [freshChips, setFreshChips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const textareaRef = useRef(null);
  const longPressTimer = useRef(null);

  // AI Fresh messages (pastel red chips)
  const aiFreshMessages = [
    "Hi, I went through your profile and found it quite nice. Would like to connect and know you better",
    "Hi, sending this request with respect. Please feel free to respond only if you're comfortable",
    "Hi, I liked your profile. Sending a request to connect",
    "Hello, your profile resonated with what I'm looking for in a partner. Let's connect if you're open to it."
  ];

  // Default draft messages
  const defaultDraftMessages = [
    "Hi! I came across your profile and found it interesting. Would love to connect and know more about you.",
    "Your profile caught my attention. I believe we share similar values and interests. Looking forward to hearing from you!",
    "Hello! I'm interested in getting to know you better. Let's connect and see if we're a good match."
  ];

  // Load saved drafts and default message from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sessionSavedMessages');
    if (saved) {
      setSavedDrafts(JSON.parse(saved));
    } else {
      setSavedDrafts(defaultDraftMessages);
    }
    
    // Load the actual default message
    const sessionDefault = localStorage.getItem('sessionDefaultMessage');
    setDefaultMessage(sessionDefault || defaultDraftMessages[0]);
  }, []);

  // Long press handlers
  const handleLongPressStart = (messageText = '') => {
    longPressTimer.current = setTimeout(() => {
      setInitialComposeMessage(messageText);
      setShowSavedMessageSheet(true);
    }, 500); // 500ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Handle AI refresh icon click - add fresh chip randomly
  const handleAIRefresh = () => {
    // Trigger rotation animation
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    
    // Get remaining messages that haven't been added yet
    const remainingMessages = aiFreshMessages.filter(msg => !freshChips.includes(msg));
    
    if (remainingMessages.length > 0) {
      // Pick a random message from remaining
      const randomIndex = Math.floor(Math.random() * remainingMessages.length);
      const newMessage = remainingMessages[randomIndex];
      // Add to fresh chips at the beginning (most recent first)
      setFreshChips(prev => [newMessage, ...prev]);
    }
  };

  // Handle message selection from bottom sheet
  const handleSavedMessageContinue = (message) => {
    setShowSavedMessageSheet(false);
    // Reload saved drafts and default message
    const saved = localStorage.getItem('sessionSavedMessages');
    if (saved) {
      setSavedDrafts(JSON.parse(saved));
    }
    const sessionDefault = localStorage.getItem('sessionDefaultMessage');
    setDefaultMessage(sessionDefault || defaultDraftMessages[0]);
  };

  // Auto-expand textarea when message changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [replyMessage]);

  // Get sentMessage and sentDate from profile
  const sentMessage = profile?.sentMessage;
  const sentDate = profile?.sentDate;
  const isEditing = profile?.isEditing; // True when opened during shimmer (no message sent yet)

  // Load messages from localStorage when component mounts or profile changes
  useEffect(() => {
    if (profile?.profileId) {
      const saved = localStorage.getItem('profileMessages');
      const allMessages = saved ? JSON.parse(saved) : {};
      let profileMessages = allMessages[profile.profileId] || [];
      
      // If there's a sentMessage from the profile but no stored messages,
      // initialize with that first message so all messages are tracked together
      if (profileMessages.length === 0 && sentMessage && !isEditing) {
        const initialMessage = {
          text: sentMessage,
          date: sentDate ? (typeof sentDate === 'string' ? sentDate : new Date(sentDate).toISOString()) : new Date().toISOString(),
          type: 'sent'
        };
        profileMessages = [initialMessage];
        // Save this initial message to localStorage
        allMessages[profile.profileId] = profileMessages;
        localStorage.setItem('profileMessages', JSON.stringify(allMessages));
      }
      
      setMessages(profileMessages);
    }
  }, [profile?.profileId, sentMessage, sentDate, isEditing]);

  // Save messages to localStorage whenever they change
  const saveMessages = (newMessages) => {
    if (profile?.profileId) {
      const saved = localStorage.getItem('profileMessages');
      const allMessages = saved ? JSON.parse(saved) : {};
      allMessages[profile.profileId] = newMessages;
      localStorage.setItem('profileMessages', JSON.stringify(allMessages));
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) {
      // Use today's date if no date provided
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      return `${day}/${month}/${year}`;
    }
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!replyMessage.trim()) return;
    
    const newMessage = {
      text: replyMessage,
      date: new Date().toISOString(), // Store as ISO string for localStorage
      type: 'sent'
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setReplyMessage('');
    
    // Call the parent's onSendMessage callback if provided
    if (onSendMessage) {
      onSendMessage(replyMessage, profile?.profileId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="message-window-overlay">
      <div className="message-window">
        {/* Header */}
        <div className="message-window-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <div className="header-profile-info" onClick={() => onViewProfile && onViewProfile(profile)} style={{cursor: 'pointer'}}>
            <img 
              src={profile?.profilePicture} 
              alt={profile?.profileName} 
              className="header-profile-pic"
            />
            <div className="header-profile-details">
              <h3 className="header-profile-name">{profile?.profileName}</h3>
              <p className="header-profile-meta">Active 2h ago</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-action-btn">
              <img src="/images/cam-recorder.png" alt="Video" width="20" height="20" />
            </button>
            <button className="header-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </button>
            <button className="header-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="message-window-tabs">
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {/* Profile Card (shown only in chat tab) */}
        {activeTab === 'chat' && (
          <div className="message-profile-card" onClick={() => onViewProfile && onViewProfile(profile)} style={{cursor: 'pointer'}}>
            <img 
              src={profile?.profilePicture} 
              alt={profile?.profileName} 
              className="profile-card-photo"
            />
            <div className="profile-card-info">
              <div className="profile-card-tags">
                <div className="msg-paid-tag">
                  <span>👑</span>
                  <span>Paid member</span>
                </div>
                <div className="msg-verified-tag">
                  <span>✓</span>
                  <span>Verified Profile</span>
                  <span>ℹ</span>
                </div>
              </div>
              <p className="profile-card-meta">
                <span>{profile?.profileId}</span> •
                <span>Profile created by {profile?.profileCreatedBy}</span> •
                <span>{profile?.age} Yrs</span> •
                <span>{profile?.height}</span> •
                <span>{profile?.caste}</span> •
                <span>{profile?.education}</span> •
                <span>{profile?.occupation}</span> •
                <span>{profile?.annualIncome}</span> •
                <span>{profile?.city}, {profile?.state}</span>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          /* Messages Area */
          <div className="messages-area">
            {/* Date separator */}
            <div className="date-separator">
              <span>{formatDate(sentDate || (messages.length > 0 ? messages[0].date : null))}</span>
            </div>

            {/* Show existing sent message only if not in editing mode, message exists, AND no stored messages */}
            {!isEditing && sentMessage && messages.length === 0 && (
              <>
                <div 
                  className="message-bubble sent"
                  onMouseDown={() => handleLongPressStart(sentMessage)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(sentMessage)}
                  onTouchEnd={handleLongPressEnd}
                >
                <p className="message-text">{sentMessage}</p>
                <span className="message-time">{formatTime(sentDate)}</span>
              </div>

              {/* Awaiting response indicator */}
              <div className="awaiting-response">
                <p>Waiting for {profile?.profileName} to respond...</p>
              </div>
            </>
          )}

          {/* Show all messages from localStorage */}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-bubble ${msg.type}`}
              onMouseDown={() => handleLongPressStart(msg.text)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(msg.text)}
              onTouchEnd={handleLongPressEnd}
            >
              <p className="message-text">{msg.text}</p>
              <span className="message-time">{formatTime(msg.date)}</span>
            </div>
          ))}

          {/* Awaiting response indicator - show when we have messages */}
          {messages.length > 0 && (
            <div className="awaiting-response">
              <p>Waiting for {profile?.profileName} to respond...</p>
            </div>
          )}

          {/* Show prompt to type message when in editing mode and no messages yet */}
          {isEditing && messages.length === 0 && (
            <div className="compose-prompt">
              <p>Type your message below to send to {profile?.profileName}</p>
            </div>
          )}
        </div>
        )}

        {activeTab === 'profile' && (
          /* Profile Tab Content - Full View */
          <div className="profile-tab-content">
            {/* Profile Photo Section */}
            <div className="profile-tab-photo-section">
              <img src={profile?.profilePicture} alt={profile?.profileName} className="profile-tab-photo" />
              <div className="profile-tab-photo-overlay">
                <span className="photo-count-badge">📸 1</span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="profile-tab-tags">
              <div className="msg-paid-tag">
                <span>👑</span>
                <span>Paid member</span>
              </div>
              <div className="msg-verified-tag">
                <span>✓</span>
                <span>Verified Profile</span>
                <span>ℹ</span>
              </div>
            </div>

            {/* Name and Contact */}
            <div className="profile-tab-name-section">
              <h2 className="profile-tab-name">{profile?.profileName}</h2>
              <div className="profile-tab-contact-actions">
                <button className="profile-tab-contact-btn">📞</button>
                <button className="profile-tab-contact-btn whatsapp">💬</button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="profile-tab-meta">
              <span>{profile?.profileId}</span> • 
              <span>{profile?.profileCreatedBy}</span> • 
              <span>{profile?.age} Yrs</span> • 
              <span>{profile?.height}</span> • 
              <span>{profile?.caste}</span> • 
              <span>{profile?.education}</span> • 
              <span>{profile?.occupation}</span> • 
              <span>{profile?.annualIncome}</span> • 
              <span>{profile?.city}, {profile?.state}</span>
            </div>

            {/* Personal Information Section */}
            <div className="profile-tab-section">
              <h4 className="profile-tab-section-title">Personal Information</h4>
              <div className="profile-detail-row">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{profile?.gender}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{profile?.age} Yrs</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{profile?.dateOfBirth}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Height:</span>
                <span className="detail-value">{profile?.height}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">{profile?.weight}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Body Type:</span>
                <span className="detail-value">{profile?.bodyType}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Marital Status:</span>
                <span className="detail-value">{profile?.maritalStatus}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Mother Tongue:</span>
                <span className="detail-value">{profile?.motherTongue}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Religion:</span>
                <span className="detail-value">{profile?.religion}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Caste:</span>
                <span className="detail-value">{profile?.caste}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Eating Habits:</span>
                <span className="detail-value">{profile?.eatingHabits}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{profile?.city}, {profile?.state}</span>
              </div>
            </div>

            {/* Horoscope Section */}
            <div className="profile-tab-section kundli-section">
              <div className="kundli-link-row">
                <span className="kundli-icon">📄</span>
                <span>View Horoscope</span>
              </div>
              <div className="kundli-link-row">
                <span className="kundli-icon">🔄</span>
                <span>View Horoscope Compatibility</span>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="profile-tab-section">
              <h4 className="profile-tab-section-title">Professional Information</h4>
              <div className="profile-detail-row">
                <span className="detail-label">Employed in:</span>
                <span className="detail-value">{profile?.employment}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Annual Income:</span>
                <span className="detail-value">{profile?.annualIncome}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Education:</span>
                <span className="detail-value">{profile?.education}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Works at:</span>
                <span className="detail-value">{profile?.occupation}</span>
              </div>
            </div>

            {/* Family Information Section */}
            <div className="profile-tab-section">
              <h4 className="profile-tab-section-title">Family Information</h4>
              <div className="profile-detail-row">
                <span className="detail-label">Family Status:</span>
                <span className="detail-value">{profile?.familyStatus}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Father's Occupation:</span>
                <span className="detail-value">{profile?.fatherOccupation}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Mother's Occupation:</span>
                <span className="detail-value">{profile?.motherOccupation}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Brothers:</span>
                <span className="detail-value">{profile?.brothers}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Sisters:</span>
                <span className="detail-value">{profile?.sisters}</span>
              </div>
            </div>

            {/* About Me Section */}
            <div className="profile-tab-section">
              <h4 className="profile-tab-section-title">About Me</h4>
              <p className="about-text">{profile?.aboutMe || 'No description available.'}</p>
            </div>
          </div>
        )}

        {/* Saved Drafts Chips - Always visible */}
        <div className="saved-drafts-section">
          <div className={`ai-refresh-icon ${isRefreshing ? 'rotating' : ''}`} onClick={handleAIRefresh}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="saved-drafts-chips">
            {/* Fresh AI Chips (pastel red) */}
            {freshChips.map((chip, index) => (
              <button
                key={`fresh-${index}`}
                className="draft-chip fresh-chip"
                onClick={() => setReplyMessage(chip)}
                onMouseDown={() => handleLongPressStart(chip)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(chip)}
                onTouchEnd={handleLongPressEnd}
              >
                <span className="chip-text">{chip.length > 40 ? chip.substring(0, 40) + '...' : chip}</span>
              </button>
            ))}
            {/* Saved Drafts Chips (pastel blue) */}
            {savedDrafts.map((draft, index) => {
              const isDefault = draft === defaultMessage;
              return (
                <button
                  key={index}
                  className={`draft-chip ${isDefault ? 'default-chip' : ''}`}
                  onClick={() => setReplyMessage(draft)}
                  onMouseDown={() => handleLongPressStart('')}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart('')}
                  onTouchEnd={handleLongPressEnd}
                >
                  {isDefault && <span className="default-tag">Default</span>}
                  <span className="chip-text">{draft.length > 40 ? draft.substring(0, 40) + '...' : draft}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reply Input Area - Always visible */}
        <div className="reply-input-area">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="reply-input"
              placeholder="Type a message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button 
              className="send-btn" 
              disabled={!replyMessage.trim()}
              onClick={handleSendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Saved Message Bottom Sheet */}
      {showSavedMessageSheet && (
        <SavedMessageBottomSheet
          onContinue={handleSavedMessageContinue}
          onClose={() => setShowSavedMessageSheet(false)}
          initialComposeMessage={initialComposeMessage}
        />
      )}
    </div>
  );
};

export default MessageWindow;
