// Creator Studio content engine for moodytiger.
// Designs a full social campaign: strategy, content calendar, ready-to-post
// captions + hashtags per platform, and a creative brief / Framia prompt.

export const GOALS = [
  { id: "newdrop", label: "New seasonal drop", detail: "Collection (e.g. Winter Outerwear)" },
  { id: "backtoschool", label: "Back-to-school push", detail: "" },
  { id: "localstore", label: "Drive Bay Area store visits", detail: "" },
  { id: "sport", label: "Sport-specific launch", detail: "Sport (e.g. Tennis)" },
  { id: "miles", label: "Grow the Miles Club", detail: "Bonus (e.g. 2x miles)" },
  { id: "giftguide", label: "Holiday gift guide", detail: "Occasion (e.g. Holidays)" },
];

const pick = (a) => a[Math.floor(Math.random() * a.length)];

const BASE_TAGS = ["#moodytiger", "#kidsactivewear", "#kidsfashion", "#activekids", "#bayareakids"];

function content(goal, detail) {
  const d = (detail || "").trim();
  switch (goal) {
    case "newdrop": {
      const c = d || "the new collection";
      return {
        objective: `Launch ${c} and drive first-week sales online and in store.`,
        offer: "Early access for Miles members + free shipping on the drop.",
        hooks: [
          `Just dropped: ${c}. Built to move the way kids do. 🐯`,
          `New season, new gear — ${c} is here and made for all-day play.`,
          `${c} has landed. Comfort that keeps up, now in fresh colors.`,
        ],
        concept: `Bright, playful flat-lays and action shots of kids in ${c} — running, jumping, mid-play. Natural light, moodytiger orange accents.`,
      };
    }
    case "backtoschool":
      return {
        objective: "Capture back-to-school demand from Bay Area parents.",
        offer: "Bundle & save: 15% off 3+ everyday items.",
        hooks: [
          "Back-to-school, sorted. Comfy layers kids actually want to wear. 🎒",
          "First-bell ready: durable, comfy moodytiger basics for every school day.",
          "Less laundry drama, more play. Back-to-school picks that keep up.",
        ],
        concept: "Kids heading to school / playground in moodytiger basics. Warm, candid, morning light.",
      };
    case "localstore":
      return {
        objective: "Turn local awareness into Bay Area store foot traffic.",
        offer: "In-store only: free moodytiger socks with any purchase this weekend.",
        hooks: [
          "Bay Area families — come play with us this weekend. 🐯 In-store treat inside!",
          "We're in your neighborhood. Swing by the store for a free-socks surprise.",
          "Local & loving it: visit us this weekend for an in-store moodytiger perk.",
        ],
        concept: "Storefront + family walking in, local Bay Area feel. Map pin graphic, weekend-only badge.",
      };
    case "sport": {
      const s = d || "sport";
      return {
        objective: `Position moodytiger as the go-to for youth ${s.toLowerCase()}.`,
        offer: `Shop the ${s} range — Miles members earn double this week.`,
        hooks: [
          `Little ${s.toLowerCase()} stars, big comfort. The moodytiger ${s} range is built to perform. 🎾`,
          `From warm-up to winner: gear that keeps up with young ${s.toLowerCase()} players.`,
          `Game on. Our ${s} collection moves the way your kid does.`,
        ],
        concept: `Action shots of kids playing ${s.toLowerCase()} in moodytiger gear — motion, focus, joy.`,
      };
    }
    case "miles": {
      const b = d || "2x";
      return {
        objective: `Accelerate Miles Club sign-ups and repeat purchases with a ${b} miles boost.`,
        offer: `${b} miles on every purchase this week — in store and online.`,
        hooks: [
          `Double the play, ${b} the miles. Join the moodytiger Miles Club this week. 🎟️`,
          `Your purchases just got more rewarding — ${b} miles for a limited time.`,
          `Cub to Legend, faster: ${b} miles on everything this week.`,
        ],
        concept: "Playful rewards graphic — tiger mascot, miles counter climbing, tier badges.",
      };
    }
    case "giftguide": {
      const o = d || "the holidays";
      return {
        objective: `Win ${o} gifting for kids with a curated moodytiger guide.`,
        offer: "Gift-ready bundles + a free gift box with orders $75+.",
        hooks: [
          `The ${o} gift that gets worn on repeat. 🎁 Our kids' gift guide is live.`,
          `Skip the toys that get forgotten — gift comfort they'll live in this ${o}.`,
          `Sorted: the moodytiger ${o} gift guide for active little ones.`,
        ],
        concept: "Cozy gift-wrapped moodytiger pieces, warm holiday palette, family unboxing.",
      };
    }
    default:
      return { objective: "", offer: "", hooks: [""], concept: "" };
  }
}

function captionFor(platform, hook, offer) {
  if (platform === "TikTok")
    return `${hook}\n\nPOV: comfy gear that keeps up with every tumble, sprint and spin. ${offer} Link in bio 🐯`;
  if (platform === "Instagram")
    return `${hook}\n\n${offer}\nTap the link in bio to shop. Which look is your favorite? 👇`;
  return `${hook} ${offer}`;
}

function calendar(channel) {
  return [
    { when: "Day 1 · Mon", channel: "Instagram", format: "Carousel", idea: "Launch post — hero shots + offer" },
    { when: "Day 2 · Tue", channel: "TikTok", format: "Short video", idea: "Kids-in-motion clip, trending audio" },
    { when: "Day 4 · Thu", channel: "Email (Miles)", format: "Email", idea: "Miles-member early access + reward" },
    { when: "Day 6 · Sat", channel: "Instagram", format: "Stories", idea: "UGC / behind-the-scenes + countdown" },
  ];
}

function kpis() {
  return [
    { metric: "Reach", target: "40k–80k" },
    { metric: "Engagement", target: "5–9%" },
    { metric: "Store/online conv.", target: "2–4%" },
  ];
}

export function generatePlan({ goal, detail, channel = "Instagram", audience = "Bay Area parents", audienceSize = 0 }) {
  const c = content(goal, detail);
  const goalMeta = GOALS.find((g) => g.id === goal);
  const tags = [...BASE_TAGS, goal === "sport" && detail ? `#kids${detail.toLowerCase().replace(/\s+/g, "")}` : null].filter(Boolean);

  const platforms = ["Instagram", "TikTok"];
  const posts = platforms.map((p) => ({
    platform: p,
    caption: captionFor(p, pick(c.hooks), c.offer),
    hashtags: tags,
  }));

  return {
    title: goalMeta ? goalMeta.label : "Campaign",
    objective: c.objective,
    audience: {
      segment: audience,
      size: audienceSize,
      why: audience === "Bay Area parents"
        ? "Local parents are the primary shoppers and drive store visits."
        : `Focused on ${audience.toLowerCase()} for higher relevance.`,
    },
    offer: c.offer,
    calendar: calendar(channel),
    posts,
    creative: {
      concept: c.concept,
      framiaPrompt: `moodytiger ${goalMeta?.label || "campaign"}${detail ? " — " + detail : ""}: ${c.concept} Brand: playful, bright, kids activewear, orange accents. Output: a 9:16 social ad video, upbeat, 10s.`,
    },
    kpis: kpis(),
    projection: `Est. ${Math.max(1, Math.round((audienceSize || 2000) * 0.03))} conversions at a 3% rate.`,
  };
}
