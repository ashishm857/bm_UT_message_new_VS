import React, { useState, useEffect } from 'react';
import OperatorInputForm from './components/OperatorInputForm';
import ProfileListView from './components/ProfileListView';
import ProspectProfilePage from './components/ProspectProfilePage';
import DailyRecommendationPage from './components/DailyRecommendationPage';
import MatchesScreen from './components/MatchesScreen';
import MessagesScreen from './components/MessagesScreen';
import generateProspectProfile, { resetProfileGeneration } from './utils/prospectProfileLogic';
import { generatePartnerPreference } from './utils/partnerPreferenceLogic';
import './App.css';

function App() {
  // Clear ALL localStorage on app load - fresh start every time
  useEffect(() => {
    localStorage.clear();
  }, []);

  const [currentView, setCurrentView] = useState('form'); // 'form', 'recommendation', 'profile', 'matches', 'messages'
  const [previousView, setPreviousView] = useState(null);
  const [operatorInput, setOperatorInput] = useState(null);
  const [prospectProfiles, setProspectProfiles] = useState([]);
  const [partnerPreferences, setPartnerPreferences] = useState([]);
  const [allMatchesProfiles, setAllMatchesProfiles] = useState([]);
  const [newMatchesProfiles, setNewMatchesProfiles] = useState([]);
  const [messagesProfiles, setMessagesProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [selectedMatchProfile, setSelectedMatchProfile] = useState(null);
  const [returnToMessageWindowProfile, setReturnToMessageWindowProfile] = useState(null);
  const [receivedMessageWindowData, setReceivedMessageWindowData] = useState(null);
  const [receivedMessageData, setReceivedMessageData] = useState(null); // For profiles from Received tab
  const [returnToReceivedMessageWindow, setReturnToReceivedMessageWindow] = useState(null); // For returning to message window

  const handleFormSubmit = (formData) => {
    setOperatorInput(formData);
    
    // Clear localStorage for fresh start
    localStorage.removeItem('matchesProfileStates');
    localStorage.removeItem('hiddenProfiles');
    localStorage.removeItem('sessionDefaultMessage');
    localStorage.removeItem('useDefaultMessage');
    localStorage.removeItem('bottomSheetShown');
    localStorage.removeItem('sessionSavedMessages');
    localStorage.removeItem('profileMessages');
    localStorage.removeItem('readMessageIds');
    localStorage.removeItem('declinedProfiles');
    
    // Reset profile generation to ensure unique profiles
    resetProfileGeneration();
    
    // Generate 5 prospect profiles for daily recommendation
    const profiles = [];
    const preferences = [];
    
    for (let i = 0; i < 5; i++) {
      const profile = generateProspectProfile(formData);
      const preference = generatePartnerPreference(profile);
      profiles.push(profile);
      preferences.push(preference);
    }
    
    setProspectProfiles(profiles);
    setPartnerPreferences(preferences);
    setSelectedProfileIndex(0);
    setCurrentView('recommendation');

    // Generate 20 profiles for All Matches
    const allMatches = [];
    for (let i = 0; i < 20; i++) {
      allMatches.push(generateProspectProfile(formData));
    }
    setAllMatchesProfiles(allMatches);

    // Generate 5 profiles for New Matches (from the first 5 of All Matches)
    const newMatches = allMatches.slice(0, 5);
    setNewMatchesProfiles(newMatches);

    // Generate 15 fresh profiles for Messages Screen (non-repeating)
    const messagesProfilesList = [];
    for (let i = 0; i < 15; i++) {
      messagesProfilesList.push(generateProspectProfile(formData));
    }
    setMessagesProfiles(messagesProfilesList);
  };

  const handleSelectProfile = (index) => {
    setSelectedProfileIndex(index);
    setCurrentView('profile');
  };

  const handleBackToList = () => {
    console.log('handleBackToList - previousView:', previousView);
    console.log('handleBackToList - currentView:', currentView);
    console.log('handleBackToList - returnToMessageWindowProfile:', returnToMessageWindowProfile?.profileId);
    
    if (previousView === 'matches') {
      console.log('Navigating back to matches');
      setCurrentView('matches');
      setPreviousView(null);
      // returnToMessageWindowProfile will trigger message window to open in MatchesScreen
    } else if (previousView === 'messages') {
      console.log('Navigating back to messages');
      setCurrentView('messages');
      setPreviousView(null);
    } else {
      console.log('Navigating back to form');
      setCurrentView('form');
      setOperatorInput(null);
      setProspectProfiles([]);
      setPartnerPreferences([]);
      setReturnToMessageWindowProfile(null);
    }
  };

  const handleNextProfile = () => {
    if (previousView === 'matches') {
      // Navigate through matches profiles
      const currentMatchIndex = allMatchesProfiles.findIndex(p => p.profileId === selectedMatchProfile?.profileId);
      if (currentMatchIndex < allMatchesProfiles.length - 1) {
        setSelectedMatchProfile(allMatchesProfiles[currentMatchIndex + 1]);
        setSelectedProfileIndex(currentMatchIndex + 1);
      } else {
        // At the end - go back to matches list
        handleBackToList();
      }
    } else {
      // Daily recommendation navigation
      if (selectedProfileIndex < prospectProfiles.length - 1) {
        setSelectedProfileIndex(selectedProfileIndex + 1);
      }
    }
  };

  const handlePrevProfile = () => {
    if (previousView === 'matches') {
      // Navigate through matches profiles
      const currentMatchIndex = allMatchesProfiles.findIndex(p => p.profileId === selectedMatchProfile?.profileId);
      if (currentMatchIndex > 0) {
        setSelectedMatchProfile(allMatchesProfiles[currentMatchIndex - 1]);
        setSelectedProfileIndex(currentMatchIndex - 1);
      }
    } else {
      // Daily recommendation navigation
      if (selectedProfileIndex > 0) {
        setSelectedProfileIndex(selectedProfileIndex - 1);
      }
    }
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setOperatorInput(null);
    setProspectProfiles([]);
    setPartnerPreferences([]);
    setAllMatchesProfiles([]);
    setNewMatchesProfiles([]);
  };

  const handleRecommendationsExhausted = () => {
    setCurrentView('matches');
  };

  const handleProfileClick = (profile) => {
    // Navigate to full profile view - store the profile directly
    console.log('handleProfileClick - profile:', profile.profileId);
    setSelectedMatchProfile(profile);
    // Set the index for navigation arrows
    const profileIndex = allMatchesProfiles.findIndex(p => p.profileId === profile.profileId);
    setSelectedProfileIndex(profileIndex >= 0 ? profileIndex : 0);
    setPreviousView('matches');
    setCurrentView('profile');
    // Clear return to message window since this is direct navigation from matches
    setReturnToMessageWindowProfile(null);
    console.log('handleProfileClick - set previousView to matches');
  };

  // Handle profile click from message window - should return to message window on back
  const handleProfileClickFromMessage = (profile, messageWindowProfile) => {
    console.log('handleProfileClickFromMessage - profile:', profile.profileId, 'messageWindowProfile:', messageWindowProfile.profileId);
    setSelectedMatchProfile(profile);
    const profileIndex = allMatchesProfiles.findIndex(p => p.profileId === profile.profileId);
    setSelectedProfileIndex(profileIndex >= 0 ? profileIndex : 0);
    setPreviousView('matches');
    setCurrentView('profile');
    // Store the message window profile to return to
    setReturnToMessageWindowProfile(messageWindowProfile);
  };

  const handleSendMessage = (profileId) => {
    console.log('Opening message window for profile:', profileId);
    // Message window logic will be implemented later
  };

  const handleCallNow = (profileId) => {
    console.log('Call now clicked for profile:', profileId);
    // No interaction as per spec
  };

  const handleDontShow = (profileId) => {
    console.log('Don\'t show clicked for profile:', profileId);
    
    if (previousView === 'matches') {
      // Get current index and filter out hidden profiles
      const hiddenProfiles = JSON.parse(localStorage.getItem('hiddenProfiles') || '[]');
      const newHiddenProfiles = [...hiddenProfiles, profileId];
      localStorage.setItem('hiddenProfiles', JSON.stringify(newHiddenProfiles));
      
      // Get remaining profiles after hiding current one
      const remainingProfiles = allMatchesProfiles.filter(p => !newHiddenProfiles.includes(p.profileId));
      
      if (remainingProfiles.length > 0) {
        // Find the next profile to show
        const currentIndex = allMatchesProfiles.findIndex(p => p.profileId === profileId);
        let nextProfile = null;
        
        // Look for the next non-hidden profile after current index
        for (let i = currentIndex + 1; i < allMatchesProfiles.length; i++) {
          if (!newHiddenProfiles.includes(allMatchesProfiles[i].profileId)) {
            nextProfile = allMatchesProfiles[i];
            break;
          }
        }
        
        // If no profile found after, look for the previous non-hidden profile
        if (!nextProfile) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (!newHiddenProfiles.includes(allMatchesProfiles[i].profileId)) {
              nextProfile = allMatchesProfiles[i];
              break;
            }
          }
        }
        
        if (nextProfile) {
          setSelectedMatchProfile(nextProfile);
          const newIndex = allMatchesProfiles.findIndex(p => p.profileId === nextProfile.profileId);
          setSelectedProfileIndex(newIndex);
        } else {
          // No more profiles, go back to matches list
          handleBackToList();
        }
      } else {
        // No remaining profiles, go back to matches list
        handleBackToList();
      }
    }
  };

  // Helper to check if message was sent for a profile
  const isMessageSent = (profileId) => {
    const saved = localStorage.getItem('matchesProfileStates');
    console.log('isMessageSent check for profileId:', profileId);
    console.log('localStorage matchesProfileStates:', saved);
    if (saved) {
      const states = JSON.parse(saved);
      const result = states[profileId]?.messageSent || false;
      console.log('isMessageSent result:', result);
      return result;
    }
    return false;
  };

  // Helper to get sent date for a profile
  const getSentDate = (profileId) => {
    const saved = localStorage.getItem('matchesProfileStates');
    if (saved) {
      const states = JSON.parse(saved);
      return states[profileId]?.sentDate || null;
    }
    return null;
  };

  // Helper to get sent message for a profile
  const getSentMessage = (profileId) => {
    const saved = localStorage.getItem('matchesProfileStates');
    if (saved) {
      const states = JSON.parse(saved);
      return states[profileId]?.sentMessage || null;
    }
    return null;
  };

  const handleSkip = (profileId) => {
    console.log('Skip clicked for profile:', profileId);
    // Skip logic - move to next profile
    handleNextProfile();
  };

  // Handle navigation to Messages screen
  const handleGoToMessages = () => {
    setPreviousView(currentView);
    setCurrentView('messages');
  };

  // Handle navigation back from Messages screen
  const handleBackFromMessages = () => {
    setCurrentView('matches');
    setPreviousView(null);
  };

  // Handle profile click from Messages screen
  const handleProfileClickFromMessages = (profile, receivedMessage = null, isFromAwaiting = false) => {
    setSelectedMatchProfile(profile);
    const profileIndex = [...allMatchesProfiles, ...messagesProfiles].findIndex(p => p.profileId === profile.profileId);
    setSelectedProfileIndex(profileIndex >= 0 ? profileIndex : 0);
    setPreviousView('messages');
    setCurrentView('profile');
    // Store received message data only if coming from Received tab (not Awaiting tab)
    // For Awaiting tab, we rely on messageSent state from localStorage
    if (receivedMessage && !isFromAwaiting) {
      setReceivedMessageData({
        message: receivedMessage,
        date: new Date().toISOString()
      });
      // Store data to return to message window
      setReturnToReceivedMessageWindow({
        profile: profile,
        message: receivedMessage,
        isFromAwaiting: isFromAwaiting
      });
    } else {
      setReceivedMessageData(null);
      // For Awaiting tab, still store return data so we can go back to message window
      if (isFromAwaiting && receivedMessage) {
        setReturnToReceivedMessageWindow({
          profile: profile,
          message: receivedMessage,
          isFromAwaiting: isFromAwaiting
        });
      } else {
        setReturnToReceivedMessageWindow(null);
      }
    }
  };

  // Handle back to message window from profile
  const handleBackToMessageWindow = () => {
    setCurrentView('messages');
    // Keep returnToReceivedMessageWindow so MessagesScreen can reopen the message window
  };

  // Handle opening message window from Messages screen (received messages)
  const handleOpenReceivedMessageWindow = (profile, fullMessage, type) => {
    setReceivedMessageWindowData({ profile, fullMessage, type });
  };

  return (
    <div className="app">
      {currentView === 'form' && (
        <OperatorInputForm onSubmit={handleFormSubmit} />
      )}
      
      {currentView === 'recommendation' && (
        <DailyRecommendationPage 
          profiles={prospectProfiles}
          partnerPreferences={partnerPreferences}
          onBack={handleBackToForm}
          onExhausted={handleRecommendationsExhausted}
        />
      )}

      {currentView === 'matches' && (
        <MatchesScreen
          allMatchesProfiles={allMatchesProfiles}
          newMatchesProfiles={newMatchesProfiles}
          onProfileClick={handleProfileClick}
          onProfileClickFromMessage={handleProfileClickFromMessage}
          onSendMessage={handleSendMessage}
          onCallNow={handleCallNow}
          onDontShow={handleDontShow}
          initialMessageWindowProfile={returnToMessageWindowProfile}
          onMessageWindowOpened={() => setReturnToMessageWindowProfile(null)}
          onGoToMessages={handleGoToMessages}
        />
      )}

      {currentView === 'messages' && (
        <MessagesScreen
          profiles={messagesProfiles}
          allMatchesProfiles={allMatchesProfiles}
          onBack={handleBackFromMessages}
          onProfileClick={handleProfileClickFromMessages}
          onOpenMessageWindow={handleOpenReceivedMessageWindow}
          initialOpenMessage={returnToReceivedMessageWindow}
          onMessageWindowOpened={() => setReturnToReceivedMessageWindow(null)}
        />
      )}
      
      {currentView === 'profile' && selectedMatchProfile && previousView === 'matches' && (
        <ProspectProfilePage 
          profile={selectedMatchProfile}
          partnerPreference={generatePartnerPreference(selectedMatchProfile)}
          onBack={handleBackToList}
          onNext={handleNextProfile}
          onPrev={handlePrevProfile}
          currentIndex={selectedProfileIndex}
          totalProfiles={allMatchesProfiles.length}
          messageSent={isMessageSent(selectedMatchProfile.profileId)}
          sentDate={getSentDate(selectedMatchProfile.profileId)}
          sentMessage={getSentMessage(selectedMatchProfile.profileId)}
          onSendMessage={handleSendMessage}
          onCallNow={handleCallNow}
          onDontShow={handleDontShow}
          onSkip={handleSkip}
        />
      )}

      {currentView === 'profile' && selectedMatchProfile && previousView === 'messages' && (
        <ProspectProfilePage 
          profile={selectedMatchProfile}
          partnerPreference={generatePartnerPreference(selectedMatchProfile)}
          onBack={handleBackToList}
          onBackToMessageWindow={handleBackToMessageWindow}
          onNext={null}
          onPrev={null}
          currentIndex={0}
          totalProfiles={1}
          messageSent={isMessageSent(selectedMatchProfile.profileId)}
          sentDate={getSentDate(selectedMatchProfile.profileId)}
          sentMessage={getSentMessage(selectedMatchProfile.profileId)}
          messageReceived={receivedMessageData !== null}
          receivedMessage={receivedMessageData?.message}
          receivedDate={receivedMessageData?.date}
          onSendMessage={handleSendMessage}
          onCallNow={handleCallNow}
          onDontShow={handleDontShow}
          onSkip={handleSkip}
        />
      )}
      
      {currentView === 'profile' && previousView !== 'matches' && prospectProfiles[selectedProfileIndex] && (
        <ProspectProfilePage 
          profile={prospectProfiles[selectedProfileIndex]}
          partnerPreference={partnerPreferences[selectedProfileIndex]}
          onBack={handleBackToList}
          onNext={handleNextProfile}
          onPrev={handlePrevProfile}
          currentIndex={selectedProfileIndex}
          totalProfiles={prospectProfiles.length}
          messageSent={isMessageSent(prospectProfiles[selectedProfileIndex].profileId)}
          sentDate={getSentDate(prospectProfiles[selectedProfileIndex].profileId)}
          sentMessage={getSentMessage(prospectProfiles[selectedProfileIndex].profileId)}
          onSendMessage={handleSendMessage}
          onCallNow={handleCallNow}
          onDontShow={handleDontShow}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}

export default App;
