# CSI-2132 Course Project - Hotel Management System

## Overview
This is a Hotel Management System developed as part of the CSI-2132 course project. The system allows users to manage hotel bookings, room assignments, and customer information through a modern web interface.

## Tech Stack

### Frontend
- **Framework**: Next.js (React Framework)
- **Language**: TypeScript
- **Styling**: TailwindCSS

### Backend
- **Language**: Python
- **API Server**: FastAPI / Uvicorn [For API endpoints]
- **ORM**: SQLAlchemy

### Database
- **DBMS**: PostgreSQL

## Project Structure
```
.
├── frontend/               # Next.js frontend application
│   ├── src/               # Source code
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── backend/               # FastAPI backend application
│   ├── app/              # Application code
│   ├── run.py            # Server entry point
│   └── requirements.txt  # Backend dependencies
├── SQL/                  # Database scripts and schemas
└── .env                  # Environment variables
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL

### Clone the Git Repository

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv

   # On Windows
   .\venv\Scripts\activate

   # On Unix or MacOS
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables (IF NOT ALREADY CREATED)
   
   (replace user and password with yours)
   ```ini
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=hotel_management
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432

   # Backend settings
   BACKEND_PORT=8000
   BACKEND_HOST=localhost

   # Frontend settings
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```


4. Initialize / Reset DB:
   ```bash
   python app/init_db.py
   ```
   This will either create or reset the BD

5. Run the backend server:
   ```bash
   python run.py
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Database Setup
- Backend DB Initialize  / Reset `python app/init_db.py`

## Development
- Frontend development server (with hot reload): `npm run dev`
- Backend development server: `python run.py`
