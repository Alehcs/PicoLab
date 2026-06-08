# PicoLab Integration Roadmap

This roadmap keeps the completed frontend stable while backend and AI integration is introduced in small, demo-safe steps.

## Phase 11B: Backend Skeleton With Mock Endpoints

- Add a small backend server.
- Implement the REST endpoints from `docs/api-contracts.md` with deterministic mock responses.
- Keep frontend data usage unchanged at first.
- Add health checks and basic request logging.
- Avoid API keys and model SDKs.

Success criteria:

- Backend starts locally.
- Mock endpoints return contract-shaped data.
- Frontend can still run as pure mock UI.

## Phase 11C: Connect Ask Pico

- Connect `askPico` in the frontend service layer to the backend endpoint.
- Keep local mock fallback if the backend is unavailable.
- Add a demo mock provider first.
- Optionally add a real AI provider behind the backend once secrets are configured outside the repo.

Success criteria:

- Ask Pico can use backend responses in one or two routes.
- Drawer behavior, local history, and contextual actions remain stable.
- Responses stay short, supportive, and page-aware.

## Phase 11D: Connect Problem Parse and Step Check

- Connect typed problem parsing first.
- Add scan/OCR parsing after the typed flow is stable.
- Connect Smart Notebook step checking for the unit-focused sample.
- Create structured learning signals from step checks.

Success criteria:

- Add Problem can produce reviewable problem data from backend mock or provider output.
- Scan Confirm remains editable/reviewable.
- Smart Notebook can receive supportive step feedback.

## Phase 11E: Persist Learning Progress and Signals

- Store learning signals from notebook and practice events.
- Update Growth Map from persisted signals.
- Update Growth Path recommendations from current signals.
- Track mission completion and PicoPoints events.

Success criteria:

- Learning signals can flow from Step Check to Growth Map.
- Practice completion can update PicoPoints.
- Profile can summarize recent activity from stored events.

## Phase 12: Demo Polish and Deployment Notes

- Add README instructions for pure mock, mock backend, and partial AI backend modes.
- Add deployment notes for frontend and backend.
- Prepare a short demo script.
- Record fallback behavior so demo can continue if AI/backend access is unavailable.

Success criteria:

- Demo path is clear.
- Build and deployment instructions are current.
- Product narrative matches the implemented flows.

## Recommended Demo Sequence

1. Keep current frontend stable.
2. Add backend mock endpoints.
3. Connect Ask Pico first because it is visible and high-impact.
4. Connect problem parse and step check next.
5. Keep Growth Map, Practice, Profile, and Settings mostly mock while they consume local events.
6. Add real AI provider only after mock contracts are proven.
