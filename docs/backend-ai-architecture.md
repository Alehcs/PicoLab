# PicoLab Backend and AI Architecture

Phase 11A defined the backend and AI integration shape for PicoLab. The current demo now includes a mock Express backend, connected frontend service paths, local fallback behavior, and the deterministic mock diagnostic engine. It still does not add secrets, auth, a database, or real model provider calls.

PicoLab remains a visual learning product first. Ask Pico is contextual support, not the primary interface.

## Architecture Goals

- Keep the current frontend usable with mock data.
- Add clear contracts for future backend work.
- Make AI responsibilities explicit and provider-agnostic.
- Support route-by-route integration instead of a large rewrite.
- Preserve PicoLab language: learning signal, growth path, practice mission, PicoPoints, supportive explanation, visual template.
- Avoid punitive feedback and answer-only tutoring.

## Backend Responsibilities

### Problem Intake

The mock backend parses typed and simulated scan inputs. It extracts numbers, units, variables, formulas, goals, ambiguous details, and confidence scores. The response is reviewable before a problem enters Smart Notebook.

### Step Checking

The mock backend checks learner steps against the current problem context. It identifies math, unit, formula, and reasoning adjustments, returns supportive feedback, and creates learning signals when a pattern should be tracked.

### Smart Notebook

The backend provides step feedback, current-step explanations, suggested visual explanations, and diagnostic output shaped for the existing notebook cards and coach panel.

### Visual Lab

The backend and frontend service layer select Visual Lab templates based on the problem, current step, and learning signal. Active demo templates include motion, units, graph, formula, free-body, and function.

### Growth Map

The mock backend and local persistence aggregate learning signals, detect repeated patterns, track improvement, and recommend the next focus. Growth Map remains diagnostic and supportive.

### Growth Path

The mock backend and local persistence generate a personalized roadmap from learner goals and learning signals. Growth Path updates recommendations from current signals.

### Practice Missions

The mock backend returns daily challenges, focus missions from Growth Map signals, random missions, answer checks, completion events, and PicoPoints awards.

### Ask Pico

The mock backend receives page context, current problem state, relevant UI state, and conversation history. It returns a short contextual educational response plus suggested actions. The frontend falls back to local mock responses if the backend is unavailable.

### Profile

The mock backend and local persistence aggregate PicoPoints, streaks, badges, league progress, goals, and recent activity from learning events.

### Settings

Settings remain local/mock in the MVP. Future backend persistence should be added only after user/session identity exists.

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
- Practice progress, learning signals, parsed/current problems, and Visual Lab suggestions use localStorage or sessionStorage for demo persistence.

### Hackathon Backend

- The current hackathon backend is mock-only and stateless.
- Connected frontend services call backend endpoints first and fall back to local mock data.
- No server-side store, auth, or database is included yet.

### Future Product

- Add auth.
- Store per-user profile data.
- Persist learning signal history.
- Persist problem and mission history.
- Persist settings after identity and privacy controls are ready.

## Mock Fallback Strategy

The frontend remains fully usable with mock data. Connected API functions call the mock backend first and fall back to the local mock service if the backend is unavailable.

Recommended demo modes:

- Pure mock frontend.
- Frontend plus mock backend.
- Future frontend plus partial real AI backend.

The current demo uses the frontend plus mock backend path, with local fallback for Ask Pico, problem parse, step check, practice, growth, profile, and Visual Lab suggestions.
