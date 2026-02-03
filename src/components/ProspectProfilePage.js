import React, { useState, useEffect, useRef } from 'react';
import './ProspectProfilePage.css';
import SavedMessageBottomSheet from './SavedMessageBottomSheet';
import MessageWindow from './MessageWindow';

const ProspectProfilePage = ({ profile, partnerPreference, onBack, onBackToMessageWindow, onNext, onPrev, currentIndex, totalProfiles, messageSent: initialMessageSent, sentDate: initialSentDate, sentMessage: initialSentMessage, messageReceived, receivedMessage, receivedDate, onSendMessage, onCallNow, onDontShow, onSkip }) => {
  
  // Helper to get message state from localStorage
  const getMessageStateFromStorage = (profileId) => {
    const saved = localStorage.getItem('matchesProfileStates');
    if (saved && profileId) {
      try {
        const states = JSON.parse(saved);
        return states[profileId] || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Initialize state with lazy initializer to check localStorage on first render
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [messageSent, setMessageSent] = useState(() => {
    const stored = getMessageStateFromStorage(profile?.profileId);
    return stored?.messageSent ? true : initialMessageSent;
  });
  const [sentDate, setSentDate] = useState(() => {
    const stored = getMessageStateFromStorage(profile?.profileId);
    return stored?.sentDate || initialSentDate;
  });
  const [sentMessage, setSentMessage] = useState(() => {
    const stored = getMessageStateFromStorage(profile?.profileId);
    return stored?.sentMessage || initialSentMessage;
  });
  const [showMessageWindow, setShowMessageWindow] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  
  // State for declined (when user clicks Decline button)
  const [isDeclined, setIsDeclined] = useState(() => {
    const saved = localStorage.getItem('declinedProfiles');
    if (saved && profile?.profileId) {
      const declined = JSON.parse(saved);
      return declined.includes(profile.profileId);
    }
    return false;
  });
  
  // Store shimmer timeout ID and pending message to allow cancellation
  const shimmerTimeoutRef = useRef(null);
  const pendingMessageRef = useRef(null);

  // Sync state when profile changes
  useEffect(() => {
    const profileState = getMessageStateFromStorage(profile?.profileId);
    if (profileState?.messageSent) {
      setMessageSent(true);
      setSentDate(profileState.sentDate || initialSentDate);
      setSentMessage(profileState.sentMessage || initialSentMessage);
    } else {
      setMessageSent(initialMessageSent);
      setSentDate(initialSentDate);
      setSentMessage(initialSentMessage);
    }
    
    // Sync declined state
    const saved = localStorage.getItem('declinedProfiles');
    if (saved && profile?.profileId) {
      const declined = JSON.parse(saved);
      setIsDeclined(declined.includes(profile.profileId));
    } else {
      setIsDeclined(false);
    }
    
    // Scroll to top when profile changes
    window.scrollTo(0, 0);
  }, [profile?.profileId, initialMessageSent, initialSentDate, initialSentMessage]);
  
  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      if (messageReceived && onBackToMessageWindow) {
        onBackToMessageWindow();
      } else if (onBack) {
        onBack();
      }
    };
    
    // Push a state to handle back button
    window.history.pushState({ page: 'profile' }, '');
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBack, onBackToMessageWindow, messageReceived]);
  
  // Handle decline button click
  const handleDecline = () => {
    const saved = localStorage.getItem('declinedProfiles');
    const declined = saved ? JSON.parse(saved) : [];
    if (!declined.includes(profile.profileId)) {
      declined.push(profile.profileId);
      localStorage.setItem('declinedProfiles', JSON.stringify(declined));
    }
    setIsDeclined(true);
  };

  // Open message window
  const openMessageWindow = (options = {}) => {
    setShowMessageWindow(true);
  };

  // Close message window
  const closeMessageWindow = () => {
    setShowMessageWindow(false);
    setIsEditingMode(false);
  };
  
  // State for editing mode (when shimmer is cancelled)
  const [isEditingMode, setIsEditingMode] = useState(false);

  // Handle message sent from MessageWindow
  const handleMessageFromWindow = (message, profileId) => {
    if (!message) return;
    
    const newSentDate = new Date();
    setMessageSent(true);
    setSentDate(newSentDate);
    setSentMessage(message);
    setIsEditingMode(false);
    
    // Update localStorage to persist the state
    const saved = localStorage.getItem('matchesProfileStates');
    const states = saved ? JSON.parse(saved) : {};
    states[profile.profileId] = {
      ...states[profile.profileId],
      messageSent: true,
      sentDate: newSentDate,
      sentMessage: message
    };
    localStorage.setItem('matchesProfileStates', JSON.stringify(states));
    
    if (onSendMessage) {
      onSendMessage(profile.profileId);
    }
    
    // Don't auto-close or auto-navigate - let user click back manually
  };

  // Handle send message button click
  const handleSendMessageClick = () => {
    // If coming from Received tab, go back to message window
    if (messageReceived && onBackToMessageWindow) {
      onBackToMessageWindow();
      return;
    }
    
    // If message already sent, open message window
    if (messageSent) {
      openMessageWindow();
      return;
    }
    
    // If currently shimmering, cancel the auto-send and open message window for manual typing
    if (isShimmering) {
      // Cancel the shimmer timeout
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current);
        shimmerTimeoutRef.current = null;
      }
      
      // Stop shimmer
      setIsShimmering(false);
      
      // Open message window in editing mode (blank chat)
      setIsEditingMode(true);
      setShowMessageWindow(true);
      
      return;
    }
    
    if (!messageSent) {
      // Check if bottom sheet has already been shown this session
      const bottomSheetShown = localStorage.getItem('bottomSheetShown') === 'true';
      
      if (bottomSheetShown) {
        // Bottom sheet already shown - use the saved default message
        const sessionDefaultMessage = localStorage.getItem('sessionDefaultMessage');
        if (sessionDefaultMessage) {
          sendMessageWithShimmer(sessionDefaultMessage);
        } else {
          // Fallback to first draft message if no custom message was set
          const defaultMessage = "Hi! I came across your profile and found it interesting. Would love to connect and know more about you.";
          sendMessageWithShimmer(defaultMessage);
        }
      } else {
        // First time in session - show bottom sheet
        setShowBottomSheet(true);
      }
    } else {
      // Already sent, just open message window
      if (onSendMessage) {
        onSendMessage(profile.profileId);
      }
    }
  };

  // Send message with shimmer effect
  const sendMessageWithShimmer = (message) => {
    // Store the pending message so we can retrieve it if user cancels
    pendingMessageRef.current = message;
    
    setIsShimmering(true);

    // After 2 seconds, mark as sent and stop shimmer
    const timeoutId = setTimeout(() => {
      // Clear the stored timeout and pending message
      shimmerTimeoutRef.current = null;
      pendingMessageRef.current = null;
      
      const newSentDate = new Date();
      setIsShimmering(false);
      setMessageSent(true);
      setSentDate(newSentDate);
      setSentMessage(message);

      // Update localStorage to persist the state
      const saved = localStorage.getItem('matchesProfileStates');
      const states = saved ? JSON.parse(saved) : {};
      states[profile.profileId] = {
        ...states[profile.profileId],
        messageSent: true,
        sentDate: newSentDate,
        sentMessage: message
      };
      localStorage.setItem('matchesProfileStates', JSON.stringify(states));

      if (onSendMessage) {
        onSendMessage(profile.profileId);
      }
      
      // Show sent status for 1 second, then slide to next profile
      if (onNext && currentIndex < totalProfiles - 1) {
        setTimeout(() => {
          setIsSliding(true);
          setTimeout(() => {
            setIsSliding(false);
            onNext();
          }, 400);
        }, 1000); // Wait 1 second to show sent status
      }
    }, 2000);
    
    // Store the timeout ID so we can cancel it
    shimmerTimeoutRef.current = timeoutId;
  };

  // Handle message sent from bottom sheet
  const handleMessageSent = (message) => {
    setShowBottomSheet(false);
    
    // Mark that bottom sheet has been shown this session
    localStorage.setItem('bottomSheetShown', 'true');
    
    // Send with shimmer effect
    sendMessageWithShimmer(message);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}, ${month}, ${year}`;
  };

  const handleBackClick = () => {
    console.log('Back button clicked!');
    // If coming from received message, go back to message window
    if (messageReceived && onBackToMessageWindow) {
      onBackToMessageWindow();
    } else if (onBack) {
      onBack();
    } else {
      console.error('onBack is not defined!');
    }
  };

  if (!profile) {
    return (
      <div className="profile-page-container">
        <div className="profile-header">
          <button className="back-btn" onClick={handleBackClick}>←</button>
          <button className="language-btn">🌐</button>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={`profile-page-container ${isSliding ? 'slide-out' : ''}`}>
      <div className="profile-header">
        <button className="back-btn" onClick={handleBackClick}>←</button>
        <button className="language-btn">🌐</button>
      </div>

      {/* Fixed Navigation Arrows */}
      {currentIndex > 0 && (
        <button className="nav-arrow nav-arrow-left" onClick={onPrev}>‹</button>
      )}
      {currentIndex < totalProfiles - 1 && (
        <button className="nav-arrow nav-arrow-right" onClick={onNext}>›</button>
      )}

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-photo-section">
          <img src={profile.profilePicture} alt={profile.profileName} className="profile-photo" />
          
          {/* Photo Overlay CTAs */}
          <div className="photo-overlay-ctas">
            <button className="photo-overlay-btn">⋯</button>
            <button className="photo-overlay-btn">⭐</button>
          </div>
          
          {/* Photo Footer */}
          <div className="photo-footer">
            <span className="photo-count">📸 1</span>
          </div>
        </div>

        {/* Tags and Name Section */}
        <div className="profile-tags-section">
          <div className="tags-row">
            <div className="paid-tag">
              <span className="crown-icon">👑</span>
              <span>Paid member</span>
            </div>
            <div className="verified-tag">
              <span className="verified-icon">✓</span>
              <span>Verified Profile</span>
              <span className="info-icon">ℹ</span>
            </div>
          </div>
        </div>

        {/* Name and Contact Actions */}
        <div className="name-section">
          <h1 className="profile-name">{profile.profileName}</h1>
          <div className="contact-actions">
            <button className="contact-icon-btn">📞</button>
            <button className="contact-icon-btn whatsapp-btn">💬</button>
          </div>
        </div>

        {/* Meta Information Row */}
        <div className="meta-info-row">
          <span>{profile.profileId}</span> • 
          <span>{profile.profileCreatedBy}</span> • 
          <span>{profile.age} Yrs</span> • 
          <span>{profile.height}</span> • 
          <span>{profile.caste}</span> • 
          <span>{profile.education}</span> • 
          <span>{profile.occupation}</span> • 
          <span>{profile.annualIncome}</span> • 
          <span>{profile.location}</span>
        </div>

        {/* Sticky CTA */}
        <div className="sticky-cta-bar">
          {messageReceived ? (
            /* Received message state - from Received tab */
            <>
              {/* Communication Header */}
              <div className="profile-communication-header">
                <p className="profile-communication-text">
                  {isDeclined 
                    ? `You have declined ${profile.gender === 'Male' ? 'his' : 'her'} request`
                    : `${profile.gender === 'Male' ? 'He' : 'She'} sent you a message`
                  }
                </p>
                <span className="profile-communication-date">
                  {formatDate(receivedDate)}
                </span>
              </div>
              
              {/* Message Snippet */}
              <div className="profile-message-snippet">
                <p className="profile-snippet-text">
                  {receivedMessage ? receivedMessage.substring(0, 30) + '...' : 'Greeting! We came across'}
                </p>
                <button 
                  className="profile-read-more-link"
                  onClick={openMessageWindow}
                >
                  Read More →
                </button>
              </div>

              {/* CTAs - side by side or full width */}
              <div className="message-sent-ctas">
                {!isDeclined && (
                  <button 
                    className="cta-btn tertiary-cta"
                    onClick={handleDecline}
                  >
                    Decline
                  </button>
                )}
                <button 
                  className="cta-btn primary-cta"
                  onClick={handleSendMessageClick}
                >
                  Send Reply
                </button>
              </div>
            </>
          ) : messageSent ? (
            /* After message sent - matches card style */
            <>
              {/* Communication Header */}
              <div className="profile-communication-header">
                <p className="profile-communication-text">
                  You sent {profile.gender === 'Male' ? 'him' : 'her'} a message
                </p>
                <span className="profile-communication-date">
                  {formatDate(sentDate)}
                </span>
              </div>
              
              {/* Message Snippet */}
              <div className="profile-message-snippet">
                <p className="profile-snippet-text">
                  {sentMessage ? sentMessage.substring(0, 30) + '...' : 'Greetings, we came across'}
                </p>
                <button 
                  className="profile-read-more-link"
                  onClick={openMessageWindow}
                >
                  Read More →
                </button>
              </div>

              {/* CTAs - side by side */}
              <div className="message-sent-ctas">
                <button 
                  className="cta-btn secondary-red-cta"
                  onClick={() => onCallNow && onCallNow(profile.profileId)}
                >
                  Call Now
                </button>
                <button 
                  className="cta-btn primary-outline-cta"
                  onClick={handleSendMessageClick}
                >
                  <span className="checkmark-icon">✓</span> Send Message
                </button>
              </div>
            </>
          ) : (
            /* Before message sent - default layout */
            <>
              <div className="secondary-ctas">
                <button 
                  className="secondary-cta dont-show-btn tertiary-style"
                  onClick={() => onDontShow && onDontShow(profile.profileId)}
                >
                  Don't show
                </button>
                <button 
                  className="secondary-cta skip-btn"
                  onClick={() => onSkip && onSkip(profile.profileId)}
                >
                  Skip
                </button>
              </div>
              <button 
                className={`primary-cta ${isShimmering ? 'shimmer-effect' : ''}`}
                onClick={handleSendMessageClick}
              >
                {isShimmering ? 'Edit Message' : 'Send Message'}
              </button>
            </>
          )}
        </div>

        {/* Profile Information Feed */}
        <div className="profile-section personal-info-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="detail-row">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{profile.gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{profile.age} Yrs</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{profile.dateOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time of Birth:</span>
            <span className="detail-value">{profile.timeOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Height:</span>
            <span className="detail-value">{profile.height}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Weight:</span>
            <span className="detail-value">{profile.weight}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Body Type:</span>
            <span className="detail-value">{profile.bodyType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Marital Status:</span>
            <span className="detail-value">{profile.maritalStatus}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Profile Created By:</span>
            <span className="detail-value">{profile.profileCreatedBy}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Physical Status:</span>
            <span className="detail-value">{profile.physicalStatus}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Mother Tongue:</span>
            <span className="detail-value">{profile.motherTongue}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Lives in:</span>
            <span className="detail-value">{profile.location}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">State:</span>
            <span className="detail-value">{profile.state}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Citizenship:</span>
            <span className="detail-value">India</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Eating Habits:</span>
            <span className="detail-value">{profile.eatingHabits}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Religion:</span>
            <span className="detail-value">{profile.religion}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Caste:</span>
            <span className="detail-value">{profile.caste}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gothram:</span>
            <span className="detail-value">{profile.gothram}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dosham:</span>
            <span className="detail-value">{profile.dosham}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Place of Birth:</span>
            <span className="detail-value">{profile.placeOfBirth}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Star:</span>
            <span className="detail-value">{profile.star}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rashi:</span>
            <span className="detail-value">{profile.rashi}</span>
          </div>
        </div>

        {/* Kundli Section */}
        <div className="profile-section kundli-section">
          <div className="kundli-link">
            <span className="kundli-icon">📄</span>
            <span>View Horoscope</span>
          </div>
          <div className="kundli-link">
            <span className="kundli-icon">🔄</span>
            <span>View Horoscope Compatibility</span>
          </div>
        </div>

        {/* Religious & Cultural Details */}
        <div className="profile-section">
          <h3 className="section-title">Professional Information</h3>
          <div className="detail-row">
            <span className="detail-label">Employed in:</span>
            <span className="detail-value">{profile.employment}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Annual Income:</span>
            <span className="detail-value">{profile.annualIncome}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Education:</span>
            <span className="detail-value">{profile.education}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Studied at:</span>
            <span className="detail-value">{profile.institute}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Works at:</span>
            <span className="detail-value">{profile.occupation}</span>
          </div>
        </div>

        {/* Family Information */}
        <div className="profile-section">
          <h3 className="section-title">Family Information</h3>
          <div className="detail-row">
            <span className="detail-label">Family Status:</span>
            <span className="detail-value">{profile.familyStatus}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Parents' Information:</span>
            <span className="detail-value">Father: {profile.fatherOccupation}, Mother: {profile.motherOccupation}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Brothers:</span>
            <span className="detail-value">{profile.brothers}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Sisters:</span>
            <span className="detail-value">{profile.sisters}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Family Location:</span>
            <span className="detail-value">{profile.familyLocation}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type of Residence:</span>
            <span className="detail-value">{profile.typeOfResidence}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="profile-section contact-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="detail-row">
            <span className="detail-label">Contact Person:</span>
            <span className="detail-value">{profile.profileCreatedBy}</span>
          </div>
          <div className="contact-ctas">
            <button className="contact-cta whatsapp-cta">💬 WhatsApp</button>
            <button className="contact-cta call-cta">📞 Call Now</button>
          </div>
        </div>

        {/* About Me */}
        <div className="profile-section">
          <h3 className="section-title">About Me</h3>
          <p className="about-text">{profile.aboutMe}</p>
        </div>

        {/* Additional Details - combining Additional Information and Lifestyle */}
        <div className="profile-section">
          <h3 className="section-title">Additional Details</h3>
          <div className="detail-row">
            <span className="detail-label">Wishing to support family financially:</span>
            <span className="detail-value">{profile.wishingToSupportFamily}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Horoscope matching requirement:</span>
            <span className="detail-value">{profile.horoscopeMatching}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Planning to work after marriage:</span>
            <span className="detail-value">{profile.planningToWorkAfterMarriage}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Open to relocate after marriage:</span>
            <span className="detail-value">{profile.openToRelocate}</span>
          </div>
        </div>

        {/* Future Goals */}
        <div className="profile-section">
          <h3 className="section-title">Future Goals</h3>
          <p className="about-text">{profile.futureGoal}</p>
        </div>

        {/* Lifestyle */}
        <div className="profile-section">
          <h3 className="section-title">Lifestyle</h3>
          <div className="detail-row">
            <span className="detail-label">Cuisine:</span>
            <span className="detail-value">{profile.cuisine}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Movies:</span>
            <span className="detail-value">{profile.movies}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Sports:</span>
            <span className="detail-value">{profile.sports}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Music:</span>
            <span className="detail-value">{profile.music}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Drinking Habit:</span>
            <span className="detail-value">{profile.drinkingHabit}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Smoking Habit:</span>
            <span className="detail-value">{profile.smokingHabit}</span>
          </div>
        </div>

        {/* Partner Preference */}
        <div className="profile-section partner-preference-section">
          <h3 className="section-title">Partner Preference</h3>
          
          <div className="preference-photos">
            <div className="preference-photo-container">
              <img src={profile.profilePicture} alt="Their profile" className="preference-photo" />
              <span className="photo-label">Their Profile</span>
            </div>
            <div className="preference-arrow">→</div>
            <div className="preference-photo-container">
              <div className="preference-photo placeholder-photo">You</div>
              <span className="photo-label">Your Profile</span>
            </div>
          </div>
          
          <div className="matching-score">
            <span className="score-label">Your Matching Score:</span>
            <span className="score-value">{partnerPreference.matchingScore}</span>
          </div>

          <h4 className="subsection-title">Basic Preferences</h4>
          <div className="detail-row">
            <span className="detail-label">Preferred Age:</span>
            <span className="detail-value">{partnerPreference.preferredAge}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Height:</span>
            <span className="detail-value">{partnerPreference.preferredHeight}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Marital Status:</span>
            <span className="detail-value">{partnerPreference.preferredMaritalStatus}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Mother Tongue:</span>
            <span className="detail-value">{partnerPreference.preferredMotherTongue}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Physical Status:</span>
            <span className="detail-value">{partnerPreference.preferredPhysicalStatus}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Eating Habit Preference:</span>
            <span className="detail-value">{partnerPreference.preferredEatingHabits}</span>
            <span className="preference-match-icon no-match">✗</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Smoking Habit Preference:</span>
            <span className="detail-value">{partnerPreference.preferredSmokingHabit}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Drinking Habit Preference:</span>
            <span className="detail-value">{partnerPreference.preferredDrinkingHabit}</span>
            <span className="preference-match-icon match">✓</span>
          </div>

          <h4 className="subsection-title">Religious Preferences</h4>
          <div className="detail-row">
            <span className="detail-label">Preferred Religion:</span>
            <span className="detail-value">{partnerPreference.preferredReligion}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Caste:</span>
            <span className="detail-value">{partnerPreference.preferredCaste}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Star:</span>
            <span className="detail-value">{partnerPreference.preferredStar}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Dosham Preference:</span>
            <span className="detail-value">{partnerPreference.preferredDosham}</span>
            <span className="preference-match-icon match">✓</span>
          </div>

          <h4 className="subsection-title">Professional Preferences</h4>
          <div className="detail-row">
            <span className="detail-label">Preferred Education:</span>
            <span className="detail-value">{partnerPreference.preferredEducation}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Employment Type:</span>
            <span className="detail-value">{partnerPreference.preferredEmployment}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Occupation:</span>
            <span className="detail-value">{partnerPreference.preferredOccupation}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred Annual Income:</span>
            <span className="detail-value">{partnerPreference.preferredAnnualIncome}</span>
            <span className="preference-match-icon match">✓</span>
          </div>

          <h4 className="subsection-title">Location Preferences</h4>
          <div className="detail-row">
            <span className="detail-label">Preferred Country:</span>
            <span className="detail-value">{partnerPreference.preferredCountry}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred State:</span>
            <span className="detail-value">{partnerPreference.preferredState}</span>
            <span className="preference-match-icon match">✓</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Preferred City:</span>
            <span className="detail-value">{partnerPreference.preferredCity}</span>
            <span className="preference-match-icon no-match">✗</span>
          </div>
        </div>
      </div>

      {/* Saved Message Bottom Sheet */}
      {showBottomSheet && (
        <SavedMessageBottomSheet
          onContinue={handleMessageSent}
          onClose={() => setShowBottomSheet(false)}
        />
      )}

      {/* Message Window */}
      {showMessageWindow && (
        <MessageWindow
          profile={{
            ...profile,
            sentMessage: isEditingMode ? null : sentMessage,
            sentDate: isEditingMode ? null : sentDate,
            isEditing: isEditingMode
          }}
          onClose={closeMessageWindow}
          onSendMessage={handleMessageFromWindow}
        />
      )}
    </div>
  );
};

export default ProspectProfilePage;
