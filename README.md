# Next.js & Supabase MDX Portfolio CMS

A feature-rich, full-stack, open-source portfolio and blog CMS. Built with a modern [Next.js 16](https://nextjs.org/) (App Router) stack, [Supabase](https://supabase.com/), and [Shadcn/ui](https://ui.shadcn.com/).

Fork and deploy your own in minutes.

## Overview

This project is a complete, production-ready solution for developers to build their personal portfolio, case study site, and blog. It features a secure admin panel for managing all content and a high-performance, server-rendered public site for displaying it.

The entire system is built on a unified content table, allowing you to manage both project case studies and blog articles from a single interface.

➡️ [CMS View Live](https://cms-showcase.edufortes.dev/dashboard)

## 🚀 Live Demo

You can test-drive the live admin panel here: https://cms-showcase.edufortes.dev/dashboard

To log in and test the CMS, please use the public test user account:

**Email:** `magic@user.com`

**Password:** `magic123`

> [!CAUTION] > **Please Note:**
>
> - **This is a public sandbox:** To keep it clean for all users, a script runs **every 72 hours** to reset the demo account's password back to `magic123` and clear all test content. If the password does not work at first, use the button for an instant reset of it.
>
> - **Safety & Respect:** Please do not enter any personal or sensitive data (passwords, private keys, government IDs, credit card numbers, phone numbers, or private email addresses) in the live demo. This environment is public and not secure for real personal information.
>
> - **Be Respectful:** Keep interactions polite and constructive. Avoid abusive, hateful, sexually explicit, or otherwise inappropriate language or behavior. Content that violates these guidelines may be removed.

## 🌟 Key Features

- **Admin Dashboard:** A secure, password-protected admin panel built inside Next.js.

- **Full Authentication:** Login, logout, "Forgot Password" (via email), and "Change Password" flows.

- **User Profile Management:** Update your full name, display name, and upload an avatar.

- **Unified Content Model:** A single content table manages both Projects and Articles.

- **Full CRUD:** Create, Read, Update, and Delete content with Server Actions.

- **Rich MDX Editor:** Uses @mdxeditor/editor to write content with Markdown and custom React components (e.Example: <Carousel />).

- **Dynamic Public Pages:** Server-renders all content using next-mdx-remote for perfect SEO and performance.

- **Supabase Stack:**

  - **Database:** PostgreSQL with a full migration-based workflow.

  - **Auth:** Row Level Security (RLS) on all tables and storage.

  - **Storage:** Secure file uploads for user avatars.

- **Modern Tooling:** Built with shadcn/ui, Tailwind CSS, Zod, and React Hook Form.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)

- **Backend & DB:** Supabase (Auth, Postgres, Storage)

- **Styling:** Tailwind CSS

- **UI Components:** shadcn/ui

- **Content:** MDX (@mdxeditor/editor & next-mdx-remote)

- **Validation:** Zod & React Hook Form

- **Local Development:** Supabase CLI & Docker

## 🚀 Getting Started

You can set up and run this project locally in just a few minutes.

**Prerequisites**

[Node.js](https://nodejs.org/) (v18 or later)

[Docker Desktop](https://docs.docker.com/desktop/) (must be running in the background)

[Supabase CLI](https://supabase.com/docs/guides/local-development): `npm install -g supabase`

### 1. Clone the Repository

Fork and clone the repository, then navigate into the directory.

```bash

git clone https://github.com/Edu-Fortes/next-supabase-portifolio-cms.git
cd next-supabase-portifolio-cms

```

### 2. Install Dependencies

```Bash

npm install

```

### 3. Set Up Local Supabase Environment

This one command will start the local Supabase services (database, auth, storage) using Docker.

```Bash

npx supabase start

```

### 4. Run the Database Migrations

Your database is empty. This command will run all the migration files in the `supabase/migrations` folder to build your tables, RLS policies, and storage buckets.

```Bash

supabase db reset

```

### 5. Set Up Environment Variables

Copy the example env file:

```Bash

cp .env.local.example .env.local

```

Your **Supabase keys** were printed in the terminal **after** running supabase start. Open `.env.local` and paste them in.

It should look like this:

```Ini,TOML

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=ey...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

```

### 6. Run the Development Server

```Bash

npm run dev

```

Your site is now running at `http://localhost:3000`.

### 7. Create Your Admin User

1. Navigate to your local Supabase Studio: `http://localhost:54323`

2. Go to the Authentication tab.

3. Click "Add user" and create your admin account.

4. The handle_new_user trigger will automatically create your matching row in the profiles table.

You can now go to `http://localhost:3000/sign-in` and sign in!

## 🌐 Deploy to Production

Deploying this project is a two-part process.

### Part 1: Deploy Supabase

1. Create a new project on [Supabase](https://supabase.com/).

2. Link your local project to your new remote project:

```Bash

npx supabase link --project-ref YOUR_PROJECT_ID

```

3. Push your database migrations to the remote database:

```Bash

npx supabase migration up

```

4. Go to your Supabase dashboard (Settings > API) and get your production URL and publishable key.

### Part 2: Deploy to Vercel

1. Push your project to GitHub.

2. Create a new project on Vercel and import your repository.

3. In the Vercel project settings, add your Supabase keys as Environment Variables:

```Ini,TOML

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL (Set this to your public Vercel URL)

```

4. Click Deploy.

## 📄 License

This project is open-source and available under the MIT License.
