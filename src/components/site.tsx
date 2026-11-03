"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Artwork } from "@/components/artwork";
import type { ArtworkKey } from "@/lib/artwork";

type PublicSettings = { registration_url: string | null; registration_enabled: boolean; registration_button_text: string; registration_message: string; contact_email?: string | null; sections: Record<string, boolean> };
let cachedSettings: PublicSettings | null = null;
let fetchedAt = 0;
let settingsRequest: Promise<PublicSettings> | null = null;
async function getPublicSettings() {
  if (cachedSettings && Date.now() - fetchedAt < 15000) return cachedSettings;
  if (!settingsRequest) settingsRequest = fetch("/api/public/settings", { cache: "no-store" }).then(response => { if (!response.ok) throw new Error("Settings unavailable"); return response.json(); }).then(settings => { cachedSettings = settings; fetchedAt = Date.now(); return settings; }).finally(() => { settingsRequest = null; });
  return settingsRequest;
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    getPublicSettings().then(settings => setSections(settings.sections ?? {})).catch(() => {});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const allLinks: [string, string, string][] = [["About", "/about", "about"], ["Committees", "/committees", "committees"], ["Events", "/events", "events"], ["Schedule", "/schedule", "schedule"], ["Resources", "/resources", "resources"], ["Secretariat", "/secretariat", "secretariat"], ["Contact", "/contact", "contact"]];
  const links = allLinks.filter(([, , key]) => sections[key] !== false);
  return <>
    <header className={`museum-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="nav-identity" aria-label="Stella Maris MUN home"><Image src="/images/stell-logo.jpeg" alt="" width={46} height={46} className="nav-logo"/><span>STELLA <i>MARIS</i><small>MODEL UNITED NATIONS · 2027</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, path]) => <Link key={label} href={path} className={pathname === path || pathname.startsWith(`${path}/`) ? "active" : ""} aria-current={pathname === path ? "page" : undefined}>{label}</Link>)}<RegisterButton className="nav-register"/></nav>
      <button className="mobile-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
    </header>
    {open && <div className="mobile-nav-backdrop" onClick={() => setOpen(false)}><nav className="mobile-nav" aria-label="Mobile navigation" onClick={event => event.stopPropagation()}><div className="mobile-nav-heading"><span className="eyebrow">Navigate</span><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><X/></button></div>{links.map(([label, path], index) => <Link key={label} href={path} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}<ArrowUpRight size={17}/></Link>)}<RegisterButton className="button-gold mobile-register"/></nav></div>}
  </>;
}

export function RegisterButton({ className = "" }: { className?: string }) {
  const [settings, setSettings] = useState<PublicSettings | null>(cachedSettings);
  useEffect(() => { getPublicSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  if (settings?.registration_enabled && settings.registration_url) return <a className={`button button-gold ${className}`} target="_blank" rel="noreferrer" href={settings.registration_url}>{settings.registration_button_text || "Register now"}<ArrowUpRight size={16}/></a>;
  return <span className={`button button-disabled ${className}`} aria-label={settings?.registration_message || "Registration details will be announced shortly"}>{settings?.registration_message || "Registration soon"}</span>;
}

export function Footer() {
  return <footer className="museum-footer"><div className="footer-art" aria-hidden="true"><Artwork name="laurel" ratio="1 / 1" className="footer-laurel" decorative/></div><div className="wrap footer-main">
    <div className="footer-brand-block"><Link href="/" className="footer-brand"><Image src="/images/stell-logo.jpeg" alt="" width={66} height={66}/><span><strong>STELLA MARIS</strong><small>MODEL UNITED NATIONS · 2027</small></span></Link><p>Two days of diplomacy, dialogue and ideas that move beyond borders.</p><span className="footer-date">29—30 JANUARY 2027 <i>·</i> CHENNAI</span></div>
    <div className="footer-col"><span className="eyebrow">Explore</span><Link href="/about">The conference</Link><Link href="/committees">Committees</Link><Link href="/events">Events & activities</Link><Link href="/schedule">Programme</Link></div>
    <div className="footer-col"><span className="eyebrow">For delegates</span><Link href="/delegates">Delegate information</Link><Link href="/resources">Resources library</Link><Link href="/secretariat">Secretariat</Link><Link href="/contact">Contact the team</Link></div>
    <div className="footer-cta"><span className="eyebrow">Your place at the table</span><p>Be part of the conversation.</p><RegisterButton/></div>
  </div><div className="wrap footer-bottom"><span>© 2027 Stella Maris Model United Nations</span><span>Stella Maris College <i>·</i> Chennai, India</span><a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to the beginning ↑</a></div></footer>;
}

export function Shell({ children }: { children: React.ReactNode }) { return <><Nav/>{children}<Footer/></>; }

export function PageHero({ kicker, title, children, artwork = "arch", index = "01", tone = "dark" }: { kicker: string; title: string; children?: React.ReactNode; artwork?: ArtworkKey; index?: string; tone?: "dark" | "light" }) {
  return <section className={`page-opener opener-${tone}`}><div className="page-opener-art"><Artwork name={artwork} ratio="16 / 10" sizes="(max-width: 760px) 100vw, 60vw" className="opener-artwork"/></div><div className="wrap page-opener-content"><p className="eyebrow">{kicker}</p><h1>{title}</h1>{children && <p className="opener-deck">{children}</p>}<div className="opener-footer"><span className="opener-rule"/><span>{index} / STELLA MARIS MUN · 2027</span></div></div><span className="opener-ghost-number" aria-hidden="true">{index}</span></section>;
}
