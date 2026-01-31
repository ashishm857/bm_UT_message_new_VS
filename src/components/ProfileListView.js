import React from 'react';
import './ProfileListView.css';

const ProfileListView = ({ profiles, partnerPreferences, onSelectProfile }) => {
  return (
    <div className="profile-list-container">
      <div className="list-header">
        <h1>Prospect Profiles</h1>
        <p className="list-subtitle">Generated {profiles.length} profiles based on your input</p>
      </div>

      <div className="profile-cards">
        {profiles.map((profile, index) => {
          const preference = partnerPreferences[index];
          return (
            <div 
              key={profile.profileId} 
              className="profile-card"
              onClick={() => onSelectProfile(index)}
            >
              <div className="card-header">
                <div className="profile-avatar-small">
                  {profile.gender === 'Male' ? '👨' : '👩'}
                </div>
                <div className="card-header-info">
                  <h3 className="card-profile-id">{profile.profileId}</h3>
                  <p className="card-basic-info">{profile.age} Yrs, {profile.height}</p>
                </div>
                <div className="match-score-badge">{preference.matchingScore}</div>
              </div>

              <div className="card-body">
                <div className="card-detail">
                  <span className="card-label">Location:</span>
                  <span className="card-value">{profile.location}, {profile.state}</span>
                </div>
                <div className="card-detail">
                  <span className="card-label">Education:</span>
                  <span className="card-value">{profile.education}</span>
                </div>
                <div className="card-detail">
                  <span className="card-label">Occupation:</span>
                  <span className="card-value">{profile.occupation}</span>
                </div>
                <div className="card-detail">
                  <span className="card-label">Income:</span>
                  <span className="card-value">{profile.annualIncome}</span>
                </div>
                <div className="card-detail">
                  <span className="card-label">Caste:</span>
                  <span className="card-value">{profile.caste}</span>
                </div>
                <div className="card-detail">
                  <span className="card-label">Marital Status:</span>
                  <span className="card-value">{profile.maritalStatus}</span>
                </div>
              </div>

              <div className="card-footer">
                <button className="view-profile-btn">View Full Profile →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileListView;
