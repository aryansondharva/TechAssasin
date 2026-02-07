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
1. Go to your Supabase project
2. Click on "SQL Editor"
3. Copy and run each file from `backend/supabase/migrations/` folder

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

## Testing (Optional)

To make sure everything works:
```bash
cd backend
npm test
```

## Need Help?

- Check [Backend README](./backend/README.md) for more details
- Open an issue on GitHub if something doesn't work

## Want to Contribute?

1. Fork this project
2. Make your changes
3. Submit a pull request

We welcome all contributions!

## License

MIT License - feel free to use this project

---

Made for hackathon organizers and participants 🚀
