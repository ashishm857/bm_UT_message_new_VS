import React, { useState, useRef, useEffect } from 'react';
import './DailyRecommendationPage.css';
import RecommendationCard from './RecommendationCard';
import SavedMessageBottomSheet from './SavedMessageBottomSheet';

const DailyRecommendationPage = ({ profiles, partnerPreferences, onBack, onExhausted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [hasShownSavedMessage, setHasShownSavedMessage] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSwipeRight = () => {
    // First swipe right - show saved message bottom sheet
    if (!hasShownSavedMessage) {
      setShowSavedMessage(true);
      return;
    }

    // Subsequent swipes - send message directly
    performSwipeTransition('right', 'Interested');
  };

  const handleSwipeLeft = () => {
    performSwipeTransition('left', 'Not Interested');
  };

  const handleSwipeUp = () => {
    performSwipeTransition('up', 'Shortlisted');
  };

  const handleSwipeDown = () => {
    performSwipeTransition('down', "Don't Show");
  };

  const performSwipeTransition = (direction, tag) => {
    setSwipeDirection(direction);
    setIsTransitioning(true);

    // Show tag and transition for 400ms
    setTimeout(() => {
      setIsTransitioning(false);
      setSwipeDirection(null);
      
      // Move to next profile
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All profiles viewed - navigate to Matches screen
        if (onExhausted) {
          onExhausted();
        } else {
          alert('You have viewed all recommendations!');
          onBack();
        }
      }
    }, 400);
  };

  const handleSavedMessageContinue = (message) => {
    setSelectedMessage(message);
    setHasShownSavedMessage(true);
    setShowSavedMessage(false);
    
    // Now perform the swipe right action
    performSwipeTransition('right', 'Interested');
  };

  const handleCloseSavedMessage = () => {
    setShowSavedMessage(false);
  };

  if (!profiles || profiles.length === 0) {
    return <div className="daily-recommendation-empty">No recommendations available</div>;
  }

  const currentProfile = profiles[currentIndex];
  const currentPartnerPreference = partnerPreferences[currentIndex];
  const nextProfile = currentIndex < profiles.length - 1 ? profiles[currentIndex + 1] : null;

  return (
    <div className="daily-recommendation-container">
      {/* Header */}
      <div className="daily-recommendation-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="recommendation-title">
          Daily Recommendation <span className="recommendation-count">({currentIndex + 1} out of {profiles.length})</span>
        </h2>
      </div>

      {/* Card Stack */}
      <div className="card-stack">
        {/* Next card preview (5-10px visible at top) */}
        {nextProfile && (
          <div className="card-preview">
            <div className="preview-strip"></div>
          </div>
        )}

        {/* Current card */}
        <RecommendationCard
          profile={currentProfile}
          partnerPreference={currentPartnerPreference}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          swipeDirection={swipeDirection}
          isTransitioning={isTransitioning}
        />
      </div>

      {/* Saved Message Bottom Sheet */}
      {showSavedMessage && (
        <SavedMessageBottomSheet
          onContinue={handleSavedMessageContinue}
          onClose={handleCloseSavedMessage}
        />
      )}
    </div>
  );
};

export default DailyRecommendationPage;
