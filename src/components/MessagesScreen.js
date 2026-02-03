import React, { useState, useEffect } from 'react';
import './MessagesScreen.css';
import ReceivedMessageWindow from './ReceivedMessageWindow';

const MessagesScreen = ({ profiles, allMatchesProfiles, onBack, onProfileClick, onOpenMessageWindow, initialOpenMessage, onMessageWindowOpened }) => {
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'awaiting', 'calls'
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [awaitingMessages, setAwaitingMessages] = useState([]);
  const [showMessageWindow, setShowMessageWindow] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to refresh lists after reply

  // Handle initial message window opening (when returning from profile)
  useEffect(() => {
    if (initialOpenMessage && initialOpenMessage.profile) {
      const messageObj = {
        id: `received-${initialOpenMessage.profile.profileId}`,
        profile: initialOpenMessage.profile,
        fullMessage: initialOpenMessage.message,
        snippet: initialOpenMessage.message ? initialOpenMessage.message.substring(0, 25) + '..' : '',
        date: new Date(),
        isRead: true,
        unreadCount: 0,
        isFromAwaiting: initialOpenMessage.isFromAwaiting || false
      };
      setSelectedMessage(messageObj);
      setShowMessageWindow(true);
      // Set active tab based on where we came from
      if (initialOpenMessage.isFromAwaiting) {
        setActiveTab('awaiting');
      }
      if (onMessageWindowOpened) {
        onMessageWindowOpened();
      }
    }
  }, [initialOpenMessage]);

  // Message content
  const regularMessage = "Greeting!We came across your profile and liked it. Could you please check our profile too and let us know if you are interested in communicating further ? We look forward for you reply.";
  const specialMessage = "Hello! Pls send your photo and share your contact number, We are interested in your profile, Thanks & Regards";
  const regularSnippet = "Greeting!We came across your..";
  const specialSnippet = "Hello! Pls send your photo ...";

  // Load read message IDs from localStorage
  const getReadMessageIds = () => {
    const saved = localStorage.getItem('readMessageIds');
    return saved ? JSON.parse(saved) : [];
  };

  // Save read message ID to localStorage
  const saveReadMessageId = (messageId) => {
    const readIds = getReadMessageIds();
    if (!readIds.includes(messageId)) {
      readIds.push(messageId);
      localStorage.setItem('readMessageIds', JSON.stringify(readIds));
    }
  };

  // Initialize received messages with 15 fresh profiles - ALL start as unread
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      // Get stored message states to show user's reply snippets
      const saved = localStorage.getItem('matchesProfileStates');
      const messageStates = saved ? JSON.parse(saved) : {};
      
      const messages = profiles.slice(0, 15)
        .map((profile, index) => {
          // 4th, 8th, 12th cards (index 3, 7, 11) have special message
          const isSpecial = index === 3 || index === 7 || index === 11;
          const messageId = `received-${profile.profileId}`;
          
          // Check if user has replied to this profile
          const profileState = messageStates[profile.profileId];
          const hasReplied = profileState?.messageSent;
          const replySnippet = hasReplied && profileState.sentMessage 
            ? profileState.sentMessage.substring(0, 30) + '..' 
            : null;
          
          // Check if user has opened this message window before
          const readIds = getReadMessageIds();
          const hasBeenRead = readIds.includes(messageId);
          
          return {
            id: messageId,
            profile: profile,
            snippet: replySnippet || (isSpecial ? specialSnippet : regularSnippet),
            fullMessage: isSpecial ? specialMessage : regularMessage,
            date: hasReplied && profileState.sentDate ? new Date(profileState.sentDate) : generateRandomDate(),
            isRead: hasBeenRead, // Read if user has opened the message window
            unreadCount: hasBeenRead ? 0 : 1, // Show badge only if not read
            hasReplied: hasReplied,
            replyMessage: profileState?.sentMessage || null
          };
        });
      setReceivedMessages(messages);
    }
  }, [profiles, refreshTrigger]); // Add refreshTrigger to update after reply

  // Load awaiting messages from localStorage (sent messages)
  useEffect(() => {
    const saved = localStorage.getItem('matchesProfileStates');
    if (saved && allMatchesProfiles && allMatchesProfiles.length > 0) {
      const states = JSON.parse(saved);
      const awaiting = Object.keys(states)
        .filter(profileId => states[profileId].messageSent)
        .map(profileId => {
          const state = states[profileId];
          // Find the profile from allMatchesProfiles
          const profile = allMatchesProfiles.find(p => p.profileId === profileId) || state.profile || { profileId, profileName: 'Unknown' };
          return {
            id: `awaiting-${profileId}`,
            profileId: profileId,
            profile: profile,
            snippet: state.sentMessage ? state.sentMessage.substring(0, 30) + '...' : 'Message sent...',
            fullMessage: state.sentMessage || 'Message sent',
            date: state.sentDate ? new Date(state.sentDate) : new Date(),
            isRead: true
          };
        });
      setAwaitingMessages(awaiting);
    }
  }, [allMatchesProfiles, refreshTrigger]); // Also refresh when messages are sent

  // Refresh awaiting messages when tab changes to 'awaiting'
  useEffect(() => {
    if (activeTab === 'awaiting') {
      const saved = localStorage.getItem('matchesProfileStates');
      if (saved && allMatchesProfiles && allMatchesProfiles.length > 0) {
        const states = JSON.parse(saved);
        const awaiting = Object.keys(states)
          .filter(profileId => states[profileId].messageSent)
          .map(profileId => {
            const state = states[profileId];
            const profile = allMatchesProfiles.find(p => p.profileId === profileId) || state.profile || { profileId, profileName: 'Unknown' };
            return {
              id: `awaiting-${profileId}`,
              profileId: profileId,
              profile: profile,
              snippet: state.sentMessage ? state.sentMessage.substring(0, 30) + '...' : 'Message sent...',
              fullMessage: state.sentMessage || 'Message sent',
              date: state.sentDate ? new Date(state.sentDate) : new Date(),
              isRead: true
            };
          });
        setAwaitingMessages(awaiting);
      }
    }
  }, [activeTab, allMatchesProfiles]);

  // Generate random date within last 7 days
  const generateRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const randomDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return randomDate;
  };

  // Format date as DD MM YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Handle message card click
  const handleMessageClick = (message) => {
    // Mark as read and persist to localStorage
    if (activeTab === 'received') {
      saveReadMessageId(message.id);
      setReceivedMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isRead: true, unreadCount: 0 } : msg
        )
      );
    }
    // Open message window
    setSelectedMessage(message);
    setShowMessageWindow(true);
  };

  // Close message window
  const handleCloseMessageWindow = () => {
    setShowMessageWindow(false);
    setSelectedMessage(null);
  };

  // Handle sending reply - save to localStorage and update UI
  const handleSendReply = (message, profileId) => {
    if (!message || !profileId) return;
    
    const profile = selectedMessage?.profile;
    if (!profile) return;

    // Save to localStorage for consistent state across screens
    const saved = localStorage.getItem('matchesProfileStates');
    const states = saved ? JSON.parse(saved) : {};
    states[profileId] = {
      ...states[profileId],
      messageSent: true,
      sentMessage: message,
      sentDate: new Date().toISOString(),
      profile: profile
    };
    localStorage.setItem('matchesProfileStates', JSON.stringify(states));

    // Trigger refresh to update message snippets in Received tab
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="messages-screen">
      {/* Received Message Window */}
      {showMessageWindow && selectedMessage && (
        <ReceivedMessageWindow
          profile={selectedMessage.profile}
          receivedMessage={selectedMessage.fullMessage}
          onClose={handleCloseMessageWindow}
          onSendMessage={handleSendReply}
          onProfileClick={(profile, message) => onProfileClick && onProfileClick(profile, message, activeTab === 'awaiting')}
          isAwaitingResponse={activeTab === 'awaiting' || selectedMessage.isFromAwaiting}
        />
      )}

      {/* Header */}
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      {/* Tabs */}
      <div className="messages-tabs">
        <button 
          className={`messages-tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received
        </button>
        <button 
          className={`messages-tab ${activeTab === 'awaiting' ? 'active' : ''}`}
          onClick={() => setActiveTab('awaiting')}
        >
          Awaiting Response
        </button>
        <button 
          className={`messages-tab ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          Calls
        </button>
      </div>

      {/* Tab Content */}
      <div className="messages-content">
        {activeTab === 'received' && (
          <>
            {/* Context Communication and Utility Chips */}
            <div className="utility-chips-row">
              <div className="context-text">
                <p>Incoming messages</p>
                <p>from paid members</p>
              </div>
              <div className="utility-chips">
                <button className="utility-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M6 12h12M9 18h6"/>
                  </svg>
                  <span>Sort By</span>
                </button>
                <button className="utility-chip filter-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Listing */}
            <div className="message-listing">
              {receivedMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`message-strip-card ${!message.isRead ? 'unread' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="message-photo-container">
                    <img 
                      src={message.profile?.profilePicture} 
                      alt={message.profile?.profileName}
                      className="message-profile-photo"
                    />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="message-content">
                    <span className="message-sender-name">{message.profile?.profileName}</span>
                    <span className="message-snippet">{message.snippet}</span>
                  </div>
                  <div className="message-meta">
                    <span className="message-date">{formatDate(message.date)}</span>
                    {!message.isRead && message.unreadCount > 0 && (
                      <div className="unread-badge">{message.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'awaiting' && (
          <>
            {/* Message Listing for Awaiting */}
            <div className="message-listing">
              {awaitingMessages.length === 0 ? (
                <div className="empty-state">
                  <p>No messages awaiting response</p>
                </div>
              ) : (
                awaitingMessages.map((message) => (
                  <div 
                    key={message.id}
                    className="message-strip-card"
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="message-photo-container">
                      <img 
                        src={message.profile?.profilePicture} 
                        alt={message.profile?.profileName}
                        className="message-profile-photo"
                      />
                    </div>
                    <div className="message-content">
                      <span className="message-sender-name">{message.profile?.profileName}</span>
                      <span className="message-snippet">{message.snippet}</span>
                    </div>
                    <div className="message-meta">
                      <span className="message-date">{formatDate(message.date)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'calls' && (
          <div className="empty-state">
            <p>Calls feature coming soon</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <div className="nav-item disabled">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </div>
        <div className="nav-item clickable" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span>Matches</span>
        </div>
        <div className="nav-item disabled">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="M20 8v6"/>
            <path d="M23 11h-6"/>
          </svg>
          <span>Interests</span>
        </div>
        <div className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span>Messages</span>
        </div>
        <div className="nav-item disabled">
          <div className="upgrade-badge">53% OFF</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
          </svg>
          <span>Upgrade</span>
        </div>
        <div className="nav-item profile-nav disabled">
          <div className="profile-avatar">
            <img src="/images/males/Abhishek.jpg" alt="Profile" />
          </div>
          <span>TamilMat..</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="dropdown-arrow">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </nav>
    </div>
  );
};

export default MessagesScreen;
