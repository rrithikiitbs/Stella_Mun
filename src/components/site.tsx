import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/components/artwork";
import type { ArtworkKey } from "@/lib/artwork";
import { Nav, RegisterButton, BackToTop } from "@/components/site-navigation";

export { Nav, RegisterButton };

export function Footer() {
  return <footer className="museum-footer"><div className="footer-art" aria-hidden="true"><Artwork name="laurel" ratio="1 / 1" className="footer-laurel" decorative/></div><div className="wrap footer-main">
    <div className="footer-brand-block"><Link href="/" className="footer-brand"><Image src="/images/stell-logo.jpeg" alt="" width={66} height={66}/><span><strong>STELLA MARIS</strong><small>MODEL UNITED NATIONS · 2027</small></span></Link><p>Two days of diplomacy, dialogue and ideas that move beyond borders.</p><span className="footer-date">29—30 JANUARY 2027 <i>·</i> CHENNAI</span></div>
    <div className="footer-col"><span className="eyebrow">Explore</span><Link href="/about">The conference</Link><Link href="/committees">Committees</Link><Link href="/events">Events & activities</Link><Link href="/schedule">Itinerary</Link></div>
    <div className="footer-col"><span className="eyebrow">For delegates</span><Link href="/delegates">Delegate information</Link><Link href="/resources">Resources library</Link><Link href="/secretariat">Secretariat</Link><Link href="/contact">Contact the team</Link></div>
    <div className="footer-cta"><span className="eyebrow">Your place at the table</span><p>Be part of the conversation.</p><RegisterButton/></div>
  </div><div className="wrap footer-bottom"><span>© PRR007 2027 Stella Maris Model United Nations</span><span>Stella Maris College <i>·</i> Chennai, India</span><BackToTop/></div></footer>;
}

export function Shell({ children }: { children: React.ReactNode }) { return <><Nav/>{children}<Footer/></>; }

export function PageHero({ kicker, title, children, artwork = "arch", index = "01", tone = "dark" }: { kicker: string; title: string; children?: React.ReactNode; artwork?: ArtworkKey; index?: string; tone?: "dark" | "light" }) {
  return <section className={`page-opener opener-${tone}`}><div className="page-opener-art"><Artwork name={artwork} ratio="16 / 10" sizes="(max-width: 760px) 100vw, 60vw" className="opener-artwork"/></div><div className="wrap page-opener-content"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{children && <p className="opener-deck">{children}</p>}<div className="opener-footer"><span className="opener-rule"/><span>{index} / STELLA MARIS MUN · 2027</span></div></div><span className="opener-ghost-number" aria-hidden="true">{index}</span></section>;
}
