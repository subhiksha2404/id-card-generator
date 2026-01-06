# ID Card Generator
A secure, modern web application for generating and managing professional ID cards. Built with React, Vite, and Supabase.

## Features
- **Secure Authentication**: Email/Password login and signup via Supabase Auth.
- **ID Card Generation**: Create professional ID cards with profile photos.
- **Cloud Storage**: Profile photos stored securely in Supabase Storage.
- **Persistent Database**: All cards are saved to a Postgres database.
- **User Isolation**: Row Level Security ensures users only see their own cards.
- **Responsive Design**: Works on mobile, tablet, and desktop.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React
- **Utils**: date-fns, uuid

## Prerequisites
- Node.js (v18 or higher)
- A Supabase project

## Environment Variables
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Database Schema
The application uses a single `id_cards` table with the following structure:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `full_name`: Text
- `dob`: Date
- `phone_number`: Text
- `email`: Text
- `photo_url`: Text
- `id_number`: Text (Unique)
- `created_at`: Timestamptz

Row Level Security (RLS) is enabled to enforce privacy.
