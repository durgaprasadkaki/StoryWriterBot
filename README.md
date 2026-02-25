# StoryWriterBot

StoryWriterBot is an AI-assisted story ideation and drafting application with ASI-1 API integration, interactive refinement, and MongoDB-backed story history.

## Submission Deliverables

- ✅ Working project with ASI-1 API integration
- ✅ README with project description and setup instructions
- ✅ Code documentation in `ASI1_INTEGRATION.md` and `CODE_DOCUMENTATION.md`
- ✅ Demo evidence section (screenshots/video placeholders) in this README

## Highlights

- Clean folder separation: `app`, `features`, `shared`
- Reusable UI primitives (`Button`, `Card`, `Field`, `SelectField`, `TextAreaField`)
- Feature-isolated story generator module
- Local storage draft history (load/delete/clear)
- Type-safe forms and model contracts with TypeScript

## Tech Stack

- React 19 + TypeScript + Vite
- Node.js + Express backend proxy
- MongoDB (Atlas) via Mongoose for story history
- Vanilla CSS with component utility classes
- Local-first fallback persistence via `localStorage`

## Project Structure

```text
src/
  app/
    App.tsx
    styles.css
  features/
    story-generator/
      components/
      hooks/
      model/
      services/
  shared/
    components/ui/
    constants/
    lib/
```

## Getting Started

```bash
npm install
npm run dev
```

`npm run dev` starts both the Vite frontend and the local backend proxy required for `/api/*` routes.

Create backend environment file before running if not already present:

```bash
cp backend/.env.example backend/.env
```

Then set at least:

- `ASI1_API_KEY`
- `MONGODB_URI`

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Architectural Notes

- `features/story-generator/services/storyComposer.ts`: generation/composition logic
- `features/story-generator/hooks/useStoryGenerator.ts`: feature state + persistence orchestration
- `features/story-generator/components/*`: presentation and interactions
- `shared/*`: generic utilities and reusable UI blocks

This layout keeps domain logic isolated, encourages fast iteration, and makes future API integration straightforward.

## Demo Evidence

Add your proof of working app here:

- `docs/screenshots/home.png` – Landing or workspace view
- `docs/screenshots/generated-story.png` – Story generation result
- `docs/screenshots/history.png` – MongoDB-backed story history
- Demo video link: `https://your-video-link`

## Additional Docs

- `ASI1_INTEGRATION.md` – API-focused integration notes
- `CODE_DOCUMENTATION.md` – code architecture, modules, and data flow
- `docs/DEMO.md` – demo checklist and evidence guide
