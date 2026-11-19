// Seeded demo data for the moodytiger marketing engine.
// Used whenever Supabase isn't configured so the dashboard looks alive.

export const DEMO_KPIS = {
  revenue: 128400, revenueDelta: 14.2,
  members: 2140, membersDelta: 11.6,
  webVisits: 38600, webVisitsDelta: 9.4,
  storeVisits: 2180, storeVisitsDelta: 7.1,
  campaignReach: 196000, campaignReachDelta: 22.0,
  milesIssued: 412000, milesDelta: 13.3,
};

// 12-week sales vs local awareness
export const DEMO_TREND = [
  { label: "W1", sales: 7600, awareness: 9200 },
  { label: "W2", sales: 8100, awareness: 9900 },
  { label: "W3", sales: 8700, awareness: 10800 },
  { label: "W4", sales: 8400, awareness: 11200 },
  { label: "W5", sales: 9300, awareness: 12600 },
  { label: "W6", sales: 9900, awareness: 13900 },
  { label: "W7", sales: 9700, awareness: 14200 },
  { label: "W8", sales: 10600, awareness: 15800 },
  { label: "W9", sales: 11200, awareness: 17100 },
  { label: "W10", sales: 11900, awareness: 18400 },
  { label: "W11", sales: 12600, awareness: 20200 },
  { label: "W12", sales: 13400, awareness: 22600 },
];

// Channel performance (conversions attributed)
export const DEMO_CHANNELS = [
  { label: "Instagram", value: 86 },
  { label: "TikTok", value: 72 },
  { label: "Email (Miles)", value: 54 },
  { label: "Local events", value: 31 },
  { label: "Google", value: 24 },
];

export const DEMO_TIER_SPLIT = [
  { label: "Cub", value: 1180, color: "#FFC53D" },
  { label: "Explorer", value: 620, color: "#5BC236" },
  { label: "Adventurer", value: 258, color: "#2DA7FF" },
  { label: "Legend", value: 82, color: "#FF6B35" },
];

export const DEMO_TOP_REWARDS = [
  { label: "Free Shipping", value: 142 },
  { label: "Kids' Socks", value: 88 },
  { label: "15% Off", value: 61 },
  { label: "Sun Hat", value: 34 },
  { label: "Early Access", value: 12 },
];

export const DEMO_MEMBERS = [
  { name: "Emily Carter", email: "emily.c@gmail.com", points: 3920, tier: "Legend", visits: 18, joined: "2025-02-11" },
  { name: "Raj Patel", email: "raj.patel@gmail.com", points: 2210, tier: "Adventurer", visits: 12, joined: "2025-04-02" },
  { name: "Mandy Wong", email: "mandy.w@gmail.com", points: 1680, tier: "Adventurer", visits: 10, joined: "2025-05-20" },
  { name: "Sara Kim", email: "sara.kim@gmail.com", points: 940, tier: "Explorer", visits: 7, joined: "2025-06-14" },
  { name: "Luis Romero", email: "luis.r@gmail.com", points: 720, tier: "Explorer", visits: 6, joined: "2025-07-30" },
  { name: "Nina Shah", email: "nina.shah@gmail.com", points: 410, tier: "Cub", visits: 3, joined: "2025-08-19" },
  { name: "Tom Becker", email: "tom.b@gmail.com", points: 260, tier: "Cub", visits: 2, joined: "2025-09-05" },
];

export const DEMO_CAMPAIGNS = [
  { id: "c1", name: "Back-to-School Play", channel: "Instagram", audience: "Bay Area parents", sent: 48000, opened: 9200, redeemed: 340, status: "Posted", date: "2025-09-03" },
  { id: "c2", name: "Rainy-Day Layers", channel: "TikTok", audience: "All followers", sent: 72000, opened: 15600, redeemed: 410, status: "Posted", date: "2025-10-12" },
  { id: "c3", name: "Miles Club Double Points", channel: "Email", audience: "Miles members", sent: 2140, opened: 1180, redeemed: 196, status: "Posted", date: "2025-11-01" },
  { id: "c4", name: "Holiday Gift Guide", channel: "Instagram", audience: "Bay Area parents", sent: 0, opened: 0, redeemed: 0, status: "Draft", date: "—" },
];

