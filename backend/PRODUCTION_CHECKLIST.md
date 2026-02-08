# Production Deployment Checklist

Use this checklist to ensure your TechAssassin backend is properly configured for production deployment.

## Pre-Deployment Preparation

### Code Quality
- [ ] All unit tests passing (`npm test`)
- [ ] All property-based tests passing
- [ ] No TypeScript errors (`npm run build`)
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] API documentation complete
- [ ] CHANGELOG updated with release notes

### Security Review
- [ ] All secrets removed from code
- [ ] Environment variables properly configured
- [ ] Row Level Security policies reviewed
- [ ] Input validation implemented on all endpoints
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] Authentication flows tested
- [ ] Authorization checks verified

### Performance
- [ ] Database indexes verified
- [ ] Slow queries optimized
- [ ] Pagination implemented on list endpoints
- [ ] Caching strategy implemented
- [ ] File upload size limits enforced
- [ ] API response times acceptable (<500ms for 95% of requests)

---

## Supabase Production Setup

### Project Configuration
- [ ] Production Supabase project created (separate from development)
- [ ] Strong database password set and stored securely
- [ ] Appropriate region selected (closest to users)
- [ ] Project name clearly indicates "Production"

### Database Setup
- [ ] All migrations applied in correct order
- [ ] Migration verification queries run successfully
- [ ] All tables created with correct schema
- [ ] All indexes created
- [ ] All foreign key constraints working
- [ ] All check constraints working
- [ ] Unique constraints verified

### Row Level Security
- [ ] RLS enabled on all tables
- [ ] Profiles table policies tested
- [ ] Events table policies tested
- [ ] Registrations table policies tested
- [ ] Announcements table policies tested
- [ ] Resources table policies tested
- [ ] Sponsors table policies tested
- [ ] Leaderboard table policies tested
- [ ] Admin-only operations protected
- [ ] User data isolation verified

### Authentication
- [ ] Email authentication enabled
- [ ] Email templates customized with production branding
- [ ] Site URL set to production domain
- [ ] Redirect URLs configured correctly
- [ ] Email verification working
- [ ] Password reset working
- [ ] OAuth providers configured (if using):
  - [ ] GitHub OAuth credentials added
  - [ ] Google OAuth credentials added
  - [ ] Callback URLs configured correctly

### Storage
- [ ] `avatars` bucket created (public)
- [ ] `event-images` bucket created (public)
- [ ] `sponsor-logos` bucket created (public)
- [ ] Storage policies applied correctly
- [ ] Upload permissions tested
- [ ] Public read access verified
- [ ] File size limits enforced (2MB)
- [ ] File type restrictions working

### Realtime
- [ ] Realtime enabled on `events` table
- [ ] Realtime enabled on `registrations` table
- [ ] Realtime enabled on `announcements` table
- [ ] Realtime enabled on `leaderboard` table
- [ ] Realtime subscriptions tested

### Backups and Recovery
- [ ] Database backups enabled
- [ ] Backup schedule configured
- [ ] Point-in-Time Recovery enabled (if on Pro plan)
- [ ] Backup restoration tested in development
- [ ] Recovery procedures documented

### Monitoring
- [ ] Usage alerts configured
- [ ] High database usage alerts enabled
- [ ] Storage quota alerts enabled
- [ ] API request monitoring enabled

---

## Resend Production Setup

### Domain Verification
- [ ] Production domain added to Resend
- [ ] DNS records added to domain registrar:
  - [ ] TXT record for domain verification
  - [ ] TXT record for DKIM
- [ ] Domain verification status: **Verified**
- [ ] SPF record configured
- [ ] DMARC policy configured (optional but recommended)

### API Configuration
- [ ] Production API key created
- [ ] API key named clearly (e.g., "TechAssassin Production")
- [ ] API key stored securely (password manager)
- [ ] API key permissions set to "Sending access"
- [ ] Test email sent successfully

### Email Templates
- [ ] Registration confirmation template tested
- [ ] Welcome email template tested
- [ ] Password reset template tested (Supabase)
- [ ] All templates use verified sender domain
- [ ] All templates include unsubscribe link (if required)
- [ ] Email branding matches application

### Monitoring
- [ ] Email delivery monitoring enabled
- [ ] Bounce rate monitoring configured
- [ ] Monthly usage tracking set up
- [ ] Delivery failure alerts configured

---

## Vercel Production Setup

