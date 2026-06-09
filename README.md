# PicoLab

**A visual AI learning coach that turns STEM mistakes into learning signals.**

PicoLab helps students solve math and physics problems step by step. It detects learning signals from mistakes, then connects those signals across Smart Notebook, Visual Lab, Growth Map, Growth Path, Practice Missions, Profile, and Ask Pico.

Ask Pico is contextual support inside the learning flow, not a chatbot-first experience. It uses the current page, problem state, and learning context to give short coaching nudges.

## Core Value Proposition

**PicoLab turns mistakes into learning signals through visual STEM practice, contextual AI coaching, and personalized growth paths.**

## Features

- Problem intake and scan/confirm flow
- Smart Notebook step review
- Contextual Ask Pico drawer
- Visual Lab with multiple templates:
  - Motion
  - Units
  - Graph
  - Formula
  - Free-body
  - Function
- Learning Signal Taxonomy
- Mock Diagnostic Engine
- Growth Map
- Growth Path
- Practice Missions
- PicoPoints, streaks, and badges
- Profile progress
- Backend mock with offline fallback

## Tech Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS

Backend:

- Express
- TypeScript
- tsx
- Mock REST endpoints

Persistence:

- `localStorage` and `sessionStorage` for demo progress, Ask Pico history, practice progress, diagnostic signals, and Visual Lab suggestions

## Local Setup

Install dependencies:

```sh
npm install
```

Start the frontend:

```sh
npm run dev
```

Start the mock backend in a second terminal:

```sh
npm run dev:server
```

Build the frontend:

```sh
npm run build
```

Build the backend:

```sh
npm run build:server
```

Optional environment:

```env
VITE_PICOLAB_API_URL=http://localhost:8787/api
PORT=8787
CLIENT_ORIGIN=http://localhost:5173
PICOLAB_API_MODE=mock
```

The default frontend API URL is `http://127.0.0.1:8787/api`. If the backend is not running, connected flows fall back to local mock behavior so the demo can continue.

## Demo Flow

1. Home: show the product promise.
2. Add Problem: enter a sample kinematics problem.
3. Scan & Confirm: show extracted values and ambiguity review.
4. Smart Notebook: show step reasoning and a diagnostic signal.
5. Ask Pico: ask about the unit, sign, or concept.
6. Visual Lab: open the recommended visual template.
7. Practice Missions: answer a mission and complete it.
8. Growth Map: show learning signals.
9. Growth Path: show the recommended next focus.
10. Profile: show PicoPoints, streak, badges, and progress.

Suggested sample problem:

```txt
An object starts at 2 m/s and accelerates at 4 m/s^2 for 2 seconds. Find the final velocity.
```

## What Is Real vs Mock

Real:

- Complete frontend flow
- Backend mock endpoints
- Local persistence
- Diagnostic taxonomy
- Deterministic mock diagnostic engine
- Backend-first service layer with local fallback
- Visual Lab template activation

Mock/demo:

- AI responses are mock/provider-ready
- OCR is simulated
- No real user auth
- No real database
- No production AI model yet

Future:

- Real AI provider
- Real OCR
- Persistent user accounts
- Richer diagnostic engine
- Teacher dashboard
- Expanded STEM templates

## Useful Scripts

```sh
npm run dev
npm run dev:server
npm run build
npm run build:server
npm run preview
npm run start:server
npm run typecheck
```

## Demo Reset

Use this browser console snippet to reset local demo state:

```js
[
  "picolab.askPico.history",
  "picolab.practice.progress",
  "picolab.learning.signals",
  "picolab.currentParsedProblem",
  "picolab.currentProblem",
  "picolab.visualLab.suggestedTemplate"
].forEach((key) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
});
```

## Docs

- [Demo script](docs/demo-script.md)
- [Final QA checklist](docs/final-qa-checklist.md)
- [Backend local development](docs/backend-local-dev.md)
- [API contracts](docs/api-contracts.md)
- [Backend and AI architecture](docs/backend-ai-architecture.md)
- [Learning signal taxonomy](docs/learning-signal-taxonomy.md)
- [Mock diagnostic engine](docs/diagnostic-engine.md)
- [Integration roadmap](docs/integration-roadmap.md)
