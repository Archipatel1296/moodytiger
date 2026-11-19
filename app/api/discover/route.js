// Live creator/contact discovery.
// Primary source: Apollo people search (real contacts + LinkedIn + outreach data).
// Bonus source: SerpAPI (social profiles). Both run server-side.
// Env (Vercel, NOT NEXT_PUBLIC): APOLLO_API_KEY, SERPAPI_KEY (either/both).
// If neither is set or both fail, the client falls back to seeded data.

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function parseCount(s) {
  if (!s) return null;
  const m = String(s).replace(/,/g, "").match(/([\d.]+)\s*([KkMmBb])?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const u = (m[2] || "").toUpperCase();
  if (u === "K") n *= 1e3;
  else if (u === "M") n *= 1e6;
  else if (u === "B") n *= 1e9;
  return Math.round(n);
}

function scoreFit(text, location) {
  const lc = (text || "").toLowerCase();
  let f = 64;
  const locs = ["bay area", "san francisco", "san jose", "sunnyvale", "palo alto", "oakland", "fremont", "silicon valley", "berkeley", "bay"];
  if (locs.some((l) => lc.includes(l))) f += 15;
  const niches = ["kid", "family", "mom", "parent", "toddler", "child", "activewear", "sport", "play", "tennis", "ski", "skat",
    "creator", "influencer", "blog", "content", "media", "lifestyle"];
  const hits = niches.filter((n) => lc.includes(n)).length;
  f += Math.min(20, hits * 5);
  return Math.min(98, f + Math.floor(Math.random() * 3));
}

// ── Apollo people search ─────────────────────────────────────
async function apollo(key) {
  const res = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
    method: "POST",
    headers: { "x-api-key": key, "Content-Type": "application/json", "Cache-Control": "no-cache" },
    cache: "no-store",
    body: JSON.stringify({
      person_locations: ["San Francisco, California", "San Jose, California", "Oakland, California", "Palo Alto, California"],
      q_keywords: "content creator influencer blogger parenting kids family mom",
      per_page: 10,
      page: 1,
    }),
  });
  if (!res.ok) throw new Error(`Apollo ${res.status}`);
  const data = await res.json();
  const people = data.people || data.contacts || [];
  return people.map((p) => {
    const li = p.linkedin_url || "";
    const handle = li ? "@" + li.replace(/\/+$/, "").split("/").pop() : "@" + (p.id || Math.random().toString(36).slice(2, 8));
    const org = (p.organization && p.organization.name) || p.organization_name || "";
    const title = p.title || p.headline || "";
    const city = [p.city, p.state].filter(Boolean).join(", ") || "Bay Area";
    const text = `${title} ${org} ${city}`;
    return {
      handle,
      name: p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || handle.replace("@", ""),
      platform: "LinkedIn",
      followers: null,
      er: null,
      city,
      niche: "kids & family",
      fit: scoreFit(text, city),
      status: "new",
      notes: [title, org].filter(Boolean).join(" · ") || "Contact found via Apollo",
      profileUrl: li || null,
    };
  });
}

// ── SerpAPI social search ────────────────────────────────────
function parseProfile(link) {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, "");
    const parts = u.pathname.split("/").filter(Boolean);
    if (host.includes("instagram.com")) {
      const skip = ["p", "reel", "reels", "explore", "tags", "accounts", "stories"];
      if (parts[0] && !skip.includes(parts[0].toLowerCase())) return { platform: "Instagram", handle: "@" + parts[0].replace("@", "") };
    }
    if (host.includes("tiktok.com")) {
      const seg = parts.find((p) => p.startsWith("@"));
      if (seg) return { platform: "TikTok", handle: seg };
    }
    if (host.includes("youtube.com")) {
      if (parts[0] && parts[0].startsWith("@")) return { platform: "YouTube", handle: parts[0] };
      if (["channel", "c", "user"].includes(parts[0])) return { platform: "YouTube", handle: "@" + (parts[1] || "channel") };
    }
    return null;
  } catch {
    return null;
  }
}
function cleanName(title, handle) {
  if (!title) return handle.replace("@", "");
  let t = title.split("•")[0].split("|")[0].split(" on ")[0];
  t = t.replace(/\s*[-–]\s*(YouTube|Instagram|TikTok|Facebook).*$/i, "");
  t = t.replace(/\(@[^)]+\)/, "").replace(/["“”]/g, "").trim();
  return t || handle.replace("@", "");
}
async function serp(key) {
  const loc = "Bay Area San Francisco";
  const niche = "kids family mom activewear";
  const queries = [`${niche} ${loc} site:instagram.com`, `${niche} ${loc} site:tiktok.com`];
  const batches = await Promise.all(
    queries.map((q) =>
      fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&num=10&api_key=${key}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { organic_results: [] }))
        .then((d) => d.organic_results || [])
        .catch(() => [])
    )
  );
  const out = [];
  for (const batch of batches) {
    for (const r of batch) {
      const prof = parseProfile(r.link || "");
      if (!prof) continue;
      const text = `${r.title || ""} ${r.snippet || ""}`;
      const fm = text.match(/([\d.,]+[KkMmBb]?)\s*[Ff]ollowers/);
      out.push({
        handle: prof.handle,
        name: cleanName(r.title, prof.handle),
        platform: prof.platform,
        followers: fm ? parseCount(fm[1]) : null,
        er: null,
        city: "Bay Area",
        niche: "kids & family",
        fit: scoreFit(text, "bay area"),
        status: "new",
        notes: r.snippet || "Found via web search.",
        profileUrl: r.link,
      });
    }
  }
  return out;
}

export async function POST() {
  const apolloKey = process.env.APOLLO_API_KEY;
  const serpKey = process.env.SERPAPI_KEY;
  if (!apolloKey && !serpKey) {
    return Response.json({ ok: false, error: "No discovery key set", results: [] }, { status: 200 });
  }

  const [apolloRes, serpRes] = await Promise.all([
    apolloKey ? apollo(apolloKey).catch((e) => ({ error: String(e) })) : null,
    serpKey ? serp(serpKey).catch(() => []) : null,
  ]);

  const used = [];
  let merged = [];
  if (Array.isArray(apolloRes) && apolloRes.length) { merged = merged.concat(apolloRes); used.push("apollo"); }
  if (Array.isArray(serpRes) && serpRes.length) { merged = merged.concat(serpRes); used.push("serpapi"); }

  // dedupe by handle
  const seen = new Set();
  const results = [];
  for (const r of merged) {
    const h = (r.handle || "").toLowerCase();
    if (h && seen.has(h)) continue;
    seen.add(h);
    results.push(r);
  }
  results.sort((a, b) => b.fit - a.fit);

  if (!results.length) {
    const err = (apolloRes && apolloRes.error) || "No results";
    return Response.json({ ok: false, error: err, results: [] }, { status: 200 });
  }
  return Response.json({ ok: true, source: used.join("+") || "live", results: results.slice(0, 15) });
}
