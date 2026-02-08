# TechAssassin Backend

A serverless Next.js 14 backend application for the TechAssassin hackathon community platform.

## 🚧 Development Status

**Current Phase:** Core Infrastructure Complete, API Development In Progress

### ✅ Completed
- Project structure and dependencies
- Complete database schema (7 tables)
- All database migrations
- Row Level Security (RLS) policies
- Supabase Storage buckets and policies
- TypeScript type definitions
- Database schema validation tests
- Test infrastructure setup

### 🔄 In Progress
- Supabase client configuration
- Zod validation schemas
- Authentication middleware
- API route implementations

### 📋 Upcoming
- Profile management API
- Event management API
- Registration system API
- Email service integration
- Real-time subscriptions
- Comprehensive test suite

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Email**: Resend API
- **Testing**: Vitest + fast-check (property-based testing)
- **Deployment**: Vercel

## Project Structure

```
backend/
├── app/
│   ├── api/              # API routes (in progress)
│   │   └── health/       # Health check endpoint ✅
│   └── ...               # Next.js app files
├── lib/                  # Business logic and utilities
│   ├── email/           # Email service (planned)
│   ├── errors/          # Error handling (planned)
│   ├── middleware/      # Auth middleware (planned)
│   ├── services/        # Business services (planned)
│   ├── storage/         # File storage (planned)
│   ├── supabase/        # Supabase clients (planned)
│   ├── utils/           # Utilities ✅
│   └── validations/     # Zod schemas (planned)
├── supabase/
│   └── migrations/      # Database migrations ✅ (17 files)
├── types/
│   └── database.ts      # TypeScript types ✅
├── vitest.config.ts     # Test configuration ✅
├── .env.local           # Environment variables (not committed)
└── .env.example         # Environment variables template
```

## Database Schema

The database includes 7 main tables:
- ✅ **profiles** - Extended user information
- ✅ **events** - Hackathon event details
- ✅ **registrations** - User event registrations
- ✅ **announcements** - Community announcements
- ✅ **resources** - Educational content
- ✅ **sponsors** - Sponsor information
- ✅ **leaderboard** - Event scoring

All tables have:
- ✅ Proper indexes for performance
- ✅ Foreign key constraints
- ✅ Row Level Security policies
- ✅ Validation constraints

## Project Structure

```
backend/
├── app/
│   ├── api/          # API routes
│   └── ...           # Next.js app files
├── lib/              # Business logic and utilities
├── types/            # TypeScript type definitions
├── .env.local        # Environment variables (not committed)
└── .env.example      # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials:
- Supabase URL and keys from your Supabase project settings
- Resend API key from your Resend dashboard

### Development

Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### Testing

Run tests:
```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

**Current Test Status:**
- ✅ Database schema validation tests (passing)
- ✅ Database schema structure tests (passing)
- 🔄 Property-based tests (in development)
- 🔄 API endpoint tests (in development)

### Database Setup

The database migrations are located in `supabase/migrations/`. To set up:

1. Create a Supabase project
2. Go to SQL Editor in your Supabase dashboard
3. Run each migration file in order (they're numbered)

**Migration Files (All Complete ✅):**
- Tables: profiles, events, registrations, announcements, resources, sponsors, leaderboard
- Triggers: Automatic profile creation on user signup
- RLS Policies: Security policies for all tables
- Storage: Buckets and policies for file uploads

See [migrations/README.md](./supabase/migrations/README.md) for detailed documentation.

### Building

Build for production:
```bash
npm run build
```

## Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (server-side only)
- `RESEND_API_KEY`: Your Resend API key for sending emails

## API Documentation

API routes are located in `app/api/` and follow RESTful conventions.

### Current Endpoints
- ✅ `GET /api/health` - Health check endpoint

### Planned Endpoints
- 🔄 Authentication: `/api/auth/*`
- 🔄 Profiles: `/api/profile/*`
- 🔄 Events: `/api/events/*`
- 🔄 Registrations: `/api/registrations/*`
- 🔄 Announcements: `/api/announcements/*`
- 🔄 Resources: `/api/resources/*`
- 🔄 Sponsors: `/api/sponsors/*`
- 🔄 Leaderboard: `/api/leaderboard/*`

Full API documentation will be available in `API.md` once implementation is complete.

## Development Workflow

1. **Database First**: All database changes go through migrations
2. **Type Safety**: TypeScript types are defined in `types/database.ts`
3. **Validation**: Input validation using Zod schemas
4. **Testing**: Both unit tests and property-based tests
5. **Security**: Row Level Security enforced at database level

## Deployment

### Quick Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd backend
vercel --prod
```

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for quick start guide.

### Comprehensive Deployment Guide

For detailed production deployment instructions including:
- Supabase production setup
- Resend configuration
- Environment variables
- Database migrations
- CORS configuration
- Post-deployment verification
- Monitoring and maintenance

See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Database Migrations

To run database migrations on your Supabase instance:

```bash
# Using Supabase CLI (recommended)
supabase link --project-ref your-project-ref
supabase db push

# Or manually via SQL Editor
# See DATABASE_MIGRATION_GUIDE.md for detailed instructions
```

See [DATABASE_MIGRATION_GUIDE.md](./DATABASE_MIGRATION_GUIDE.md) for complete migration guide.

### Production Checklist

Before deploying to production, complete the [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) to ensure:
- All environment variables configured
- Database migrations applied
- Security policies enabled
- Monitoring configured
- Backup procedures in place

## Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions for local development
- [API Documentation](./API.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Comprehensive production deployment guide
- [Vercel Quick Start](./VERCEL_DEPLOYMENT.md) - Quick reference for Vercel deployment
- [Database Migration Guide](./DATABASE_MIGRATION_GUIDE.md) - Database migration procedures
- [Production Checklist](./PRODUCTION_CHECKLIST.md) - Pre-deployment verification checklist
- [Database Migrations](./supabase/migrations/README.md) - Migration file documentation
- [RLS Policies](./supabase/migrations/RLS_POLICIES.md) - Security policy details
- [Database Tests](./lib/utils/DATABASE_TESTS_README.md) - Test documentation

## API Documentation

API routes are located in `app/api/` and follow RESTful conventions.

## License

MIT
