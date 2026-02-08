# Quick Start: Vercel Deployment

This is a quick reference guide for deploying TechAssassin backend to Vercel. For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites

- ✅ Vercel account ([sign up free](https://vercel.com/signup))
- ✅ Production Supabase project configured
- ✅ Production Resend API key
- ✅ All tests passing locally
- ✅ Code pushed to Git repository

## Quick Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from Backend Directory

```bash
cd backend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time)
- **Project name?** → techassassin-backend
- **In which directory is your code?** → ./ (or ./backend if in root)

### 4. Configure Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 5. Deploy to Production

```bash
vercel --prod
```

### 6. Verify Deployment

```bash
# Test health endpoint
curl https://your-deployment-url.vercel.app/api/health

# Should return:
# {"status":"ok","timestamp":"...","message":"TechAssassin API is running"}
```

## Environment Variables Reference

| Variable | Where to Get It | Environment |
|----------|----------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (⚠️ Keep Secret!) | All |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | All |
| `NEXT_PUBLIC_APP_URL` | Your production domain | Production |

## Common Issues

### Build Fails

**Problem:** Deployment fails during build step

**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Review build logs in Vercel dashboard
```

### Environment Variables Not Working

**Problem:** API returns errors about missing configuration

**Solution:**
1. Verify variables are set in Vercel Dashboard → Settings → Environment Variables
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables: `vercel --prod`

### Database Connection Fails

**Problem:** API returns database connection errors

**Solution:**
1. Verify Supabase project is active
2. Check API keys are correct in Vercel
3. Ensure migrations have been run on production database
4. Test connection from Supabase SQL Editor

### CORS Errors

**Problem:** Frontend can't make requests to API

**Solution:**
1. Update `backend/middleware.ts` with your frontend domain
2. Redeploy: `vercel --prod`
3. Clear browser cache
4. Test with curl to isolate issue

## Deployment Commands

```bash
# Deploy to preview (automatic URL)
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Rollback to previous deployment
vercel rollback [deployment-url]

# Remove deployment
vercel rm [deployment-url]
```

## Custom Domain Setup

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Click "Add"

### 2. Configure DNS

Add these records to your domain registrar:

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For subdomain (api.yourdomain.com):**
```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### 3. Verify Domain

- Wait for DNS propagation (can take up to 48 hours)
- Vercel will automatically issue SSL certificate
- Domain status will show "Valid" when ready

## Post-Deployment Checklist

- [ ] Health endpoint responds: `GET /api/health`
- [ ] Database connection works: `GET /api/events`
- [ ] Authentication works: `POST /api/auth/signup`
- [ ] File uploads work: `POST /api/profile/avatar`
- [ ] Emails are sent: Test registration
- [ ] CORS works: Test from frontend
- [ ] Error handling works: Test invalid requests
- [ ] Rate limiting works: Test registration endpoint
- [ ] Admin operations protected: Test without admin role

## Monitoring

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Logs for specific deployment
vercel logs [deployment-url]
```

### Analytics

Go to Vercel Dashboard → Your Project → Analytics to view:
- Request volume
- Response times
- Error rates
- Geographic distribution

## Rollback

If something goes wrong:

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [previous-deployment-url]
```

Or use Vercel Dashboard:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

## CI/CD Integration

### Automatic Deployments

Vercel automatically deploys when you push to Git:

- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Open Pull Request** → Preview deployment with unique URL

### Disable Auto-Deploy

If you want manual control:
1. Go to Project Settings → Git
2. Disable "Production Branch"
3. Deploy manually with `vercel --prod`

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** Available on Pro plan
- **Community:** [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

## Next Steps

1. ✅ Deployment successful
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production best practices
5. Complete [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)

---

**Quick Reference Version:** 1.0  
**Last Updated:** February 8, 2026

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
