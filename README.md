# Unfold
> A sophisticated card-based reflection and journaling platform designed to facilitate structured introspection through curated deck interactions and custom prompt engineering.

## Overview
Unfold provides a digital environment for users to engage with thematic prompt decks, streamlining the process of daily reflection or creative brainstorming. The application utilizes a robust state-driven architecture to manage card progression, user favorites, and historical session data entirely on the client side. By leveraging persistent local storage, it ensures data continuity and privacy without requiring a centralized backend infrastructure. The interface focuses on high-fidelity transitions and a minimalist aesthetic to minimize cognitive load during introspective tasks.

## Key Features
* **Dynamic Reflection Engine:** Facilitates deep-dive sessions using randomized or sequential prompt delivery across multiple thematic categories.
* **Integrated Deck Builder:** Enables users to define, edit, and manage personalized prompt collections through a dedicated administrative interface.
* **Persistent Session Tracking:** Implements a localized data layer to record session history, favorite prompts, and deck progress across browser restarts.

## Technical Architecture
* **Frontend/UI:** React 18, TypeScript, Tailwind CSS, Framer Motion, Radix UI.
* **Backend/Logic:** Custom React Hooks (useGameState, useDeckState), LocalStorage API for client-side persistence.
* **Infrastructure/Hardware:** Vite-based build pipeline with automated GitHub Actions deployment.

## Setup & Deployment
1. Clone the repository and install project dependencies using `npm install`.
2. Execute `npm run dev` to launch the local development server with HMR.
3. Generate production-ready assets by running `npm run build`.
4. Deploy the contents of the `dist` directory to any static hosting provider.