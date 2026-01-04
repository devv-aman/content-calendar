# Content Calendar Backend

A Node.js + TypeScript + Express backend API for the Content Calendar application.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod
- **Logging**: Pino
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 20+
- pnpm
- Supabase project
- Supabase CLI (optional, for migrations)

## Installation

1. Clone the repository and navigate to the backend directory:

```bash
cd be
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
NODE_ENV=development
PORT=3001

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_ACCESS_SECRET=your_access_secret_min_32_chars_long
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars_long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

COOKIE_DOMAIN=localhost
COOKIE_SECURE=false

FRONTEND_URL=http://localhost:5173
```

## Database Setup

### Using Supabase CLI (Recommended)

1. Link to your Supabase project:

```bash
npx supabase link --project-ref your-project-ref
```

2. Push migrations to remote database:

```bash
npx supabase db push
```

3. Seed the database with test users:

```bash
pnpm seed
```

### Alternative: Manual SQL

If you prefer not to use Supabase CLI, copy the contents of `supabase/migrations/*.sql` and run in Supabase SQL Editor.

## Running the Application

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

## API Documentation

Once the server is running, access the Swagger documentation at:

- **Swagger UI**: http://localhost:3001/api-docs
- **Swagger JSON**: http://localhost:3001/swagger.json

## Project Structure

```
be/
├── src/
│   ├── config/           # Configuration (env, database, swagger)
│   ├── constants/        # String constants and messages
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Database models/types
│   ├── modules/          # Feature modules (auth, etc.)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── supabase/
│   └── migrations/       # Supabase CLI migrations
├── scripts/              # Utility scripts (seed, swagger)
├── docs/                 # Documentation
└── swagger.json          # OpenAPI specification
```

## API Endpoints

| Method | Endpoint               | Description          | Auth          |
| ------ | ---------------------- | -------------------- | ------------- |
| POST   | `/api/v1/auth/login`   | User login           | No            |
| POST   | `/api/v1/auth/refresh` | Refresh access token | Refresh token |
| POST   | `/api/v1/auth/logout`  | User logout          | Yes           |
| GET    | `/api/v1/auth/me`      | Get current user     | Yes           |
| GET    | `/health`              | Health check         | No            |

## Authentication

This API uses HTTP-only cookies for authentication:

- **Access Token**: Short-lived (15 min default), used for API authentication
- **Refresh Token**: Long-lived (7 days default), used to get new access tokens

Frontend must use `withCredentials: true` in axios/fetch to send cookies.

## Test Credentials

After running the seed script:

| Role  | Email             | Password  |
| ----- | ----------------- | --------- |
| Admin | admin@example.com | Admin@123 |
| User  | user@example.com  | User@123  |

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm seed` - Seed database with test users
- `pnpm swagger:generate` - Generate swagger.json

## License

ISC
