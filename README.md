# Inventory Management App

This repository contains a full-stack Inventory Management application with a Node/Express + SQLite backend and a React frontend. The project includes product CRUD, CSV import/export, and inventory history tracking.

## Contents

- `backend/` — Node.js + Express API, SQLite DB, import/export endpoints.
- `frontend/` — React app (Create React App) for product UI and history sidebar.

## Prerequisites

- Node.js (v16+ recommended) and npm installed.
- Git (optional, for cloning).

## Local Setup

Follow these steps to run the app locally.

**1) Backend (API)**

- Open a terminal and navigate to the `backend` folder:

```powershell
cd backend
```

- Install dependencies:

```powershell
npm install
```

- Create a `.env` file in `backend/` if you want to customize environment variables (optional). Example:

```
PORT=4000
DATABASE_PATH=./inventory.db
JWT_SECRET=your_jwt_secret_here
```

- Start the server in development (uses `nodemon` when available):

```powershell
npm run dev
```

- Or start normally:

```powershell
npm start
```

- The API will listen on `http://localhost:<PORT>` (default `4000` if set in `.env`).

**Database initialization**

On first run the server will create `inventory.db` (SQLite) and initialize the `products` and `inventory_history` tables. No manual migration is required.

**API endpoints (summary)**

- `GET /api/products` — Get all products (supports optional query params for category, pagination, sorting if implemented).
- `GET /api/products/:id` — Get single product by id.
- `PUT /api/products/:id` — Update product (tracks stock changes to `inventory_history`).
- `POST /api/products/import` — Import products from uploaded CSV file (multipart/form-data, field `csvFile`).
- `GET /api/products/export` — Export all products as CSV (downloadable file).
- `GET /api/products/:id/history` — Get inventory history for a product, sorted by date DESC.

Refer to source files in `backend/routes/` for full behavior and validation rules.

**Import CSV format**

The import expects a CSV with headers such as: `name,unit,category,brand,stock,status,image` (order and exact fields may vary — review `backend` import handler).

**Notes on uploads**: Uploaded CSVs are stored temporarily in `backend/uploads/` before processing. Duplicate product names are skipped by default; the endpoint returns counts of added/skipped items.

**2) Frontend (React)**

- Open a new terminal and navigate to the `frontend` folder:

```powershell
cd frontend
```

- Install dependencies:

```powershell
npm install
```

- Start the development server:

```powershell
npm start
```

- The React app runs by default at `http://localhost:3000` and expects the backend API to be reachable (update `frontend/src/api/axios.js` base URL if your backend runs on a different host/port).

**Import / Export UI**

- Use the `Import` button to upload a CSV file; the UI will send a `POST` with form-data with key `csvFile` to `/api/products/import`.
- Use the `Export` button to download `products.csv` from `/api/products/export`.

**Inventory History**

- Click a product row or the `View History` action to open the History sidebar. The frontend fetches `GET /api/products/:id/history` and displays past stock changes.

## Inline Editing

- Product rows support inline editing. On save the frontend sends `PUT /api/products/:id`. If the `stock` value changed, the backend inserts a new record into `inventory_history`.

## Testing

- Backend tests (if provided) live in `backend/__tests__/`. Run with:

```powershell
cd backend
npm test
```

- Frontend tests live in `frontend/src/` (React Testing Library). Run with:

```powershell
cd frontend
npm test
```

## Deployment Notes

- Backend: Ensure the host allows persistent storage for the SQLite file or switch to a managed DB (Postgres) for production. Configure `PORT` and environment variables in your hosting service. Provide `start` script in `backend/package.json`.
- Frontend: Build with `npm run build` and deploy the `build/` folder to Netlify, Vercel, or a static host. Update API base URL to the deployed backend URL.

## Bonus / Improvements

- Add server-side pagination and sorting (`?page=&limit=&sort=&order=`) to `GET /api/products`.
- Add JWT authentication and protect API routes. Use `bcrypt` for password hashing.
- Move to PostgreSQL (or another managed DB) for production to avoid SQLite persistence issues.

## Submission Checklist

- **Repository:** public GitHub repo link (share URL).
- **Backend Live URL:** deployed API base URL.
- **Frontend Live URL:** deployed React app URL.

Include these links in your submission message.

---

If you want, I can:

- update `backend/package.json` to add `dev` and `start` scripts (if missing),
- add an example `.env.example`, or
- create a sample CSV to test the import flow.

Tell me which of those you'd like me to do next.

