import React, { useState } from 'react';
import './OperatorInputForm.css';

const OperatorInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    gender: '',
    membership: '',
    age: '',
    height: '',
    maritalStatus: '',
    eatingHabits: '',
    caste: '',
    annualIncome: '',
    state: ''
  });

  const genderOptions = ['Male', 'Female'];
  const membershipOptions = ['Free user', 'Paid membership'];
  const ageOptions = Array.from({ length: 16 }, (_, i) => i + 25);
  const heightOptions = [
    '4\'8"', '4\'9"', '4\'10"', '4\'11"', 
    '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"',
    '6\'0"'
  ];
  const maritalStatusOptions = ['Never Married', 'Divorced', 'Awaiting Divorce'];
  const eatingHabitsOptions = ['Vegetarian', 'Eggitarian', 'Non-Vegetarian'];
  
  const casteOptions = {
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

  const annualIncomeOptions = [
    '1 - 2 Lakhs', '2 - 3 Lakhs', '3 - 5 Lakhs', '5 - 8 Lakhs', '8 - 12 Lakhs', 
    '12 - 18 Lakhs', '18 - 25 Lakhs', '25 - 35 Lakhs', '35 - 50 Lakhs', 
    '50 Lakhs - 70 Lakhs', '70 Lakhs - 1 Cr', '1 Cr +'
  ];

  const stateOptions = [
    'Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Uttarakhand'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every(val => val !== '')) {
      onSubmit(formData);
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="operator-form-container">
      <h1 className="form-header">Bharat Matrimony Test App</h1>
      
      <form onSubmit={handleSubmit} className="operator-form">
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            {genderOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Membership</label>
          <select name="membership" value={formData.membership} onChange={handleChange} required>
            <option value="">Select Membership</option>
            {membershipOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Age</label>
          <select name="age" value={formData.age} onChange={handleChange} required>
            <option value="">Select Age</option>
            {ageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Height</label>
          <select name="height" value={formData.height} onChange={handleChange} required>
            <option value="">Select Height</option>
            {heightOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Marital Status</label>
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
            <option value="">Select Marital Status</option>
            {maritalStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Eating Habits</label>
          <select name="eatingHabits" value={formData.eatingHabits} onChange={handleChange} required>
            <option value="">Select Eating Habits</option>
            {eatingHabitsOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Caste</label>
          <select name="caste" value={formData.caste} onChange={handleChange} required>
            <option value="">Select Caste</option>
            {Object.entries(casteOptions).map(([group, castes]) => (
              <optgroup key={group} label={group}>
                {castes.map(caste => (
                  <option key={caste} value={caste}>{caste}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Annual Income</label>
          <select name="annualIncome" value={formData.annualIncome} onChange={handleChange} required>
            <option value="">Select Annual Income</option>
            {annualIncomeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {stateOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default OperatorInputForm;
