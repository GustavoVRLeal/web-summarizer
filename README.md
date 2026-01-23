# Web Summarizer

Professional, full-stack web application that summarizes text with AI and stores a searchable history. It accepts raw text or uploaded PDF/TXT files, generates a summary with key points and suggested actions, and lets users review past results.

## Features
- AI-generated summary, key points, and action items
- PDF/TXT upload with text extraction
- History list with search and detail view
- Bilingual UI toggle (Portuguese and English)

## Architecture
### Frontend
- React 19 with Vite for fast development and builds
- Fetch-based REST integration with the backend API
- Custom CSS styling and SVG flag icons for language switching

### Backend
- FastAPI for REST endpoints and request validation
- Uvicorn ASGI server for local development
- CORS configured for local Vite origins

### AI Integration
- OpenAI Responses API using the `gpt-4.1-mini` model
- Strict JSON-only responses with validation and fallback handling

### Data and Persistence
- SQLAlchemy ORM
- SQLite database (`backend/summaries.db`)
- Stores original text, summary, bullet points, actions, and timestamps

### File Processing
- PyPDF2 for PDF text extraction
- Plain text decoding for `.txt` files
- `python-multipart` for file uploads

### Configuration
- `python-dotenv` to load `OPENAI_API_KEY` from `backend/.env`

### Tooling
- Vite dev server and build pipeline
- ESLint for frontend linting
- Root `concurrently` script to run frontend and backend together

## Tech Stack
- Frontend: React, Vite, JavaScript (JSX), CSS
- Backend: Python, FastAPI, Uvicorn, Pydantic
- AI: OpenAI SDK (Responses API)
- Data: SQLAlchemy, SQLite

## Local Development
### Backend
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run Both (root)
```bash
npm run dev
```

## Environment Variables
- `OPENAI_API_KEY`: required by the backend to call the OpenAI API
