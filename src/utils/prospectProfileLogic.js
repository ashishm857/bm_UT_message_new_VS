// Prospect Profile Logic based on operator input

let profileIdCounter = 1073500;

const usedImages = { male: new Set(), female: new Set() };

const maleImages = [
  'Aarush', 'Abhishek', 'Akshaya', 'Amit', 'Amresh', 'ANIL', 'Ansh', 'Ashish',
  'Avinash', 'Ayush', 'Denesh', 'Dilip', 'Girish', 'Himanshu', 'Krishna', 'Onkar',
  'Rahul', 'Rajesh', 'Ramesh', 'Ravi', 'Rishi', 'Rohit', 'Ronak', 'Samaye',
  'Samyak', 'Santhosh', 'Satish', 'Shantanu', 'Shanu', 'Shashank', 'Shashwat',
  'Shubham', 'Shyam', 'Sonu', 'Subodh', 'Sudhir', 'Sugam', 'Sujit', 'Sunil', 'Suresh', 'Vishal'
];

const femaleImages = [
  'Aakriti', 'Aishwariya', 'Anamika', 'Ani', 'Anisha', 'Aparna', 'Dimple', 'Dolly',
  'Ekta', 'Hemlata', 'Jaismine', 'Kanika', 'Kiran', 'Kirti', 'Komal', 'Prerana',
  'Priyanka', 'Rani', 'Remli', 'Rena', 'Ria', 'Ridhi', 'Rimjhim', 'Rinki',
  'Rishu', 'Ritika', 'Roma', 'Ruhi', 'Rupali', 'Samridhi', 'Shraddha',
  'Shukanya', 'Shusmita', 'Shweta', 'Soni', 'Sujata', 'Supriya', 'Tanya', 'Vijeyta'
];

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

