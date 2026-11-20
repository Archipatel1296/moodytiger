// Live creator discovery.
// Primary source: SerpAPI (Google) — several targeted searches, parsed into
// real creator profiles/handles. Apollo is attempted only as a bonus and is
// skipped gracefully (Apollo's people-search API is not on free plans).
// Env (Vercel, server-side, NOT NEXT_PUBLIC): SERPAPI_KEY, APOLLO_API_KEY (optional).
// If nothing is configured or all sources fail, the client falls back to seeded data.

export const dynamic = "force-dynamic";
export const maxDuration = 45;

const BLOCK = new Set([
  "gmail", "yahoo", "outlook", "hotmail", "icloud", "email", "mailto",
  "instagram", "tiktok", "youtube", "twitter", "x", "facebook", "threads",
  "explore", "reels", "reel", "shorts", "watch", "home", "about", "media",
]);

function parseCount(s) {
  if (!s) return null;
  const m = String(s).replace(/,/g, "").match(/([\d.]+)\s*([KkMmBb])?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const u = (m[2] || "").toUpperCase();
  if (u === "K") n *= 1e3; else if (u === "M") n *= 1e6; else if (u === "B") n *= 1e9;
  return Math.round(n);
}

function scoreFit(text) {
  const lc = (text || "").toLowerCase();
  let f = 66;
  const locs = ["bay area", "san francisco", "san jose", "sunnyvale", "palo alto", "oakland", "fremont", "silicon valley", "berkeley", "marin", "bay"];
  if (locs.some((l) => lc.includes(l))) f += 14;
  const niches = ["kid", "family", "mom", "parent", "toddler", "child", "activewear", "sport", "play", "tennis", "ski", "skat", "creator", "influencer", "blog", "content", "lifestyle"];
  f += Math.min(18, niches.filter((n) => lc.includes(n)).length * 4);
  return Math.min(98, f + Math.floor(Math.random() * 3));
}

function profileFromLink(link) {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, "");
    const parts = u.pathname.split("/").filter(Boolean);
    if (host.includes("instagram.com")) {
      if (parts[0] && !BLOCK.has(parts[0].toLowerCase()) && parts[0] !== "p")
        return { platform: "Instagram", handle: "@" + parts[0].replace("@", ""), url: link };
    }
    if (host.includes("tiktok.com")) {
      const seg = parts.find((x) => x.startsWith("@"));
      if (seg) return { platform: "TikTok", handle: seg, url: link };
    }
    if (host.includes("youtube.com")) {
      if (parts[0] && parts[0].startsWith("@")) return { platform: "YouTube", handle: parts[0], url: link };
      if (["channel", "c", "user"].includes(parts[0])) return { platform: "YouTube", handle: "@" + (parts[1] || "channel"), url: link };
    }
  } catch { /* ignore */ }
  return null;
}

