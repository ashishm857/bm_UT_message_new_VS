---
name : Daily_Recommendation_page_feature_architect_interaction
description : This section defines the layout, structure, gestures, and interaction behavior of the Daily Recommendation page exactly as described.

---


#  bharat matrimony - Daily Recommendation Screen – Feature Architecture & Interaction

This document defines the **Daily Recommendation page** layout, structure, gestures, and interaction behavior exactly as described.
**Design link for Daily recommendation  : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\Daily_Recommendation_page_feature_architect_interaction\Reference_screenshot\daily_ recommendation_page\Screenshot_20260128_154128_HindiMatrimony.jpg
---

## 1. Header

* Header title:

  * **Daily Recommendation**
* Count indicator:

  * Displayed in brackets: **(1 out of 5)**

---

## 2. Card Stack Layout

* Two profile cards are stacked vertically in the screen at any glance.
* Visibility rules:

  * Top card (current profile): fully visible
  * Next card:

    * Not fully visible
    * Only **5–10px** of the top border is visible - pls check the refernce screenshot : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\Daily_Recommendation_page_feature_architect_interaction\Reference_screenshot\daily_ recommendation_page\Screenshot_20260128_154128_HindiMatrimony.jpg

---

## 3. Profile Card Structure

* The visible profile card uses the **Full View Profile** layout.
* Differences from Full View Profile:
   
  * Entire profile is confined within a **single container card** .
  * Profile content scrolls **vertically inside the container card**.

### 3.1 Sticky Header (Inside Card)

* Sticky header remains fixed while scrolling inside the card container.

---

## 4. Swipe Gestures & Outcomes

### 4.1 Swipe Gesture & Directions 

* **Swipe Right** → Message will be sent 
* **Swipe Left** → profile will be skipped 
* **Swipe Down** → Don’t show
* **Swipe Up** → Shortlist

---

## 5. Bottom CTAs

* Bottom CTAs mirror the **full View Profile CTA logic**

---

## 6. Free Member Behavior

* Visible CTA:

  * Send message
  * Skip 
  * Don't show
  * Shortlist( on the top right of the profile photo)

### Swipe Right

* message is sent
* Profile transitions out
* Next profile loads

---

### 7.1 First Swipe Right

* CTA state: Send Message
* Instead of sending immediately:

  * A **bottom-up Saved Message flow** is triggered
    **refernce_ screenshot : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\Daily_Recommendation_page_feature_architect_interaction\Reference_screenshot\Saved_message_bottom-up\Capture (1).JPG**
---

## 8. Saved Message – Bottom-Up Flow 
### 8.1 Bottom-Up Screen

* Header:

  * **Saved Message**
* Extreme right:

  * Close (X)
* Subtext:

  * “Pick a message well-suited and will be sending the same message to all of your interested propect”

#### Content:

* Section heading: Saved Message
* Three draft messages shown
* Each draft has:

  * Radio button on the left
  * One draft pre-selected by default
  * Default subtext shown on the extreme right of the radio button selected draft.

---

### 8.2 Compose Message (Collapsed State, down arrow icon on the right)

* Collapsed compose section visible below drafts
* Expand action:

  * Clicking downward arrow expands compose section

---

### 8.3 Compose Message (Expanded State, up arrow icon on the right)

* Free text input field
* Checkbox below text field:

  * “Set as default message for all future interest”
* Primary CTA:

  * Continue

---

### 8.4 Confirmation Bottom-Up - ( no reference screenshot design as per system judgement )

* Appears after clicking Continue 
* Content:

  * Text: “This message will be sent with all of your connect requests”
  * Selected message displayed
  * Tertiary CTA:

    * Change message (with downward arrow) , onclick takes to the the previous screen
* Primary CTA:

  * Got it

---

## 9. One-Time Behavior Rule

* Saved Message bottom-up:

  * Appears **only once**
  * Triggered only on the **first right swipe**

* After confirmation:

  * Message is sent
  * Profile is swiped right

---

## 10. Subsequent Swipes (Paid Members)

* No bottom-up appears
* Right swipe:

  * Sends message immediately
* Left swipe:

  * Skips profile

---

## 11. Swipe Transition Tags

* During swipe transition (≤ 0.4 seconds delay):

### Right Swipe

* Tag shown: **Interested**

### Left Swipe

* Tag shown: **Not Interested**

* Tags are:

  * Temporary
  * Visible only during swipe animation over the profile photo.

---

## 12. Animation & Transition Notes

* Profile card transition:

  * From center → left or right
  * Duration ≤ **0.4 seconds**
* Tag visibility is tied only to this transition state

---

**End of Daily Recommendation Screen – Feature Architecture & Interaction**
