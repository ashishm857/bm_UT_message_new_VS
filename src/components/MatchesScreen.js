import React, { useState, useEffect } from 'react';
import './MatchesScreen.css';
import SavedMessageBottomSheet from './SavedMessageBottomSheet';

const MatchesScreen = ({ 
  allMatchesProfiles, 
  newMatchesProfiles, 
  onProfileClick, 
  onSendMessage, 
  onCallNow, 
  onDontShow 
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
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [pendingProfileId, setPendingProfileId] = useState(null);

  // Save profile states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('matchesProfileStates', JSON.stringify(profileStates));
  }, [profileStates]);

  // Save hidden profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hiddenProfiles', JSON.stringify(hiddenProfiles));
  }, [hiddenProfiles]);

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

  const handleSendMessage = (profileId) => {
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
    // Save the message as the session default
    localStorage.setItem('sessionDefaultMessage', message);
    
    if (pendingProfileId) {
      sendMessageWithShimmer(pendingProfileId, message);
      setPendingProfileId(null);
    }
  };

  // Send message with shimmer effect
  const sendMessageWithShimmer = (profileId, message) => {
    // Show shimmer effect
    setProfileStates(prev => ({
      ...prev,
      [profileId]: { ...prev[profileId], isShimmering: true }
    }));

    // After 2 seconds, mark as sent and stop shimmer
    setTimeout(() => {
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
    }, 2000);
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
      <div className="matches-profile-list">
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
              className={`match-profile-card ${animatingOutProfile === profile.profileId ? 'sliding-out' : ''}`}
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
                    <button className="read-more-link">
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
                  data-text="✓ Send Message"
                >
                  <span className="checkmark-red">✓</span> Send Message
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
    </div>
  );
};

export default MatchesScreen;
