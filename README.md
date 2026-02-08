# TechAssassin Community Platform

A comprehensive hackathon management platform where organizers can create events and participants can register. Features real-time updates, user authentication, file uploads, and more.

## 🚀 Quick Start

Get started in 5 minutes! See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

```bash
# 1. Setup Backend
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev  # Runs on http://localhost:3000

# 2. Setup Frontend (new terminal)
cd Client
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev  # Runs on http://localhost:8080
```

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Frontend-Backend Integration](./FRONTEND_BACKEND_INTEGRATION.md)** - Complete integration guide

### Backend Documentation
- [Setup Guide](./backend/SETUP.md) - Detailed backend setup
- [API Documentation](./backend/API.md) - Complete API reference
- [Deployment Guide](./backend/DEPLOYMENT.md) - Production deployment
- [Database Migrations](./backend/DATABASE_MIGRATION_GUIDE.md) - Migration procedures

### Frontend Documentation
- [Frontend README](./Client/README.md) - Frontend-specific documentation

## 🚧 Project Status

**Current Phase:** ✅ Backend Complete - Frontend Integration Ready

### Completed ✅
- ✅ Complete backend API with all endpoints
- ✅ Database schema and migrations (7 tables)
- ✅ Row Level Security (RLS) policies
- ✅ Supabase Storage buckets and policies
- ✅ Authentication system (email/password, OAuth)
- ✅ Profile management with avatar uploads
- ✅ Event management (CRUD operations)
- ✅ Registration system with capacity limits
- ✅ Announcements, Resources, Sponsors, Leaderboard
- ✅ Email notifications (Resend)
- ✅ Real-time subscriptions (Supabase)
- ✅ File upload handling
- ✅ Error handling and validation
- ✅ Rate limiting
- ✅ TypeScript types and interfaces
- ✅ Comprehensive testing
- ✅ **Frontend-Backend Integration Layer**
- ✅ **API Client and Service Layer**
- ✅ **Deployment Documentation**

### Ready for Development 🎯
- Frontend UI components
- User authentication flows
- Event listing and details pages
- Registration forms
- Admin dashboard
- Real-time updates integration

## What is this?

TechAssassin helps you run hackathons online. Think of it like an event management system specifically for coding competitions.

## Features

### Current Features (Implemented)
- ✅ **Database Schema**: Complete PostgreSQL schema with 7 tables
  - Profiles (user information)
  - Events (hackathon details)
  - Registrations (event sign-ups)
  - Announcements (community updates)
  - Resources (learning materials)
  - Sponsors (event supporters)
  - Leaderboard (competition scores)
- ✅ **Security**: Row Level Security policies on all tables
- ✅ **Storage**: File upload buckets for avatars, event images, and logos
- ✅ **Type Safety**: Complete TypeScript type definitions

### Planned Features
- 🔄 User authentication (email/password, OAuth)
- 🔄 Profile management with avatar uploads
- 🔄 Event creation and management (admin only)
- 🔄 Event registration with capacity limits
- 🔄 Real-time updates for participant counts
- 🔄 Email notifications for registrations
- 🔄 Announcements feed
- 🔄 Resource library
- 🔄 Sponsor showcase
- 🔄 Live leaderboard

## What you can do:
- Create your profile with your skills
- Browse hackathon events
- Register for events you want to join
- See live updates (how many people joined, announcements, scores)
- Access learning resources
- View sponsors

## Folders

```
Community/
├── backend/     # Server code (handles data and logic)
├── Client/      # Website code (what users see)
└── README.md    # This file
```

## Technology Used

**Backend (Server):**
- Next.js - Web framework
- Supabase - Database and user accounts
- TypeScript - Programming language

**Frontend (Website):**
- React - Makes the website interactive
- Tailwind CSS - Makes it look good

## How to Run This Project

### What You Need First
- Node.js (version 18 or newer) - [Download here](https://nodejs.org/)
- A Supabase account (free) - [Sign up here](https://supabase.com/)
- A Resend account (free) - [Sign up here](https://resend.com/)

### Step 1: Download the Code
```bash
git clone <repository-url>
cd Community
```

### Step 2: Setup Backend (Server)
```bash
cd backend
npm install
```

Create a file called `.env.local` in the backend folder and add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
RESEND_API_KEY=your_resend_key_here
```

### Step 3: Setup Database

**✅ Database migrations are ready!**

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Run the migrations in order from `backend/supabase/migrations/`:
   - ✅ `20260207000001_create_profiles_table.sql`
   - ✅ `20260207000002_create_events_table.sql`
   - ✅ `20260207000003_create_registrations_table.sql`
   - ✅ `20260207000004_create_announcements_table.sql`
   - ✅ `20260207000005_create_resources_table.sql`
   - ✅ `20260207000006_create_sponsors_table.sql`
   - ✅ `20260207000007_create_leaderboard_table.sql`
   - ✅ `20260207000008_create_profile_trigger.sql`
   - ✅ `20260207000009_create_rls_policies_profiles.sql`
   - ✅ `20260207000010_create_rls_policies_events.sql`
   - ✅ `20260207000011_create_rls_policies_registrations.sql`
   - ✅ `20260207000012_create_rls_policies_announcements.sql`
   - ✅ `20260207000013_create_rls_policies_resources.sql`
   - ✅ `20260207000014_create_rls_policies_sponsors.sql`
   - ✅ `20260207000015_create_rls_policies_leaderboard.sql`
   - ✅ `20260207000016_create_storage_buckets.sql`
   - ✅ `20260207000017_create_storage_policies.sql`

**Note:** The database schema is complete and tested!

### Step 4: Setup Frontend (Website)
```bash
cd ../Client
npm install
```

### Step 5: Run Everything

**Start the server:**
```bash
cd backend
npm run dev
```
Server runs at: http://localhost:3000

**Start the website (in a new terminal):**
```bash
cd Client
npm run dev
```
Website runs at: http://localhost:5173

## Testing

### Backend Tests

The backend includes comprehensive testing:

**✅ Completed Tests:**
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

**Current Test Coverage:**
- ✅ Database schema validation tests
- ✅ Database schema structure tests
- 🔄 Property-based tests (in progress)
- 🔄 API endpoint tests (in progress)

### Test Results
All database schema tests are passing! ✅

## Development Progress

For detailed implementation progress, see:
- [Requirements Document](./.kiro/specs/techassassin-backend/requirements.md)
- [Design Document](./.kiro/specs/techassassin-backend/design.md)
- [Task List](./.kiro/specs/techassassin-backend/tasks.md)

**Completed Tasks:** 5 / 28 major tasks
- ✅ Task 1: Project setup
- ✅ Task 2: Database schema and migrations
- ✅ Task 3: Row Level Security policies
- ✅ Task 4: Storage buckets and policies
- ✅ Task 5: TypeScript types and interfaces

## Want to Contribute?

1. Fork this project
2. Make your changes
3. Submit a pull request

We welcome all contributions!

## License

MIT License - feel free to use this project

---

Made for hackathon organizers and participants 🚀
