import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { ORDER_URL } from "@/lib/supabaseClient";

const ENGINE = [
  { icon: "🎨", title: "Creator Studio", desc: "Design social campaigns and generate ad videos with Framia — built right into the dashboard." },
  { icon: "⭐", title: "Influencer Studio", desc: "An agent that finds Bay Area family & kids creators, scores fit, and drafts outreach." },
  { icon: "🎟️", title: "Miles Club", desc: "Grow loyalty with miles, tiers and receipt codes parents claim in store or online." },
  { icon: "📊", title: "Live Analytics", desc: "Connect Shopify & Instagram and watch local awareness turn into store sales." },
];

function Sparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="spk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6B35" />
          <stop offset="0.5" stopColor="#FFC53D" />
          <stop offset="1" stopColor="#2DA7FF" />
        </linearGradient>
      </defs>
      <path d="M24 2c1 12 9 20 22 22-13 2-21 10-22 22-1-12-9-20-22-22 13-2 21-10 22-22z" fill="url(#spk)" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="bg-landing min-h-screen">
      {/* minimal nav — logo + Login only */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-lg">🐯</span>
          <span className="display text-xl font-600 lowercase tracking-tight text-ink">moodytiger</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1 shadow-card backdrop-blur">
          <Link href="/admin" className="pill-dark px-6 py-2 text-sm">Login</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tiger">
              🐯 moodytiger · AI Local Marketing Engine
            </div>

            <h1 className="display text-[3.2rem] leading-[0.95] text-ink sm:text-7xl md:text-8xl">
              <span className="inline-flex flex-wrap items-center">
                Marke
                <span className="mx-2 inline-block h-[3px] w-10 rounded-full bg-tiger align-middle sm:w-14" />
                <Sparkle className="mx-1 h-8 w-8 sm:h-11 sm:w-11" />
                ting
              </span>
              <br />
              done easy, as always
            </h1>

            <p className="mt-6 max-w-md text-lg text-mute">
              Design and post social campaigns, discover Bay Area creators, grow the Miles Club,
              and watch local awareness turn into store sales — all from one owner dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admin" className="pill-dark text-base">Open the dashboard →</Link>
              <Link href="/loyalty" className="pill-ghost text-base">Explore the Miles Club</Link>
            </div>

            {/* solution line — replaces "Industry leader since 2014" */}
            <div className="mt-12 flex items-center gap-2 text-sm font-semibold text-ink/70">
              <Sparkle className="h-4 w-4" />
              One engine that turns local buzz into store sales.
            </div>
          </div>

          {/* 3D gradient disc */}
          <div className="relative flex justify-center">
            <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]" style={{ perspective: "1100px" }}>
              <div
                className="absolute inset-0 rounded-full opacity-70 blur-3xl"
                style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,107,53,.55), rgba(45,167,255,.4) 55%, transparent 72%)" }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  transform: "rotateX(58deg) rotateZ(-24deg)",
                  background:
                    "conic-gradient(from 150deg at 50% 50%, #FF6B35, #FFC53D, #5BC236, #2DA7FF, #8B5CF6, #FF6B35)",
                  boxShadow: "0 50px 90px -24px rgba(45,167,255,.55), inset 0 0 70px rgba(255,255,255,.3)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.75), transparent 42%)" }}
                />
                <div
                  className="absolute rounded-full"
                  style={{ inset: "30%", background: "#F4F5F7", boxShadow: "inset 0 14px 36px rgba(27,27,47,.16)" }}
                />
              </div>
              <Sparkle className="absolute -right-2 top-6 h-10 w-10 animate-floaty" />
              <Sparkle className="absolute bottom-10 left-0 h-6 w-6 animate-floaty" />
            </div>
          </div>
        </div>
      </section>

      {/* ENGINE FEATURES */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGINE.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl">{f.icon}</div>
              <div className="mt-3 font-bold text-ink">{f.title}</div>
              <p className="mt-1 text-sm text-mute">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/admin" className="pill-primary text-base">Open the dashboard →</Link>
          <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-ghost text-base">Visit the store</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
