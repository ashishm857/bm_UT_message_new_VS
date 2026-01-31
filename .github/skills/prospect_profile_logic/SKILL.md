---
name: prospect_profile_logic
description: Use the logic below in the skill whenever creating a propect profile info on the basis of operator input.
---

# Bharat Matrimony – Relevance Logic Documentation

**Focus Region:** North India (Hindi Belt)  


## profile picture field  logic
show female pic to male profile and male pic to female profile.
male images : C:\Users\Ashish\BM_UT_Message_new\.agent\skills\operator_input_form\images\Males
female images : C:\Users\Ashish\BM_UT_Message_new\.agent\skills\operator_input_form\images\females
*** Don't repeat the same pic for another profile ***

---

## Profile id field logic
- H10735287
- H10735288
- H10735289
- H10735290
- H10735291
- H10735292
- H10735293
- H10735294
- H10735295
- H10735296
- H10735297
- H10735298
- H10735299
- H10735300

*** pick any id from the list ***

---

## Measurement & Display Standards (Global)

### Measurement Units
- Age: Yrs (e.g., 32 Yrs)
- Height: Ft–Inch (e.g., 5.8")
- Income: LPA (Lakhs Per Annum)
- Location: City → State

*** same to same mapping ***
- Weight: 55kg for female and 72kg for male
- Body type: Average for female and Athletic for male
---

##  Fixed Global fields

- 1. Religion: Hindu  
- 2.  Mother Tongue: Hindi  
- 3. Physical Status: Normal  
- 4. Drinking Habit: No  
- 5. Smoking Habit: No  

---

## 6. Age field Logic 

### age field
- Male User (Age = X Yrs): Show females in range X−6 to X  
- Female User (Age = X Yrs): Show males in range X to X+6  

### Date of birth field     
- Male - date of birth: 30 july yyyy (###age)     
- Female - date of birth: 30 july yyyy (###age)

### Time of birth field 
- fixed time of birth: 10:22 PM for both male and female

---

## 7. Height field Logic 

- Female height ≤ Male height (±3")
- Avoid differences > 10"

---

## 8. Marital Status field Logic

- Never Married → Never Married
- Divorced → Divorced / Awaiting Divorce
- Awaiting Divorce → Divorced / Awaiting Divorce

---

## 9. Profile Created By field

- Self
- Parents
- Father
- Mother
- Brother
- Sister
*** show one of them randomly ***
---

## 10. Eating Habits field

- Vegetarian
- Eggitarian
- Non-Vegetarian
*** same to same mapping ***
---

## 11. Caste field Logic (North India Clusters)

Handled via caste groups (Brahmin, Kshatriya, Vaishya, OBC, SC). 

### Brahmin Group
Brahmin (General)
Kanyakubja Brahmin
Maithil Brahmin
Saraswat Brahmin
Bhumihar
Sanadhya Brahmin
Gaur Brahmin
Tyagi Brahmin
Saryuparin Brahmin
Nagar Brahmin
Pushkarna Brahmin
Chitpavan Brahmin

### Kshatriya Group
Rajput
Thakur
Chauhan
Rathore
Sisodia
Tomar
Solanki
Parmar
Bundela
Kachwaha
Shekhawat
Bhati
Hada
Bisen
Nikumbh

### Vaishya Group
Agarwal
Gupta
Baniya
Maheshwari
Khandelwal
Oswal
Porwal
Jain Agarwal
Jain Khandelwal
Jain Oswal
Modh Baniya
Shrimali
Chaurasia
Halwai
Teli

### OBC Group
Yadav
Kurmi
Koeri
Lodhi
Jat
Ahir
Saini
Kushwaha
Mali
Kumhar
Nai
Gadaria
Kahar
Rajbhar
Gurjar

### SC Group
Jatav
Chamar
Valmiki
Pasi
Kori
Dhobi
Dhanuk
Dom
Musahar
Balmiki
Bhangi
Mochi
Kanjar
Dusadh
Meghwal

*** pick a caste from the same group → allowed ***

---

## 12. Star field & Rashi field 

### Stars
Rohini, Ashwini, Bharani, Magha, Anuradha, Mula, utarashada
### Rashi
Mesh, Vrishabha, Mithun, Karka, Singh, sagittarius, leo, capricorn.

*** select any random Star & Rashi respectively from the list ***

---

## 13. Annual Income field Logic

Male: Female income ≤ X-5
Female: Male income ≥ X+5  

---

## 14. Employment field (fixed)

- Private Sector 
---

## 15. Institute field

1. IIT Delhi  
2. IIT Kanpur  
3. IIT Roorkee  
4. IIT Ropar  
5. IIT (BHU)  
6. IISER Mohali    
8. BHU  
9. DU  
10. JNU  
12. PU Chandigarh  
13. LPU  
14. NIT Silchar  
16. DTU  
17. NIT Kurukshetra     
20. BITS Pilani  

- Show any institute .
---

## 16 Organization fields (fixed)

Organization : -

## 17. Education field 

B.Tech / B.E, M.Tech / M.E, M.Des, MBA, MCA, BCA, Professional Tech Certifications

- Show any institute .
---

## 18. Occupation field

Software Engineer, Full Stack Developer, DevOps, Cloud Engineer, Data Engineer, QA, Network Engineer, Technical Lead, Lead UX designer, Lead UI Designer

- Show any institute .
---

## 19. Location field Logic 

### Delhi
New Delhi, North Delhi, South Delhi, East Delhi, West Delhi, Central Delhi, Shahdara

### Haryana
Gurugram, Faridabad, Panipat, Ambala, Karnal, Sonipat, Rohtak, Hisar, Sirsa, Yamunanagar, Kurukshetra

### Himachal Pradesh
Shimla, Kangra, Mandi, Solan, Kullu, Chamba, Hamirpur, Una, Bilaspur

### Jammu & Kashmir
Srinagar, Jammu, Anantnag, Baramulla, Budgam, Pulwama, Kupwara, Kathua, Udhampur

### Ladakh
Leh, Kargil

### Punjab
Ludhiana, Amritsar, Jalandhar, Patiala, Mohali, Bathinda, Hoshiarpur, Pathankot, Gurdaspur

### Rajasthan
Jaipur, Jodhpur, Udaipur, Kota, Ajmer, Alwar, Bharatpur, Bikaner, Sikar, Jhunjhunu

### Uttar Pradesh
Lucknow, Noida, Ghaziabad, Kanpur, Varanasi, Prayagraj, Agra, Meerut, Bareilly, Gorakhpur, Ayodhya

### Uttarakhand
Dehradun, Haridwar, Rishikesh, Nainital, Haldwani, Roorkee

- Show any city from the same state of the input city.

*** same city will be used in place of birth field ***  

---

## 20. Family Details fields (fixed)
###
- Family Values: Moderate  
###
- Family Type: Nuclear
###  
- Family Status: Upper Middle Class
###  
- Father’s Occupation: Runs a business
###  
- Mother’s Occupation: Homemaker  
###
- Brothers: 1 (Married: 1)  
###
- Sisters: 1 (Married: 1)  

---

## 21. About Me field (fixed)
We are looking for a partner who shares our values and lifestyle. We believe in a healthy and happy relationship, where both partners support each other's goals and dreams. We value honesty, integrity, and kindness above all else, and we are committed to building a strong, lasting bond with our partner. We are open to meeting new people and exploring new opportunities, but we are also committed to our own personal growth and development. We are looking for a partner who is committed to the same values and who shares our vision for a happy and fulfilling life together.  

*** use it every time ***

---

## 22. Lifestyle field (fixed)  

### cuisine
North Indian, South Indian, Chinese, Italian.

### Movies
comedy, action, drama, thriller, romance, adventure

### sports 
badminton, chess, football, cricket, hockey

### music
indian classical, western 

---

## 23 Family location field logic

- Same as location field logic

---
 
 ## 24 Type of residence field logic (fixed)

- Type of residence: own

---

## 25 Gothram field logic (fixed)

- Gothram: Vashisth

---

## 26 Additional fields (fixed)

- Wishing to support family financially post marriage: Yes
- Horoscope matching requirement: Must
- Planning to work after marriage: Yes
- Open to relocate after marriage: Yes

---

## 27 Future goal field logic (fixed)

- Future goal: Want to start my own caffetaria, Achieve financial independence, Buy a house, Travel the world. 