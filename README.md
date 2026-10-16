# Agreem Leads Tracking System

A full-stack lead management system built to help sales teams manage leads, track their progress, record customer interactions, and monitor team activities from one place.

The project uses a React frontend and provides two backend options: **SQLite/Turso with Drizzle ORM** and **MongoDB with Mongoose**. You can choose either backend based on your requirements.

## Table of Contents

- Project Overview
- Features
- Tech Stack
- Project Structure
- Getting Started
- Database Seeding
- Login Credentials
- API Documentation
- Available Scripts

## 1. Project Overview

Agreem Leads Tracking System helps sales teams organize and manage their leads throughout the sales pipeline.

Users can create and update leads, track their status, add activity notes, assign team members, and view dashboard statistics.

## 2. Key Features

- **Lead Management:** Create, view, update, delete, search, and filter leads.
- **Lead Pipeline:** Track leads through New, Contacted, Qualified, and Lost statuses.
- **Activity Notes:** Record customer interactions and maintain lead history.
- **Authentication:** User registration, login, password reset, and JWT-based authentication.
- **Dashboard:** View lead statistics and team activity.
- **Team Management:** View users and manage lead assignments.
- **Responsive UI:** Modern interface with light and dark themes.
- **Two Backend Options:** Choose between SQLite/Turso and MongoDB.

## 3. Tech Stack

### Frontend

- React 19 and TypeScript
- Vite
- Redux Toolkit
- Tailwind CSS v4
- Radix UI and shadcn/ui
- React Hook Form and Zod
- React Router DOM v7
- Axios and Sonner

### Backend — SQLite/Turso

- Node.js and TypeScript
- Express 5
- SQLite/Turso with Drizzle ORM
- JWT authentication
- Zod validation, Helmet, and CORS

**Port:** `5000`

### Backend — MongoDB

- Node.js and TypeScript
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Zod validation, Helmet, and CORS

**Port:** `4000`

## 4. Project Structure

```text
agreem-leads-tracking-project/
├── frontend/                  # React application
├── beckend/                   # SQLite/Turso backend
├── beckend-mongo/             # MongoDB backend
├── Agreem_Leads_Tracking_APIs.postman_collection.json
└── README.md
```
 

**Configure the frontend API URL**

In `frontend/.env`, select the backend you want to use.

For SQLite/Turso:
VITE_API_BASE_URL=http://localhost:5000/api/v1
 
For MongoDB:
VITE_API_BASE_URL=http://localhost:4000/api/v1
 
 
### Available Endpoints

**System**
- `GET /api/v1/health` — Check server status.

**Authentication**
- `POST /api/v1/auth/sign-up` — Register a user.
- `POST /api/v1/auth/sign-in` — Log in.
- `POST /api/v1/auth/forgot-password` — Request a password reset.
- `POST /api/v1/auth/verify-otp` — Verify the OTP.
- `POST /api/v1/auth/reset-password` — Reset the password.

**Leads**
- `GET /api/v1/leads` — Get leads with search, filters, and pagination.
- `GET /api/v1/leads/:id` — Get a lead by ID.
- `POST /api/v1/leads` — Create a lead.
- `PUT /api/v1/leads/:id` — Update a lead.
- `DELETE /api/v1/leads/:id` — Delete a lead.

**Activity Notes**
- `GET /api/v1/notes` — Get notes.
- `GET /api/v1/notes/:id` — Get a note by ID.
- `POST /api/v1/notes` — Create a note.
- `PUT /api/v1/notes/:id` — Update a note.
- `DELETE /api/v1/notes/:id` — Delete a note.

**Dashboard and Users**
- `GET /api/v1/dashboard/summary` — Get dashboard statistics.
- `GET /api/v1/users` — Get users with search and pagination.
- `GET /api/v1/users/current-user` — Get current logged-in user details.
- `DELETE /api/v1/users/:id` — Delete a user (preventing self-deletion).

## 8. Available Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run seed` | Reset and populate the database with sample data. |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the production application. |

## Notes

- Start only one backend at a time for the frontend configuration you selected.
- Ensure the database connection and environment variables are configured correctly before starting the backend.
- Temporary testing credentials may stop working after their expiry.
