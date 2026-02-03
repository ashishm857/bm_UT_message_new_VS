import React, { useRef, useState, useEffect } from 'react';
import './RecommendationCard.css';

const RecommendationCard = ({ 
  profile, 
  partnerPreference, 
  onSwipeRight, 
  onSwipeLeft, 
  onSwipeUp, 
  onSwipeDown,
  swipeDirection,
  isTransitioning 
}) => {
  const containerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const [showShortlistBtn, setShowShortlistBtn] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isMouseDown = false;

    // Touch events
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      touchStartRef.current = { x: startX, y: startY };
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      const minSwipeDistance = 50;
      
      // Only handle horizontal swipes (removed vertical to allow scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        }
      }
    };

    // Mouse events for desktop testing
    const handleMouseDown = (e) => {
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      
      const endX = e.clientX;
      const endY = e.clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      const minSwipeDistance = 50;
      
      // Only handle horizontal swipes (removed vertical to allow scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSwipeRight, onSwipeLeft, onSwipeUp, onSwipeDown]);

  const getSwipeTag = () => {
    switch (swipeDirection) {
      case 'right': return 'Interested';
      case 'left': return 'Not Interested';
      case 'up': return 'Shortlisted';
      case 'down': "Don't Show";
      default: return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`recommendation-card-container ${isTransitioning ? `swipe-${swipeDirection}` : ''}`}
    >
      {/* Swipe transition tag overlay */}
      {isTransitioning && (
        <div className="swipe-tag-overlay">
          <span className={`swipe-tag swipe-tag-${swipeDirection}`}>
            {getSwipeTag()}
          </span>
        </div>
      )}

      {/* Scrollable content wrapper */}
      <div className="card-content-wrapper">
        {/* Profile Photo Section with Shortlist */}
        <div className="card-photo-section">
          <img src={profile.profilePicture} alt={profile.name} className="card-profile-photo" />
          
          {/* Photo overlay buttons */}
          <div className="card-photo-overlay-ctas">
            <button className="card-photo-overlay-btn" onClick={onSwipeUp}>⭐</button>
          </div>

          {/* Photo counter */}
          <div className="card-photo-footer">
            <span className="card-photo-count">📸 1</span>
          </div>
        </div>

        {/* Profile Tags */}
        <div className="card-tags-section">
          <div className="card-tags-row">
            <div className="card-paid-tag">
              <span className="crown-icon">👑</span>
              <span>Paid member</span>
            </div>
            <div className="card-verified-tag">
              <span className="verified-icon">✓</span>
              <span>Verified Profile</span>
              <span className="info-icon">ℹ</span>
            </div>
          </div>
          <div className="card-contact-actions">
            <button className="card-contact-icon-btn">☎️</button>
            <button className="card-contact-icon-btn whatsapp-btn">💬</button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="card-meta-info-row">
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

        {/* Personal Information */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Personal Information</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Gender:</span>
            <span className="card-detail-value">{profile.gender}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Age:</span>
            <span className="card-detail-value">{profile.age} Yrs</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Date of Birth:</span>
            <span className="card-detail-value">{profile.dateOfBirth}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Time of Birth:</span>
            <span className="card-detail-value">{profile.timeOfBirth}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Height:</span>
            <span className="card-detail-value">{profile.height}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Weight:</span>
            <span className="card-detail-value">{profile.weight}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Body Type:</span>
            <span className="card-detail-value">{profile.bodyType}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Marital Status:</span>
            <span className="card-detail-value">{profile.maritalStatus}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Profile Created By:</span>
            <span className="card-detail-value">{profile.profileCreatedBy}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Physical Status:</span>
            <span className="card-detail-value">{profile.physicalStatus}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Mother Tongue:</span>
            <span className="card-detail-value">{profile.motherTongue}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Lives in:</span>
            <span className="card-detail-value">{profile.city}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">State:</span>
            <span className="card-detail-value">{profile.state}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Citizenship:</span>
            <span className="card-detail-value">{profile.citizenship}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Eating Habits:</span>
            <span className="card-detail-value">{profile.eatingHabit}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Religion:</span>
            <span className="card-detail-value">{profile.religion}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Caste:</span>
            <span className="card-detail-value">{profile.caste}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Gothram:</span>
            <span className="card-detail-value">{profile.gothram}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Dosham:</span>
            <span className="card-detail-value">{profile.dosham}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Place of Birth:</span>
            <span className="card-detail-value">{profile.placeOfBirth}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Star:</span>
            <span className="card-detail-value">{profile.star}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Rashi:</span>
            <span className="card-detail-value">{profile.rashi}</span>
          </div>
        </div>

        {/* Kundli Section */}
        <div className="card-profile-section card-kundli-section">
          <div className="card-kundli-link">
            <span className="card-kundli-icon">📄</span>
            <span>View Horoscope</span>
          </div>
          <div className="card-kundli-link">
            <span className="card-kundli-icon">🔄</span>
            <span>View Horoscope Compatibility</span>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Professional Information</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Employed in:</span>
            <span className="card-detail-value">{profile.employment}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Annual Income:</span>
            <span className="card-detail-value">{profile.annualIncome}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Education:</span>
            <span className="card-detail-value">{profile.education}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Studied at:</span>
            <span className="card-detail-value">{profile.institute}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Works at:</span>
            <span className="card-detail-value">{profile.occupation}</span>
          </div>
        </div>

        {/* Family Information */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Family Information</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Family Status:</span>
            <span className="card-detail-value">{profile.familyStatus}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Parents' Information:</span>
            <span className="card-detail-value">Father: {profile.fatherOccupation}, Mother: {profile.motherOccupation}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Brothers:</span>
            <span className="card-detail-value">{profile.brothers}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Sisters:</span>
            <span className="card-detail-value">{profile.sisters}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Family Location:</span>
            <span className="card-detail-value">{profile.familyLocation}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Type of Residence:</span>
            <span className="card-detail-value">{profile.typeOfResidence}</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card-profile-section card-contact-section">
          <h3 className="card-section-title">Contact Information</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Contact Person:</span>
            <span className="card-detail-value">{profile.profileCreatedBy}</span>
          </div>
          <div className="card-contact-ctas">
            <button className="card-contact-cta card-whatsapp-cta">💬 WhatsApp</button>
            <button className="card-contact-cta card-call-cta">📞 Call Now</button>
          </div>
        </div>

        {/* About Me */}
        <div className="card-profile-section">
          <h3 className="card-section-title">About Me</h3>
          <p className="card-about-text">{profile.aboutMe}</p>
        </div>

        {/* Additional Details */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Additional Details</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Wishing to support family financially:</span>
            <span className="card-detail-value">{profile.wishingToSupportFamily}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Horoscope matching requirement:</span>
            <span className="card-detail-value">{profile.horoscopeMatching}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Planning to work after marriage:</span>
            <span className="card-detail-value">{profile.planningToWorkAfterMarriage}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Open to relocate after marriage:</span>
            <span className="card-detail-value">{profile.openToRelocate}</span>
          </div>
        </div>

        {/* Future Goals */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Future Goals</h3>
          <p className="card-about-text">{profile.futureGoal}</p>
        </div>

        {/* Lifestyle */}
        <div className="card-profile-section">
          <h3 className="card-section-title">Lifestyle</h3>
          <div className="card-detail-row">
            <span className="card-detail-label">Cuisine:</span>
            <span className="card-detail-value">{profile.cuisine}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Movies:</span>
            <span className="card-detail-value">{profile.movies}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Sports:</span>
            <span className="card-detail-value">{profile.sports}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Music:</span>
            <span className="card-detail-value">{profile.music}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Drinking Habit:</span>
            <span className="card-detail-value">{profile.drinkingHabit}</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Smoking Habit:</span>
            <span className="card-detail-value">{profile.smokingHabit}</span>
          </div>
        </div>

        {/* Partner Preference */}
        <div className="card-profile-section card-partner-preference-section">
          <h3 className="card-section-title">Partner Preference</h3>
          
          <div className="card-preference-photos">
            <div className="card-preference-photo-container">
              <img src={profile.profilePicture} alt="Their profile" className="card-preference-photo" />
              <span className="card-photo-label">Their Profile</span>
            </div>
            <div className="card-preference-arrow">→</div>
            <div className="card-preference-photo-container">
              <div className="card-preference-photo card-placeholder-photo">You</div>
              <span className="card-photo-label">Your Profile</span>
            </div>
          </div>
          
          <div className="card-matching-score">
            <span className="card-score-label">Your Matching Score:</span>
            <span className="card-score-value">{partnerPreference.matchingScore}</span>
          </div>

          <h4 className="card-subsection-title">Basic Preferences</h4>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Age:</span>
            <span className="card-detail-value">{partnerPreference.preferredAge}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Height:</span>
            <span className="card-detail-value">{partnerPreference.preferredHeight}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Marital Status:</span>
            <span className="card-detail-value">{partnerPreference.preferredMaritalStatus}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Mother Tongue:</span>
            <span className="card-detail-value">{partnerPreference.preferredMotherTongue}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Physical Status:</span>
            <span className="card-detail-value">{partnerPreference.preferredPhysicalStatus}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Eating Habit Preference:</span>
            <span className="card-detail-value">{partnerPreference.preferredEatingHabits}</span>
            <span className="card-preference-match-icon no-match">✗</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Smoking Habit Preference:</span>
            <span className="card-detail-value">{partnerPreference.preferredSmokingHabit}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Drinking Habit Preference:</span>
            <span className="card-detail-value">{partnerPreference.preferredDrinkingHabit}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>

          <h4 className="card-subsection-title">Religious Preferences</h4>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Religion:</span>
            <span className="card-detail-value">{partnerPreference.preferredReligion}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Caste:</span>
            <span className="card-detail-value">{partnerPreference.preferredCaste}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Star:</span>
            <span className="card-detail-value">{partnerPreference.preferredStar}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Dosham Preference:</span>
            <span className="card-detail-value">{partnerPreference.preferredDosham}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>

          <h4 className="card-subsection-title">Professional Preferences</h4>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Education:</span>
            <span className="card-detail-value">{partnerPreference.preferredEducation}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Employment Type:</span>
            <span className="card-detail-value">{partnerPreference.preferredEmployment}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Occupation:</span>
            <span className="card-detail-value">{partnerPreference.preferredOccupation}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Annual Income:</span>
            <span className="card-detail-value">{partnerPreference.preferredAnnualIncome}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>

          <h4 className="card-subsection-title">Location Preferences</h4>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred Country:</span>
            <span className="card-detail-value">{partnerPreference.preferredCountry}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred State:</span>
            <span className="card-detail-value">{partnerPreference.preferredState}</span>
            <span className="card-preference-match-icon match">✓</span>
          </div>
          <div className="card-detail-row">
            <span className="card-detail-label">Preferred City:</span>
            <span className="card-detail-value">{partnerPreference.preferredCity}</span>
            <span className="card-preference-match-icon no-match">✗</span>
          </div>
        </div>
      </div>

      {/* Bottom CTAs (Sticky at bottom like full view profile) */}
      <div className="card-sticky-cta-bar">
        <div className="card-secondary-ctas">
          <button className="card-secondary-cta card-dont-show-btn" onClick={onSwipeDown}>Don't show</button>
          <button className="card-secondary-cta card-skip-btn" onClick={onSwipeLeft}>Skip</button>
        </div>
        <button className="card-primary-cta" onClick={onSwipeRight}>Send Message</button>
      </div>
    </div>
  );
};

export default RecommendationCard;
