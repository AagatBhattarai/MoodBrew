# Supabase Setup Instructions

This guide will help you set up Supabase authentication for MoodBrew.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: MoodBrew (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to you
5. Click "Create new project" and wait for it to be ready

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

## Step 3: Set Up Environment Variables

1. In the `moodbrew` directory, create a `.env` file (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the SQL

This will:

- Create a `profiles` table to store user names
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically create a profile when a user signs up

## Step 5: Configure Authentication

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. Optionally configure email templates under **Authentication** → **Email Templates**

## Step 6: Test the Application

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the app in your browser
3. You should be redirected to the login page
4. Click "Sign up" to create a new account
5. After signing up, you should be redirected to the home page with your name displayed

## Troubleshooting

### "Supabase credentials not found" warning

- Make sure your `.env` file exists in the `moodbrew` directory
- Make sure the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/updating the `.env` file

### "Failed to sign up" error

- Check that the `profiles` table was created successfully
- Verify that RLS policies are set up correctly
- Check the Supabase logs in the dashboard for more details

### User name not showing

- Make sure the profile was created in the `profiles` table
- Check the browser console for any errors
- Verify that the name field was filled during signup

## Database Schema

The `profiles` table has the following structure:

- `id` (UUID): References `auth.users(id)`, primary key
- `email` (TEXT): User's email address
- `name` (TEXT): User's display name (required)
- `created_at` (TIMESTAMP): When the profile was created
- `updated_at` (TIMESTAMP): When the profile was last updated
