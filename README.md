# Showhome Sensei

This is an AI-powered application for new home sales hosts, built with Next.js, Genkit, and Drizzle ORM.

## Overview

Showhome Sensei is the in-hand assistant for sales hosts and the intelligence engine for builders. It streamlines the entire showhome visit process, from frictionless visitor intake and AI-powered lead triage to intelligent in-conversation support and automated, personalized follow-ups.

### Key Features

*   **Frictionless Intake & Triage:** A simple QR/NFC-based intake form that uses AI to instantly classify visitors as "Hot Now," "Researching," or "Just Looking."
*   **Intelligent Tour:** Provides hosts with live inventory data, option visualization tools, and real-time AI upsell "nudges" based on visitor interactions.
*   **Automated Nurturing:** Generates and sends personalized follow-up emails, complete with photos from the visit, before the visitor even leaves the driveway.
*   **Big Picture Analytics:** A dashboard that provides daily summaries, lead scoring, and trend tracking to help builders optimize their sales strategy.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
*   **AI/Generative:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google Gemini
*   **Database:** [Postgres](https://www.postgresql.org/) (via Neon)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Authentication:** [Auth.js (NextAuth)](https://authjs.dev/)

## Getting Started

### 1. Environment Variables

You will need to set up your environment variables. Copy the `.env.example` file to a new file named `.env` and add your database connection string and other required keys.

```bash
cp .env.example .env
```

**File: `.env`**
```
# Find this in your Neon project settings
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Your Google AI API Key for Genkit
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# NextAuth & Resend for Magic Link Login
# See https://authjs.dev/getting-started/installation
AUTH_SECRET="YOUR_AUTH_SECRET" # Generate one: `openssl rand -hex 32`
EMAIL_FROM="noreply@yourdomain.com"
RESEND_API_KEY="YOUR_RESEND_API_KEY"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Push Database Schema

Push the Drizzle schema to your Neon database. This will create all the necessary tables.

```bash
npm run db:push
```

### 4. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Seed the Database (Optional, Recommended)

To populate the application with sample data (inventory, users, etc.), navigate to the visitor intake form (`/visitor-intake`) and enter **"Seed Database"** in the name field. This will trigger a one-time seeding process.
