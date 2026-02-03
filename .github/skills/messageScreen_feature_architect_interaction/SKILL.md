---
name : messageScreen_feature_architect_interaction
description : This document defines the **Messages Screen** structure and content. It captures layout, sections, and informational hierarchy exactly as described. No additional interactions, logic, or assumptions are introduced beyond what is stated.
---

# Bharat Matrimony:Messages Screen – Feature Architecture & Interaction

## 1. Screen Entry & Global Structure

** 
### 1.1 Screen Header

* **Heading:** Messages
* Fixed at the top of the screen
* White background

### 1.2 Primary Tabs (Below Header)

Three horizontal tabs:

1. **Received**
2. **Awaiting Response**
3. **Calls**

**message listing Screen Design Reference** : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\messageScreen_feature_architect_interaction\Reference_screenshot\message_listing_received\image (5) (1).png

---

## 2. Messaging Eligibility & Visibility Rules (Critical)



* If a member sends a message *, it appears in:

  * Sender → **Awaiting Response** tab

* Messages recieved from prospects :

  * Appear in **Received** tab

---

## 3. Received Tab

### 3.1 Context Communication

* Displayed just below the **Received** tab label
* Copy:

  > Incoming messages from paid members
* Shown once per screen load

### 3.2 Utility Chips (Extreme Right) ( non -functional )

Two chips aligned to the extreme right:

* **Sort By** (icon + label only)
* **Filter** (icon only)

### 3.3 Message Listing – Strip Card Layout

Each message is shown as a horizontal strip card:

**Strip Card Elements:**

* Profile photo thumbnail (small)
* Online indicator (small green dot on photo bottom-right)
* Name
* Message snippet (1 line)
* Date aligned to the extreme right

  * Format: DD MM YYYY
* **card states : read and unread**
  * Read : don't have any background color, simple white background .
  * Unread : have a subtle background color with red dot with count 1 on the extreme right.

### 3.3.1 - 15 fresh cards need to auto load . 
  * All 15 need to be in unread state.
  * All strip cards except 4th,8th & 12th will have a message snippet on the strip card - **Greeting!We came across your..**
  * onclick, on any of the strip cards except 4th,8th & 12th, it will open the message window screen with full message - **Greeting!We came across your profile and liked it. Could you please check our profile too and let us know if you are interested in communicating further ? We look forward for you reply.**
  * 4th,8th & 12th strip card will have message snippet - **Hello! Pls send your photo ...** 
  * onclick, on any of the 4th,8th & 12th strip card, it will open the message window screen with full message - **Hello! Pls send your photo and share your contact number, We are interested in your profile, Thanks & Regards** 
  
  * Interaction:

    * Tapping any strip card opens the **Message Window**

---

## 4. Awaiting Response Tab

### 4.1 Purpose

* Contains **all outbound first initiated messages sent by the logged-in user**

### 4.2 Listing Behavior

* Uses the **same strip card layout** as Received


---

## 5. Calls Tab ( non-functional )


---

## 6. Message Window Screen

Will be same as already build just remove 
1 saved messages chips section 
2 long press save messaage bottom up 

### Row 1: 

* 2 reply chips available at first with subtle pastal green color background
   chips 1 : **Hi, thank you for reaching out. Happy to connect and know you better.**
   chip 2 : **Hello, I’ve gone through your profile too. Let’s take this forward.**

* AI refresh
  * AI icon button ( by clicking - animation single rotation)


* On tap: AI suggested reply chip background is same subtle pastal red

  * Generates new suggested message chips - some drafts are provided 
  below choose randomly and don't repeat 

    AI Reply : **Hello, appreciate you reaching out. Happy to start a conversation.**
    AI Reply : **Hi, thank you for the kind message. I feel our profiles align in many ways. Let’s connect.**
    AI Reply : **Hello, I liked the clarity in your profile too. Open to exploring this further.**
    AI Reply : **Hi, thanks for your interest. I’ll go through your profile in detail and get back**
    AI Reply : **Hello, thank you for reaching out. I need some time to review and reflect.**
    AI Reply : **Hi, thank you for the request. I’ll discuss this with my family and revert**
    

---

### Row 2: Message Input

White background

**Left to Right:**

* Plus icon (attachments)
* Text input field
* Send icon CTA (icon only)


---

## 16. Alignment & Consistency Rules

* Sent messages:

  * Always right-aligned

* Received messages:

  * Always left-aligned

  

---

**End of Interaction Behavior Document – Message Window**

