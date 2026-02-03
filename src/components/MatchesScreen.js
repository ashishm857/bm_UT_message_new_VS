import React, { useState, useEffect, useRef } from 'react';
import './MatchesScreen.css';
import SavedMessageBottomSheet from './SavedMessageBottomSheet';
import MessageWindow from './MessageWindow';

const MatchesScreen = ({ 
  allMatchesProfiles, 
  newMatchesProfiles, 
  onProfileClick, 
  onProfileClickFromMessage,
  onSendMessage, 
  onCallNow, 
  onDontShow,
  initialMessageWindowProfile,
  onMessageWindowOpened,
  onGoToMessages
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'new'
  const [profileStates, setProfileStates] = useState(() => {
    const saved = localStorage.getItem('matchesProfileStates');
    return saved ? JSON.parse(saved) : {};
  });
  const [hiddenProfiles, setHiddenProfiles] = useState(() => {
    const saved = localStorage.getItem('hiddenProfiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [animatingOutProfile, setAnimatingOutProfile] = useState(null);
  const [messageSentAnimating, setMessageSentAnimating] = useState(null);
  const [listSlideUp, setListSlideUp] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMessageBadge, setShowMessageBadge] = useState(() => {
    const saved = localStorage.getItem('messageBadgeSeen');
    return saved !== 'true';
  });
  const [pendingProfileId, setPendingProfileId] = useState(null);
  const [showMessageWindow, setShowMessageWindow] = useState(false);
  const [messageWindowProfile, setMessageWindowProfile] = useState(null);
  
  // Store shimmer timeout IDs and pending messages to allow cancellation
  const shimmerTimeouts = useRef({});
  const pendingMessages = useRef({});

  // Save profile states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('matchesProfileStates', JSON.stringify(profileStates));
  }, [profileStates]);

  // Save hidden profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hiddenProfiles', JSON.stringify(hiddenProfiles));
  }, [hiddenProfiles]);

  // Open message window if coming back from profile page
  useEffect(() => {
    if (initialMessageWindowProfile) {
      const fullProfile = allMatchesProfiles.find(p => p.profileId === initialMessageWindowProfile.profileId) || initialMessageWindowProfile;
      setMessageWindowProfile({
        ...fullProfile,
        sentMessage: profileStates[initialMessageWindowProfile.profileId]?.sentMessage,
        sentDate: profileStates[initialMessageWindowProfile.profileId]?.sentDate
      });
      setShowMessageWindow(true);
      // Clear the prop after opening
      if (onMessageWindowOpened) {
        onMessageWindowOpened();
      }
    }
  }, [initialMessageWindowProfile]);

  // Get profiles based on active tab, excluding hidden ones
  const allProfiles = activeTab === 'all' ? allMatchesProfiles : newMatchesProfiles;
  const profiles = (allProfiles || []).filter(profile => !hiddenProfiles.includes(profile.profileId));

  console.log('MatchesScreen render - allMatchesProfiles:', allMatchesProfiles?.length, 'newMatchesProfiles:', newMatchesProfiles?.length, 'hiddenProfiles:', hiddenProfiles.length, 'filtered profiles:', profiles.length);

  // Handle "Don't show" - adds profile to hidden list with slide-out animation
  const handleDontShow = (profileId) => {
    // Start the slide-out animation
    setAnimatingOutProfile(profileId);
    
    // After animation completes (400ms), actually hide the profile
    setTimeout(() => {
      setHiddenProfiles(prev => [...prev, profileId]);
      setAnimatingOutProfile(null);
      if (onDontShow) {
        onDontShow(profileId);
      }
    }, 400);
  };

  // Open message window
  const openMessageWindow = (profile) => {
    const currentProfiles = activeTab === 'all' ? allMatchesProfiles : newMatchesProfiles;
    const fullProfile = currentProfiles.find(p => p.profileId === profile.profileId) || profile;
    setMessageWindowProfile({
      ...fullProfile,
      sentMessage: profileStates[profile.profileId]?.sentMessage,
      sentDate: profileStates[profile.profileId]?.sentDate
    });
    setShowMessageWindow(true);
  };

  // Close message window
  const closeMessageWindow = () => {
    setShowMessageWindow(false);
    setMessageWindowProfile(null);
  };

  // Handle message sent from MessageWindow
  const handleMessageFromWindow = (message, profileId) => {
    if (!message || !profileId) return;
    
    // Mark message as sent
    setProfileStates(prev => ({
      ...prev,
      [profileId]: { 
        ...prev[profileId], 
        messageSent: true,
        sentDate: new Date(),
        sentMessage: message
      }
    }));
    
    // Update the messageWindowProfile to reflect that message is now sent
    setMessageWindowProfile(prev => ({
      ...prev,
      isEditing: false,
      sentMessage: message,
      sentDate: new Date()
    }));
    
    onSendMessage(profileId);
    
    // Don't auto-close or auto-navigate - let user click back manually
  };

  const handleSendMessage = (profileId) => {
    const currentState = profileStates[profileId] || {};
    const isShimmering = currentState.isShimmering;
    const messageSent = currentState.messageSent;
    
    // If message already sent, open message window
    if (messageSent) {
      const currentProfiles = activeTab === 'all' ? allMatchesProfiles : newMatchesProfiles;
      const profile = currentProfiles.find(p => p.profileId === profileId);
      if (profile) {
        openMessageWindow(profile);
      }
      return;
    }
    
    // If currently shimmering, cancel the auto-send and open message window for manual typing
    if (isShimmering) {
      // Cancel the shimmer timeout
      if (shimmerTimeouts.current[profileId]) {
        clearTimeout(shimmerTimeouts.current[profileId]);
        delete shimmerTimeouts.current[profileId];
      }
      
      // Stop shimmer
      setProfileStates(prev => ({
        ...prev,
        [profileId]: { ...prev[profileId], isShimmering: false }
      }));
      
      // Open message window with blank chat for user to type their message
      const currentProfiles = activeTab === 'all' ? allMatchesProfiles : newMatchesProfiles;
      const profile = currentProfiles.find(p => p.profileId === profileId);
      if (profile) {
        setMessageWindowProfile({
          ...profile,
          sentMessage: null, // No message sent yet
          sentDate: null,
          isEditing: true // Flag to indicate user should type/edit message
        });
        setShowMessageWindow(true);
      }
      
      // Clear pending message
      delete pendingMessages.current[profileId];
      return;
    }
    
    // Check if this is the first message send for this profile
    const isFirstSend = !profileStates[profileId]?.messageSent;
    
    if (isFirstSend) {
      // Check if bottom sheet has already been shown this session
      const bottomSheetShown = localStorage.getItem('bottomSheetShown') === 'true';
      
      if (bottomSheetShown) {
        // Bottom sheet already shown - use the saved default message
        const sessionDefaultMessage = localStorage.getItem('sessionDefaultMessage');
        if (sessionDefaultMessage) {
          sendMessageWithShimmer(profileId, sessionDefaultMessage);
        } else {
          // Fallback to first draft message if no custom message was set
          const defaultMessage = "Hi! I came across your profile and found it interesting. Would love to connect and know more about you.";
          sendMessageWithShimmer(profileId, defaultMessage);
        }
      } else {
        // First time in session - show bottom sheet
        setPendingProfileId(profileId);
        setShowBottomSheet(true);
      }
    } else {
      // Already sent, just open message window
      onSendMessage(profileId);
    }
  };

  // Handle message sent from bottom sheet
  const handleMessageConfirmed = (message) => {
    setShowBottomSheet(false);
    
    // Mark that bottom sheet has been shown this session
    localStorage.setItem('bottomSheetShown', 'true');
    
    if (pendingProfileId) {
      sendMessageWithShimmer(pendingProfileId, message);
      setPendingProfileId(null);
    }
  };

  // Send message with shimmer effect
  const sendMessageWithShimmer = (profileId, message) => {
    // Store the pending message so we can retrieve it if user cancels
    pendingMessages.current[profileId] = message;
    
    // Show shimmer effect
    setProfileStates(prev => ({
      ...prev,
      [profileId]: { ...prev[profileId], isShimmering: true }
    }));

    // After 2 seconds, mark as sent and stop shimmer
    const timeoutId = setTimeout(() => {
      // Clear the stored timeout and pending message
      delete shimmerTimeouts.current[profileId];
      delete pendingMessages.current[profileId];
      
      setProfileStates(prev => ({
        ...prev,
        [profileId]: { 
          ...prev[profileId], 
          isShimmering: false, 
          messageSent: true,
          sentDate: new Date(),
          sentMessage: message
        }
      }));
      onSendMessage(profileId);
      
      // Animation disabled per user request
      // Wait 0.4 seconds to show sent status, then start slide-out animation for the entire list
      // setTimeout(() => {
      //   setListSlideUp(true);
      //   setMessageSentAnimating(profileId);
      //   
      //   // After animation completes, remove the slide class to restore normal scrolling
      //   setTimeout(() => {
      //     setMessageSentAnimating(null);
      //     setListSlideUp(false);
      //   }, 900);
      // }, 400);
    }, 2000);
    
    // Store the timeout ID so we can cancel it
    shimmerTimeouts.current[profileId] = timeoutId;
  };

  const getMatchCount = () => {
    if (activeTab === 'all') {
      return '2000 matches based on your preference';
    } else {
      return '4 matches based on your preference';
    }
  };

  const formatDate = (date) => {
    // Handle both Date objects and date strings from localStorage
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return ''; // Return empty string for invalid dates
    }
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  return (
    <div className="matches-container">
      {/* Header - Row 1: Match Tabs */}
      <div className="matches-tabs">
        <button 
          className={`match-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Matches
        </button>
        <button 
          className={`match-tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Matches
        </button>
        <button className="match-tab more-tab">
          More <span className="arrow-down">∨</span>
        </button>
      </div>

      {/* Header - Row 2: Match Count */}
      <div className="matches-count-row">
        <p className="match-count-text">{getMatchCount()}</p>
        <button className="three-dot-btn">⋮</button>
      </div>

      {/* Header - Row 3: Filter Chips */}
      <div className="matches-filter-chips">
        <div className="filter-chip">
          <span>Filter</span>
          <span className="chip-icon">⚙</span>
        </div>
        <div className="filter-chip">
          <span>Sort by</span>
          <span className="chip-icon">↕</span>
        </div>
        <div className="filter-chip">Newly joined</div>
        <div className="filter-chip">Not seen</div>
        <div className="filter-chip">Profile with photo</div>
        <div className="filter-chip">Location</div>
        <div className="filter-chip">Mutual match</div>
        <div className="filter-chip">Profile created by</div>
      </div>

      {/* Profile Cards */}
      <div className={`matches-profile-list ${listSlideUp ? 'list-slide-up' : ''}`}>
        {profiles.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No profiles to display
          </div>
        ) : (
          profiles.map((profile) => {
          const state = profileStates[profile.profileId] || {};
          const messageSent = state.messageSent;
          const isShimmering = state.isShimmering;

          return (
            <div 
              key={profile.profileId} 
              className={`match-profile-card ${animatingOutProfile === profile.profileId ? 'sliding-out' : ''} ${messageSentAnimating === profile.profileId ? 'message-sent-slide' : ''}`}
              onClick={() => onProfileClick(profile)}
            >
              {/* Profile Photo Section */}
              <div className="match-card-photo-section">
                <img 
                  src={profile.profilePicture} 
                  alt={profile.name} 
                  className="match-card-photo" 
                />
                <div className="match-photo-overlay">
                  <button className="match-shortlist-btn">⭐</button>
                </div>
                <div className="match-photo-counter">
                  <span>📸 1</span>
                </div>
              </div>

              {/* Profile Tags */}
              <div className="match-card-tags">
                <div className="match-tags-row">
                  <div className="match-paid-tag">
                    <span>👑</span>
                    <span>Paid member</span>
                  </div>
                  <div className="match-verified-tag">
                    <span>✓</span>
                    <span>Verified Profile</span>
                    <span>ℹ</span>
                  </div>
                </div>
                <div className="match-contact-icons">
                  <button className="match-contact-icon">☎️</button>
                  <button className="match-contact-icon">💬</button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="match-card-meta">
                <span style={{fontWeight: 'bold'}}>{profile.profileName}</span> •
                <span>{profile.profileId}</span> •
                <span>Profile created by {profile.profileCreatedBy}</span> •
                <span>{profile.age} Yrs</span> •
                <span>{profile.height}</span> •
                <span>{profile.caste}</span> •
                <span>{profile.education}</span> •
                <span>{profile.occupation}</span> •
                <span>{profile.annualIncome}</span> •
                <span>{profile.city}, {profile.state}</span>
              </div>

              {/* Communication Header (if message sent) */}
              {messageSent && (
                <>
                  <div className="match-communication-header">
                    <p className="communication-text">
                      You sent {profile.gender === 'Male' ? 'him' : 'her'} a message
                    </p>
                    <span className="communication-date">
                      {formatDate(state.sentDate)}
                    </span>
                  </div>
                  
                  <div className="match-message-snippet">
                    <p className="message-snippet-text">
                      {state.sentMessage ? state.sentMessage.substring(0, 30) + '...' : 'Greetings, we came across...'}
                    </p>
                    <button 
                      className="read-more-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMessageWindow(profile);
                      }}
                    >
                      Read More →
                    </button>
                  </div>
                </>
              )}

              {/* CTAs */}
              <div 
                className="match-card-ctas"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className={messageSent ? "match-secondary-cta" : "match-tertiary-cta"}
                  onClick={() => messageSent ? onCallNow(profile.profileId) : handleDontShow(profile.profileId)}
                >
                  {messageSent ? "Call Now" : "Don't show"}
                </button>
                <button 
                  className={`match-primary-cta ${isShimmering ? 'shimmer-effect' : ''} ${messageSent ? 'message-sent' : ''}`}
                  onClick={() => handleSendMessage(profile.profileId)}
                  data-text={isShimmering ? "✓ Edit Message" : "✓ Send Message"}
                >
                  <span className="checkmark-red">✓</span> {isShimmering ? 'Edit Message' : 'Send Message'}
                </button>
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Saved Message Bottom Sheet */}
      {showBottomSheet && (
        <SavedMessageBottomSheet
          onContinue={handleMessageConfirmed}
          onClose={() => {
            setShowBottomSheet(false);
            setPendingProfileId(null);
          }}
        />
      )}

      {/* Message Window */}
      {showMessageWindow && messageWindowProfile && (
        <MessageWindow
          profile={messageWindowProfile}
          onClose={closeMessageWindow}
          onSendMessage={handleMessageFromWindow}
          onViewProfile={(profile) => {
            // Pass the message window profile so we can return to it
            if (onProfileClickFromMessage) {
              onProfileClickFromMessage(profile, messageWindowProfile);
            } else {
              closeMessageWindow();
              onProfileClick(profile);
            }
          }}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <div className="nav-item disabled">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Home</span>
        </div>
        <div className="nav-item active">
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
        <div className="nav-item clickable" onClick={() => {
          setShowMessageBadge(false);
          localStorage.setItem('messageBadgeSeen', 'true');
          onGoToMessages && onGoToMessages();
        }}>
          {showMessageBadge && <div className="message-badge">15</div>}
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

export default MatchesScreen;
