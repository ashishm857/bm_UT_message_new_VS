# Bharat Matrimony Test Application

A mobile-first web application for usability testing of Bharat Matrimony's prospect profile viewing flow. This is an experimental, simulation-heavy test environment designed to convert Figma-designed multi-step product flows into testable prototypes.

## 🎯 Project Overview

This is **NOT a production product**. It's a prototype for:
- Testing user flows on mobile web (360×720px viewport)
- Generating prospect profiles based on operator input
- Simulating profile matching logic
- Demonstrating partner preference compatibility

### Key Features

- ✅ Operator input form with 9 configurable fields
- ✅ Automatic generation of 4 prospect profiles per search
- ✅ Complete profile view with 27+ data fields
- ✅ Partner preference matching (18/20 score)
- ✅ Profile images for male and female prospects
- ✅ Mobile-optimized responsive design
- ✅ Session-based in-memory state management

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

## 🚀 Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\Users\Ashish\bm_UT_message_new_VS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to that URL

## 📱 Usage

### Step 1: Operator Input Form
Fill out the form with your profile information:
- Gender (Male/Female)
- Membership type (Free/Paid)
- Age (25-40 years)
- Height (4'8" - 6'0")
- Marital Status
- Eating Habits
- Caste
- Annual Income
- State

### Step 2: View Generated Profiles
- System generates 4 prospect profiles based on your input
- Each profile shows:
  - Profile picture
  - Basic information
  - Matching score (18/20)
  - Quick summary

### Step 3: Full Profile View
Click on any profile to see complete details:
- Personal Information (age, height, DOB, etc.)
- Religious & Cultural Details
- Professional Information
- Family Information
- Contact Information
- About Me
- Additional Details
- Future Goals
- Lifestyle
- Partner Preferences

## 🧠 Logic Implementation

### Prospect Profile Logic
- **Gender**: Shows opposite gender profiles
- **Age**: 
  - Male operator → Female profiles (Age-6 to Age)
  - Female operator → Male profiles (Age to Age+6)
- **Height**: Compatible heights (±3")
- **Caste**: Matches within same caste group
- **Income**:
  - Male operator → Female income ≤ Male-5
  - Female operator → Male income ≥ Female+5
- **Location**: Same state, different cities

### Partner Preference Logic
- Matching score: Fixed at 18/20
- Age range preferences based on prospect age/gender
- Height range preferences (±3")
- All preference categories populated automatically

## 📁 Project Structure

```
bm_UT_message_new_VS/
├── public/
│   ├── index.html
│   └── images/
│       ├── males/          # Male profile images
│       └── females/        # Female profile images
├── src/
│   ├── components/
│   │   ├── OperatorInputForm.js
│   │   ├── OperatorInputForm.css
│   │   ├── ProfileListView.js
│   │   ├── ProfileListView.css
│   │   ├── ProspectProfilePage.js
│   │   └── ProspectProfilePage.css
│   ├── utils/
│   │   ├── prospectProfileLogic.js
│   │   └── partnerPreferenceLogic.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .github/
│   ├── rules/
│   │   └── buildinglogic.md
│   └── skills/
│       ├── operator_input_form/
│       ├── prospect_profile_logic/
│       ├── prospect_partner preference_logic/
│       └── Full_View_prospect_Profile_page_feature_Architect_interaction/
├── server.js
├── webpack.config.js
├── package.json
└── README.md
```

## 🎨 Design Reference

The UI follows the design specifications from:
- `.github/skills/Full_View_prospect_Profile_page_feature_Architect_interaction/Reference_screenshot/`

### Colors
- Primary Red: `#d32f2f`
- Verified Blue: `#0069CA`
- Premium Purple: `#431E73`
- WhatsApp Green: `#25D366`
- Warning Orange: `#E06506`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run client` - Start webpack dev server only
- `npm run server` - Start Express server only

## 📊 Data Flow

1. **User Input** → Operator fills form
2. **Profile Generation** → System generates 4 profiles using:
   - `prospectProfileLogic.js` - Creates profile data
   - `partnerPreferenceLogic.js` - Creates preferences
3. **State Management** → In-memory React state
4. **Display** → Profile cards and full view pages

## ⚠️ Important Notes

### Non-Goals (Explicitly NOT included):
- ❌ No database persistence
- ❌ No user authentication
- ❌ No analytics or logging
- ❌ No A/B testing
- ❌ No design assumptions beyond provided specs

### Session Behavior:
- All data is ephemeral and in-memory
- Refreshing the page resets everything
- No data is saved between sessions

## 🖼️ Profile Images

Profile images are stored in:
- `public/images/males/` - 42 male profile images
- `public/images/females/` - 40 female profile images

Images are automatically selected based on:
- Operator's gender (shows opposite gender)
- No image repetition across profiles in same session
- Image name becomes the profile name

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Optimized for mobile viewport: **360px × 720px**

## 📝 Development Notes

- Built with React 18
- Uses Webpack for bundling
- Express server for production deployment
- No external API calls
- Pure client-side logic

## 👥 Focus Region

**North India (Hindi Belt)**
- States: Delhi, Haryana, Himachal Pradesh, J&K, Punjab, Rajasthan, UP, Uttarakhand
- Religion: Hindu
- Mother Tongue: Hindi
- Caste groups: Brahmin, Kshatriya, Vaishya, OBC, SC

## 📧 Support

This is a test application. For issues or questions, refer to the skill documentation in `.github/skills/` folder.

---

**Version:** 1.0.0  
**Last Updated:** January 30, 2026  
**Test Environment Only - Not for Production Use**
