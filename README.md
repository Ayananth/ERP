# ERP Project

This is a full-stack ERP-style web application with:

- `Frontend`: React + Vite
- `Backend`: Django + Django REST Framework + sqlite
- `Containerization`: Docker and Docker Compose

## Project Setup

### Prerequisites

- Docker
- Docker Compose

### Run with Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:8000`

### Environment Configuration

The Docker Compose file already wires the main local URLs:

- `FRONTEND_URL=http://localhost:5173`
- `VITE_API_BASE_URL=http://localhost:8000/api`

## Project Structure

- `frontend/` contains the React UI
- `backend/` contains the Django application
- `docker-compose.yml` runs both services together

## Completed Pages

### Authentication

- Login page
- Register page

### Dashboard

- Main dashboard page after login

### Inventory

- Item general details page
- Item units page
- Item price list page
- Item photo page

### Sales

- Sales quotation page
- Sales order page

## Routing Overview

Protected application routes are grouped under the main layout after authentication. The app currently includes routes for:

- `/login`
- `/register`
- `/`
- `/inventory/items/general`
- `/inventory/items/:itemId/general`
- `/inventory/items/:itemId/units`
- `/inventory/items/:itemId/prices`
- `/inventory/items/:itemId/photo`
- `/sales/transactions/quotation`
- `/sales/transactions/quotation/:quotationId`
- `/sales/transactions/order`
- `/sales/transactions/order/:orderId`
- `/sales/orders`
- `/sales/orders/:orderId`

## Notes

- The frontend runs with Vite in development mode inside Docker.
- The backend container runs database migrations before starting the Django server.
- I have included the db.sqlite file