### Project Configuration
- [ ] Vercel account created
- [ ] Project created and linked to Git repository
- [ ] Project name set appropriately
- [ ] Framework preset: Next.js
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Root directory configured (if monorepo)

### Environment Variables
All variables configured in Vercel Dashboard > Settings > Environment Variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Production, Preview, Development)
- [ ] `RESEND_API_KEY` (Production, Preview, Development)
- [ ] `NEXT_PUBLIC_APP_URL` (Production: https://yourdomain.com)
- [ ] `NEXT_PUBLIC_APP_URL` (Preview: auto-generated or staging domain)
- [ ] `NEXT_PUBLIC_APP_URL` (Development: http://localhost:3000)

### Domain Configuration
- [ ] Custom domain added (if using)
- [ ] DNS records configured:
  - [ ] A record or CNAME pointing to Vercel
  - [ ] SSL certificate issued automatically
- [ ] Domain verification complete
- [ ] HTTPS enforced
- [ ] www redirect configured (if desired)

### Build Configuration
- [ ] Build succeeds without errors
- [ ] Build time acceptable (<5 minutes)
- [ ] No build warnings
- [ ] TypeScript compilation successful
- [ ] All dependencies installed correctly

### Deployment Settings
- [ ] Auto-deploy from main branch enabled
- [ ] Preview deployments enabled for PRs
- [ ] Deployment protection configured (if needed)
- [ ] Build cache enabled
- [ ] Function regions configured (if needed)

---

## CORS Configuration

### Middleware Setup
- [ ] `middleware.ts` created in backend root
- [ ] Allowed origins configured:
  - [ ] Production frontend domain
  - [ ] www subdomain (if applicable)
  - [ ] Staging domain (if applicable)
  - [ ] localhost for development
- [ ] Preflight requests handled (OPTIONS)
- [ ] CORS headers set correctly:
  - [ ] Access-Control-Allow-Origin
  - [ ] Access-Control-Allow-Methods
  - [ ] Access-Control-Allow-Headers
  - [ ] Access-Control-Max-Age

### Testing
- [ ] Preflight requests work from frontend
- [ ] Actual requests work from frontend
- [ ] Unauthorized origins are blocked
- [ ] Credentials handling works (if needed)

---

## Post-Deployment Verification

### API Endpoints Testing

**Health Check:**
- [ ] `GET /api/health` returns 200 OK
- [ ] Response includes status, timestamp, message

**Authentication:**
- [ ] `POST /api/auth/signup` creates new user
- [ ] `POST /api/auth/signin` authenticates user
- [ ] `POST /api/auth/signout` ends session
- [ ] `POST /api/auth/reset-password` sends reset email
- [ ] Email verification link works
- [ ] Password reset link works

**Profiles:**
- [ ] `GET /api/profile` returns authenticated user profile
- [ ] `GET /api/profile/[id]` returns public profile
- [ ] `PATCH /api/profile` updates profile
- [ ] `POST /api/profile/avatar` uploads avatar
- [ ] Username uniqueness enforced
- [ ] Admin field cannot be modified by users

**Events:**
- [ ] `GET /api/events` lists events with filters
- [ ] `GET /api/events/[id]` returns event details
- [ ] `POST /api/events` creates event (admin only)
- [ ] `PATCH /api/events/[id]` updates event (admin only)
- [ ] `DELETE /api/events/[id]` deletes event (admin only)
- [ ] `POST /api/events/[id]/images` uploads images (admin only)
- [ ] Non-admin users cannot create/modify events
- [ ] Participant count is accurate
- [ ] Event status calculated correctly

**Registrations:**
- [ ] `POST /api/registrations` creates registration
- [ ] `GET /api/registrations` returns user's registrations
- [ ] `GET /api/registrations/event/[eventId]` returns event registrations (admin)
- [ ] `PATCH /api/registrations/[id]` updates status (admin only)
- [ ] Duplicate registration prevented
- [ ] Capacity limits enforced
- [ ] Waitlist logic works correctly
- [ ] Registration emails sent
- [ ] Rate limiting works (5 per hour)

**Announcements:**
- [ ] `GET /api/announcements` lists announcements
- [ ] `POST /api/announcements` creates announcement (admin only)
- [ ] `PATCH /api/announcements/[id]` updates announcement (author/admin)
- [ ] `DELETE /api/announcements/[id]` deletes announcement (author/admin)
- [ ] Announcements ordered by date (newest first)
- [ ] Author information included

**Resources:**
- [ ] `GET /api/resources` lists resources
- [ ] `POST /api/resources` creates resource (admin only)
- [ ] `PATCH /api/resources/[id]` updates resource (admin only)
- [ ] `DELETE /api/resources/[id]` deletes resource (admin only)
- [ ] Category filtering works
- [ ] Pagination works

**Sponsors:**
- [ ] `GET /api/sponsors` lists sponsors (public access)
- [ ] `POST /api/sponsors` creates sponsor (admin only)
- [ ] `PATCH /api/sponsors/[id]` updates sponsor (admin only)
- [ ] `DELETE /api/sponsors/[id]` deletes sponsor (admin only)
- [ ] `POST /api/sponsors/[id]/logo` uploads logo (admin only)
- [ ] Sponsors ordered by tier

**Leaderboard:**
- [ ] `GET /api/leaderboard/[eventId]` returns leaderboard
- [ ] `POST /api/leaderboard` updates scores (admin only)
- [ ] Ranks calculated correctly
- [ ] Ties handled properly
- [ ] Participant info included

### Error Handling
- [ ] Invalid input returns 400 with descriptive errors
- [ ] Unauthenticated requests return 401
- [ ] Unauthorized requests return 403
- [ ] Not found returns 404
- [ ] Server errors return 500
- [ ] Error messages are user-friendly
- [ ] Sensitive information not leaked in errors

### File Uploads
- [ ] Avatar upload works (jpg, png, webp)
- [ ] Event image upload works
- [ ] Sponsor logo upload works
- [ ] File size limit enforced (2MB)
- [ ] Invalid file types rejected
- [ ] Files accessible via public URLs
- [ ] Storage cleanup works on deletion

### Real-time Features
- [ ] Registration changes broadcast to subscribers
- [ ] Announcement creation broadcast to subscribers
- [ ] Leaderboard updates broadcast to subscribers
- [ ] Participant count updates in real-time
- [ ] Reconnection works after disconnect

### Email Delivery
- [ ] Registration confirmation emails delivered
- [ ] Welcome emails delivered
- [ ] Password reset emails delivered (Supabase)
- [ ] Emails have correct sender
- [ ] Email links work correctly
- [ ] Email templates render properly
- [ ] Unsubscribe links work (if applicable)

### Performance
- [ ] API response times <500ms for 95% of requests
- [ ] Database queries use indexes
- [ ] Pagination works on large datasets
- [ ] No N+1 query problems
- [ ] Caching working where implemented
- [ ] File uploads complete in reasonable time

### Security
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection working
- [ ] Rate limiting enforced
- [ ] Admin operations protected
- [ ] User data isolated (RLS working)
- [ ] Service role key not exposed
- [ ] API keys not exposed in client code

---

## Monitoring Setup

### Vercel Monitoring
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Deployment notifications enabled
- [ ] Team notifications configured

### Supabase Monitoring
- [ ] Database usage monitoring enabled
- [ ] API request monitoring enabled
- [ ] Storage usage monitoring enabled
- [ ] Real-time connection monitoring enabled
- [ ] Usage alerts configured

### Resend Monitoring
- [ ] Email delivery monitoring enabled
- [ ] Bounce rate tracking active
- [ ] Monthly usage tracking enabled
- [ ] Delivery failure alerts configured

### External Monitoring (Optional)
- [ ] Uptime monitoring configured (e.g., UptimeRobot)
- [ ] Error tracking service integrated (e.g., Sentry)
- [ ] Log aggregation configured (e.g., LogRocket)
- [ ] Performance monitoring (e.g., New Relic)

---

## Documentation

### User-Facing Documentation
- [ ] API documentation complete (API.md)
- [ ] Setup guide complete (SETUP.md)
- [ ] Deployment guide complete (DEPLOYMENT.md)
- [ ] README updated with production info
- [ ] Changelog updated
- [ ] Migration guide (if applicable)

### Internal Documentation
- [ ] Architecture documented
- [ ] Database schema documented
- [ ] RLS policies documented
- [ ] Environment variables documented
- [ ] Deployment procedures documented
- [ ] Rollback procedures documented
- [ ] Troubleshooting guide complete
- [ ] Runbook for common issues

### Team Communication
- [ ] Team notified of deployment
- [ ] Deployment schedule communicated
- [ ] Maintenance window announced (if needed)
- [ ] Support team briefed
- [ ] Escalation procedures documented

---

## Compliance and Legal

### Data Privacy
- [ ] Privacy policy created and accessible
- [ ] Terms of service created and accessible
- [ ] Cookie policy created (if applicable)
- [ ] GDPR compliance implemented (if serving EU)
- [ ] Data export functionality implemented
- [ ] Data deletion functionality implemented
- [ ] User consent flows implemented

### Security Compliance
- [ ] Security audit completed
- [ ] Penetration testing performed (if required)
- [ ] Vulnerability scanning completed
- [ ] Security policies documented
- [ ] Incident response plan documented

### Operational Compliance
- [ ] Backup procedures documented
- [ ] Disaster recovery plan documented
- [ ] Data retention policies defined
- [ ] Audit logging implemented
- [ ] Access control policies documented

---

## Free Tier Compliance

### Supabase Free Tier Limits
- [ ] Database size: <500MB
- [ ] Bandwidth: <2GB per month
- [ ] Storage: <1GB
- [ ] Realtime connections: <200 concurrent
- [ ] Usage monitoring configured
- [ ] Upgrade plan ready if limits approached

### Resend Free Tier Limits
- [ ] Email volume: <3,000 per month
- [ ] Daily limit: <100 per day
- [ ] Usage monitoring configured
- [ ] Upgrade plan ready if limits approached

### Vercel Free Tier Limits
- [ ] Bandwidth: <100GB per month
- [ ] Serverless execution: <100 hours per month
- [ ] Build time: <6,000 minutes per month
- [ ] Usage monitoring configured
- [ ] Upgrade plan ready if limits approached

---

## Rollback Plan

### Preparation
- [ ] Previous working deployment identified
- [ ] Database backup created before deployment
- [ ] Rollback procedure documented
- [ ] Team aware of rollback process
- [ ] Rollback decision criteria defined

### Rollback Triggers
- [ ] Critical bugs in production
- [ ] Performance degradation >50%
- [ ] Security vulnerabilities discovered
- [ ] Data corruption detected
- [ ] Service unavailability >5 minutes

### Rollback Procedure
- [ ] Vercel rollback steps documented
- [ ] Database rollback steps documented
- [ ] Cache invalidation steps documented
- [ ] User notification plan ready
- [ ] Post-rollback verification checklist ready

---

## Post-Launch Tasks

### Immediate (First 24 Hours)
- [ ] Monitor error rates
- [ ] Monitor API response times
- [ ] Monitor email delivery
- [ ] Monitor user signups
- [ ] Monitor database performance
- [ ] Check for any critical issues
- [ ] Respond to user feedback

### Short-term (First Week)
- [ ] Analyze usage patterns
- [ ] Identify performance bottlenecks
- [ ] Review error logs
- [ ] Optimize slow queries
- [ ] Gather user feedback
- [ ] Plan improvements

### Long-term (First Month)
- [ ] Review free tier usage
- [ ] Plan for scaling
- [ ] Implement additional features
- [ ] Optimize based on real usage
- [ ] Update documentation based on learnings
- [ ] Conduct retrospective

---

## Sign-off

### Technical Lead
- [ ] Code review complete
- [ ] Architecture approved
- [ ] Security review passed
- [ ] Performance acceptable
- [ ] Documentation complete

**Name:** ________________  
**Date:** ________________  
**Signature:** ________________

### Product Owner
- [ ] Features complete
- [ ] User acceptance testing passed
- [ ] Documentation reviewed
- [ ] Ready for production

**Name:** ________________  
**Date:** ________________  
**Signature:** ________________

### DevOps/Infrastructure
- [ ] Infrastructure configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Deployment tested
- [ ] Rollback plan ready

**Name:** ________________  
**Date:** ________________  
**Signature:** ________________

---

## Deployment Date and Time

**Scheduled Deployment:**
- Date: ________________
- Time: ________________ (Timezone: ________)
- Duration: ________________
- Maintenance Window: ________________

**Actual Deployment:**
- Date: ________________
- Time: ________________
- Duration: ________________
- Issues Encountered: ________________

**Deployment Status:** ☐ Success ☐ Partial ☐ Failed ☐ Rolled Back

**Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

---

**Checklist Version:** 1.0  
**Last Updated:** February 8, 2026  
**Next Review:** ________________
