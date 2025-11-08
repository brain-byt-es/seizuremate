# SeizureMate Project Overview

This document provides a comprehensive overview of the SeizureMate project, serving as an instructional context for future interactions. It covers the project's purpose, technical stack, architecture, design principles, and operational guidelines.

## 1. Project Purpose & Vision

*   **Mission:** To make seizure tracking accessible, insightful, and empowering for anyone living with seizures or caring for someone who does.
*   **Vision:** A world where every person managing seizures feels informed, supported, and connected — not defined by their condition.
*   **Brand Essence:** Clarity, calm, and confidence.
*   **Core Idea:** "Transform uncertainty into understanding."
*   **Target Audience:** Individuals managing focal seizures, caregivers, and clinicians.

## 2. Technical Stack & Architecture

*   **Application Type:** React Native (Expo) mobile application.
*   **Language:** TypeScript.
*   **Frontend Framework:** React Native.
*   **Routing:** Expo Router (file-based routing).
*   **Authentication:** Clerk (integrated with Supabase).
*   **Backend & Database:** Supabase (PostgreSQL, authentication, data storage for logs, user profiles, medications).
*   **State Management:** React Context API is the primary method for global state.
    *   `LogsContext`: Manages fetching and adding seizure/symptom/medication logs.
    *   `OnboardingContext`: Manages the state of the multi-step user onboarding flow.
    *   `AsyncStorage` is used for persisting simple flags like `hasSeenIntro`.
*   **Navigation:** React Navigation (underlying Expo Router), Tab-based navigation for core features.
*   **Styling & Theming:** Custom theming system with light/dark modes, "Calm Mode" for accessibility, defined design tokens (colors, spacing, typography, motion, shadow, radius).
*   **UI Components:** Themed components (`ThemedText`, `ThemedButton`, `ThemedView`) for consistent application of design system. Never ALTER THOSE THEME FILES

## 3. Key Features & Flows

*   **Onboarding Flow:** Multi-step process (Profile, Medication, Caregivers) to collect initial user data and set up the user's profile in Supabase.
*   **Authentication:** Secure user authentication via Clerk, with session management integrated with Supabase.
*   **Logging:** Core feature for tracking seizures, medications, and symptoms. Data is stored in Supabase and managed via `LogsContext`.
*   **Tab Navigation:** Main application features are accessible via a bottom tab bar: Today, Log, Calendar, Insights, Settings.
*   **Data Insights:** The `Insights` screen provides visualizations and statistics based on logged data.

## 4. Architecture & Data Flow

*   **Repository Pattern:** All direct database interactions (Supabase queries) are abstracted into repository classes (e.g., `LogRepository`, `UserRepository`). This decouples the UI and business logic from the database implementation.
*   **Context for State:** React Contexts (e.g., `LogsContext`) consume these repositories to manage application state and provide data and actions (like `fetchLogs`, `addLog`) to the UI components via custom hooks (`useLogs`).
*   **Component Responsibility:** UI components are responsible for rendering the UI and handling their own local state (e.g., loading and error states for data they fetch). They call functions from context hooks to trigger data operations.
*   **Authentication Flow:** A custom hook (`useAuthAndSupabase`) manages the initialization of the Supabase session after Clerk authentication is complete, providing a reliable `isSupabaseReady` signal to the rest of the app.

## 5. Design System & Brand Guidelines ("Confident Calm")

