---
name : matchScreen_feature_Architect_Interaction
description : This document defines the **Matches Screen** structure and content. It captures layout, sections, and informational hierarchy exactly as described. No additional interactions, logic, or assumptions need to be introduced beyond what is stated.

---

# Bharat Matrimony – Matches Tab (Mobile Web)

## Overview

The Matches tab is one of the six bottom navigation items in the Bharat Matrimony mobile web app. It serves as the primary screen for browsing matched profiles. This document defines the **feature architecture, screen structure, and interactions** for the Matches screen.

---

## Design Reference

* 

**Design reference :C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\matchScreen_feature_Architect_Interaction\Reference_screenshot\screenshot_image
---

## Entry Points

* Bottom navigation → Matches tab
* After recommendation profiles exhausted , we will land user to matches screen.

---

## Matches Screen Structure

The Matches screen is a vertically scrollable page consisting of a multi-row header followed by profile cards and a bottom sticky navigation bar.

### Header

The header is composed of **four rows**.

#### Row 1 – Global Header (Same as Home)

* Regular / Prime toggle *(placeholder only, no mode switching)*
* Language icon *(placeholder only)*

No interactions are enabled for any of the above elements.

---

#### Row 2 – Match Tabs

* All Matches - 1st tab
* New Matches - 2nd tab
* More ( arrow down icon )- 3rd tab   

Switching tabs to newly joined does trigger interaction shows you same prospect profiles which is there in the new matches of the home screen.


---

#### Row 3 – Match Count Communication

* Text for All matches tab selected state: **"2000 matches based on your preference"** *(dummy content)*
* Text for New matches tab on selected state: **"4 matches based on your preference"** *(dummy content)*   
* Three-dot icon on the extreme right *(placeholder only)* - check the screenshot : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\matchScreen_feature_Architect_Interaction\Reference_screenshot\screenshot_image

No interaction is enabled on this row.

---

#### Row 4 – Filter / Attribute Chips

Displayed items:

* Filter - right side icon 
* Sort by - right side icon 
* Newly joined
* Not seen
* Profile with photo
* Location
* Mutual match
* Profile created by

All items are **dummy, non-interactive placeholders**. No filtering or sorting logic need to be implemented.

---

## Profile Card Structure

same as full view profile first section  CTA logic explained below . design reference
---

###  CTA logic

Operator will see <Don't show > (tertiary cta) & <send message > (primary cta) 

### 2. – Outbound Actions

#### Initial State (Paid user viewing a profile)

* Primary CTA: **Send Message**
* Secondary CTA: **Don’t Show**

**Send Message**

* Remains as **Send Message** after action. nO change of label or style

**Don’t Show**

* Changes to secondary CTA **Call Now** after message is been sent.

#### Post Message Sent (Paid user)

A communication header appears above the CTAs:

* Text: **“You sent him / her a message”**
* Date shown beside the text in caption format: **DD, MM, YYYY**

Below the communication header:

* Message snippet (example): design reference : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\matchScreen_feature_Architect_Interaction\Reference_screenshot\Message snippet

  * “Greetings, we came across your … … …”
* Tertiary link: **Read More →**

*** paid member when click on message CTA first time in an profile card from matches screen or from Full view profile page ( note : not from Daily recommendation screen) will see a shimmering effect left to right transition taking 1 sec to complete *** 

*** During shimmering transition, clicking on the message CTA again will open the full screen message window ***  Design reference : C:\Users\Ashish\bm_UT_message_new_VS\.github\skills\matchScreen_feature_Architect_Interaction\Reference_screenshot\Message window1

*** paid member clicking on Call now after message is been sent , will not have any interaction ***

## Interactions

### Enabled Interaction

* Tap on a profile card → navigates to **Full Profile Screen**

---

## Transitions

* Bottom navigation → Matches → Matches screen 
* Profile card tap → navigates to Full Profile Screen
* Back navigation → returns to previous screen

---

