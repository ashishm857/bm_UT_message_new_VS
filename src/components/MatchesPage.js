import React, { useState } from 'react';
import './MatchesPage.css';

const MatchesPage = ({ profiles, onBack, onSelectProfile }) => {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'mutual'

  return (
    <div className="matches-container">
      {/* Header */}
      <div className="matches-header">
        <button className="matches-back-btn" onClick={onBack}>←</button>
        <h1 className="matches-title">Matches</h1>
        <div className="matches-header-spacer"></div>
      </div>

      {/* Tabs */}
      <div className="matches-tabs">
        <button 
          className={`matches-tab ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Matches
        </button>
        <button 
          className={`matches-tab ${activeTab === 'mutual' ? 'active' : ''}`}
          onClick={() => setActiveTab('mutual')}
        >
          Mutual Matches
        </button>
      </div>

      {/* Filter/Sort Section */}
      <div className="matches-controls">
        <button className="matches-filter-btn">
          <span className="filter-icon">⚙</span>
          <span>Filter</span>
        </button>
        <button className="matches-sort-btn">
          <span>Sort By</span>
          <span className="chevron">∨</span>
        </button>
      </div>

      {/* Grid View */}
      <div className="matches-grid">
        {profiles.map((profile, index) => (
          <div 
            key={index} 
            className="match-card"
            onClick={() => onSelectProfile(index)}
          >
            {/* Profile Photo */}
            <div className="match-photo-container">
              <img 
                src={profile.profilePicture} 
                alt={profile.name} 
                className="match-photo"
              />
              
              {/* Photo overlay gradient */}
              <div className="match-photo-overlay"></div>

              {/* Photo counter */}
              <div className="match-photo-count">1/{profile.totalPhotos || 14}</div>

              {/* Shortlist button */}
              <button className="match-shortlist-btn">
                <span className="star-icon">⭐</span>
                <span className="shortlist-text">Shortlist</span>
              </button>

              {/* Photo Verified Badge */}
              <div className="match-badge photo-verified">
                <span className="badge-icon">✓</span>
                <span>Photo Verified</span>
              </div>

              {/* ID Verified Badge */}
              <div className="match-badges-row">
                <div className="match-badge id-verified">
                  <span className="badge-icon">✓</span>
                  <span>ID verified</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="match-info">
              <h3 className="match-name">{profile.name}</h3>
              <p className="match-meta">
                {profile.age} Yrs, {profile.height} • {profile.caste}
              </p>
              <p className="match-meta">
                {profile.education}
              </p>
              <p className="match-meta">
                {profile.occupation}
              </p>
              <p className="match-meta">
                {profile.city}, {profile.state}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="match-actions">
              <button className="match-action-btn connect-btn">
                Connect Now
              </button>
              <button className="match-action-btn skip-btn">
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;
