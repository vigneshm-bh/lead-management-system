# Lead Management System

A full-stack web application to manage sales leads and help the sales team follow up efficiently.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, TypeScript, Vite, Emotion |
| Backend  | Spring Boot 3.3, Java 21            |
| Database | PostgreSQL                          |
| Auth     | JWT (HttpOnly Cookies + Refresh Token Rotation) |

## Features

- Create, edit, and delete leads
- Lead fields: Name, Company, Email, Phone, Source, Status, Notes
- Status options: New, Contacted, Qualified, Won, Lost
- Dashboard with total leads and leads grouped by status
- Search/filter leads by name, company, email, or status
- JWT authentication with secure HttpOnly cookies
- Refresh token rotation for session persistence
- Client and server-side form validation

---

## Prerequisites

- **Java 21** (JDK)
- **Maven 3.8+**
- **Node.js 20+** and **npm**
- **PostgreSQL 14+**

---

## Database Setup

1. Install and start PostgreSQL.

2. Create the database:

```sql
CREATE DATABASE lead_management;
```

3. Default connection config (update `backend/src/main/resources/application.yml` if different):

```
Host: localhost
Port: 5432
Database: lead_management
Username: postgres
Password: postgres
```

---

## Backend Setup

```bash
cd backend

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.

Liquibase will automatically create the database tables on first run.

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend starts on **http://localhost:3000**.

The Vite dev server proxies all `/api` requests to the backend at `localhost:8080`.

---

## Usage

1. Open **http://localhost:3000** in your browser.
2. Click **Sign Up** to create an account.
3. After registration, you are logged in automatically.
4. Use the **Dashboard** to see lead statistics.
5. Navigate to **Leads** to create, edit, search, filter, or delete leads.

---

## API Documentation (Swagger)

Once the backend is running, access the interactive API documentation at:

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

No authentication required to view the docs.

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
|--------|----------------------|---------------------|---------------|
| POST   | `/api/auth/register` | Register new user   | No            |
| POST   | `/api/auth/login`    | Login               | No            |
| POST   | `/api/auth/refresh`  | Refresh access token| No (cookie)   |
| POST   | `/api/auth/logout`   | Logout              | No            |
| GET    | `/api/auth/me`       | Get current user    | Yes           |

### Leads

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| GET    | `/api/leads`          | List/search leads        | Yes           |
| GET    | `/api/leads/{id}`     | Get lead by ID           | Yes           |
| POST   | `/api/leads`          | Create a new lead        | Yes           |
| PUT    | `/api/leads/{id}`     | Update a lead            | Yes           |
| DELETE | `/api/leads/{id}`     | Delete a lead            | Yes           |
| GET    | `/api/leads/dashboard`| Get dashboard statistics | Yes           |

**Query Parameters for `GET /api/leads`:**

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `search` | string | Search by name, company, or email    |
| `status` | string | Filter by status (NEW, CONTACTED, etc.) |

---
