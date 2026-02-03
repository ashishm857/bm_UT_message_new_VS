import React, { useState, useEffect, useRef } from 'react';
import './ReceivedMessageWindow.css';

const ReceivedMessageWindow = ({ profile, receivedMessage, onClose, onSendMessage, onProfileClick, isAwaitingResponse = false }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [freshChips, setFreshChips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);
  const [savedMessages, setSavedMessages] = useState(() => {
    // Initialize from sessionStorage for session-wide persistence
    const saved = sessionStorage.getItem('savedMessageChips');
    return saved ? JSON.parse(saved) : [];
  });
  const [longPressOverlay, setLongPressOverlay] = useState({ visible: false, messageText: '', position: { x: 0, y: 0 } });
  const longPressTimer = useRef(null);
  const textareaRef = useRef(null);

  // Default reply chips (pastel green)
  const defaultReplyChips = [
    "Hello, appreciate you reaching out. Happy to start a conversation.",
    "Hi, thank you for reaching out. Happy to connect and know you."
  ];

  // AI suggested replies (pastel red)
  const aiReplies = [
    "Hello, appreciate you reaching out. Happy to start a conversation.",
    "Hi, thanks for your interest. I'll go through your profile in detail and get back.",
    "Hello, thank you for reaching out. I need some time to review and reflect.",
    "Hello, I liked the clarity in your profile too. Open to exploring this further.",
    "Hi, thank you for the request. I'll discuss this with my family and revert.",
    "Hello, appreciate your interest. I'll need some time before proceeding."
  ];

  // Initialize with the received message and load any previously sent replies
  useEffect(() => {
    const messagesList = [];
    
    // Add the initial received message
    if (receivedMessage) {
      messagesList.push({
        text: receivedMessage,
        date: new Date().toISOString(),
        type: isAwaitingResponse ? 'sent' : 'received'
      });
    }
    
    // Load previously sent replies from localStorage
    if (profile?.profileId) {
      const saved = localStorage.getItem('matchesProfileStates');
      if (saved) {
        const states = JSON.parse(saved);
        const profileState = states[profile.profileId];
        if (profileState?.messageSent && profileState.sentMessage && !isAwaitingResponse) {
          // Add the user's reply to the conversation
          messagesList.push({
            text: profileState.sentMessage,
            date: profileState.sentDate || new Date().toISOString(),
            type: 'sent'
          });
          setHasReplied(true);
        }
        // Check if profile was declined
        if (profileState?.isDeclined) {
          setIsDeclined(true);
          messagesList.push({
            text: 'declined',
            date: profileState.declinedDate || new Date().toISOString(),
            type: 'declined'
          });
        }
      }
    }
    
    setMessages(messagesList);
  }, [receivedMessage, isAwaitingResponse, profile?.profileId]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [replyMessage]);

  // Handle AI refresh
  const handleAIRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    
    const remainingReplies = aiReplies.filter(msg => !freshChips.includes(msg));
    
    if (remainingReplies.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingReplies.length);
      const newReply = remainingReplies[randomIndex];
      setFreshChips(prev => [newReply, ...prev]);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) {
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

  // Handle sending a reply
  const handleSendMessage = () => {
    if (!replyMessage.trim()) return;
    
    const newMessage = {
      text: replyMessage,
      date: new Date().toISOString(),
      type: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setReplyMessage('');
    setHasReplied(true);
    
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

  const handleDecline = () => {
    setIsDeclined(true);
    const declinedDate = new Date().toISOString();
    
    // Save declined state to localStorage
    if (profile?.profileId) {
      const saved = localStorage.getItem('matchesProfileStates');
      const states = saved ? JSON.parse(saved) : {};
      states[profile.profileId] = {
        ...states[profile.profileId],
        isDeclined: true,
        declinedDate: declinedDate
      };
      localStorage.setItem('matchesProfileStates', JSON.stringify(states));
    }
    
    // Add declined message bubble
    const declinedMessage = {
      text: 'declined',
      date: declinedDate,
      type: 'declined'
    };
    setMessages(prev => [...prev, declinedMessage]);
  };

  // Long press handlers for sent messages
  const handleLongPressStart = (e, messageText) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    longPressTimer.current = setTimeout(() => {
      setLongPressOverlay({
        visible: true,
        messageText: messageText,
        position: { x: rect.left + rect.width / 2, y: rect.top }
      });
    }, 500); // 500ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleSaveMessage = () => {
    if (longPressOverlay.messageText && !savedMessages.includes(longPressOverlay.messageText)) {
      const newSavedMessages = [longPressOverlay.messageText, ...savedMessages];
      setSavedMessages(newSavedMessages);
      // Persist to sessionStorage for session-wide access
      sessionStorage.setItem('savedMessageChips', JSON.stringify(newSavedMessages));
    }
    setLongPressOverlay({ visible: false, messageText: '', position: { x: 0, y: 0 } });
  };

  const handleCloseOverlay = () => {
    setLongPressOverlay({ visible: false, messageText: '', position: { x: 0, y: 0 } });
  };

  return (
    <div className="received-message-window-overlay">
      <div className="received-message-window">
        {/* Long Press Save Message Overlay */}
        {longPressOverlay.visible && (
          <div className="save-message-overlay" onClick={handleCloseOverlay}>
            <div 
              className="save-message-popup"
              style={{ top: longPressOverlay.position.y - 50, left: longPressOverlay.position.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="save-message-btn" onClick={handleSaveMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                  <polyline points="17,21 17,13 7,13 7,21"/>
                  <polyline points="7,3 7,8 15,8"/>
                </svg>
                Save message
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="rmw-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <div className="header-profile-info">
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
        <div className="rmw-tabs">
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

        {/* Profile Card - only in chat tab */}
        {activeTab === 'chat' && (
          <div 
            className="rmw-profile-card clickable"
            onClick={() => onProfileClick && onProfileClick(profile, receivedMessage)}
          >
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
          <div className="rmw-messages-area">
            {/* Date separator */}
            <div className="date-separator">
              <span>{formatDate(messages[0]?.date)}</span>
            </div>

            {/* Messages */}
            {messages.map((msg, index) => (
              msg.type === 'declined' ? (
                <div key={index} className="message-bubble declined">
                  <div className="declined-bubble-content">
                    <p className="declined-title">Message declined</p>
                    <p className="declined-subtitle">You declined {profile?.gender === 'Female' ? 'her' : 'his'} message</p>
                    <span className="message-time">{formatTime(msg.date)}</span>
                  </div>
                </div>
              ) : (
                <div 
                  key={index} 
                  className={`message-bubble ${msg.type}`}
                  onMouseDown={msg.type === 'sent' ? (e) => handleLongPressStart(e, msg.text) : undefined}
                  onMouseUp={msg.type === 'sent' ? handleLongPressEnd : undefined}
                  onMouseLeave={msg.type === 'sent' ? handleLongPressEnd : undefined}
                  onTouchStart={msg.type === 'sent' ? (e) => handleLongPressStart(e, msg.text) : undefined}
                  onTouchEnd={msg.type === 'sent' ? handleLongPressEnd : undefined}
                >
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">{formatTime(msg.date)}</span>
                </div>
              )
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="rmw-profile-content">
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

            {/* Name */}
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

            {/* Personal Information */}
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
                <span className="detail-label">Height:</span>
                <span className="detail-value">{profile?.height}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Caste:</span>
                <span className="detail-value">{profile?.caste}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Education:</span>
                <span className="detail-value">{profile?.education}</span>
              </div>
              <div className="profile-detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{profile?.city}, {profile?.state}</span>
              </div>
            </div>

            {/* About Me */}
            <div className="profile-tab-section">
              <h4 className="profile-tab-section-title">About Me</h4>
              <p className="about-text">{profile?.aboutMe || 'No description available.'}</p>
            </div>
          </div>
        )}

        {/* Reply Chips Section - Row 1 */}
        <div className="rmw-reply-chips-section">
          <div className={`ai-refresh-icon ${isRefreshing ? 'rotating' : ''}`} onClick={handleAIRefresh}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="reply-chips">
            {/* AI Fresh Chips (pastel red) */}
            {freshChips.map((chip, index) => (
              <button
                key={`ai-${index}`}
                className="reply-chip ai-chip"
                onClick={() => setReplyMessage(chip)}
              >
                <span className="chip-text">{chip.length > 40 ? chip.substring(0, 40) + '...' : chip}</span>
              </button>
            ))}
            {/* Saved Message Chips (green background) */}
            {savedMessages.map((chip, index) => (
              <button
                key={`saved-${index}`}
                className="reply-chip saved-message-chip"
                onClick={() => setReplyMessage(chip)}
              >
                <span className="chip-text">{chip.length > 40 ? chip.substring(0, 40) + '...' : chip}</span>
              </button>
            ))}
            {/* Default Reply Chips (pastel green) */}
            {defaultReplyChips.map((chip, index) => (
              <button
                key={`default-${index}`}
                className="reply-chip default-reply-chip"
                onClick={() => setReplyMessage(chip)}
              >
                <span className="chip-text">{chip.length > 40 ? chip.substring(0, 40) + '...' : chip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Input - Row 2 */}
        <div className="rmw-input-area">
          <button className="attachment-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
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
          </div>
          <button 
            className="send-btn" 
            disabled={!replyMessage.trim()}
            onClick={handleSendMessage}
          >
            ➤
          </button>
        </div>

        {/* Decline CTA - Row 3 */}
        {!isDeclined && !hasReplied && (
          <div className="rmw-decline-area">
            <span className="decline-text">Not interested in the profile!</span>
            <button className="decline-btn" onClick={handleDecline}>
              <span className="decline-icon">✕</span>
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedMessageWindow;
