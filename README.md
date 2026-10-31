# Visitor Admin Site

A blank public page with an **Admin** link, an admin login, and an opt-in visitor log. The browser asks before sending a visit. If a visitor allows it, the server saves the time and Vercel's approximate country, region, and city headers. The app does not save an IP address, GPS coordinates, referrer, or user agent. Geolocation is an IP-based estimate and may be missing or inaccurate.

## 1. Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor → New query**, paste the contents of [`supabase.sql`](./supabase.sql), and run it. This creates the `visitor_logs` table with row-level security enabled and no public policies.
3. Copy the project URL from **Connect** (or **Project Settings → API Keys**) and create/copy a server-only **Secret key** (`sb_secret_...`) from **Project Settings → API Keys**. The app sends this key only from server routes. Never put it in browser code or source control. Supabase is deprecating its old `service_role` key by the end of 2026, so this starter uses the newer secret key.

## 2. Configure local secrets

`.env.local` is already present in this starter with the admin username/password and a random session secret. It has blank Supabase values. Keep this file on your computer; `.gitignore` excludes it from Git. In it, set:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` to your chosen admin login.
- `SESSION_SECRET` to a random secret with at least 32 characters.
- `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to the values from Supabase.

The starter login name is `admin`; choose your own strong password. Do not commit `.env.local` or put secrets in client-side variables.

## 3. Put the project on GitHub

Create a **private** GitHub repository named `visitor-admin-site`. Upload or push the **contents of this `visitor-admin-site` folder** so `package.json` is at the repository root. Include `app/`, `lib/`, `package.json`, `tsconfig.json`, `next-env.d.ts`, `supabase.sql`, `.env.example`, `.gitignore`, and `README.md`.

Do **not** upload `.env.local`, `node_modules/`, or `.next/`. The `.gitignore` is set to exclude these. GitHub Desktop or the Git command line can publish the whole folder; the GitHub web uploader can also upload the project files. If you place the code inside a nested folder in the repository, select that folder as Vercel's Root Directory later.

## 4. Run locally (optional)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Local visits won't have Vercel's location headers, so their location fields will be blank.

## 5. Deploy to Vercel

1. Sign in to Vercel, choose **Add New → Project**, and import the GitHub repository.
2. If `package.json` is at the repository root, leave **Root Directory** as `./`. Vercel should detect Next.js automatically.
3. Add these five variables under **Environment Variables**, at least for **Production**: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY`. Copy the first three from your local `.env.local`, and the last two from Supabase. Add Preview too if you want preview deployments to use the same database and login.
4. Click **Deploy**. After deployment, visit the Vercel URL, choose Allow on the consent prompt, then open `/admin` and sign in. New environment variable values take effect after a redeploy.

The Supabase secret key and session secret must remain server-only. Vercel runs the API routes that use them; Supabase stores the logs.

The admin session is an HttpOnly, same-site cookie that expires after 12 hours. The log page shows the latest 500 opt-in visits. This starter does not include automated deletion; set an appropriate retention period for your use and comply with applicable privacy requirements.
