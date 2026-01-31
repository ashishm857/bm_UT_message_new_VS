// Partner Preference Logic based on prospect profile

const casteGroups = {
  'Brahmin Group': [
    'Brahmin (General)', 'Kanyakubja Brahmin', 'Maithil Brahmin', 'Saraswat Brahmin',
    'Bhumihar', 'Sanadhya Brahmin', 'Gaur Brahmin', 'Tyagi Brahmin', 'Saryuparin Brahmin',
    'Nagar Brahmin', 'Pushkarna Brahmin', 'Chitpavan Brahmin'
  ],
  'Kshatriya Group': [
    'Rajput', 'Thakur', 'Chauhan', 'Rathore', 'Sisodia', 'Tomar', 'Solanki', 'Parmar',
    'Bundela', 'Kachwaha', 'Shekhawat', 'Bhati', 'Hada', 'Bisen', 'Nikumbh'
  ],
  'Vaishya Group': [
    'Agarwal', 'Gupta', 'Baniya', 'Maheshwari', 'Khandelwal', 'Oswal', 'Porwal',
    'Jain Agarwal', 'Jain Khandelwal', 'Jain Oswal', 'Modh Baniya', 'Shrimali',
    'Chaurasia', 'Halwai', 'Teli'
  ],
  'OBC Group': [
    'Yadav', 'Kurmi', 'Koeri', 'Lodhi', 'Jat', 'Ahir', 'Saini', 'Kushwaha', 'Mali',
    'Kumhar', 'Nai', 'Gadaria', 'Kahar', 'Rajbhar', 'Gurjar'
  ],
  'SC Group': [
    'Jatav', 'Chamar', 'Valmiki', 'Pasi', 'Kori', 'Dhobi', 'Dhanuk', 'Dom', 'Musahar',
    'Balmiki', 'Bhangi', 'Mochi', 'Kanjar', 'Dusadh', 'Meghwal'
  ]
};

const educationGroups = {
  'Engineering': ['B.Tech / B.E', 'M.Tech / M.E', 'MCA', 'BCA'],
  'Design': ['M.Des'],
  'Management': ['MBA'],
  'Certifications': ['Professional Tech Certifications']
};

const allStates = [
  'Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Punjab',
  'Rajasthan', 'Uttar Pradesh', 'Uttarakhand'
];

const allStars = ['Rohini', 'Ashwini', 'Bharani', 'Magha', 'Anuradha', 'Mula', 'utarashada'];

// Get caste group for a given caste
const getCasteGroup = (caste) => {
  for (const [group, castes] of Object.entries(casteGroups)) {
    if (castes.includes(caste)) {
      return group;
    }
  }
  return null;
};

// Get all castes from same group
const getCastesFromGroup = (caste) => {
  const group = getCasteGroup(caste);
  if (group) {
    return casteGroups[group];
  }
  return [caste];
};

// Get education group for a given education
const getEducationGroup = (education) => {
  for (const [group, educations] of Object.entries(educationGroups)) {
    if (educations.includes(education)) {
      return group;
    }
  }
  return null;
};

// Get all educations from same group
const getEducationsFromGroup = (education) => {
  const group = getEducationGroup(education);
  if (group) {
    return educationGroups[group];
  }
  return [education];
};

// Convert height to inches for calculation
const heightToInches = (height) => {
  const match = height.match(/(\d+)'(\d+)"/);
  if (match) {
    return parseInt(match[1]) * 12 + parseInt(match[2]);
  }
  return 0;
};

// Convert inches to height format
const inchesToHeight = (inches) => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

// Calculate preferred age range
const calculatePreferredAgeRange = (prospectAge, prospectGender) => {
  const age = parseInt(prospectAge);
  if (prospectGender === 'Male') {
    // Male prospect: Show preferred age range X-6 - X yrs
    return `${age - 6} - ${age} Yrs`;
  } else {
    // Female prospect: Show preferred age range X - X+6 yrs
    return `${age} - ${age + 6} Yrs`;
  }
};

// Calculate preferred height range
const calculatePreferredHeightRange = (prospectHeight, prospectGender) => {
  const prospectInches = heightToInches(prospectHeight);
  
  if (prospectGender === 'Male') {
    // Male prospect: Show preferred height range X-3" - X ft
    const minHeight = prospectInches - 3;
    const maxHeight = prospectInches;
    return `${inchesToHeight(minHeight)} - ${inchesToHeight(maxHeight)}`;
  } else {
    // Female prospect: Show preferred height range X - X+3 ft
    const minHeight = prospectInches;
    const maxHeight = prospectInches + 3;
    return `${inchesToHeight(minHeight)} - ${inchesToHeight(maxHeight)}`;
  }
};

// Parse income range and return max value in lakhs
const parseIncome = (incomeRange) => {
  if (incomeRange.includes('Cr')) {
    return 100; // 1 Cr
  }
  const match = incomeRange.match(/(\d+)\s*-?\s*(\d+)?\s*Lakhs?/);
  if (match) {
    return parseInt(match[2] || match[1]);
  }
  return 0;
};

// Calculate preferred annual income range
const calculatePreferredIncomeRange = (prospectIncome, prospectGender) => {
  const incomeValue = parseIncome(prospectIncome);
  
  if (prospectGender === 'Male') {
    // Male prospect: show preferred annual income range 1 - X+5 Lakhs
    return `1 - ${incomeValue + 5} Lakhs`;
  } else {
    // Female prospect: show preferred annual income range X - X+20 Lakhs
    return `${incomeValue} - ${incomeValue + 20} Lakhs`;
  }
};

// Generate partner preference
export const generatePartnerPreference = (prospectProfile) => {
  return {
    matchingScore: '18/20',
    preferredAge: calculatePreferredAgeRange(prospectProfile.age, prospectProfile.gender),
    preferredHeight: calculatePreferredHeightRange(prospectProfile.height, prospectProfile.gender),
    preferredMaritalStatus: prospectProfile.maritalStatus,
    preferredMotherTongue: 'Hindi, Brij, Awadhi, Maithali, Punjabi',
    preferredPhysicalStatus: 'Normal',
    preferredDrinkingHabit: 'No',
    preferredSmokingHabit: 'No',
    preferredEatingHabits: prospectProfile.eatingHabits,
    preferredReligion: 'Hindu',
    preferredCaste: getCastesFromGroup(prospectProfile.caste).join(', '),
    preferredStar: allStars.join(', '),
    preferredDosham: 'No',
    preferredEducation: getEducationsFromGroup(prospectProfile.education).join(', '),
    preferredOccupation: 'Any',
    preferredEmployment: 'Private sector',
    preferredAnnualIncome: calculatePreferredIncomeRange(prospectProfile.annualIncome, prospectProfile.gender),
    preferredCountry: 'India',
    preferredState: allStates.join(', '),
    preferredCity: 'Any'
  };
};

export default generatePartnerPreference;