function cleanName(title, handle) {
  if (!title) return handle.replace("@", "");
  let t = title.split("•")[0].split("|")[0].split(" on ")[0].split(" - ")[0];
  t = t.replace(/\(@[^)]+\)/, "").replace(/["“”]/g, "").trim();
  return t || handle.replace("@", "");
}

function handlesFromText(text, platform) {
  const out = [];
  const re = /@([A-Za-z0-9._]{3,30})/g;
  let m;
  while ((m = re.exec(text || "")) !== null) {
    const name = m[1].replace(/\.$/, "");
    const low = name.toLowerCase();
    if (BLOCK.has(low)) continue;
    if (/\.(com|net|org|io|co)$/i.test(name)) continue; // looks like an email/domain
    out.push({ platform, handle: "@" + name, url: null });
  }
  return out;
}

async function serp(key) {
  const QUERIES = [
    { q: 'bay area mom influencer instagram', p: "Instagram" },
    { q: 'san francisco bay area family content creator instagram', p: "Instagram" },
    { q: 'bay area kids family lifestyle creator tiktok', p: "TikTok" },
    { q: 'silicon valley parenting blogger instagram', p: "Instagram" },
    { q: 'bay area youth sports kids creator youtube', p: "YouTube" },
  ];
  const batches = await Promise.all(
    QUERIES.map(({ q }) =>
      fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&num=20&gl=us&hl=en&api_key=${key}`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : {}))
        .then((d) => d.organic_results || [])
        .catch(() => [])
    )
  );

  const out = [];
  batches.forEach((batch, qi) => {
    const platform = QUERIES[qi].p;
    for (const r of batch) {
      const text = `${r.title || ""} ${r.snippet || ""}`;
      const fm = text.match(/([\d.,]+[KkMmBb]?)\s*[Ff]ollowers/);
      const followers = fm ? parseCount(fm[1]) : null;
      const cands = [];
      const linkProf = profileFromLink(r.link || "");
      if (linkProf) cands.push(linkProf);
      // also mine @handles from the title/snippet (listicles name several creators)
      handlesFromText(text, platform).forEach((h) => cands.push(h));
      for (const c of cands) {
        out.push({
          handle: c.handle,
          name: cleanName(r.title, c.handle),
          platform: c.platform,
          followers,
          er: null,
          city: "Bay Area",
          niche: "kids & family",
          fit: scoreFit(text),
          status: "new",
          notes: (r.snippet || r.title || "Found via web search.").slice(0, 180),
          profileUrl: c.url || `https://www.google.com/search?q=${encodeURIComponent(c.handle + " " + c.platform)}`,
        });
      }
    }
  });
  return out;
}

async function apollo(key) {
  // Optional — only works on paid Apollo plans; fails gracefully otherwise.
  const res = await fetch("https://api.apollo.io/api/v1/mixed_people/search", {
    method: "POST",
    headers: { "x-api-key": key, "Content-Type": "application/json", "Cache-Control": "no-cache" },
    cache: "no-store",
    body: JSON.stringify({
      person_locations: ["San Francisco, California", "San Jose, California", "Oakland, California"],
      person_titles: ["content creator", "influencer", "blogger"],
      per_page: 10, page: 1,
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
    return {
      handle, name: p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || handle.replace("@", ""),
      platform: "LinkedIn", followers: null, er: null, city, niche: "kids & family",
      fit: scoreFit(`${title} ${org} ${city}`), status: "new",
      notes: [title, org].filter(Boolean).join(" · ") || "Contact via Apollo", profileUrl: li || null,
    };
  });
}

export async function POST() {
  const serpKey = process.env.SERPAPI_KEY;
  const apolloKey = process.env.APOLLO_API_KEY;
  if (!serpKey && !apolloKey) {
    return Response.json({ ok: false, error: "No discovery key set", results: [] });
  }

  const [serpRes, apolloRes] = await Promise.all([
    serpKey ? serp(serpKey).catch((e) => ({ error: String(e) })) : null,
    apolloKey ? apollo(apolloKey).catch((e) => ({ error: String(e) })) : null,
  ]);

  const used = [];
  let merged = [];
  if (Array.isArray(serpRes) && serpRes.length) { merged = merged.concat(serpRes); used.push("serpapi"); }
  if (Array.isArray(apolloRes) && apolloRes.length) { merged = merged.concat(apolloRes); used.push("apollo"); }

  // dedupe by handle (case-insensitive)
  const seen = new Set();
  const results = [];
  for (const r of merged) {
    const h = (r.handle || "").toLowerCase();
    if (!h || seen.has(h)) continue;
    seen.add(h);
    results.push(r);
  }
  results.sort((a, b) => b.fit - a.fit);

  if (!results.length) {
    const err = (serpRes && serpRes.error) || (apolloRes && apolloRes.error) || "No results";
    return Response.json({ ok: false, error: String(err), results: [] });
  }
  return Response.json({ ok: true, source: used.join("+"), count: results.length, results: results.slice(0, 15) });
}
