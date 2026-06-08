# Backend Local Development

Phase 11B adds a mock-only PicoLab API server. It does not call real AI providers, does not require API keys, and the frontend pages are not connected to it yet.

## Install

Install project dependencies from the repo root:

```sh
npm install
```

The backend uses the root `package.json` and lockfile.

## Environment

Copy the backend example env if you want to override defaults:

```sh
cp server/.env.example server/.env
```

Defaults:

```env
PORT=8787
HOST=127.0.0.1
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
PICOLAB_API_MODE=mock
```

No secrets are needed for Phase 11B.

## Run

Start the mock API:

```sh
npm run dev:server
```

The API listens at:

```txt
http://127.0.0.1:8787/api
```

Build the backend:

```sh
npm run build:server
```

Run the compiled backend:

```sh
npm run start:server
```

## Health Check

```sh
curl http://127.0.0.1:8787/api/health
```

Expected mock response includes:

```json
{
  "ok": true,
  "service": "picolab-api",
  "mode": "mock"
}
```

## Ask Pico Example

```sh
curl -X POST http://127.0.0.1:8787/api/ask-pico \
  -H "Content-Type: application/json" \
  -d '{
    "context": "notebook",
    "currentPage": "/smart-notebook",
    "messages": [
      { "role": "learner", "text": "Why is the unit m/s?" }
    ],
    "currentProblem": {
      "topic": "Kinematics",
      "step": "v = 10 m"
    }
  }'
```

## Problem Parse Example

```sh
curl -X POST http://127.0.0.1:8787/api/problems/parse \
  -H "Content-Type: application/json" \
  -d '{
    "inputType": "typed",
    "text": "An object starts at 2 m/s and accelerates at 4 m/s² for 2 seconds. Find the final velocity.",
    "subject": "physics"
  }'
```

## Frontend Impact

The frontend remains mock-first. `src/services/picolabApi.ts` still points at the local mock service and no page depends on the backend yet.

For Phase 11C, `src/services/apiClient.ts` can target the backend with:

```env
VITE_PICOLAB_API_URL=http://127.0.0.1:8787/api
```

This is optional until a flow is intentionally connected.
