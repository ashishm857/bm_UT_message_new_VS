---   
name : Full_View_Profile_page_feature_Architect_interaction
description : This document defines the **Full View Profile Screen** structure and content. It captures layout, sections, and informational hierarchy exactly as described. No additional interactions, logic, or assumptions are introduced beyond what is stated.
---


# Bharat matrimony - Full View Profile Screen – Feature Architecture

This document defines the **Full View prospect Profile Screen** structure and content. It captures layout, sections, and informational hierarchy exactly as described. No additional interactions, logic, or assumptions are introduced beyond what is stated.

**design reference - C:\Users\Ashish\BM_UT_Message_new\.github\skills\Full_View_prospect_Profile_page_feature_Architect_interaction\Reference_screenshot**
---

## 1. Header

* Extreme left:

  * Back button
  
* Extreme right:

  * Language icon

--- 

## 2. Profile Photo Section

* Primary profile photo displayed below header : Each profile name will be same as image name, image repository -

 **males images to be shown to female member : C:\Users\Ashish\BM_UT_Message_new\.agent\skills\Full_View_prospect_Profile_page_feature_Architect_interaction\images\Males**

 **females images to be shown to male member : C:\Users\Ashish\BM_UT_Message_new\.agent\skills\Full_View_prospect_Profile_page_feature_Architect_interaction\images\Females**

### 2.1 Overlay CTAs on Photo (Top Right)

* Three‑dot menu icon

  * Subtle rounded black background

* Shortlist CTA with icon

  * Same subtle rounded black background 

### 2.2 Photo Footer

* Bottom of photo:

  * Photo count indicator
  * Photo icon + count **1**

### 2.3 Profile Navigation Arrows

* Extreme left viewport:

  * Left arrow (previous profile)

* Extreme right viewport:

  * Right arrow (next profile)

* Arrow visibility rules:

  * If no previous profile exists, left arrow is not shown

* Arrow styling:

  * Subtle rounded black background

---

## 3. Above‑the‑Fold Profile Summary

### 3.1 Tags

* Paid Member ID tag
* Verified Profile tag

### 3.2 Name & Contact Actions

* Profile name

* Extreme right of name:

  * Call icon
  * WhatsApp icon

### 3.3 Meta Information Row

Displayed in very small font, separated by subtle dots:

* Matrimony ID
* Profile created by
* Age
* Height
* Caste
* Education
* Occupation
* Annual income
* Location

This completes the **above‑the‑fold** section.

---

## 4. Sticky CTA

* Sticky CTA bar present
* CTA behavior and states are governed by the logic:
  ** 3 CTA buttons **
  1. send message ( primary cta, in the bottom)
  2. skip ( secondary cta, above the primary cta, in the right side)
  3. Don't show ( tertiary cta, above the primary cta, in the left side)

---

## 5. Profile Information Feed

### 5.1 Personal Information

Displayed in the following order:

* Age
* Height
* Physical status
* Mother tongue
* Profile created by
* Marital status
* Lives in
* State
* Citizenship
* Eating habits
* Religion
* Caste
* Gotram
* Dosham
* Date of birth
* Time of birth
* Place of birth
* Star
* Rashi

---

### 5.2 Kundli Section

* Displayed on a different background color
* Contains two tertiary links with icons:

  * View Horoscope
  * View Horoscope Compatibility

---

### 5.3 Professional Information

* Employed in
* Annual income
* Education
* Studied at
* Works at

---

### 5.4 Family Information

* Family status
* Parents’ information
* Number of brothers
* Number of sisters
* Family location
* Type of residence

---

### 5.5 Contact Information

* Contact person’s name
* CTAs:

  * WhatsApp
  * Call Now

---

### 5.6 About Me

* Free‑text profile description

---

### 5.7 Additional Details

* Additional personal or profile‑specific information

---

### 5.8 Future Goals

* Stated aspirations and future plans

---

### 5.9 Lifestyle

* Lifestyle‑related attributes and preferences

---

## 6. Partner Preference Section

### 6.1 Visual Layout

* Left side:

  * Profile photo thumbnail of the viewed profile
* Right side:

  * Viewer’s own photo thumbnail

---

### 6.2 Basic Preferences

* Preferred age
* Preferred height
* Preferred marital status
* Preferred physical status
* Eating habit preference
* Smoking habit preference
* Drinking habit preference

---

### 6.3 Religious Preferences

* Preferred religion
* Preferred caste
* Preferred sub‑caste
* Preferred star
* Dosham preference

---

### 6.4 Professional Preferences

* Preferred education
* Preferred employment type
* Preferred occupation
* Preferred annual income

---

### 6.5 Location Preferences

* Preferred country
* Preferred state
* Preferred city

---
**End of Full View Profile Screen – Feature Architecture**
