# Insta Vault — Phase 1

Project scaffold for Phase 1: static layout shell using Next.js (App Router), TypeScript and Tailwind.

Run locally:

```bash
npm install
npm run dev
```

What’s included:
- App shell: sidebar, topbar, main content area
- Static UI components in `components/`
- `app/page.tsx` shows the “All Posts” heading

## Quick Save From iPhone (No Native App Required)

Use the new web import page:

- `https://<your-domain>/import`
- You can also pass a link directly: `https://<your-domain>/import?url=<encoded_post_url>`

### One-time iPhone Shortcut Setup (about 5 minutes)

1. Open the Shortcuts app and create a new shortcut called `Save to Insta Vault`.
2. Add action `URL` with value:
	- `https://<your-domain>/import?url=[Shortcut Input]`
3. Add action `Open URLs`.
4. In shortcut settings, enable `Show in Share Sheet`.
5. Set `Accepts` to `URLs`.

### Daily usage

1. In Instagram/TikTok/YouTube/etc, tap `Share` then `Copy Link` (or share directly to the shortcut when available).
2. Run `Save to Insta Vault` from the share sheet.
3. Insta Vault opens `/import` and you tap `Import and Save`.

### Local development on iPhone

If you are testing on your phone against local dev, run Next.js on your LAN IP:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Then use `http://<your-mac-local-ip>:3000/import` in Safari and in the Shortcut URL action.

## Deploy With Supabase + Netlify (No Custom Domain Needed)

You do not need to buy a domain to use this app on phone. Netlify gives you a free URL like:

- `https://your-site-name.netlify.app`

Use that URL in your iPhone shortcut.

### 1) Create Supabase table

In Supabase SQL Editor, run:

```sql
create table if not exists public.vault_state (
	id text primary key,
	payload jsonb not null,
	updated_at timestamptz not null default now()
);
```

### 2) Set environment variables

Use `.env.example` as reference.

Required values:

- `NEXT_PUBLIC_ENABLE_CLOUD_SYNC=1`
- `SUPABASE_URL=https://<your-project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`

Important:

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only (Netlify env var only).
- Do not expose the service role key in browser code.

### 3) Connect repo to Netlify

1. Push this repo to GitHub.
2. In Netlify, choose `Add new site` -> `Import from Git`.
3. Select this repo.
4. Build command: `npm run build`.
5. Publish directory: leave default for Next.js plugin.
6. Add the 3 environment variables above.
7. Deploy.

This repo includes `netlify.toml` with `@netlify/plugin-nextjs` configured.

### 4) Verify cloud sync

1. Open your Netlify URL.
2. Save one link via `/import`.
3. Open same Netlify URL on another device.
4. Confirm posts match (shared state from Supabase).
