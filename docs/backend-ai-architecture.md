# PicoLab Backend and AI Architecture

Phase 11A defines the backend and AI integration shape for PicoLab without implementing a server, adding secrets, replacing frontend mock data, or calling real model providers.

PicoLab remains a visual learning product first. Ask Pico is contextual support, not the primary interface.

## Architecture Goals

- Keep the current frontend usable with mock data.
- Add clear contracts for future backend work.
- Make AI responsibilities explicit and provider-agnostic.
- Support route-by-route integration instead of a large rewrite.
- Preserve PicoLab language: learning signal, growth path, practice mission, PicoPoints, supportive explanation, visual template.
- Avoid punitive feedback and answer-only tutoring.

## Future Backend Responsibilities

### Problem Intake

The backend will parse typed, formula, and scanned problem inputs. It should extract numbers, units, variables, formulas, goals, ambiguous details, and confidence scores. The response should be reviewable before a problem enters Smart Notebook.

### Step Checking

The backend will check learner steps against the current problem context. It should identify math, unit, formula, and reasoning adjustments, return supportive feedback, and create a learning signal when a pattern should be tracked.

### Smart Notebook

The backend will provide notebook state, next hints, current-step explanations, suggested visual explanations, and progress summaries. Responses should be short enough for the existing notebook cards and coach panel.

### Visual Lab

The backend will select a visual template based on the problem, current step, and learning signal. Supported template ids are motion, graph, units, formula, free-body, function, energy, and circuit. Responses should include parameters, control values, and a brief explanation.

### Growth Map

The backend will aggregate learning signals, detect repeated patterns, track improvement, and recommend the next focus. Growth Map should remain diagnostic and supportive.

### Growth Path

The backend will generate a personalized roadmap from learner goals and learning signals. It should update path recommendations after new signals and support future goal changes.

### Practice Missions

The backend will generate daily challenges, focus missions from Growth Map signals, random missions, answer checks, completion events, and PicoPoints awards.

### Ask Pico

The backend will receive page context, current problem state, relevant UI state, and conversation history. It should return a short contextual educational response plus suggested actions.

### Profile

The backend will aggregate PicoPoints, streaks, badges, league progress, goals, and recent activity from learning events.

### Settings

Settings can remain local/mock in the MVP. Future backend persistence should be added only after user/session identity exists.

## AI Provider Abstraction

The frontend and backend should not depend directly on a single model SDK. Future AI work should route through an `AiProvider` interface with task methods for:

- parse problem
- check step
- ask Pico
- generate practice

Provider options:

- Demo mock provider for deterministic hackathon flows.
- OpenAI provider for later parsing, tutoring, Ask Pico, and practice generation.
- Gemini provider for optional multimodal scan experiments.
- Qwen provider for optional math and visual reasoning experiments.
- Custom backend provider for server-side orchestration.

No API keys, SDK imports, or real provider calls are part of Phase 11A.

## AI Task Guidelines

AI responses should:

- stay short and contextual
- use supportive explanations
- avoid answer-only tutoring
- explain reasoning visually when possible
- avoid overclaiming certainty
- preserve learner safety and privacy
- return structured learning signals only when the pattern is useful

Likely tasks:

- parse problem statements and scanned text
- explain the current notebook step
- check unit consistency
- generate a next hint
- answer Ask Pico questions from page context
- generate practice missions
- summarize a learning signal

## Persistence Direction

### MVP Local

- Ask Pico history remains in localStorage.
- Progress can stay mock/local until backend routes are introduced.

### Hackathon Backend

- Use a simple JSON store, SQLite, or Postgres depending on deployment speed.
- Scope data by anonymous session or user id.
- Store problems, notebook attempts, learning signals, missions, PicoPoints events, and profile events.

### Future Product

- Add auth.
- Store per-user profile data.
- Persist learning signal history.
- Persist problem and mission history.
- Persist settings after identity and privacy controls are ready.

## Mock Fallback Strategy

The frontend should remain fully usable with mock data. API functions should be able to call a backend later and fall back to the mock service if the backend is unavailable.

Recommended demo modes:

- Pure mock frontend.
- Frontend plus mock backend.
- Frontend plus partial real AI backend.

The safest integration path is to connect one high-impact flow at a time while Growth Map, Practice, Profile, and Settings continue to use stable mock data.