const locationsByState = {
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Shahdara'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Sonipat', 'Rohtak', 'Hisar', 'Sirsa', 'Yamunanagar', 'Kurukshetra'],
  'Himachal Pradesh': ['Shimla', 'Kangra', 'Mandi', 'Solan', 'Kullu', 'Chamba', 'Hamirpur', 'Una', 'Bilaspur'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Budgam', 'Pulwama', 'Kupwara', 'Kathua', 'Udhampur'],
  'Ladakh': ['Leh', 'Kargil'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali', 'Bathinda', 'Hoshiarpur', 'Pathankot', 'Gurdaspur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Alwar', 'Bharatpur', 'Bikaner', 'Sikar', 'Jhunjhunu'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Ghaziabad', 'Kanpur', 'Varanasi', 'Prayagraj', 'Agra', 'Meerut', 'Bareilly', 'Gorakhpur', 'Ayodhya'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani', 'Roorkee']
};

const stars = ['Rohini', 'Ashwini', 'Bharani', 'Magha', 'Anuradha', 'Mula', 'utarashada'];
const rashis = ['Mesh', 'Vrishabha', 'Mithun', 'Karka', 'Singh', 'sagittarius', 'leo', 'capricorn'];
const profileCreatedBy = ['Self', 'Parents', 'Father', 'Mother', 'Brother', 'Sister'];
const institutes = [
  'IIT Delhi', 'IIT Kanpur', 'IIT Roorkee', 'IIT Ropar', 'IIT (BHU)', 'IISER Mohali',
  'BHU', 'DU', 'JNU', 'PU Chandigarh', 'LPU', 'NIT Silchar', 'DTU', 'NIT Kurukshetra', 'BITS Pilani'
];
const educations = ['B.Tech / B.E', 'M.Tech / M.E', 'M.Des', 'MBA', 'MCA', 'BCA', 'Professional Tech Certifications'];
const occupations = [
  'Software Engineer', 'Full Stack Developer', 'DevOps', 'Cloud Engineer', 'Data Engineer',
  'QA', 'Network Engineer', 'Technical Lead', 'Lead UX designer', 'Lead UI Designer'
];

// Get caste group for a given caste
const getCasteGroup = (caste) => {
  for (const [group, castes] of Object.entries(casteGroups)) {
    if (castes.includes(caste)) {
      return group;
    }
  }
  return null;
};

// Get random item from array
const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Get unique profile image
const getUniqueProfileImage = (gender) => {
  const images = gender === 'Male' ? maleImages : femaleImages;
  const usedSet = gender === 'Male' ? usedImages.male : usedImages.female;
  
  const availableImages = images.filter(img => !usedSet.has(img));
  if (availableImages.length === 0) {
    usedSet.clear(); // Reset if all used
    return images[0];
  }
  
  const imageName = getRandomItem(availableImages);
  usedSet.add(imageName);
  return imageName;
};

// Get unique profile ID
const getUniqueProfileId = () => {
  const id = `H${profileIdCounter}`;
  profileIdCounter++;
  return id;
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

// Calculate prospect age based on operator age and gender
const calculateProspectAge = (operatorAge, operatorGender) => {
  const age = parseInt(operatorAge);
  if (operatorGender === 'Male') {
    // Show females in range X-6 to X
    const minAge = age - 6;
    const maxAge = age;
    return Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  } else {
    // Show males in range X to X+6
    const minAge = age;
    const maxAge = age + 6;
    return Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  }
};

// Calculate prospect height based on operator height and gender
const calculateProspectHeight = (operatorHeight, operatorGender) => {
  const operatorInches = heightToInches(operatorHeight);
  
  if (operatorGender === 'Male') {
    // Show female height ≤ male height (±3")
    const minHeight = operatorInches - 3;
    const maxHeight = operatorInches;
    const prospectInches = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    return inchesToHeight(prospectInches);
  } else {
    // Show male height ≥ female height (±3")
    const minHeight = operatorInches;
    const maxHeight = operatorInches + 3;
    const prospectInches = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    return inchesToHeight(prospectInches);
  }
};

// Calculate prospect marital status
const calculateProspectMaritalStatus = (operatorMaritalStatus) => {
  if (operatorMaritalStatus === 'Never Married') {
    return 'Never Married';
  } else if (operatorMaritalStatus === 'Divorced' || operatorMaritalStatus === 'Awaiting Divorce') {
    return getRandomItem(['Divorced', 'Awaiting Divorce']);
  }
  return operatorMaritalStatus;
};

// Get prospect caste from same group
const getProspectCaste = (operatorCaste) => {
  const group = getCasteGroup(operatorCaste);
  if (group) {
    const castes = casteGroups[group].filter(c => c !== operatorCaste);
    return getRandomItem(castes);
  }
  return operatorCaste;
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

// Calculate prospect income
const calculateProspectIncome = (operatorIncome, operatorGender) => {
  const operatorIncomeValue = parseIncome(operatorIncome);
  
  const incomeRanges = [
    '1 - 2 Lakhs', '2 - 3 Lakhs', '3 - 5 Lakhs', '5 - 8 Lakhs', '8 - 12 Lakhs',
    '12 - 18 Lakhs', '18 - 25 Lakhs', '25 - 35 Lakhs', '35 - 50 Lakhs',
    '50 Lakhs - 70 Lakhs', '70 Lakhs - 1 Cr', '1 Cr +'
  ];
  
  if (operatorGender === 'Male') {
    // Female income ≤ X-5
    const maxIncome = operatorIncomeValue - 5;
    const validRanges = incomeRanges.filter(range => parseIncome(range) <= maxIncome);
    return validRanges.length > 0 ? getRandomItem(validRanges) : incomeRanges[0];
  } else {
    // Male income ≥ X+5
    const minIncome = operatorIncomeValue + 5;
    const validRanges = incomeRanges.filter(range => parseIncome(range) >= minIncome);
    return validRanges.length > 0 ? getRandomItem(validRanges) : incomeRanges[incomeRanges.length - 1];
  }
};

// Get prospect location from same state
const getProspectLocation = (operatorState) => {
  const cities = locationsByState[operatorState] || [];
  return cities.length > 0 ? getRandomItem(cities) : 'Unknown City';
};

// Generate date of birth
const generateDateOfBirth = (age) => {
  const currentYear = 2026;
  const birthYear = currentYear - age;
  return `30 July ${birthYear}`;
};

// Generate prospect profile
export const generateProspectProfile = (operatorInput) => {
  const prospectGender = operatorInput.gender === 'Male' ? 'Female' : 'Male';
  const prospectAge = calculateProspectAge(operatorInput.age, operatorInput.gender);
  const prospectHeight = calculateProspectHeight(operatorInput.height, operatorInput.gender);
  const imageName = getUniqueProfileImage(prospectGender);
  const imageFolder = prospectGender.toLowerCase() === 'male' ? 'males' : 'females';
  
  return {
    profileId: getUniqueProfileId(),
    profilePicture: `/images/${imageFolder}/${imageName}.jpg`,
    profileName: imageName,
    gender: prospectGender,
    age: prospectAge,
    dateOfBirth: generateDateOfBirth(prospectAge),
    timeOfBirth: '10:22 PM',
    height: prospectHeight,
    weight: prospectGender === 'Female' ? '55kg' : '72kg',
    bodyType: prospectGender === 'Female' ? 'Average' : 'Athletic',
    maritalStatus: calculateProspectMaritalStatus(operatorInput.maritalStatus),
    profileCreatedBy: getRandomItem(profileCreatedBy),
    religion: 'Hindu',
    motherTongue: 'Hindi',
    physicalStatus: 'Normal',
    eatingHabit: operatorInput.eatingHabits,
    eatingHabits: operatorInput.eatingHabits,
    drinkingHabit: 'No',
    smokingHabit: 'No',
    caste: getProspectCaste(operatorInput.caste),
    casteGroup: getCasteGroup(operatorInput.caste),
    star: getRandomItem(stars),
    rashi: getRandomItem(rashis),
    gothram: 'Vashisth',
    dosham: 'No',
    annualIncome: calculateProspectIncome(operatorInput.annualIncome, operatorInput.gender),
    employment: 'Private Sector',
    organization: '-',
    education: getRandomItem(educations),
    institute: getRandomItem(institutes),
    occupation: getRandomItem(occupations),
    city: getProspectLocation(operatorInput.state),
    location: getProspectLocation(operatorInput.state),
    placeOfBirth: getProspectLocation(operatorInput.state),
    state: operatorInput.state,
    citizenship: 'India',
    familyValues: 'Moderate',
    familyType: 'Nuclear',
    familyStatus: 'Upper Middle Class',
    fatherOccupation: 'Runs a business',
    motherOccupation: 'Homemaker',
    brothers: '1 (Married: 1)',
    sisters: '1 (Married: 1)',
    familyLocation: getProspectLocation(operatorInput.state),
    typeOfResidence: 'Own',
    aboutMe: 'We are looking for a partner who shares our values and lifestyle. We believe in a healthy and happy relationship, where both partners support each other\'s goals and dreams. We value honesty, integrity, and kindness above all else, and we are committed to building a strong, lasting bond with our partner. We are open to meeting new people and exploring new opportunities, but we are also committed to our own personal growth and development. We are looking for a partner who is committed to the same values and who shares our vision for a happy and fulfilling life together.',
    cuisine: 'North Indian, South Indian, Chinese, Italian',
    movies: 'comedy, action, drama, thriller, romance, adventure',
    sports: 'badminton, chess, football, cricket, hockey',
    music: 'indian classical, western',
    wishingToSupportFamily: 'Yes',
    horoscopeMatching: 'Must',
    planningToWorkAfterMarriage: 'Yes',
    openToRelocate: 'Yes',
    futureGoal: 'Want to start my own cafeteria, Achieve financial independence, Buy a house, Travel the world'
  };
};

// Reset function to clear used resources for new session
export const resetProfileGeneration = () => {
  profileIdCounter = 1073500;
  usedImages.male.clear();
  usedImages.female.clear();
};

export default generateProspectProfile;
