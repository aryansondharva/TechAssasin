# TechAssassin - Quick Start Guide

Get the TechAssassin frontend and backend running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free tier works)
- A Resend account (free tier works)

---

## Step 1: Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `backend/.env.local` with your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
```

**Get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Go to Settings → API
4. Copy URL and keys

**Get Resend API key:**
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Go to API Keys
4. Create and copy key

---

## Step 2: Run Database Migrations

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Option B: Manual (via Supabase Dashboard)**

1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file from `backend/supabase/migrations/` in order
3. See `backend/DATABASE_MIGRATION_GUIDE.md` for details

---

## Step 3: Start Backend

```bash
# From backend directory
npm run dev
```

Backend runs on: `http://localhost:3000`

**Verify it's working:**
```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"ok","timestamp":"...","message":"..."}`

---

## Step 4: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd Client

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `Client/.env.local`:
```bash
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Supabase Configuration (same as backend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Application Configuration
VITE_APP_NAME=TechAssassin
VITE_APP_URL=http://localhost:8080
VITE_DEBUG=true
```

---

## Step 5: Start Frontend

```bash
# From Client directory
npm run dev
```

Frontend runs on: `http://localhost:8080`

---

## Step 6: Test the Integration

1. Open browser to `http://localhost:8080`
2. Open browser console (F12)
3. Navigate around the app
4. Check Network tab for API requests
5. Try signing up for an account

---

## Troubleshooting

### Backend won't start

**Check:**
- Environment variables are set correctly
- Supabase project is active
- Port 3000 is not in use

**Fix:**
```bash
# Check if port is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process if needed
```

### Frontend can't connect to backend

**Check:**
- Backend is running on port 3000
- `VITE_API_URL` is set to `http://localhost:3000/api`
- No CORS errors in browser console

**Fix:**
```bash
# Restart both servers
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd Client
npm run dev
```

### CORS errors

**Check:**
- Backend `middleware.ts` includes `http://localhost:8080`
- Both servers are running
- No typos in URLs

**Fix:**
- Restart both servers
- Clear browser cache
- Check `backend/middleware.ts` has correct origins

### Database connection fails

**Check:**
- Supabase project is active
- Credentials are correct
- Migrations have been run

**Fix:**
```bash
# Test Supabase connection
curl https://xxxxx.supabase.co/rest/v1/

# Re-run migrations
cd backend
supabase db push
```

---

## Next Steps

Now that everything is running:

1. **Create an admin user:**
   - Sign up through the UI
   - Manually set `is_admin = true` in Supabase Dashboard → Table Editor → profiles

2. **Create test data:**
   - Create an event (as admin)
   - Register for the event (as regular user)
   - Test all features

3. **Explore the code:**
   - Frontend: `Client/src/`
   - Backend: `backend/app/api/`
   - API docs: `backend/API.md`

4. **Read the guides:**
   - Integration: `FRONTEND_BACKEND_INTEGRATION.md`
   - Backend setup: `backend/SETUP.md`
   - Deployment: `backend/DEPLOYMENT.md`

---

## Development Workflow

### Daily Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd Client
npm run dev

# Terminal 3 - Tests (optional)
cd backend
npm test -- --watch
```

### Making Changes

**Backend changes:**
1. Edit files in `backend/app/api/` or `backend/lib/`
2. Backend auto-reloads
3. Test with curl or frontend

**Frontend changes:**
1. Edit files in `Client/src/`
2. Frontend auto-reloads
3. Check browser for changes

**Database changes:**
1. Create new migration in `backend/supabase/migrations/`
2. Run `supabase db push`
3. Update types if needed

---

## Common Commands

### Backend

```bash
# Development
npm run dev

# Build
npm run build

# Tests
npm test
npm run test:watch

# Migrations
supabase db push
supabase db reset
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build
npm run build:dev

# Preview build
npm run preview

# Tests
npm test
npm run test:watch

# Lint
npm run lint
```

---

## Project Structure

```
TechAssassin/
├── backend/              # Next.js API backend
│   ├── app/api/         # API routes
│   ├── lib/             # Business logic
│   ├── supabase/        # Database migrations
│   └── .env.local       # Backend environment variables
│
├── Client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   ├── lib/         # Utilities
│   │   └── types/       # TypeScript types
│   └── .env.local       # Frontend environment variables
│
└── Documentation files
```

---

## Getting Help

- **Integration issues:** See `FRONTEND_BACKEND_INTEGRATION.md`
- **Backend setup:** See `backend/SETUP.md`
- **API reference:** See `backend/API.md`
- **Deployment:** See `backend/DEPLOYMENT.md`

---

## Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 8080
- [ ] Health check returns OK
- [ ] Can sign up for account
- [ ] Can sign in
- [ ] Can view events list
- [ ] No CORS errors
- [ ] No console errors

If all checked, you're ready to develop! 🎉

---

**Quick Start Version:** 1.0  
**Last Updated:** February 8, 2026
