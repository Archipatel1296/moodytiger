# 🐯 moodytiger — AI Local Marketing Engine

A prototype marketing engine for **moodytiger** (kids activewear) built for the **Converge.AI** challenge: *turning Bay Area awareness into store sales.*

When the owner logs in at **`/admin`**, they land on a dashboard with:

- **Overview** — sales vs local awareness, members by tier, channel conversions, reward redemptions.
- **Creator Studio** — design a social campaign from a goal, and the studio produces the strategy, a content calendar, ready-to-post captions + hashtags per platform, and a creative brief with a **Framia** prompt + "Generate with Framia" button. Then **schedule or post**.
- **Local Creators** — an agent that finds Bay Area family/kids creators, scores fit, and drafts outreach.
- **Miles Club** — the loyalty program: members, tiers (Cub → Explorer → Adventurer → Legend), editable rewards.
- **Miles Codes** — generate receipt codes so in-store shoppers can claim miles (no online order needed).

The public site has a brand landing + a **Miles Club** sign-up/claim page.

Built with **Next.js + Tailwind + Supabase**, ready for **Vercel**. Runs on seeded demo data out of the box — connect Supabase to make it live.

## Converge.AI / Framia
The Creator Studio is built to use **Framia** (a Converge.AI product) for creative generation. Framia is **MCP-based** (`mcp.framia.pro`), so the "Generate with Framia" action is wired as a hook: connect Framia as an MCP connector (or add Framia's API when available) to produce real ad videos. Until then it shows a demo preview.

## Deploy (short version)
1. **Supabase:** create a project → SQL Editor → run `supabase/schema.sql` → turn off email confirmation (Auth → Providers → Email) → add an owner user whose email matches `NEXT_PUBLIC_ADMIN_EMAILS`.
2. **Vercel:** import the repo → add env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EMAILS`, `NEXT_PUBLIC_ORDER_URL`) → Deploy.

## Run locally
```bash
npm install
cp .env.local.example .env.local   # fill in Supabase, or leave blank for demo mode
npm run dev                         # http://localhost:3000
```

## Owner access
Go to `/admin` → sign in with an email in `NEXT_PUBLIC_ADMIN_EMAILS`. In demo mode (no Supabase), any password works.

## Structure
```
app/
  page.jsx            Brand landing + marketing-engine teaser
  loyalty/            Miles Club sign-up + claim-a-code
  admin/
    page.jsx          Overview analytics
    campaigns/        Creator Studio (design + schedule/post)
    influencers/      Local Creators (discovery agent + outreach)
    loyalty/          Miles Club management + reward editor
    codes/            Miles code generator
components/           Nav, footer, charts, admin nav
lib/                  Supabase client, data loaders, demo seed, campaign engine
supabase/schema.sql   ← paste into Supabase
```
