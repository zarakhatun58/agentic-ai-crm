"# agentic-ai-crm" 
# AI-First HCP CRM

An AI-powered Healthcare Professional (HCP) Customer Relationship Management platform designed to manage HCP profiles, log interactions, analyze engagement, and generate intelligent follow-up recommendations.

The application combines a React and TypeScript frontend, FastAPI backend, PostgreSQL database, LangGraph-based AI workflows, and Groq LLM integration.

---

## Overview

AI-First HCP CRM helps field representatives and healthcare teams efficiently manage interactions with Healthcare Professionals.

The platform provides structured interaction logging and an AI-assisted conversational experience for capturing and analyzing HCP engagement.

### Key Capabilities

- HCP profile management
- Interaction logging
- AI-assisted interaction capture
- AI-generated interaction summaries
- AI suggested follow-up actions
- HCP sentiment tracking
- Interaction history
- Structured CRM workflows
- LangGraph AI agent integration
- Groq LLM integration
- PostgreSQL data persistence
- Docker-based development environment

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS
- Lucide React
- Axios

### Backend

- Python 3.12
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Alembic

### AI and Agentic Workflow

- LangGraph
- LangChain
- Groq API
- Llama 3.3 70B Versatile
- Prompt Engineering
- AI-assisted CRM workflows

### Database

- PostgreSQL 16

### DevOps

- Docker
- Docker Compose
- Docker Desktop

---

## Project Architecture

```text
ai-first-crm/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── agents/
│   │   └── database/
│   │
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Application Architecture

```text
React + TypeScript
        |
        |
   Redux Toolkit
        |
        |
     Axios API
        |
        v
     FastAPI
        |
        +-------------------+
        |                   |
        v                   v
   PostgreSQL          LangGraph Agent
                            |
                            v
                         Groq API
                            |
                            v
                  Llama 3.3 70B Model
```

---

## Core Features

### HCP Management

Manage Healthcare Professional information and CRM-related profile data.

HCP information can be selected while logging interactions.

### Interaction Logging

Users can record HCP interactions using a structured form.

Supported interaction types include:

- Meeting
- Call
- Email
- Conference
- Dinner Program
- Virtual

Interaction data includes:

- HCP
- Interaction type
- Date
- Time
- Attendees
- Topics discussed
- Sentiment
- Outcomes
- Follow-up actions

### AI Chat

The application provides an AI Chat mode for AI-assisted CRM interaction workflows.

The AI agent can understand interaction context and assist users in capturing CRM information.

### AI Interaction Summary

AI can generate a concise summary of an HCP interaction.

Example:

```text
The representative discussed product adoption and patient outcomes
with the HCP. The HCP demonstrated positive engagement and requested
additional clinical information.
```

### AI Suggested Follow-ups

The AI system analyzes interaction context and recommends possible next actions.

Example:

```text
- Share requested clinical study
- Schedule follow-up meeting
- Send product information
- Review HCP engagement after two weeks
```

Suggested follow-ups can be added directly to the interaction form.

### Sentiment Tracking

HCP sentiment can be recorded or inferred from the interaction.

Supported sentiment examples:

```text
Positive
Neutral
Negative
```

### Interaction History

Users can view previously logged interactions and update or delete existing records.

---

## Redux Architecture

Redux Toolkit is used for frontend state management.

Example feature structure:

```text
src/features/
│
├── hcp/
│   └── hcpSlice.ts
│
├── interaction/
│   └── interactionSlice.ts
│
└── ui/
    └── uiSlice.ts
```

The interaction state manages:

```text
interactions
form
loading
saving
error
editingId
aiSuggestedFollowUps
```

---

## AI Architecture

The AI workflow uses LangGraph to implement agent-based processing.

```text
User Input
    |
    v
LangGraph Agent
    |
    v
Analyze Interaction
    |
    +----------------------+
    |                      |
    v                      v
Generate Summary     Suggest Follow-ups
    |                      |
    +-----------+----------+
                |
                v
         Structured Result
                |
                v
          React Frontend
```

Groq provides LLM inference using:

```text
llama-3.3-70b-versatile
```

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_first_crm

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=llama-3.3-70b-versatile
GROQ_MODEL_LARGE=llama-3.3-70b-versatile

SECRET_KEY=your_secure_secret_key

ALGORITHM=HS256

DEBUG=false
```

