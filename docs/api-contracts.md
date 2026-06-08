# PicoLab API Contracts

These contracts define the planned REST API for backend and AI integration. Phase 11A does not implement these endpoints.

Each endpoint should return `ApiResult<T>` on the frontend service layer. Backend responses may return the raw response body plus HTTP status; the frontend adapter can normalize them.

## Problem

### POST `/api/problems/parse`

- Purpose: Parse typed or formula input into reviewable problem data.
- Request body: `ProblemInput`
- Response body: `ParsedProblem`
- Frontend caller: `parseProblem`
- Mock fallback: Return the sample kinematics problem with extracted values.
- AI dependency: Problem parsing and formula detection.

### POST `/api/problems/scan`

- Purpose: Parse an uploaded scan/OCR result into reviewable problem data.
- Request body: `{ imageId: string; ocrText?: string; subjectHint?: SubjectArea }`
- Response body: `ParsedProblem`
- Frontend caller: future scan upload flow, then `parseProblem` adapter if useful.
- Mock fallback: Return the current Scan Confirm sample with highlighted details.
- AI dependency: OCR cleanup, detail extraction, ambiguity detection.

### POST `/api/problems/:problemId/confirm`

- Purpose: Confirm reviewed details and create a problem entity.
- Request body: `{ extractedDetails: ExtractedDetail[]; resolvedAmbiguities?: Record<string, string> }`
- Response body: `ProblemEntity`
- Frontend caller: `confirmProblem`
- Mock fallback: Return a confirmed sample problem id.
- AI dependency: None required; optional validation only.

## Notebook

### GET `/api/notebooks/:problemId`

- Purpose: Get Smart Notebook state for a confirmed problem.
- Request body: none
- Response body: `NotebookResponse`
- Frontend caller: `getNotebook`
- Mock fallback: Return existing notebook problem and steps.
- AI dependency: Optional for generated steps and summary.

### POST `/api/notebooks/:problemId/check-step`

- Purpose: Check a learner step and return supportive feedback.
- Request body: `StepCheckRequest`
- Response body: `StepCheckResponse`
- Frontend caller: `checkStep`
- Mock fallback: Return the unit learning signal sample.
- AI dependency: Step checking, unit consistency, reasoning review.

### POST `/api/notebooks/:problemId/hint`

- Purpose: Generate the next helpful hint for the current step.
- Request body: `{ stepId: string; notebookContext: NotebookStep[]; learnerQuestion?: string }`
- Response body: `{ hint: string; suggestedAction?: AskPicoAction }`
- Frontend caller: future Smart Notebook hint action.
- Mock fallback: Return the current coach-panel hint.
- AI dependency: Hint generation.

### POST `/api/notebooks/:problemId/explain-step`

- Purpose: Explain the current step in the learner's preferred style.
- Request body: `{ stepId: string; explanationStyle?: SettingsResponse['explanationStyle'] }`
- Response body: `{ explanation: string; visualTemplateId?: VisualTemplateId }`
- Frontend caller: `askPico` or future explain-step action.
- Mock fallback: Return the existing unit explanation.
- AI dependency: Step explanation and optional visual selection.

## Visual Lab

### POST `/api/visual-lab/select-template`

- Purpose: Select the best visual template for a problem, step, or learning signal.
- Request body: `VisualLabTemplateRequest`
- Response body: `VisualLabTemplateResponse`
- Frontend caller: `selectVisualTemplate`
- Mock fallback: Return the motion template with existing defaults.
- AI dependency: Template selection and parameter mapping.

### POST `/api/visual-lab/render-state`

- Purpose: Return computed visual state from template parameters.
- Request body: `{ templateId: VisualTemplateId; parameters: Record<string, number | string | boolean> }`
- Response body: `{ templateId: VisualTemplateId; state: Record<string, unknown>; explanation: string }`
- Frontend caller: future Visual Lab state adapter.
- Mock fallback: Use current client-side motion calculations.
- AI dependency: None required for deterministic templates.

## Growth

### GET `/api/growth-map`

- Purpose: Return aggregated learning signals and current focus.
- Request body: none
- Response body: `GrowthMapResponse`
- Frontend caller: `getGrowthMap`
- Mock fallback: Return existing Growth Map mock data.
- AI dependency: Optional pattern summary.

