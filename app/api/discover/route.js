// Live creator discovery via SerpAPI.
// Configure SERPAPI_KEY in Vercel (server-side — NOT NEXT_PUBLIC).
// If it's missing or the call fails, the client falls back to seeded data.

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

function parseProfile(link) {
  try {
    const u = new URL(link);
    const host = u.hostname.replace(/^www\./, "");
    const parts = u.pathname.split("/").filter(Boolean);
    if (host.includes("instagram.com")) {
      const skip = ["p", "reel", "reels", "explore", "tags", "accounts", "stories"];
      if (parts[0] && !skip.includes(parts[0].toLowerCase()))
        return { platform: "Instagram", handle: "@" + parts[0].replace("@", "") };
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

function scoreFit(text, location) {
  const lc = (text || "").toLowerCase();
  let f = 66;
  const locs = ["bay area", "san francisco", "san jose", "sunnyvale", "palo alto", "oakland", "fremont", "silicon valley", "bay"];
  if (locs.some((l) => lc.includes(l))) f += 15;
  const niches = ["kid", "family", "mom", "parent", "toddler", "child", "activewear", "sport", "play", "tennis", "ski", "skat"];
  const hits = niches.filter((n) => lc.includes(n)).length;
  f += Math.min(15, hits * 6);
  return Math.min(98, f + Math.floor(Math.random() * 3));
}

async function serp(query, key) {
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&num=10&api_key=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`SerpAPI ${res.status}`);
  const data = await res.json();
  return data.organic_results || [];
}

export async function POST(req) {
  const key = process.env.SERPAPI_KEY;
  if (!key) return Response.json({ ok: false, error: "SERPAPI_KEY not set", results: [] }, { status: 200 });

  let body = {};
  try { body = await req.json(); } catch {}
  const niche = (body.niche || "kids family mom activewear").trim();
  const location = (body.location || "Bay Area San Francisco").trim();

  // Two targeted site-searches so we land on real creator profiles.
  const queries = [
    `${niche} ${location} site:instagram.com`,
    `${niche} ${location} site:tiktok.com`,
  ];

  try {
    const batches = await Promise.all(queries.map((q) => serp(q, key).catch(() => [])));
    const seen = new Set();
    const results = [];
    for (const batch of batches) {
      for (const r of batch) {
        const prof = parseProfile(r.link || "");
        if (!prof) continue;
        const h = prof.handle.toLowerCase();
        if (seen.has(h)) continue;
        seen.add(h);
        const text = `${r.title || ""} ${r.snippet || ""}`;
        const followersMatch = text.match(/([\d.,]+[KkMmBb]?)\s*[Ff]ollowers/);
        results.push({
          handle: prof.handle,
          name: cleanName(r.title, prof.handle),
          platform: prof.platform,
          followers: followersMatch ? parseCount(followersMatch[1]) : null,
          er: null,
          city: location,
          niche,
          fit: scoreFit(text, location),
          status: "new",
          notes: r.snippet || "Found via live search.",
          profileUrl: r.link,
        });
      }
    }
    results.sort((a, b) => b.fit - a.fit);
    return Response.json({ ok: true, source: "serpapi", results: results.slice(0, 10) });
  } catch (e) {
    return Response.json({ ok: false, error: String(e), results: [] }, { status: 200 });
  }
}
