# Vaidya Dhara Frontend

React + Vite frontend for the healthcare AI assistant. Inspired by modern, calm UX similar to the referenced projects.

## Features
- React Router pages: Chat, Dashboard, Health Tips, Emergency
- Language switcher (English, Hindi, Kannada) via Context
- Chat UI with message bubbles, timestamps, and loading state
- Tailwind CSS styling with a healthcare palette
- API client configured for `/api` with Vite proxy
- Basic tests with Vitest and React Testing Library

## Getting Started

Prerequisites: Node.js 18+

Install dependencies:

```powershell
pnpm install  # or npm install / yarn install
```

Run the dev server:

```powershell
pnpm dev  # starts Vite on http://localhost:5173
```

The dev server proxies API calls to `http://localhost:8000` by default. Start the FastAPI backend in another terminal so `/api/chat` works:

```powershell
# Example (adjust to your backend start command)
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

If backend runs elsewhere, set environment variable before starting Vite:

```powershell
$env:VITE_API_PROXY_TARGET = "http://localhost:9000"; pnpm dev
```

## Tests

```powershell
pnpm test
```

## Build

```powershell
pnpm build
pnpm preview  # serve production build locally
```

## Notes
- Update `fetchHealthTips` and `EMERGENCY_CONTACTS` with real endpoints when available.
- Tailwind config lives in `tailwind.config.js` and base styles in `src/index.css`.
- Language strings are in `src/context/LanguageContext.jsx`.
