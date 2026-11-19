import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="display text-2xl text-ink">🐯 moodytiger</div>
          <p className="mt-3 max-w-sm text-sm text-mute">
            Technology-driven, design-led activewear for kids. Comfort that keeps up —
            so nothing gets in the way of play.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-tiger">Explore</div>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li><Link href="/loyalty" className="hover:text-ink">Miles Club</Link></li>
            <li><a href="https://moodytiger.com/" className="hover:text-ink">Shop</a></li>
            <li><Link href="/admin" className="hover:text-ink">Owner login</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-tiger">Marketing Engine</div>
          <p className="mt-3 text-sm text-mute">
            Design & post social campaigns, grow the Miles Club, and turn Bay Area
            awareness into store sales.
          </p>
        </div>
      </div>
      <div className="border-t border-ink/5 py-5 text-center text-xs text-mute">
        © {new Date().getFullYear()} moodytiger · Local Marketing Engine
      </div>
    </footer>
  );
}
