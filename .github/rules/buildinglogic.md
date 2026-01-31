---
trigger: always_on
---

1. Purpose & Framing (Very Important)

This project is an experimental, simulation‑heavy usability testing for mobile web app (720 px height).

The sole purpose of this project is to:

Convert Figma‑designed, multi‑step product flows into testable.

This is NOT a production product.

Explicit Non‑Goals

❌ No database

❌ No authentication

❌ No analytics, logging, or learning output

❌ No A/B testing or variant comparison

❌ No design assumptions or UI invention

All data is ephemeral, in‑memory, and Always Maintains state, metadata, and interaction history of the app prototype within a session‑bound only .

2. Core Assumptions

There is one unified flow (no variants)

Every UI screen will be explicitly provided via screenshot pic by the user

**The system must not design, infer, or assume any UI**

The system must only create functional interactive design mapped exactly to provided screenshots.


3. Entry Point: Operator_input_forma (Mandatory & Fixed)
Critical Clarification

The first page of the web app is the Input Form. need to designed .

This input form is already defined by the user as a skill with folder name operator_inpur_form

Fixed Input Fields (No Additions Allowed)

The system must take direct reference from this predefined input structure.

System Requirement

On form submission:

Create an in‑memory UserContext object using 

Immediately trigger prospect data derivation using skills prospect_profile_logic and then Prospect_partner preferenece_logic. to build full_view_profile page.

4. Prospect / Pseudo Data Generation (Session‑Bound)
Key Requirement

All visible data across the web app must be derived from the user’s input form.

Rules

Prospect data must:

Be generated fresh on every app start

Be strictly derived from the collected user inputs

Be deterministic and explainable

No external sources, stored data, or random profile generation is allowed.

This prospect data exists only for the duration of the session.

5. State Management Model
In‑Memory State Only

Core state objects:

UserContext

ProspectContext

FlowState - cta state and tabs state

ScreenState

All state is:

In‑memory only

Reset on refresh or session end

7. Technical Expectations (For Agent)
Frontend

React

Mobile‑first layout - 720:360 ( view port )

Backend Logic

React and Node.js

Event‑driven state transitions
