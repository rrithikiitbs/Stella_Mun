"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

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
  const allLinks: [string, string, string][] = [["About", "/about", "about"], ["Committees", "/committees", "committees"], ["Events", "/events", "events"], ["Itinerary", "/schedule", "schedule"], ["Resources", "/resources", "resources"], ["Secretariat", "/secretariat", "secretariat"], ["Contact", "/contact", "contact"]];
  const links = allLinks.filter(([, , key]) => sections[key] !== false);
  return <>
    <header className={`museum-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="nav-identity" aria-label="Stella Maris MUN home"><Image src="/images/stell-logo.jpeg" alt="" width={46} height={46} className="nav-logo"/><span>STELLA <i>MARIS</i><small>MODEL UNITED NATIONS · 2027</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, path]) => <Link key={label} href={path} className={pathname === path || pathname.startsWith(`${path}/`) ? "active" : ""} aria-current={pathname === path || pathname.startsWith(`${path}/`) ? "page" : undefined}>{label}</Link>)}<RegisterButton className="nav-register"/></nav>
      <button className="mobile-menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
    </header>
    {open && <div className="mobile-nav-backdrop" onClick={() => setOpen(false)}><nav className="mobile-nav" aria-label="Mobile navigation" onClick={event => event.stopPropagation()}><div className="mobile-nav-heading"><span className="eyebrow">Navigate</span><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation"><X/></button></div>{links.map(([label, path], index) => <Link key={label} href={path} onClick={() => setOpen(false)} className={pathname === path || pathname.startsWith(`${path}/`) ? "active" : ""} aria-current={pathname === path || pathname.startsWith(`${path}/`) ? "page" : undefined}><span>0{index + 1}</span>{label}<ArrowUpRight size={17}/></Link>)}<RegisterButton className="button-gold mobile-register"/></nav></div>}
  </>;
}

export function RegisterButton({ className = "" }: { className?: string }) {
  const [settings, setSettings] = useState<PublicSettings | null>(cachedSettings);
  useEffect(() => { getPublicSettings().then(setSettings).catch(() => setSettings(null)); }, []);
  if (settings?.registration_enabled && settings.registration_url) return <a className={`button button-gold ${className}`} target="_blank" rel="noreferrer" href={settings.registration_url}>{settings.registration_button_text || "Register now"}<ArrowUpRight size={16}/></a>;
  return <span className={`button button-disabled ${className}`} aria-label={settings?.registration_message || "Registration details will be announced shortly"}>{settings?.registration_message || "Registration soon"}</span>;
}

export function BackToTop() {
  return <a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to the beginning ↑</a>;
}