> Never commit real API keys or production secrets to Git.

### Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

---

## Docker Setup

The complete application can run using Docker Compose.

Docker services:

```text
hcp_crm_db
hcp_crm_backend
hcp_crm_frontend
```

### PostgreSQL

```text
Port: 5432
Database: ai_first_crm
```

### FastAPI Backend

```text
Port: 8000
```

### React Frontend

```text
Port: 5173
```

---

## Run the Application with Docker

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-first-crm
```

### 2. Configure Environment Variables

Create the required `.env` files inside:

```text
backend/.env
frontend/.env
```

Add the environment variables described above.

### 3. Build Docker Images

From the project root:

```bash
docker compose build
```

For a completely clean build:

```bash
docker compose build --no-cache
```

### 4. Start the Application

```bash
docker compose up -d
```

### 5. Check Container Status

```bash
docker compose ps
```

Expected services:

```text
hcp_crm_backend
hcp_crm_db
hcp_crm_frontend
```

The PostgreSQL container should display:

```text
healthy
```

---

## Application URLs

### Frontend

```text
http://localhost:5173
```

### Backend API

```text
http://localhost:8000
```

### Swagger API Documentation

```text
http://localhost:8000/docs
```

### ReDoc Documentation

```text
http://localhost:8000/redoc
```

---

## Docker Commands

Start all services:

```bash
docker compose up -d
```

Stop all services:

```bash
docker compose down
```

View container status:

```bash
docker compose ps
```

View all logs:

```bash
docker compose logs -f
```

View backend logs:

```bash
docker compose logs backend -f
```

View frontend logs:

```bash
docker compose logs frontend -f
```

View PostgreSQL logs:

```bash
docker compose logs db -f
```

Restart the backend:

```bash
docker compose restart backend
```

Restart the frontend:

```bash
docker compose restart frontend
```

Rebuild the application:

```bash
docker compose up -d --build
```

Remove containers and database volumes:

```bash
docker compose down -v --remove-orphans
```

Clean unused Docker resources:

```bash
docker system prune -a
```

---

## Run Backend Without Docker

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

## Run Frontend Without Docker

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Documentation

FastAPI automatically generates interactive API documentation.

After starting the backend, open:

```text
http://localhost:8000/docs
```

The Swagger interface can be used to inspect and test API endpoints.

---

## Development Workflow

Recommended Docker development workflow:

```bash
docker compose up -d
```

Check services:

```bash
docker compose ps
```

Monitor backend:

```bash
docker compose logs backend -f
```

After dependency or Dockerfile changes:

```bash
docker compose up -d --build
```

For a completely clean rebuild:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## Security

The application uses environment variables for sensitive configuration.

The following values should never be committed:

```text
GROQ_API_KEY
SECRET_KEY
DATABASE_URL containing production credentials
```

Recommended `.gitignore` entries:

```gitignore
.env
backend/.env
frontend/.env

.venv/
venv/

node_modules/

__pycache__/
*.pyc

dist/
build/

.vscode/
.idea/

.DS_Store
Thumbs.db
```

---

## Future Improvements

Potential future enhancements include:

- JWT authentication and role-based access control
- Advanced HCP engagement analytics
- AI-generated next-best-action recommendations
- Interaction voice transcription
- RAG-based medical knowledge retrieval
- AI-powered HCP profile insights
- CRM dashboard analytics
- Material and sample tracking
- Email follow-up generation
- Calendar integration
- Background AI processing
- Redis caching
- Automated testing
- CI/CD pipeline
- Cloud deployment

---

## Author

**Jahanara Khatun**

Senior Full Stack Developer | MERN Stack Developer | AI-Assisted Application Developer

Technical expertise includes:

```text
React
Next.js
TypeScript
Node.js
FastAPI
Python
PostgreSQL
Docker
LangGraph
Agentic AI
Prompt Engineering
AI Workflow Integration
```

---

## License

This project is intended for educational, technical assessment, and demonstration purposes.

---

## Project Status

```text
Frontend        Running
FastAPI Backend Running
PostgreSQL      Healthy
Docker Compose  Configured
Groq AI         Integrated
LangGraph Agent Integrated
```

**Current Status: Development Environment Successfully Containerized**