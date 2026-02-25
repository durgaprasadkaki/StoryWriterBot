# Code Documentation

## Overview

StoryWriterBot is a full-stack AI story generation application with:

- React + TypeScript frontend
- Express backend proxy for ASI-1 API communication
- MongoDB (Mongoose) persistence for story history
- Local fallback persistence for resilience

## Runtime Architecture

### Frontend

- Entry point: `src/main.tsx`
- App shell: `src/app/App.tsx`
- Feature module: `src/features/story-generator/*`

Main frontend responsibilities:

- Collect user story parameters (title, premise, genre, tone, length)
- Trigger AI generation through backend endpoints
- Render generated content and chat refinement
- Store and manage user-specific history

### Backend

- Entry point: `backend/asi1-proxy.js`
- Framework: Express
- External API: ASI-1 chat completions
- Database layer: Mongoose

Main backend responsibilities:

- Expose `/api/stories/generate` and `/api/chat`
- Protect API key usage server-side
- Expose story history CRUD endpoints:
  - `GET /api/stories?userId=...`
  - `POST /api/stories`
  - `DELETE /api/stories/:id?userId=...`
  - `DELETE /api/stories?userId=...`
- Provide health endpoint `/health`

## Key Frontend Modules

### `src/shared/services/asi1Service.ts`

- Central API service wrapper
- Request queue + lightweight rate limiting
- Retry and timeout behavior
- Network error messaging for missing backend

### `src/features/story-generator/hooks/useStoryGenerator.ts`

- Orchestrates generation and history lifecycle
- Loads history per user
- Saves generated story to backend and local fallback
- Supports load/delete/clear history actions

### `src/shared/api/storyHistoryApi.ts`

- Frontend client for story history endpoints
- Encapsulates fetch/save/delete/clear requests

## Key Backend Modules

### MongoDB Setup

In `backend/asi1-proxy.js`:

- Reads `MONGODB_URI` from `backend/.env`
- Defines `Story` schema with:
  - `userId`
  - `options`
  - `content`
  - `snippet`
  - timestamp metadata

### ASI-1 Integration

- Reads `ASI1_API_KEY` and `ASI1_BASE_URL` from env
- Uses `node-fetch` for outbound requests
- Converts model response into app-specific story payload

## Data Flow

1. User submits story options in UI.
2. Frontend hook invokes ASI service.
3. Backend calls ASI-1 API and returns generated story.
4. Frontend renders content and requests persistence.
5. Backend stores story in MongoDB.
6. History panel reloads entries from backend (with local fallback support).

## Environment Variables

Defined in `backend/.env`:

- `ASI1_API_KEY`
- `ASI1_BASE_URL`
- `MONGODB_URI`
- `PORT`

Template file: `backend/.env.example`

## Development Commands

- `npm run dev` – Start frontend + backend
- `npm run dev:frontend` – Start Vite only
- `npm run dev:backend` – Start backend only
- `npm run build` – TypeScript build + production bundle

## Validation Status

Project has been validated for:

- Build success (`npm run build`)
- Backend health endpoint response
- ASI story generation through Vite proxy
- MongoDB persistence CRUD flows for story history
