# TechAssassin - Hackathon Management Platform

<div align="center">

<img src="./Client/public/favicon.ico" alt="TechAssassin Logo" width="120" height="120" />

**A comprehensive, full-stack hackathon management platform built with modern web technologies**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TechAssassin** is a modern, full-stack web application designed to streamline hackathon management. It provides a comprehensive platform for organizers to create and manage events, and for participants to discover, register, and compete in hackathons.

### Key Highlights

- 🚀 **Full-Stack Solution**: Complete backend API and responsive frontend
- 🔐 **Secure Authentication**: Supabase Auth with JWT tokens
- 📊 **Real-time Updates**: Live participant counts and leaderboards
- 💾 **Robust Database**: PostgreSQL with Row Level Security (RLS)
- 📁 **File Management**: Integrated storage for avatars, images, and logos
- 📧 **Email Notifications**: Automated emails via Resend
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🧪 **Well-Tested**: Comprehensive test coverage with Vitest

---

## ✨ Features

### For Participants

- ✅ **User Registration & Authentication**
  - Email/password authentication
  - Profile management with avatar uploads
  - Skills and social links (GitHub, LinkedIn, Portfolio)

- ✅ **Event Discovery**
  - Browse upcoming, live, and past hackathons
  - Filter events by status and themes
  - View detailed event information

- ✅ **Event Registration**
  - Register for events with team details
  - Automatic waitlist management for full events
  - Registration status tracking (confirmed/waitlist/cancelled)

- ✅ **Dashboard**
  - View registered events
  - Track registration status
  - Access announcements and resources

### For Organizers (Admin)

- ✅ **Event Management**
  - Create and edit hackathon events
  - Set capacity limits and registration periods
  - Upload event images and define themes
  - Manage prizes and rules

- ✅ **Participant Management**
  - View all registrations
  - Approve or reject participants
  - Manage waitlists

- ✅ **Content Management**
  - Post announcements
  - Share resources and learning materials
  - Showcase sponsors with logos

- ✅ **Leaderboard**
  - Track participant scores
  - Real-time ranking updates
  - Export results

### Technical Features

- ✅ **RESTful API**: Complete backend with 30+ endpoints
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Data Validation**: Zod schemas for request/response validation
- ✅ **Error Handling**: Consistent error responses with proper status codes
- ✅ **Rate Limiting**: Protection against abuse
- ✅ **Caching**: Optimized performance with caching strategies
- ✅ **Real-time**: Supabase real-time subscriptions
- ✅ **File Uploads**: Secure file storage with type and size validation
- ✅ **Database Migrations**: Version-controlled schema changes
- ✅ **Row Level Security**: Fine-grained access control

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool |
| **React Router** | 6.x | Client-side routing |
| **Tailwind CSS** | 3.x | Styling |
| **shadcn/ui** | Latest | UI components |
| **Tanstack Query** | 5.x | Data fetching |
| **Axios** | 1.x | HTTP client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | Full-stack framework |
| **TypeScript** | 5.x | Type safety |
| **PostgreSQL** | 15.x | Database |
| **Supabase** | Latest | Auth & Database |
| **Zod** | 4.x | Schema validation |
| **Resend** | Latest | Email service |
| **Vitest** | 4.x | Testing framework |
| **fast-check** | 4.x | Property-based testing |

### DevOps & Tools

- **Git** - Version control
- **npm** - Package management
- **Vercel** - Deployment platform
- **pgAdmin 4** - Database management
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Services   │      │
│  │  - Events    │  │  - Navbar    │  │  - API Client│      │
│  │  - Dashboard │  │  - Cards     │  │  - Auth      │      │
│  │  - Profile   │  │  - Forms     │  │  - Events    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (Next.js API)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │  Middleware  │  │  Validation  │      │
│  │  - Auth      │  │  - CORS      │  │  - Zod       │      │
│  │  - Events    │  │  - Auth      │  │  - Schemas   │      │
│  │  - Profile   │  │  - Error     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────┴────────┐ ┌────┴─────┐ ┌────────┴────────┐
│   PostgreSQL   │ │ Supabase │ │  Resend Email   │
│   Database     │ │   Auth   │ │    Service      │
└────────────────┘ └──────────┘ └─────────────────┘
```

### Database Schema

```
auth.users (Supabase Auth)
    ↓
public.profiles (User profiles)
    ↓
public.events (Hackathon events)
    ↓
public.registrations (Event sign-ups)
    ↓
public.leaderboard (Competition scores)

Additional Tables:
- public.announcements
- public.resources
- public.sponsors
- public.skills
- public.user_skills
- storage.buckets
- storage.objects
```

---

## 🚀 Quick Start

Get the application running in under 5 minutes!

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/techassassin.git
cd techassassin

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../Client
npm install
```

### Configuration

#### Backend Configuration

1. Create `backend/.env.local`:

```env
# Supabase Configuration (for authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Local PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/techassassin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@techassassin.com
RESEND_FROM_NAME=TechAssassin

# Server Configuration
PORT=3001
```