### POST `/api/growth-map/signals`

- Purpose: Add or update a learning signal from notebook or practice activity.
- Request body: `LearningSignal`
- Response body: `GrowthMapResponse`
- Frontend caller: future learning-event adapter.
- Mock fallback: Store locally or return unchanged mock map.
- AI dependency: None if the signal is already structured.

### GET `/api/growth-path`

- Purpose: Return the learner's current growth path.
- Request body: none
- Response body: `GrowthPathResponse`
- Frontend caller: `getGrowthPath`
- Mock fallback: Return existing Growth Path mock data.
- AI dependency: Optional roadmap summary.

### POST `/api/growth-path/regenerate`

- Purpose: Regenerate a path after new signals or a changed learner goal.
- Request body: `{ goal?: string; learningSignals: LearningSignal[] }`
- Response body: `GrowthPathResponse`
- Frontend caller: future goal or regeneration action.
- Mock fallback: Return the current roadmap.
- AI dependency: Personalized roadmap generation.

## Practice

### GET `/api/practice/daily`

- Purpose: Return today's practice mission.
- Request body: none
- Response body: `PracticeMission`
- Frontend caller: `getDailyPractice`
- Mock fallback: Return existing daily challenge.
- AI dependency: Optional mission generation.

### GET `/api/practice/focus`

- Purpose: Return a mission based on the strongest current learning signal.
- Request body: none
- Response body: `PracticeMission`
- Frontend caller: `getFocusPractice`
- Mock fallback: Return existing Units in motion mission.
- AI dependency: Focus mission generation.

### GET `/api/practice/random`

- Purpose: Return a small set of practice missions.
- Request body: none
- Response body: `PracticeMission[]`
- Frontend caller: future random mission adapter.
- Mock fallback: Return existing random missions.
- AI dependency: Optional mission generation.

### POST `/api/practice/check-answer`

- Purpose: Check a practice answer and return feedback, points, and optional signal.
- Request body: `PracticeAnswerRequest`
- Response body: `PracticeAnswerResponse`
- Frontend caller: `checkPracticeAnswer`
- Mock fallback: Use existing focus mission answer feedback.
- AI dependency: Answer checking for free-response missions.

### POST `/api/practice/complete`

- Purpose: Record mission completion and award PicoPoints.
- Request body: `{ missionId: string; earnedPicoPoints: number; learningSignalId?: string }`
- Response body: `{ picoPoints: number; profileUpdated: boolean; nextMission?: PracticeMission }`
- Frontend caller: future completion event adapter.
- Mock fallback: Show existing mission complete card.
- AI dependency: None required.

## Ask Pico

### POST `/api/ask-pico`

- Purpose: Return a short contextual educational response and suggested actions.
- Request body: `AskPicoRequest`
- Response body: `AskPicoResponse`
- Frontend caller: `askPico`
- Mock fallback: Use the existing context-specific mock response.
- AI dependency: Contextual tutoring response and action suggestion.

## Profile

### GET `/api/profile`

- Purpose: Return learner stats, PicoPoints, league, badges, and recent activity.
- Request body: none
- Response body: `ProfileResponse`
- Frontend caller: `getProfile`
- Mock fallback: Return existing profile mock data.
- AI dependency: Optional insight summary.

### POST `/api/profile/goals`

- Purpose: Update learner goals for personalization.
- Request body: `{ goals: string[]; currentGoal?: string }`
- Response body: `ProfileResponse`
- Frontend caller: future profile goal editor.
- Mock fallback: Update local UI state only.
- AI dependency: Optional goal-to-roadmap summary.

## Settings

### GET `/api/settings`

- Purpose: Return persisted learner preferences.
- Request body: none
- Response body: `SettingsResponse`
- Frontend caller: `getSettings`
- Mock fallback: Return current local settings defaults.
- AI dependency: None.

### PATCH `/api/settings`

- Purpose: Persist changed learner preferences.
- Request body: `Partial<SettingsResponse>`
- Response body: `SettingsResponse`
- Frontend caller: future settings persistence adapter.
- Mock fallback: Keep local Settings page behavior.
- AI dependency: None.
