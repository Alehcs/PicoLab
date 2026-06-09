# Final QA Checklist

Use this checklist before a hackathon submission or live demo.

## Build

- [ ] `npm run build`
- [ ] `npm run build:server`
- [ ] `git diff --check`

## Frontend Routes

- [ ] `/`
- [ ] `/add-problem`
- [ ] `/scan-confirm`
- [ ] `/smart-notebook`
- [ ] `/visual-lab`
- [ ] `/growth-map`
- [ ] `/growth-path`
- [ ] `/practice-missions`
- [ ] `/profile`
- [ ] `/settings`

## Backend Endpoints

- [ ] `/api/health`
- [ ] `/api/ask-pico`
- [ ] `/api/problems/parse`
- [ ] `/api/notebooks/:problemId/check-step`
- [ ] `/api/practice/daily`
- [ ] `/api/practice/check-answer`
- [ ] `/api/growth-map`
- [ ] `/api/growth-path`
- [ ] `/api/profile`

## Demo Data Reset

Tracked local demo keys:

```txt
picolab.askPico.history
picolab.practice.progress
picolab.learning.signals
picolab.currentParsedProblem
picolab.currentProblem
picolab.visualLab.suggestedTemplate
```

Browser console reset snippet:

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

## Smoke QA

- [ ] Frontend starts with `npm run dev`
- [ ] Backend starts with `npm run dev:server`
- [ ] Frontend route `/` serves in the browser
- [ ] Backend health returns `ok: true`
- [ ] Ask Pico backend endpoint returns a mock coaching response
- [ ] Practice daily endpoint returns a mock mission
- [ ] Practice check-answer returns feedback and diagnostic fields
- [ ] Visual Lab opens a suggested template after a diagnostic signal
- [ ] Growth Map shows learning signal context
- [ ] Growth Path shows a recommended next focus
- [ ] Profile shows PicoPoints, streak, badges, and progress

## Demo Notes

- Keep the backend running for the cleanest demo.
- If the backend is unavailable, the frontend falls back to local mock behavior.
- Use the reset snippet before recording or presenting if local progress is stale.
- Avoid mentioning real AI, real OCR, auth, or database as implemented features.
