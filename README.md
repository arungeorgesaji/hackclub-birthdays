# Hack Club Birthdays

A SvelteKit app for Hack Club member birthdays with HCA auth, Slack profile lookup, and Postgres-backed birthday records.

## Database

Create the users table:

```sql
CREATE TABLE users (
  id text PRIMARY KEY,
  name text NOT NULL,
  pfp text NOT NULL,
  bday_month integer,
  bday_day integer,
  channel_name text,
  channel_id text
);
```

## Required services

- Hack Club Auth app with scope `slack_id`
- Slack app with bot scopes `channels:read` and `users:read`
- Postgres database

## Environment

Copy [`.env.example`](./.env.example) and set:

- `HCA_CLIENT_ID`
- `HCA_CLIENT_SECRET`
- `HCA_REDIRECT_HOST`
- `JWT_SECRET`
- `SLACK_XOXB`
- `POSTGRES_URL` or equivalent Postgres env vars

For production, the HCA redirect URI should be:

```text
https://your-domain.vercel.app/auth/callback
```

## Local development

```bash
npm install
npm run dev
```

## Vercel

- This app now uses `@sveltejs/adapter-vercel`
- Set the environment variables in the Vercel project settings
- Point your HCA app redirect URI at your Vercel domain
- Deploy normally with Vercel
