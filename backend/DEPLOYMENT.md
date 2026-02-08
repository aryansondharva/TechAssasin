# TechAssassin Backend - Deployment Guide

This guide covers deploying the TechAssassin backend to production on Vercel with Supabase and Resend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Production Environment Setup](#production-environment-setup)
- [Supabase Production Configuration](#supabase-production-configuration)
- [Resend Production Configuration](#resend-production-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Database Migration Process](#database-migration-process)
- [Post-Deployment Verification](#post-deployment-verification)
- [CORS Configuration](#cors-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Completed local development and testing
- ✅ All tests passing (`npm test`)
- ✅ Vercel account (free tier available)
- ✅ Production Supabase project created
- ✅ Production Resend account with verified domain
- ✅ Git repository with latest code
- ✅ Domain name (optional, but recommended)

---

## Production Environment Setup

### 1. Create Production Supabase Project

**Important**: Use a separate Supabase project for production, distinct from development.

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: TechAssassin Production
   - **Database Password**: Generate a strong password (save in password manager!)
   - **Region**: Choose the region closest to your primary users
   - **Pricing Plan**: Start with Free tier, upgrade as needed
5. Click "Create new project" and wait 2-3 minutes

### 2. Configure Production Database

**Security Best Practices:**
- Use strong, unique passwords
- Enable database backups (Settings > Database > Backups)
- Set up connection pooling for better performance
- Monitor database usage regularly

### 3. Production vs Development Separation

| Environment | Purpose | Data | Configuration |
|------------|---------|------|---------------|
| Development | Local testing | Test data | `.env.local` |
| Staging | Pre-production testing | Sanitized production data | Vercel preview |
| Production | Live application | Real user data | Vercel production |

---

## Supabase Production Configuration

### Step 1: Get Production API Keys

1. In your production Supabase project, go to **Settings > API**
2. Copy these values (you'll need them for Vercel):
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (KEEP SECRET!)
   ```

### Step 2: Configure Authentication

1. Go to **Authentication > URL Configuration**
2. Set **Site URL** to your production domain:
   ```
   https://yourdomain.com
   ```
3. Add **Redirect URLs**:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/auth/confirm
   ```

4. Configure **Email Templates** (Authentication > Email Templates):
   - Update all templates with your production domain
   - Customize branding and messaging
   - Test email delivery

### Step 3: Configure OAuth Providers (if using)

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App:
   - **Application name**: TechAssassin Production
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://xxxxx.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret
4. In Supabase, go to **Authentication > Providers > GitHub**
5. Enable and add credentials

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
6. In Supabase, go to **Authentication > Providers > Google**
7. Enable and add credentials

### Step 4: Configure Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create buckets (if not created via migrations):
   - `avatars` (Public)
   - `event-images` (Public)
   - `sponsor-logos` (Public)

3. Verify storage policies are applied (should be set via migrations)

### Step 5: Enable Realtime

1. Go to **Database > Replication**
2. Enable replication for:
   - `events`
   - `registrations`
   - `announcements`
   - `leaderboard`

### Step 6: Configure Database Backups

1. Go to **Settings > Database**
2. Enable **Point-in-Time Recovery** (PITR) if on Pro plan
3. Configure backup schedule
4. Test restore procedure in development

---

## Resend Production Configuration

### Step 1: Verify Your Domain

**Important**: Production emails require a verified domain.

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `techassassin.com`)
4. Add DNS records to your domain registrar:
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [provided by Resend]
   
   Type: TXT  
   Name: @
   Value: [provided by Resend]
   ```
5. Wait for verification (can take up to 48 hours)
6. Verify status shows "Verified" in Resend dashboard

### Step 2: Create Production API Key

1. Go to **API Keys** in Resend dashboard
2. Click "Create API Key"
3. Name: "TechAssassin Production"
4. Permission: "Sending access"
5. Copy the API key immediately (you won't see it again!)
6. Store securely in password manager

### Step 3: Update Email Configuration

Update `backend/lib/email/resend.ts` to use your verified domain:

```typescript
from: 'TechAssassin <noreply@yourdomain.com>'
```

### Step 4: Configure Email Limits

Free tier limits:
- 3,000 emails per month
- 100 emails per day

Monitor usage in Resend dashboard and upgrade if needed.

---

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project

```bash
cd backend
vercel link
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account/team
- Link to existing project? **N** (first time)
- Project name? **techassassin-backend**
- In which directory is your code? **./backend** or **./** (if already in backend/)

### Step 4: Configure Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings**

**Build & Development Settings:**
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Development Command: `npm run dev`

**Root Directory:**
- If deploying from monorepo, set to `backend`
- Otherwise leave as `./`

### Step 5: Deploy to Production

```bash
vercel --prod
```

This will:
1. Build your application
2. Upload to Vercel
3. Deploy to production URL
4. Return deployment URL

---

## Environment Variables Configuration

### Required Environment Variables

Configure these in Vercel Dashboard > Settings > Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key | Production, Preview, Development |
| `RESEND_API_KEY` | Production Resend API key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://preview-url.vercel.app` | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

### Adding Environment Variables in Vercel

1. Go to **Settings > Environment Variables**
2. For each variable:
   - Click "Add New"
   - Enter **Key** (variable name)
   - Enter **Value** (the actual value)
   - Select environments: **Production**, **Preview**, **Development**
   - Click "Save"

**Security Notes:**
- ✅ `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public keys)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is server-only (never expose to client)
- ⚠️ `RESEND_API_KEY` is server-only (never expose to client)

### Environment-Specific Values

**Production:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Preview (for PR deployments):**
- Use same Supabase project as production OR separate staging project
- Use test Resend API key or production key
- `NEXT_PUBLIC_APP_URL` will be auto-generated by Vercel

### Verifying Environment Variables

After adding variables:
1. Trigger a new deployment
2. Check deployment logs for any missing variables
3. Test API endpoints to ensure they work

---

## Database Migration Process

### Pre-Migration Checklist

- [ ] Backup production database
- [ ] Test migrations in staging environment
- [ ] Review migration files for correctness
- [ ] Plan rollback procedure
- [ ] Schedule during low-traffic period
- [ ] Notify team of maintenance window

### Option 1: Using Supabase CLI (Recommended)

**Setup:**
```bash
npm install -g supabase
supabase login
```

**Link to Production:**
```bash
cd backend
supabase link --project-ref your-production-project-ref
```

**Run Migrations:**
```bash
# Dry run first (check what will be applied)
supabase db push --dry-run

# Apply migrations
supabase db push
```

**Verify:**
```bash
supabase db diff
```

### Option 2: Manual SQL Execution

1. Go to Supabase Dashboard > **SQL Editor**
2. Open each migration file from `backend/supabase/migrations/`
3. Execute in order (files are numbered)
4. Verify each migration succeeds before proceeding

**Migration Order:**
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

### Post-Migration Verification

```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify storage buckets
SELECT * FROM storage.buckets;
```

### Migration Rollback

If migration fails:

1. **Restore from backup:**
   ```bash
   supabase db reset --linked
   ```

2. **Or manually revert:**
   - Drop created tables/functions
   - Restore previous schema
   - Re-run previous migrations

---

## Post-Deployment Verification

### Automated Verification Script

Create `scripts/verify-deployment.sh`:

```bash
#!/bin/bash

API_URL="https://yourdomain.com/api"

echo "🔍 Verifying TechAssassin Backend Deployment..."

# 1. Health Check
echo "1. Testing health endpoint..."
curl -f "$API_URL/health" || exit 1
echo "✅ Health check passed"

# 2. Database Connection
echo "2. Testing database connection..."
curl -f "$API_URL/events" || exit 1
echo "✅ Database connection working"

# 3. Authentication
echo "3. Testing authentication..."
curl -f -X POST "$API_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}' || exit 1
echo "✅ Authentication endpoint responding"

# 4. Storage
echo "4. Testing storage access..."
curl -f "https://xxxxx.supabase.co/storage/v1/object/public/avatars/test.jpg" || exit 1
echo "✅ Storage accessible"

echo "✅ All verification checks passed!"
```

### Manual Verification Checklist

- [ ] **Health Endpoint**: `GET /api/health` returns 200
- [ ] **Database Connection**: Can query events/profiles
- [ ] **Authentication**: Can sign up/sign in
- [ ] **File Upload**: Can upload avatar/images
- [ ] **Email Sending**: Registration emails are delivered
- [ ] **Real-time**: Subscriptions work correctly
- [ ] **CORS**: Frontend can make requests
- [ ] **Error Handling**: Errors return proper status codes
- [ ] **Rate Limiting**: Rate limits are enforced
- [ ] **Admin Operations**: Admin-only endpoints are protected

### Testing Production API

```bash
# Health check
curl https://yourdomain.com/api/health

# List events
curl https://yourdomain.com/api/events

# Sign up (should work)
curl -X POST https://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Create event without auth (should fail with 401)
curl -X POST https://yourdomain.com/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event"}'
```

---

## CORS Configuration

### Next.js CORS Setup

Create `backend/middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get origin from request
  const origin = request.headers.get('origin')
  
  // Define allowed origins
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000', // Development
    'http://localhost:3001', // Development (frontend)
  ]
  
  // Check if origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin)
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }
  
  // Handle actual requests
  const response = NextResponse.next()
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

// Configure which routes use this middleware
export const config = {
  matcher: '/api/:path*',
}
```

### Supabase CORS Configuration

Supabase handles CORS automatically, but verify:

1. Go to **Settings > API**
2. Check **CORS Allowed Origins**
3. Add your frontend domain if needed

---

## Monitoring and Maintenance

### Vercel Analytics

1. Go to **Analytics** tab in Vercel dashboard
2. Monitor:
   - Request volume
   - Response times
   - Error rates
   - Geographic distribution

### Supabase Monitoring

1. Go to **Reports** in Supabase dashboard
2. Monitor:
   - Database size
   - API requests
   - Storage usage
   - Active connections

### Resend Monitoring

1. Go to **Logs** in Resend dashboard
2. Monitor:
   - Email delivery rate
   - Bounce rate
   - Monthly usage

### Setting Up Alerts

**Vercel:**
- Configure deployment notifications
- Set up error alerts via integrations

**Supabase:**
- Enable email alerts for high usage
- Monitor database performance

**Resend:**
- Set up bounce notifications
- Monitor delivery failures

### Regular Maintenance Tasks

**Daily:**
- Check error logs
- Monitor API response times
- Review email delivery rates

**Weekly:**
- Review database performance
- Check storage usage
- Analyze user activity

**Monthly:**
- Review and optimize slow queries
- Clean up unused storage files
- Update dependencies
- Review security policies

---

## Rollback Procedures

### Vercel Rollback

**Option 1: Via Dashboard**
1. Go to **Deployments** tab
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

**Option 2: Via CLI**
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Database Rollback

**If migration fails:**
1. Restore from backup:
   ```bash
   supabase db reset --linked
   ```

2. Or use Point-in-Time Recovery (Pro plan):
   - Go to **Settings > Database > Backups**
   - Select restore point
   - Confirm restoration

**If data corruption:**
1. Identify affected tables
2. Restore from latest backup
3. Re-apply recent changes manually

### Emergency Procedures

**Complete Outage:**
1. Check Vercel status page
2. Check Supabase status page
3. Review recent deployments
4. Rollback to last known good state
5. Notify users via status page

**Data Breach:**
1. Immediately rotate all API keys
2. Review access logs
3. Notify affected users
4. Update security policies
5. Conduct security audit

---

## Troubleshooting

### Common Deployment Issues

#### 1. Build Fails on Vercel

**Symptoms:** Deployment fails during build step

**Solutions:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles locally: `npm run build`
- Check for environment-specific code

#### 2. Environment Variables Not Working

**Symptoms:** API returns errors about missing configuration

**Solutions:**
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Check which environments variables are applied to

#### 3. Database Connection Fails

**Symptoms:** API returns database connection errors

**Solutions:**
- Verify Supabase project is active
- Check API keys are correct
- Ensure migrations have been run
- Verify RLS policies allow access

#### 4. CORS Errors

**Symptoms:** Frontend can't make requests to API

**Solutions:**
- Add frontend domain to CORS allowed origins
- Check middleware configuration
- Verify preflight requests are handled
- Test with curl to isolate issue

#### 5. Email Sending Fails

**Symptoms:** Emails not being delivered

**Solutions:**
- Verify Resend API key is correct
- Check domain is verified
- Review Resend logs for errors
- Ensure sender email uses verified domain
- Check email templates are valid

#### 6. File Upload Fails

**Symptoms:** Avatar/image uploads return errors

**Solutions:**
- Verify storage buckets exist
- Check storage policies allow uploads
- Ensure file size is under limit (2MB)
- Verify file type is allowed
- Check storage quota not exceeded

### Getting Help

**Vercel Support:**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- Support: Available on Pro plan

**Supabase Support:**
- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Community: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- Support: support@supabase.io

**Resend Support:**
- Documentation: [resend.com/docs](https://resend.com/docs)
- Support: support@resend.com

---

## Security Best Practices

### API Keys and Secrets

- ✅ Never commit secrets to Git
- ✅ Use environment variables for all secrets
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use different keys for dev/staging/production
- ✅ Store keys in password manager
- ✅ Limit key permissions to minimum required

### Database Security

- ✅ Enable Row Level Security on all tables
- ✅ Use service role key only server-side
- ✅ Regularly review and update RLS policies
- ✅ Enable database backups
- ✅ Monitor for suspicious activity
- ✅ Use strong database passwords

### Application Security

- ✅ Validate all user inputs
- ✅ Sanitize data before database queries
- ✅ Implement rate limiting
- ✅ Use HTTPS only (enforced by Vercel)
- ✅ Keep dependencies updated
- ✅ Regular security audits

---

## Performance Optimization

### Vercel Configuration

**Edge Functions:**
- Consider using Edge Runtime for faster response times
- Configure in `next.config.js`:
  ```javascript
  export const runtime = 'edge'
  ```

**Caching:**
- Use Vercel's CDN for static assets
- Configure cache headers appropriately
- Use ISR (Incremental Static Regeneration) where applicable

### Database Optimization

- ✅ Ensure indexes are used (check query plans)
- ✅ Use connection pooling
- ✅ Optimize slow queries
- ✅ Consider read replicas for high traffic (Pro plan)
- ✅ Monitor query performance

### API Optimization

- ✅ Implement pagination for list endpoints
- ✅ Use database indexes for filtered queries
- ✅ Cache frequently accessed data
- ✅ Minimize database round trips
- ✅ Use batch operations where possible

---

## Compliance and Legal

### Data Privacy

- Implement GDPR compliance if serving EU users
- Add privacy policy
- Implement data export/deletion features
- Log data access appropriately

### Terms of Service

- Create and display Terms of Service
- Implement user acceptance flow
- Keep records of acceptance

### Monitoring and Logging

- Log all admin actions
- Monitor for abuse
- Implement audit trails
- Comply with data retention policies

---

## Checklist: Production Deployment

Use this checklist before going live:

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Backup procedures tested
- [ ] Rollback plan documented

### Supabase Setup
- [ ] Production project created
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Realtime enabled
- [ ] Backups configured
- [ ] OAuth providers configured (if using)

### Resend Setup
- [ ] Domain verified
- [ ] Production API key created
- [ ] Email templates tested
- [ ] Sender email configured

### Vercel Setup
- [ ] Project created and linked
- [ ] Environment variables configured
- [ ] Build settings verified
- [ ] Domain configured (if custom)
- [ ] CORS configured

### Post-Deployment
- [ ] Health check passes
- [ ] Database connection works
- [ ] Authentication works
- [ ] File uploads work
- [ ] Emails are delivered
- [ ] Real-time updates work
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] Admin operations protected
- [ ] Monitoring configured
- [ ] Alerts set up

---

## Next Steps After Deployment

1. **Monitor Initial Traffic**
   - Watch for errors in first 24 hours
   - Monitor performance metrics
   - Check email delivery rates

2. **Gather User Feedback**
   - Set up feedback mechanism
   - Monitor support requests
   - Track feature usage

3. **Optimize Based on Data**
   - Identify slow endpoints
   - Optimize database queries
   - Improve caching strategy

4. **Plan for Scale**
   - Monitor free tier limits
   - Plan upgrade path
   - Consider CDN for assets
   - Implement caching layers

---

**Deployment Status:** Ready for Production  
**Last Updated:** February 8, 2026

For setup instructions, see [SETUP.md](./SETUP.md)  
For API documentation, see [API.md](./API.md)