*   **Philosophy:** “Structure builds trust. Calm builds confidence.” Balances clinical clarity with human warmth.
*   **Principles:** Precision through simplicity, warmth through restraint, empathy through usability, consistency through systems.
*   **Core Mood:** Calm, clear, supportive, confident, reassuring, human, gentle.
*   **Visuals:**
    *   **Color Palette:** "Confident Calm" palette.
        *   **Primary:** Clarity Blue (`#2F6A8E`) - Used for logos, buttons, navigation.
        *   **Accent:** Accent Coral (`#D5705D`) - Used for highlights and affirmations.
        *   **Secondary:** Support Sage (`#7FA08C`) - Used for charts, icons, supportive visuals.
        *   **Neutrals:** Neutral Sand (`#E9E3DC`), Soft Mist (`#F2F5F5`).
        *   **Text:** Contrast Taupe (`#554E4A`).
    *   **Typography:**
        *   **Primary Font:** Inter (UI, body, data).
        *   **Secondary Font:** DM Serif Display (headlines, emotional tone).
        *   **Rules:** Sentence case only, no exclamation marks, no "shouting" (all caps).
    *   **Grid & Layout:** 8pt modular grid, responsive columns, defined spacing scale (4, 8, 12, 16, 24, 32, 48, 64px), emphasis on whitespace for "emotional breathing room."
    *   **Motion:** Calm, rhythmic, human motion language. Slow, deliberate transitions (~300-400ms). Motion should express reassurance, not excitement.
    *   **Iconography:** 24x24px grid, 1.5px stroke, rounded corners. Icons should feel like helpers, not alerts.
*   **Accessibility:**
    *   **Standard:** WCAG 2.2 AA.
    *   **Contrast Ratio:** 4.5:1 minimum.
    *   **Touch Target:** 48px minimum.
    *   **Features:** Dynamic Type, "Calm Mode" (disables animations, increases padding), visible focus rings, screen reader labels, and confirmation for destructive actions.
    *   **Philosophy:** "Accessibility is designed in — not added on."
*   **Voice & Tone:**
    *   **Personality:** Empowering, supportive, informed, empathetic, simple, clear, calm. Never clinical to the point of coldness.
    *   **Golden Rule:** "Every line should feel like a steady hand, not a raised voice."
    *   **Microcopy:** Buttons are gentle suggestions ("Save Log," not "Submit Data"). Errors lead with safety and clarity. Notifications invite calm action, never pressure.

## 6. Content & Strategy

*   **Ideal Client Profile (ICP):**
    *   **Emma:** 28-year-old professional with focal seizures, seeking understanding.
    *   **Daniel:** 48-year-old father caring for his son with generalized seizures.
    *   **Transformation:** From feeling powerless and confused to feeling prepared and confident.
*   **Offer Stack:**
    *   **Free Plan:** Core tracking features (seizures, triggers, meds), basic reports.
    *   **SeizureMate Plus (Premium):** AI insights, advanced analytics, caregiver sync. ($5.99/month or $49/year).
*   **Launch Strategy:**
    *   **Philosophy:** "We launch quietly — by listening first." Soft, respectful, human-centered.
    *   **Phases:** Closed Beta -> Community Soft Launch -> Professional Awareness.
    *   **Channels:** Focus on partnerships with epilepsy foundations, clinics, and advocacy groups, not paid influencers.
*   **Content Pillars:** Awareness & Education, Caregiver Connection, Personal Progress, Calm Tech Philosophy, Advocacy & Awareness.

## 7. Development & Operational Guidelines

*   **Installation:** `npm install`
*   **Starting the App:** `npx expo start` (options for Android, iOS, web, Expo Go)
*   **Platform-specific Runs:** `npm run android`, `npm run ios`, `npm run web`
*   **Project Reset:** `npm run reset-project` (moves starter code to `app-example`, creates blank `app` directory)
*   **Linting:** `npm run lint` or `eslint . --fix`
*   **TypeScript:** Strict type checking, path aliases (`@/*` maps to `./src/*`).
*   **Testing:** Jest and React Native Testing Library are configured. Run tests with `npm test`.

## 8. AI Interaction Guidelines

*   **Purpose:** Ensure every output — from copy to UI — follows SeizureMate’s calm, clinically trusted brand system.
*   **Style Rules:**
    *   Use a calm, clear, and encouraging tone.
    *   Maintain accessibility, contrast, and readability.
    *   Use inclusive, non-alarming, and empathetic language.
    *   Prioritize human-first clarity and emotional calm over marketing hype.
    *   Follow the "Confident Calm" palette and spacing structure for visuals.
    *   All copy should feel reassuring, clear, and human — no exclamation marks.
*   **Audience:** Individuals managing focal seizures, caregivers, and clinicians seeking calm, data-informed tracking tools.
