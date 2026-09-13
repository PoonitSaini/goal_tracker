# DevPulse Goal Tracker

A Next.js goal tracker with cloud-synced data and true username + password authentication.

## Authentication

- Users sign up with **username + password only**.
- No email address is required.
- No email verification or SMTP is used.
- Passwords are hashed on the Next.js server with Node's `scrypt` before being stored.
- Login sessions use secure, HTTP-only cookies and are stored server-side in Supabase.

## Cloud data

Goal, habit, profile, achievement, and Pomodoro data is stored in Supabase Postgres, so the same username/password works across devices and browsers.

The browser never receives the Supabase service-role key. Data requests go through Next.js API routes, which authenticate the HTTP-only session before reading or writing that user's row.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Paste and run the complete contents of `supabase/schema.sql`.
4. In Supabase **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Service Role key → `SUPABASE_SERVICE_ROLE_KEY`
5. Put those values in `.env.local` for local development.

**Do not put `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_` variable and do not commit it.**

You do not need to configure Supabase Authentication, email providers, email confirmation, or SMTP for this version.

## Local development

```powershell
npm install
npm run typecheck
npm run build
npm run dev
```

Then open `http://localhost:3000`.

## Vercel

Add these environment variables to the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optionally `NEXT_PUBLIC_APP_URL`

Use the same production Supabase project whose SQL schema was initialized above.
