import Link from "next/link";
import { Shell, RegisterButton } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { settings as fallbackSettings } from "@/lib/data";
import { getCommittees, getSettings, getPublished } from "@/lib/content";
import { committeeArtwork } from "@/lib/artwork";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [committees, site, announcements, events] = await Promise.all([
    getCommittees(), getSettings(), getPublished("announcements"), getPublished("events"),
  ]);
  const words = String(site.hero_title || "STELLA MARIS").trim().split(/\s+/);
  const lead = words.shift() || "STELLA";
  const second = words.join(" ") || "MARIS";

  return <Shell><main>
    <section className="cinema-hero">
      <div className="cinema-hero-glow" aria-hidden="true" />
      <div className="cinema-hero-art"><Artwork name="hero" priority ratio="16 / 10" sizes="(max-width: 760px) 100vw, 68vw" className="hero-artwork-frame" imageClassName="hero-artwork-image" /></div>
      <div className="hero-architecture-line" aria-hidden="true" />
      <div className="wrap cinema-hero-content">
        <p className="eyebrow hero-kicker">Stella Maris College <span>·</span> Chennai, India</p>
        <h1 className="cinema-title"><span>{lead}</span><em>{second}</em></h1>
        <div className="hero-edition"><span>MODEL UNITED NATIONS</span><b>2027</b></div>
        <div className="hero-event-meta"><span>29—30 January 2027</span><i /> <span>Chennai, India</span></div>
        <p className="hero-tagline">{site.hero_subtitle || fallbackSettings.tagline}</p>
        <div className="hero-actions"><Link className="button button-outline" href="/committees">Explore the committees <span>↗</span></Link><RegisterButton className="button-gold"/></div>
      </div>
      <div className="hero-scroll-note"><span /> SCROLL TO EXPLORE</div>
      <div className="hero-number" aria-hidden="true">01 <span>/ 27</span></div>
    </section>

    {announcements.length > 0 && <section className="notice-ribbon"><div className="wrap notice-ribbon-inner"><span className="eyebrow">From the secretariat</span><div>{announcements.slice(0, 2).map(item => <Link href={item.external_url || "/events"} key={item.id}><strong>{item.title}</strong><span>{item.description}</span><b>↗</b></Link>)}</div></div></section>}

    <section className="editorial-intro">
      <div className="wrap intro-grid">
        <Reveal className="intro-copy"><p className="eyebrow eyebrow-dark">A meeting of minds, made monumental</p><h2 className="display-heading">The world<br/><i>at the table.</i></h2><div className="gold-rule"/><p className="editorial-lead">Stella Maris Model United Nations brings students together for two days of diplomacy, dialogue and ideas that move beyond borders.</p><Link href="/about" className="editorial-link">Discover the conference <span>↗</span></Link></Reveal>
        <Reveal className="intro-visual" delay={0.12}><div className="intro-image-wrap"><Artwork name="assembly" ratio="1 / 1.12" sizes="(max-width: 760px) 100vw, 48vw" className="intro-artwork"/><div className="image-caption"><span>THE ASSEMBLY</span><b>01 — A place for every voice</b></div></div><div className="intro-side-note">DIPLOMACY · HISTORY · TOMORROW</div></Reveal>
      </div>
      <div className="intro-bottom-rule" />
    </section>

    <section className="conference-ledger"><div className="wrap ledger-grid"><div><small>THE CONFERENCE</small><strong>02</strong></div><div><small>WHEN</small><strong>29—30 <em>Jan</em> 2027</strong></div><div><small>WHERE</small><strong>Stella Maris <em>College</em></strong></div><div><small>THE CITY</small><strong>Chennai, <em>India</em></strong></div></div></section>

    {committees.length > 0 && <section className="committee-exhibition">
      <div className="wrap exhibition-head"><div><p className="eyebrow">Six forums · one world</p><h2 className="display-heading">Enter the <i>chamber.</i></h2></div><Link className="editorial-link" href="/committees">All committees <span>↗</span></Link></div>
      <div className="wrap committee-mosaic">{committees.map((committee, index) => <Reveal key={committee.slug} className={`committee-exhibit exhibit-${index + 1}`} delay={index * 0.045} y={16}>
        <Link href={`/committees/${committee.slug}`} className="committee-art-link">
          <Artwork name={committeeArtwork[committee.slug] || "assembly"} ratio={index === 0 ? "1 / 1.18" : "1 / 1"} sizes="(max-width: 700px) 92vw, (max-width: 1050px) 45vw, 32vw" className="committee-exhibit-art" imageClassName="committee-exhibit-image" />
          <span className="exhibit-index">0{index + 1} <i>/ 06</i></span><span className="exhibit-discover">Discover forum <b>↗</b></span>
          <div className="exhibit-caption"><p>{committee.abbreviation || committee.short}</p><h3>{committee.full_name || committee.name}</h3><span>{committee.description}</span></div>
        </Link>
      </Reveal>)}</div>
      <div className="mosaic-footnote"><span>THE ART OF DIALOGUE</span><span>CHENNAI · 2027</span></div>
    </section>}

    <section className="story-spread">
      <div className="story-image"><Artwork name="relief" ratio="16 / 10" sizes="(max-width: 760px) 100vw, 60vw" className="story-artwork"/></div>
      <div className="story-copy"><Reveal><p className="eyebrow">A tradition of thoughtful exchange</p><h2 className="display-heading">Ideas become<br/><i>history.</i></h2><p>{site.about_content || "Model United Nations invites students to research complex questions, listen to diverse perspectives and work toward thoughtful outcomes. At Stella Maris, the next generation takes its place in a long conversation about our shared future."}</p><Link className="button button-outline" href="/about">Our purpose <span>↗</span></Link></Reveal><Artwork name="laurel" ratio="1 / 1" className="story-laurel" decorative/></div>
    </section>

    <section className="events-exhibition">
      <div className="events-backdrop"><Artwork name="staircase" ratio="16 / 9" sizes="100vw" className="events-backdrop-art" decorative/></div>
      <div className="wrap events-inner"><div className="events-title"><p className="eyebrow">Beyond the committee room</p><h2 className="display-heading">The gathering<br/><i>continues.</i></h2><Link href="/events" className="editorial-link">Explore events <span>↗</span></Link></div>
        <div className="event-preview-list">{events.length ? events.slice(0, 3).map((event, i) => <Link href="/events" className="event-preview" key={event.id}><span>0{i + 1}</span><div><small>{event.status || "CONFERENCE EVENT"}</small><h3>{event.title}</h3><p>{event.description}</p></div><b>↗</b></Link>) : <div className="event-preview coming"><span>✦</span><div><small>29—30 JANUARY 2027</small><h3>New moments await.</h3><p>Workshops, special sessions and delegate activities will be announced here.</p></div></div>}</div>
      </div>
    </section>

    <section className="home-closer"><div className="wrap closer-inner"><Artwork name="wingOrnament" ratio="1 / 1" className="closer-ornament" decorative/><p className="eyebrow">Your voice belongs in the room</p><h2 className="display-heading">Take your place<br/><i>at the table.</i></h2><p>Two days. Six forums. A world of ideas.</p><RegisterButton className="button-gold"/><Link href="/schedule" className="editorial-link">View the conference programme <span>↗</span></Link></div></section>
  </main></Shell>;
}
