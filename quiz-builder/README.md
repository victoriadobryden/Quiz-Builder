# Quiz Builder

## Backend (Express + JS + Sequelize + SQLite)
1. `cd backend`
2. `cp .env.example .env`
3. `npm i`
4. `npm run dev`

API: `http://localhost:4000`
Health: `GET /health`

## Frontend (Next.js + React + TypeScript)
1. `cd frontend`
2. `cp .env.example .env.local`
3. `npm i`
4. `npm run dev`

UI: `http://localhost:3000`

## Create sample quiz
Go to `http://localhost:3000/create` and submit a quiz.

or

cd backend
npm run seed

will create you example quiz.



A full-stack Quiz Builder web app where users can create quizzes with multiple question types, list all quizzes, view quiz details, and delete quizzes.

## Tech Stack

### Backend
- Node.js + Express
- Sequelize ORM
- SQLite (local dev DB)

### Frontend
- Next.js (React) + TypeScript (Pages Router)

---

## Project Structure

quiz-builder/
├── backend/
├── frontend/
│ └── app/ # Next.js app (package.json is here)
└── README.md


---

## Requirements Covered (Task Checklist)

### Backend API
- `POST /quizzes` – Create a quiz
- `GET /quizzes` – List quizzes (title + question count)
- `GET /quizzes/:id` – Quiz details (with questions)
- `DELETE /quizzes/:id` – Delete a quiz
- `GET /health` – Health check

### Frontend Pages
- `/create` – Quiz creation form with dynamic questions
- `/quizzes` – Quiz list with delete action
- `/quizzes/:id` – Quiz details (read-only view)

### Code Quality
- ESLint + Prettier configured (frontend + backend)

---





