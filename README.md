# JKTECH Backend

A NestJS backend service for user authentication, document management, and ingestion controls.

## Features

- Authentication with JWT
- Role-based access control (Admin, Editor, Viewer)
- Document management with file uploads
- Integration with Python backend for document ingestion
- User management for administrators

## Prerequisites

- Node.js >= 14
- PostgreSQL
- Python backend service (for ingestion)

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sustvest
JWT_SECRET=your-secret-key
PYTHON_BACKEND_URL=http://localhost:5000
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout

### User Management
- PUT `/users/:id/role` - Update user role (Admin only)

### Documents
- POST `/documents` - Upload document
- GET `/documents` - List all documents
- DELETE `/documents/:id` - Delete document

### Ingestion
- POST `/ingestion/trigger` - Trigger document ingestion
- GET `/ingestion/status` - Check ingestion status

## Role Permissions

- Admin: Full system access
- Editor: Document upload and ingestion
- Viewer: Read-only access

## License

MIT