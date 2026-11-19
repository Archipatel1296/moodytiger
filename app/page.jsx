import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { TIERS } from "@/lib/menu";
import { ORDER_URL } from "@/lib/supabaseClient";

const ENGINE = [
  { icon: "🎨", title: "Creator Studio", desc: "Design social campaigns — captions, hashtags, a content calendar, and AI-generated creatives — then schedule and post." },
  { icon: "🎟️", title: "Miles Club", desc: "Grow loyalty with miles, tiers and receipt codes kids' parents can claim in store or online." },
  { icon: "⭐", title: "Local Creators", desc: "An agent that finds Bay Area family & kids creators, scores fit, and drafts outreach." },
  { icon: "📊", title: "Analytics", desc: "See how local awareness turns into store sales, member growth and campaign ROI." },
];

export default function HomePage() {
  return (
    <main className="bg-play min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tiger">
              🐯 Kids activewear · Bay Area
            </div>
            <h1 className="display text-5xl text-ink sm:text-6xl md:text-7xl">
              Comfort that<br />keeps up.
            </h1>
            <p className="mt-5 max-w-md text-lg text-mute">
              Technology-driven, design-led activewear for kids — now with an AI marketing
              engine that turns local awareness into store sales.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-primary text-base">Shop the collection →</a>
              <Link href="/loyalty" className="pill-ghost text-base">Join the Miles Club</Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { e: "🧒", c: "bg-sun/20" }, { e: "⛸️", c: "bg-sky/15" },
                { e: "🎾", c: "bg-lime/20" }, { e: "🧥", c: "bg-tiger/15" },
              ].map((b, i) => (
                <div key={i} className={`flex aspect-square items-center justify-center rounded-xl2 border border-ink/10 ${b.c} text-6xl animate-floaty`} style={{ animationDelay: `${i * 0.5}s` }}>
                  {b.e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MILES CLUB TEASER */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="card p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-tiger">Rewards</div>
              <h2 className="display mt-2 text-4xl text-ink">The Miles Club</h2>
              <p className="mt-3 max-w-md text-mute">
                Earn a mile for every dollar — in store or online. Climb from Cub to Legend
                and unlock free gear, early access and more.
              </p>
              <Link href="/loyalty" className="pill-primary mt-6">Join free →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIERS.map((t) => (
                <div key={t.name} className="panel p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="font-bold text-ink">{t.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-mute">{t.min}+ miles</div>
                  <div className="mt-2 text-sm text-ink/70">{t.perk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING ENGINE */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-sky">For the moodytiger team</div>
          <h2 className="display mt-2 text-4xl text-ink">The AI Marketing Engine</h2>
          <p className="mx-auto mt-3 max-w-xl text-mute">
            Everything the team needs to grow local awareness and sales — in one owner dashboard.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ENGINE.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl">{f.icon}</div>
              <div className="mt-3 font-bold text-ink">{f.title}</div>
              <p className="mt-1 text-sm text-mute">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/admin" className="pill-primary text-base">Open the dashboard →</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