2. Get your credentials:
   - **Supabase**: [Dashboard](https://supabase.com/dashboard) → Project Settings → API
   - **Resend**: [Dashboard](https://resend.com/api-keys)

#### Frontend Configuration

1. Create `Client/.env.local`:

```env
# Backend API
VITE_API_URL=http://localhost:3001/api

# Supabase (same as backend)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application
VITE_APP_NAME=TechAssassin
VITE_APP_URL=http://localhost:3000
```

### Database Setup

#### Option 1: Using pgAdmin 4 (Recommended)

1. Open pgAdmin 4
2. Create database: `techassassin`
3. Open Query Tool
4. Run `COMPLETE_DATABASE_SETUP.sql` from project root
5. Verify with `VERIFY_DATABASE.sql`

#### Option 2: Using Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE techassassin;

# Exit psql
\q

# Run setup script
psql -U postgres -d techassassin -f COMPLETE_DATABASE_SETUP.sql
```

### Running the Application

#### Development Mode

```bash
# Terminal 1: Start backend (port 3001)
cd backend
npm run dev

# Terminal 2: Start frontend (port 3000)
cd Client
npm run dev
```

#### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

---

## 📖 Documentation

### Project Structure

```
techassassin/
├── backend/                    # Backend application
│   ├── app/
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── events/        # Event management
│   │       ├── profile/       # User profiles
│   │       ├── registrations/ # Event registrations
│   │       └── ...
│   ├── lib/
│   │   ├── db/                # Database utilities
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic
│   │   ├── supabase/          # Supabase clients
│   │   ├── utils/             # Helper functions
│   │   └── validations/       # Zod schemas
│   ├── supabase/
│   │   └── migrations/        # Database migrations
│   ├── scripts/               # Utility scripts
│   ├── .env.local             # Environment variables
│   └── package.json
│
├── Client/                     # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   └── ...
│   │   ├── services/          # API service layer
│   │   │   ├── auth.service.ts
│   │   │   ├── events.service.ts
│   │   │   ├── profile.service.ts
│   │   │   └── ...
│   │   ├── lib/               # Utilities
│   │   │   └── api-client.ts  # HTTP client
│   │   ├── types/             # TypeScript types
│   │   ├── hooks/             # Custom React hooks
│   │   └── App.tsx            # Main app component
│   ├── .env.local             # Environment variables
│   └── package.json
│
├── .gitignore
├── README.md
├── LICENSE
└── vercel.json                # Deployment config
```

### API Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Sign in user |
| POST | `/api/auth/signout` | Sign out user |
| POST | `/api/auth/reset-password` | Reset password |

#### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| GET | `/api/profile/:id` | Get user profile by ID |
| PATCH | `/api/profile` | Update current user profile |
| POST | `/api/profile/avatar` | Upload avatar image |

#### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create event (admin) |
| PATCH | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |
| POST | `/api/events/:id/images` | Upload event images |

#### Registrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/registrations` | Get user's registrations |
| GET | `/api/registrations/event/:eventId` | Get event registrations (admin) |
| POST | `/api/registrations` | Register for event |
| PATCH | `/api/registrations/:id` | Update registration status (admin) |

#### Other Endpoints

- **Announcements**: `/api/announcements`
- **Resources**: `/api/resources`
- **Sponsors**: `/api/sponsors`
- **Leaderboard**: `/api/leaderboard`

For complete API documentation, see the [API Reference](./backend/API.md).

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

### Test Coverage

Current test coverage:
- ✅ Database schema validation
- ✅ Authentication middleware
- ✅ Registration service
- ✅ Leaderboard service
- ✅ Validation schemas

### Writing Tests

Tests are located in `backend/lib/**/*.test.ts` files.

Example test:

```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from './utils';

describe('Email Validation', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

#### Frontend Deployment

1. Import project in Vercel
2. Set root directory to `Client`
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in Vercel dashboard:

**Backend:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`

**Frontend:**
- `VITE_API_URL` (your backend URL)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database Migration

For production database:

```bash
# Connect to production database
psql -h your-db-host -U your-user -d your-database

# Run migrations
\i backend/supabase/migrations/00000000000000_init_local_postgres.sql
# ... run other migrations in order
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow existing code style
- Use meaningful commit messages

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive variable names
- Add comments for complex logic

### Reporting Issues

Found a bug? Have a feature request?

1. Check existing issues
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 TechAssassin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Resend](https://resend.com/) - Email service

---

## 🗺 Roadmap

### Version 1.0 (Current)
- ✅ Core authentication
- ✅ Event management
- ✅ Registration system
- ✅ Profile management
- ✅ Basic dashboard

### Version 1.1 (Planned)
- 🔄 Team management
- 🔄 Project submissions
- 🔄 Judging system
- 🔄 Advanced leaderboard
- 🔄 Email notifications

### Version 2.0 (Future)
- 📅 Calendar integration
- 📊 Analytics dashboard
- 🎥 Video submissions
- 💬 Chat system
- 🏆 Achievements & badges

---

<div align="center">

**Made with ❤️ by the TechAssassin Team**

[⬆ Back to Top](#techassassin---hackathon-management-platform)

</div>
