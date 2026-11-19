-- ════════════════════════════════════════════════════════════════
-- moodytiger Marketing Engine — Supabase schema + seed
-- Paste into: Supabase → SQL Editor → New query → Run. Safe to re-run.
-- ════════════════════════════════════════════════════════════════

-- ── Miles Club members ──────────────────────────────────────────
create table if not exists public.loyalty_members (
  id         uuid primary key references auth.users on delete cascade,
  email      text,
  name       text,
  points     int  not null default 0,   -- "miles"
  visits     int  not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.point_events (
  id         bigserial primary key,
  member_id  uuid references auth.users on delete cascade,
  amount     int,
  reason     text,
  created_at timestamptz not null default now()
);

create table if not exists public.redemptions (
  id          bigserial primary key,
  member_id   uuid references auth.users on delete cascade,
  reward_id   text,
  reward_name text,
  points      int,
  created_at  timestamptz not null default now()
);

-- ── Rewards (editable) ──────────────────────────────────────────
create table if not exists public.rewards (
  id          text primary key,
  name        text not null,
  description text,
  points      int  not null,
  sort_order  int  default 0,
  active      boolean default true,
  created_at  timestamptz not null default now()
);

-- ── Miles codes (claim miles from receipts) ─────────────────────
create table if not exists public.claim_codes (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  points     int  not null,
  note       text,
  used       boolean default false,
  used_by    uuid references auth.users on delete set null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

-- ── Social campaigns / posts ────────────────────────────────────
create table if not exists public.campaigns (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  channel    text,
  audience   text,
  body       text,
  sent       int default 0,
  opened     int default 0,
  redeemed   int default 0,
  status     text default 'Draft',
  date       text,
  created_at timestamptz not null default now()
);

-- ── Local creators (influencer CRM) ─────────────────────────────
create table if not exists public.influencers (
  id         uuid primary key default gen_random_uuid(),
  handle     text,
  name       text,
  platform   text,
  followers  int,
  niche      text,
  er         numeric,
  city       text,
  fit        int,
  status     text default 'new',
  notes      text,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════
-- Row Level Security (prototype-friendly; tighten before public launch)
-- ════════════════════════════════════════════════════════════════
alter table public.loyalty_members enable row level security;
alter table public.point_events    enable row level security;
alter table public.redemptions     enable row level security;
alter table public.rewards         enable row level security;
alter table public.claim_codes     enable row level security;
alter table public.campaigns       enable row level security;
alter table public.influencers     enable row level security;

drop policy if exists "own member" on public.loyalty_members;
create policy "own member" on public.loyalty_members
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own points" on public.point_events;
create policy "own points" on public.point_events
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

drop policy if exists "own redemptions" on public.redemptions;
create policy "own redemptions" on public.redemptions
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

drop policy if exists "rewards read"  on public.rewards;
drop policy if exists "rewards write" on public.rewards;
create policy "rewards read"  on public.rewards for select using (true);
create policy "rewards write" on public.rewards for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "codes auth" on public.claim_codes;
create policy "codes auth" on public.claim_codes for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "campaigns auth" on public.campaigns;
create policy "campaigns auth" on public.campaigns for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "influencers auth" on public.influencers;
create policy "influencers auth" on public.influencers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Secure claim-code redemption ────────────────────────────────
create or replace function public.redeem_claim_code(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid(); v_rec claim_codes;
begin
  if v_user is null then return json_build_object('ok', false, 'error', 'Please sign in first'); end if;
  select * into v_rec from claim_codes where upper(code) = upper(trim(p_code)) for update;
  if not found then return json_build_object('ok', false, 'error', 'That code is not valid'); end if;
  if v_rec.used then return json_build_object('ok', false, 'error', 'That code has already been used'); end if;
  update claim_codes set used = true, used_by = v_user, used_at = now() where id = v_rec.id;
  update loyalty_members set points = points + v_rec.points where id = v_user;
  insert into point_events(member_id, amount, reason) values (v_user, v_rec.points, 'claim_code');
  return json_build_object('ok', true, 'points', v_rec.points);
end; $$;
grant execute on function public.redeem_claim_code(text) to anon, authenticated;

-- ── Base role grants (RLS still gatekeeps) ──────────────────────
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;

-- ════════════════════════════════════════════════════════════════
-- Seed data
-- ════════════════════════════════════════════════════════════════
insert into public.rewards (id, name, description, points, sort_order, active) values
 ('ship','Free Shipping','Free shipping on your next order.',150,1,true),
 ('socks','Free Kids'' Socks','A pair of moodytiger performance socks.',300,2,true),
 ('off15','15% Off Any Item','15% off one full-price item.',500,3,true),
 ('hat','Free Sun Hat','A UV-protective play hat, on us.',750,4,true),
 ('tee','Free Everyday Tee','A free moodytiger tee in any size.',1100,5,true),
 ('vip','VIP Early Access','Shop new drops 48 hours early.',1800,6,true)
on conflict (id) do nothing;

insert into public.campaigns (name, channel, audience, sent, opened, redeemed, status, date) values
 ('Back-to-School Play','Instagram','Bay Area parents',48000,9200,340,'Posted','2025-09-03'),
 ('Rainy-Day Layers','TikTok','All followers',72000,15600,410,'Posted','2025-10-12'),
 ('Miles Club Double Points','Email','Miles members',2140,1180,196,'Posted','2025-11-01')
on conflict do nothing;

insert into public.influencers (handle, name, platform, followers, niche, er, city, fit, status, notes) values
 ('@bayareamomlife','Hannah Lee','Instagram',84000,'Bay Area mom life',5.4,'San Jose',96,'new','Posts kids outfits + activities. Perfect local fit.'),
 ('@activekidssf','Marcus Bell','TikTok',162000,'Kids sports & play',7.8,'San Francisco',94,'new','Kids sports content = ideal for activewear.'),
 ('@siliconvalleyfamily','Priya Rao','Instagram',58000,'SV family lifestyle',6.1,'Sunnyvale',97,'new','Local SV family audience. Top fit.'),
 ('@littleskaters','Dana Cruz','YouTube',120000,'Youth ice skating',4.2,'Fremont',88,'new','Skating niche overlaps our sport line.'),
 ('@tinytennispros','Owen Park','Instagram',46000,'Junior tennis',8.0,'Palo Alto',90,'new','Junior tennis — great for our tennis range.'),
 ('@skibunnykids','Kai Johnson','TikTok',71000,'Family skiing',9.0,'Tahoe/Bay',83,'new','Ski content for our winter outerwear.')
on conflict do nothing;
