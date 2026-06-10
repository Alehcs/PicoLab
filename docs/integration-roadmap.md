# PicoLab Integration Roadmap

This roadmap records the completed Phase 11 integration path and the Phase 12 demo readiness pass.

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

Status: complete.

## Phase 11C: Connect Ask Pico

- Connect `askPico` in the frontend service layer to the backend endpoint.
- Keep local mock fallback if the backend is unavailable.
- Add a demo mock provider first.
- Optionally add a real AI provider behind the backend once secrets are configured outside the repo.

Success criteria:

- Ask Pico can use backend responses in one or two routes.
- Drawer behavior, local history, and contextual actions remain stable.
- Responses stay short, supportive, and page-aware.

Status: complete with backend-first local fallback.

## Phase 11D: Connect Problem Parse and Step Check

- Connect typed problem parsing first.
- Add scan/OCR parsing after the typed flow is stable.
- Connect Smart Notebook step checking for the unit-focused sample.
- Create structured learning signals from step checks.

Success criteria:

- Add Problem can produce reviewable problem data from backend mock or provider output.
- Scan Confirm remains editable/reviewable.
- Smart Notebook can receive supportive step feedback.

Status: complete with backend-first local fallback.

## Phase 11E: Practice Missions Connected

- Connect Practice Missions to backend mock endpoints.
- Keep local fallback and local progress persistence.
- Track mission completion and PicoPoints events.

Success criteria:

- Practice completion can update PicoPoints.
- Practice answer checks can emit diagnostic fields.

Status: complete with backend-first local fallback.

## Phase 11F: Growth and Profile Connected

- Store learning signals from notebook and practice events.
- Update Growth Map from persisted signals.
- Update Roadmap recommendations from current signals.
- Sync Profile progress from local learning and practice events.

Success criteria:

- Learning signals can flow from Step Check to Growth Map.
- Roadmap can recommend the next focus.
- Profile can summarize recent activity from stored events.

Status: complete with backend-first local fallback.

## Phase 11G-11I: Learning Signals and Diagnostics

- Add the Learning Signal Taxonomy.
- Add the deterministic mock diagnostic engine.
- Enrich Growth Map, Roadmap, and Profile from diagnostic signals.
- Prepare Visual Lab suggestions from signal definitions.

Status: complete.

## Phase 11J: Visual Lab Template Activation

- Activate Visual Lab templates for motion, units, graph, formula, free-body, and function.
- Route diagnostic suggestions into Visual Lab.

Status: complete.

## Phase 12: Demo Polish and Deployment Notes

- Add README instructions for pure mock, mock backend, and partial AI backend modes.
- Add deployment notes for frontend and backend.
- Prepare a short demo script.
- Record fallback behavior so demo can continue if AI/backend access is unavailable.
- Run final build and smoke QA.

Success criteria:

- Demo path is clear.
- Build and deployment instructions are current.
- Product narrative matches the implemented flows.

## Recommended Demo Sequence

1. Keep current frontend stable.
2. Add backend mock endpoints.
3. Connect Ask Pico first because it is visible and high-impact.
4. Connect problem parse and step check next.
5. Connect Practice, Growth Map, Roadmap, and Profile with backend-first local fallback.
6. Activate Visual Lab templates from diagnostic suggestions.
7. Add real AI provider only after mock contracts are proven.
