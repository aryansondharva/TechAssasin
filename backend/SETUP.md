# TechAssassin Backend - Setup Guide

This guide will walk you through setting up the TechAssassin backend for local development and production deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Resend Setup](#resend-setup)
- [Local Development Setup](#local-development-setup)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Supabase Account**: Free tier available at [supabase.com](https://supabase.com)
- **Resend Account**: Free tier available at [resend.com](https://resend.com)

---

## Environment Variables

The application requires several environment variables to function. Create a `.env.local` file in the `backend/` directory with the following variables:

### Required Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key

# Optional: Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Variable Descriptions

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL (found in Project Settings > API)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public anonymous key for client-side operations (found in Project Settings > API)
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key for server-side admin operations (found in Project Settings > API) - **Keep this secret!**
- **RESEND_API_KEY**: Your Resend API key for sending emails (found in Resend Dashboard > API Keys)
- **NEXT_PUBLIC_APP_URL**: The base URL of your application (used for email links)

**Important**: Never commit `.env.local` to version control. Use `.env.example` as a template.

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: TechAssassin (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for setup to complete (2-3 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy the following values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Authentication

1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable **Email** provider (enabled by default)
3. (Optional) Enable **OAuth providers** (GitHub, Google):
   - Click on the provider
   - Follow the setup instructions
   - Add your OAuth app credentials

### 4. Configure Email Templates (Optional)

1. Go to **Authentication > Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

### 5. Run Database Migrations

The database schema is defined in SQL migration files located in `backend/supabase/migrations/`.

**Option A: Using Supabase CLI (Recommended)**

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   cd backend
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

**Option B: Using SQL Editor**

1. Go to **SQL Editor** in your Supabase dashboard
2. Open each migration file from `backend/supabase/migrations/` in order
3. Copy and paste the SQL into the editor
4. Click "Run" for each migration

**Migration Files (in order)**:
1. `20260207000001_create_profiles_table.sql`
2. `20260207000002_create_events_table.sql`
3. `20260207000003_create_registrations_table.sql`
4. `20260207000004_create_announcements_table.sql`
5. `20260207000005_create_resources_table.sql`
6. `20260207000006_create_sponsors_table.sql`
7. `20260207000007_create_leaderboard_table.sql`
8. `20260207000008_create_profile_trigger.sql`
9. `20260207000009_enable_rls_policies.sql`
10. `20260207000010_create_storage_buckets.sql`
11. `20260207000011_enable_realtime.sql`

### 6. Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:
   - **avatars** (Public bucket)
   - **event-images** (Public bucket)
   - **sponsor-logos** (Public bucket)

3. For each bucket, set the following policies:
   - **Public read access**: Allow anyone to read files
   - **Authenticated upload**: Allow authenticated users to upload (with path restrictions)

### 7. Enable Realtime

1. Go to **Database > Replication** in your Supabase dashboard
2. Enable replication for the following tables:
   - `events`
   - `registrations`
   - `announcements`
   - `leaderboard`

---

## Resend Setup

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### 2. Get Your API Key

1. In the Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Give it a name (e.g., "TechAssassin Development")
4. Copy the API key to your `.env.local` as `RESEND_API_KEY`

**Important**: Save this key immediately - you won't be able to see it again!

### 3. Verify Your Domain (Production Only)

For production, you'll need to verify your sending domain:

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `techassassin.com`)
4. Add the provided DNS records to your domain registrar
5. Wait for verification (can take up to 48 hours)

For development, you can use Resend's test mode which sends to your verified email only.

### 4. Configure Email Sender

Update the email sender in `backend/lib/email/resend.ts`:

```typescript
from: 'TechAssassin <noreply@yourdomain.com>'
```

For development, use:
```typescript
from: 'TechAssassin <onboarding@resend.dev>'
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/techassassin.git
cd techassassin/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local` file with your Supabase and Resend credentials (see [Environment Variables](#environment-variables) section).

### 4. Verify Setup

Run the setup verification tests:

```bash
npm test lib/utils/setup.test.ts
```

All tests should pass.

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### 6. Verify API is Running

Open your browser or use curl:

```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-02-08T...",
  "message": "TechAssassin API is running"
}
```

---

## Database Migrations

### Creating New Migrations

When you need to modify the database schema:

1. Create a new migration file in `backend/supabase/migrations/`:
   ```
   YYYYMMDDHHMMSS_description.sql
   ```

2. Write your SQL changes in the file

3. Test locally using Supabase CLI:
   ```bash
   supabase db reset  # Reset local database
   supabase db push   # Apply migrations
   ```

4. Apply to production:
   ```bash
   supabase db push --project-ref your-production-ref
   ```

### Migration Best Practices

- Always use migrations for schema changes (never modify database directly)
- Test migrations locally before applying to production
- Include rollback instructions in migration comments
- Keep migrations small and focused
- Use descriptive names for migration files

---

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Database Setup

For integration tests that require database access:

1. Create a separate Supabase project for testing
2. Add test environment variables to `.env.test.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_test_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_test_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_test_service_role_key
   ```

3. Run migrations on test database
4. Use `lib/utils/test-db.ts` utilities for test data setup/cleanup

---

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd backend
   vercel
   ```

4. **Configure Environment Variables**:
   - Go to your project in Vercel dashboard
   - Navigate to **Settings > Environment Variables**
   - Add all required environment variables from `.env.local`
   - Make sure to add them for Production, Preview, and Development environments

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Environment-Specific Configuration

**Development**:
- Use test Supabase project
- Use Resend test mode
- Enable verbose logging

**Production**:
- Use production Supabase project
- Use verified Resend domain
- Disable verbose logging
- Enable error tracking (e.g., Sentry)

---

## Troubleshooting

### Common Issues

#### 1. "Supabase client error: Invalid API key"

**Solution**: Check that your environment variables are correctly set in `.env.local` and that you've restarted the development server.

#### 2. "Database connection failed"

**Solution**: 
- Verify your Supabase project is active
- Check that migrations have been run
- Ensure your IP is not blocked by Supabase

#### 3. "Email sending failed"

**Solution**:
- Verify your Resend API key is correct
- Check that you're using a verified sender domain (or test mode)
- Review Resend dashboard for error logs

#### 4. "Authentication not working"

**Solution**:
- Verify Supabase Auth is enabled
- Check that email provider is configured
- Ensure RLS policies are correctly set up

#### 5. "File upload fails"

**Solution**:
- Verify storage buckets exist in Supabase
- Check storage policies allow uploads
- Ensure file size is under 2MB
- Verify file type is allowed (jpg, png, webp)

### Debug Mode

Enable debug logging by adding to `.env.local`:

```bash
NODE_ENV=development
DEBUG=true
```

### Getting Help

- **Documentation**: See `API.md` for API reference
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## ✅ Completed Setup Tasks

### 1. Next.js 14 Project Initialization
- ✅ Next.js 14 with TypeScript
- ✅ App Router enabled
- ✅ Project created in `backend/` directory

### 2. Dependencies Installed

#### Production Dependencies
- ✅ `@supabase/auth-helpers-nextjs` - Supabase authentication helpers
- ✅ `@supabase/supabase-js` - Supabase JavaScript client
- ✅ `zod` - Runtime type validation
- ✅ `resend` - Email service
- ✅ `next` - Next.js framework
- ✅ `react` & `react-dom` - React libraries

#### Development Dependencies
- ✅ `fast-check` - Property-based testing
- ✅ `vitest` - Testing framework
- ✅ `@vitest/ui` - Vitest UI
- ✅ `typescript` - TypeScript compiler
- ✅ Type definitions for Node, React, and React DOM

### 3. Directory Structure Created

```
backend/
├── app/
│   ├── api/              ✅ API routes directory
│   │   └── health/       ✅ Health check endpoint
│   └── ...               ✅ Next.js app files
├── lib/                  ✅ Business logic directory
│   ├── email/            ✅ Email service modules
│   ├── errors/           ✅ Error handling utilities
│   ├── middleware/       ✅ Authentication middleware
│   ├── services/         ✅ Business logic services
│   ├── storage/          ✅ Storage utilities
│   ├── supabase/         ✅ Supabase client configuration
│   ├── utils/            ✅ Utility functions
│   └── validations/      ✅ Zod validation schemas
├── types/                ✅ TypeScript type definitions
│   └── database.ts       ✅ Database type interfaces
├── .env.local            ✅ Environment variables (gitignored)
├── .env.example          ✅ Environment variables template
├── vitest.config.ts      ✅ Vitest configuration
├── tsconfig.json         ✅ TypeScript configuration
└── package.json          ✅ Package configuration with test scripts
```

### 4. Environment Variables Configured
- ✅ `.env.local` created with placeholders for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
- ✅ `.env.example` created for documentation
- ✅ `.gitignore` configured to exclude `.env*.local`

### 5. TypeScript Configuration
- ✅ Strict mode enabled (`"strict": true`)
- ✅ Path aliases configured (`@/*`)
- ✅ ES modules and JSX configured
- ✅ Type checking working correctly

### 6. Testing Setup
- ✅ Vitest configured with Node environment
- ✅ Test scripts added to package.json:
  - `npm test` - Run tests once
  - `npm run test:watch` - Watch mode
  - `npm run test:ui` - UI mode
  - `npm run test:coverage` - Coverage report
- ✅ fast-check integrated for property-based testing
- ✅ Setup verification tests passing (4/4)

### 7. Build Verification
- ✅ Production build successful
- ✅ No TypeScript errors
- ✅ API routes compiled correctly
- ✅ Static pages generated

### 8. API Structure
- ✅ Health check endpoint created at `/api/health`
- ✅ Returns JSON with status, timestamp, and message

## 🧪 Test Results

All setup verification tests passed:
```
✓ lib/utils/setup.test.ts (4 tests)
  ✓ Project Setup (4)
    ✓ should have TypeScript configured correctly
    ✓ should have Vitest working
    ✓ should have fast-check working for property-based testing
    ✓ should have Zod available

Test Files  1 passed (1)
     Tests  4 passed (4)
```

## 📋 Next Steps

1. **Configure Supabase**:
   - Create a Supabase project
   - Update `.env.local` with actual Supabase credentials
   - Run database migrations (Task 2)

2. **Configure Resend**:
   - Create a Resend account
   - Get API key
   - Update `.env.local` with Resend API key

3. **Start Development**:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`

4. **Verify Health Endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📦 Package Versions

- Next.js: 14.2.35
- TypeScript: 5.x
- Vitest: 4.0.18
- fast-check: 4.5.3
- Zod: 4.3.6
- Supabase JS: 2.95.3
- Resend: 6.9.1

## ✨ Features Ready

- ✅ TypeScript with strict mode
- ✅ Next.js 14 App Router
- ✅ API route structure
- ✅ Testing framework with property-based testing
- ✅ Environment variable management
- ✅ Type-safe database interfaces
- ✅ Organized directory structure for scalability

---

**Status**: ✅ Project setup complete and verified
**Date**: February 7, 2026


### 1. Next.js 14 Project Initialization
- ✅ Next.js 14 with TypeScript
- ✅ App Router enabled
- ✅ Project created in `backend/` directory

### 2. Dependencies Installed

#### Production Dependencies
- ✅ `@supabase/auth-helpers-nextjs` - Supabase authentication helpers
- ✅ `@supabase/supabase-js` - Supabase JavaScript client
- ✅ `zod` - Runtime type validation
- ✅ `resend` - Email service
- ✅ `next` - Next.js framework
- ✅ `react` & `react-dom` - React libraries

#### Development Dependencies
- ✅ `fast-check` - Property-based testing
- ✅ `vitest` - Testing framework
- ✅ `@vitest/ui` - Vitest UI
- ✅ `typescript` - TypeScript compiler
- ✅ Type definitions for Node, React, and React DOM

### 3. Directory Structure Created

```
backend/
├── app/
│   ├── api/              ✅ API routes directory
│   │   ├── announcements/
│   │   ├── auth/
│   │   ├── events/
│   │   ├── health/
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   ├── registrations/
│   │   ├── resources/
│   │   └── sponsors/
│   └── ...               ✅ Next.js app files
├── lib/                  ✅ Business logic directory
│   ├── email/            ✅ Email service modules
│   ├── errors/           ✅ Error handling utilities
│   ├── middleware/       ✅ Authentication middleware
│   ├── services/         ✅ Business logic services
│   ├── storage/          ✅ Storage utilities
│   ├── supabase/         ✅ Supabase client configuration
│   ├── utils/            ✅ Utility functions
│   └── validations/      ✅ Zod validation schemas
├── supabase/
│   └── migrations/       ✅ Database migration files
├── types/                ✅ TypeScript type definitions
│   └── database.ts       ✅ Database type interfaces
├── .env.local            ✅ Environment variables (gitignored)
├── .env.example          ✅ Environment variables template
├── API.md                ✅ API documentation
├── SETUP.md              ✅ Setup guide (this file)
├── vitest.config.ts      ✅ Vitest configuration
├── tsconfig.json         ✅ TypeScript configuration
└── package.json          ✅ Package configuration with test scripts
```

### 4. Environment Variables Configured
- ✅ `.env.local` created with placeholders for:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
- ✅ `.env.example` created for documentation
- ✅ `.gitignore` configured to exclude `.env*.local`

### 5. TypeScript Configuration
- ✅ Strict mode enabled (`"strict": true`)
- ✅ Path aliases configured (`@/*`)
- ✅ ES modules and JSX configured
- ✅ Type checking working correctly

### 6. Testing Setup
- ✅ Vitest configured with Node environment
- ✅ Test scripts added to package.json:
  - `npm test` - Run tests once
  - `npm run test:watch` - Watch mode
  - `npm run test:ui` - UI mode
  - `npm run test:coverage` - Coverage report
- ✅ fast-check integrated for property-based testing
- ✅ Setup verification tests passing (4/4)

### 7. Build Verification
- ✅ Production build successful
- ✅ No TypeScript errors
- ✅ API routes compiled correctly
- ✅ Static pages generated

### 8. API Structure
- ✅ Health check endpoint created at `/api/health`
- ✅ Returns JSON with status, timestamp, and message
- ✅ All CRUD endpoints implemented for:
  - Authentication
  - Profiles
  - Events
  - Registrations
  - Announcements
  - Resources
  - Sponsors
  - Leaderboard

---

## 📋 Quick Start Checklist

Use this checklist to verify your setup is complete:

- [ ] Node.js 18+ installed
- [ ] Supabase project created
- [ ] Resend account created
- [ ] `.env.local` file created with all required variables
- [ ] Dependencies installed (`npm install`)
- [ ] Database migrations run
- [ ] Storage buckets created
- [ ] Realtime enabled on tables
- [ ] Development server starts (`npm run dev`)
- [ ] Health check endpoint responds (`/api/health`)
- [ ] Tests pass (`npm test`)

---

## 📦 Package Versions

- Next.js: 14.2.35
- TypeScript: 5.x
- Vitest: 4.0.18
- fast-check: 4.5.3
- Zod: 4.3.6
- Supabase JS: 2.95.3
- Resend: 6.9.1

---

## ✨ Features Ready

- ✅ TypeScript with strict mode
- ✅ Next.js 14 App Router
- ✅ Complete API route structure
- ✅ Testing framework with property-based testing
- ✅ Environment variable management
- ✅ Type-safe database interfaces
- ✅ Organized directory structure for scalability
- ✅ Authentication with Supabase Auth
- ✅ Row Level Security policies
- ✅ File upload with Supabase Storage
- ✅ Email notifications with Resend
- ✅ Real-time subscriptions
- ✅ Comprehensive error handling
- ✅ Input validation with Zod
- ✅ Rate limiting
- ✅ Pagination support

---

**Status**: ✅ Project setup complete and verified  
**Last Updated**: February 8, 2026

For API documentation, see [API.md](./API.md)