// Local creators (Bay Area family / kids / mom niche)
export const DEMO_INFLUENCERS = [
  { handle: "@bayareamomlife", name: "Hannah Lee", platform: "Instagram", followers: 84000, niche: "Bay Area mom life", er: 5.4, city: "San Jose", fit: 96, status: "new", notes: "Posts kids' outfits + activities. Perfect local fit." },
  { handle: "@activekidssf", name: "Marcus Bell", platform: "TikTok", followers: 162000, niche: "Kids sports & play", er: 7.8, city: "San Francisco", fit: 94, status: "new", notes: "Kids sports content = ideal for activewear." },
  { handle: "@siliconvalleyfamily", name: "Priya Rao", platform: "Instagram", followers: 58000, niche: "SV family lifestyle", er: 6.1, city: "Sunnyvale", fit: 97, status: "new", notes: "Local SV family audience. Top fit." },
  { handle: "@littleskaters", name: "Dana Cruz", platform: "YouTube", followers: 120000, niche: "Youth ice skating", er: 4.2, city: "Fremont", fit: 88, status: "new", notes: "Skating niche overlaps our sport line." },
  { handle: "@tinytennispros", name: "Owen Park", platform: "Instagram", followers: 46000, niche: "Junior tennis", er: 8.0, city: "Palo Alto", fit: 90, status: "new", notes: "Junior tennis — great for our tennis range." },
  { handle: "@momsofmarin", name: "Grace Turner", platform: "Instagram", followers: 134000, niche: "Parenting", er: 3.6, city: "Marin", fit: 79, status: "new", notes: "Big reach, broad parenting audience." },
  { handle: "@skibunnykids", name: "Kai Johnson", platform: "TikTok", followers: 71000, niche: "Family skiing", er: 9.0, city: "Tahoe/Bay", fit: 83, status: "new", notes: "Ski content for our winter outerwear." },
  { handle: "@thestylishtot", name: "Olivia Grant", platform: "Instagram", followers: 300000, niche: "Kids fashion", er: 2.2, city: "Los Angeles", fit: 61, status: "new", notes: "Large but not local; lower engagement." },
];

export const AGENT_STEPS = [
  { label: "Connecting to discovery sources (Instagram, TikTok, YouTube)…", ms: 900 },
  { label: "Searching: 'Bay Area kids', 'family lifestyle', 'youth sports', 'mom creators'…", ms: 1100 },
  { label: "Found 187 candidate creators within 40 mi of the Bay Area", ms: 900 },
  { label: "Enriching profiles: followers, engagement rate, recent posts…", ms: 1200 },
  { label: "Filtering: fake-follower risk, <3% engagement, off-brand niche…", ms: 1000 },
  { label: "Scoring fit: locality + kids/activewear relevance + engagement + brand safety…", ms: 1100 },
  { label: "Ranked top 8 best-fit creators for the moodytiger campaign", ms: 700 },
];

export function draftOutreachEmail(inf) {
  const first = (inf.name || inf.handle || "there").split(" ")[0];
  const audience = inf.followers ? `${(inf.followers / 1000).toFixed(0)}K community` : "community";
  const niche = (inf.niche || "kids & family").toLowerCase();
  return `Subject: ${first}, partner with moodytiger 🐯

Hi ${first},

I'm reaching out from moodytiger — technology-driven, design-led activewear for kids. We love how you cover ${niche} for your ${audience}, and it feels like a perfect match for us.

We'd love to send a gifting box for your little one and set you up on our Creator Program:
• A unique code that gives your followers a perk (and earns you a commission per sale)
• Early access to new seasonal drops
• A revenue share as you drive store + online sales

No strings on the first box — just see if you and your kids love the gear. Would you be open to a quick chat this week?

Warmly,
The moodytiger Team`;
}
