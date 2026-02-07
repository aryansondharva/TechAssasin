# TechAssassin Community Platform

A simple hackathon management website where organizers can create events and participants can register.

## What is this?

TechAssassin helps you run hackathons online. Think of it like an event management system specifically for coding competitions.

**What you can do:**
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

## 🛠️ Tech Stack

### Backend
- **Framework**: Next.js 14 with App Router (Serverless)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (email/password, OAuth)
- **Storage**: Supabase Storage (S3-compatible)
- **Real-time**: Supabase Realtime (WebSocket subscriptions)
- **Email**: Resend API for transactional emails
- **Validation**: Zod for runtime type validation
- **Testing**: Vitest + fast-check (property-based testing)
- **Deployment**: Vercel

### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **Routing**: React Router
- **State Management**: React hooks
- **Testing**: Vitest

## 🚦 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier available)
- Resend account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Community
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env.local
   ```
   
   Edit `backend/.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

3. **Set up the Database**
   
   Run migrations in your Supabase project:
   - Navigate to your Supabase project SQL editor
   - Run each migration file in `backend/supabase/migrations/` in order
   - Or use Supabase CLI: `supabase db push`

4. **Set up the Frontend**
   ```bash
   cd ../Client
   npm install
   ```

### Development

**Start the backend:**
```bash
cd backend
npm run dev
```
Backend API will be available at `http://localhost:3000/api`

**Start the frontend:**
```bash
cd Client
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Testing

**Backend tests:**
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Frontend tests:**
```bash
cd Client
npm test
```

## 📚 Documentation

### Backend Documentation
- [Backend README](./backend/README.md) - Detailed backend setup and API documentation
- [Database Tests README](./backend/lib/utils/DATABASE_TESTS_README.md) - Database schema testing guide
- [Setup Guide](./backend/SETUP.md) - Comprehensive setup instructions

### Database Schema
The platform uses PostgreSQL with the following main tables:
- **profiles**: Extended user information
- **events**: Hackathon event details
- **registrations**: User event registrations
- **announcements**: Community announcements
- **resources**: Educational content
- **sponsors**: Sponsor information
- **leaderboard**: Event scoring and rankings

All tables include Row Level Security (RLS) policies for data protection.

## 🔑 Key Features

### For Participants
- ✅ Create and manage profile with skills and GitHub integration
- ✅ Browse upcoming and live hackathon events
- ✅ Register for events with team information
- ✅ View real-time participant counts
- ✅ Access educational resources and guides
- ✅ Track leaderboard standings
- ✅ Receive email notifications

### For Admins
- ✅ Create and manage hackathon events
- ✅ Upload event images and manage prizes
- ✅ Review and manage registrations
- ✅ Post community announcements
- ✅ Manage educational resources
- ✅ Showcase sponsors
- ✅ Update leaderboard scores

### Technical Features
- ✅ Serverless architecture (Vercel deployment)
- ✅ Real-time updates via WebSocket
- ✅ Row Level Security for data protection
- ✅ Automatic profile creation on signup
- ✅ Cascade deletion for data integrity
- ✅ Smart registration with capacity management
- ✅ File upload with validation (avatars, images, logos)
- ✅ Comprehensive error handling
- ✅ Rate limiting on critical endpoints
- ✅ Property-based testing for correctness

## 🧪 Testing Strategy

The project uses a comprehensive testing approach:

1. **Unit Tests**: Specific examples and edge cases
2. **Property-Based Tests**: Universal correctness properties (100+ iterations)
3. **Integration Tests**: API endpoint testing
4. **Schema Tests**: Database structure validation

See [Database Tests README](./backend/lib/utils/DATABASE_TESTS_README.md) for detailed testing documentation.

## 🚀 Deployment

### Backend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Frontend
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for API endpoints

## 📝 Environment Variables

### Backend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

### Frontend
Configure API endpoint in your frontend environment configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)
- [Vitest Documentation](https://vitest.dev/)

## 💡 Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

Built with ❤️ for the hackathon community
