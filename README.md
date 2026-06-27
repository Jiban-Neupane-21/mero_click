<div align="center">
  <h1 align="center">Studio Mero Click</h1>
  <p align="center">
    A premium React-based studio portfolio and booking management system, featuring cinematic video showcases, dynamic image galleries, and a full admin dashboard.
  </p>
</div>

## 🚀 Features

- **Dynamic Portfolio Galleries**: Beautiful, masonry-style photo galleries.
- **Cinematic Video Showcase**: Support for embedding YouTube, Facebook, and TikTok videos directly on the platform.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) interface to manage images, videos, and services.
- **Supabase Integration**: Live Postgres database and cloud storage integration for persistent state and image hosting.
- **Local Storage Fallback**: Runs completely in the browser using Mock Data and LocalStorage if Supabase is not configured.
- **Responsive Design**: Built with Material UI and Tailwind CSS for a seamless desktop and mobile experience.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Material UI, Tailwind CSS, Framer Motion
- **Icons**: Lucide React, MUI Icons
- **Backend/DB**: Supabase (PostgreSQL, Storage buckets)
- **Routing**: React Router DOM

---

## 📖 In-Depth Setup Guide

Follow these steps to get the studio platform running locally on your machine.

### 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A **Supabase Account** (if you want live database functionality) - [Sign up here](https://supabase.com/)

### 2. Installation

First, clone the repository and install the required dependencies:

```bash
# Clone the repository
git clone https://github.com/Jiban-Neupane-21/mero_click.git

# Navigate into the directory
cd photo-studio-service

# Install dependencies using npm
npm install
```

### 3. Environment Variables (Supabase Setup)

The application can run in **Local Mode** (using browser LocalStorage) without any configuration. However, for a production-ready setup, you should connect it to Supabase.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. In your Supabase project, go to **Project Settings -> API** and copy your **Project URL** and **anon public key**.
3. Create a `.env` file in the root of your project directory (`photo-studio-service/.env`).
4. Add the following variables to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Supabase Database Schema

If you are using Supabase, you need to set up the appropriate tables in the Supabase SQL Editor.

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Create Portfolio Table
CREATE TABLE portfolio (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text,
  "imageUrl" text NOT NULL,
  "specLabel" text,
  author text
);

-- Create Videos Table
CREATE TABLE videos (
  id text PRIMARY KEY,
  title text NOT NULL,
  "youtubeId" text,
  category text,
  duration text,
  description text,
  "uploadDate" text,
  "facebookLink" text,
  "tiktokLink" text
);
```

**Storage Buckets:**
You must also create a public storage bucket in Supabase named `portfolio-images` so that uploaded images have a place to live.

### 5. Running the App Locally

Once your dependencies are installed and your `.env` file is configured (optional), you can start the local development server:

```bash
npm run dev
```

- The app will automatically launch at `http://localhost:8000` (or another port if 8000 is occupied).
- Any changes you make to the source code will hot-reload instantly in your browser.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the app for production to the `dist` folder.
- `npm run preview` - Boots up a local web server to preview your production build.
- `npm run lint` - Runs TypeScript type-checking without emitting files.
