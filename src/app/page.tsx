import Link from "next/link";
import "./home.css";
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

  return <Shell><main className="home-world">
    <section className="world-hero" id="top">
      <div className="world-hero-art"><Artwork name="heroClean" priority ratio="16 / 9" sizes="100vw" position="center center" className="world-hero-artwork" imageClassName="world-hero-image" /></div>
      <div className="world-hero-atmosphere" aria-hidden="true"><span className="world-orbit orbit-one"/><span className="world-orbit orbit-two"/><span className="world-light-column"/><span className="world-grid-floor"/></div>
      <div className="world-hero-frame" aria-hidden="true"/>
      <div className="world-hero-content">
        <p className="world-kicker"><span/> STELLA MARIS COLLEGE <i>·</i> CHENNAI, INDIA</p>
        <p className="world-overline">A world of diplomacy</p>
        <h1 aria-label="STELLA MARIS MUN - 27"><span>STELLA MARIS</span><em>MUN - 27</em></h1>
        <div className="world-title-signature"><span>MODEL UNITED NATIONS</span><b>CHENNAI · INDIA</b></div>
        <p className="world-tagline">{site.hero_subtitle || fallbackSettings.tagline}</p>
        <div className="world-actions"><Link className="world-explore" href="/committees"><span>Explore committees</span><b>↗</b></Link><RegisterButton className="world-register"/></div>
      </div>
      <div className="world-hero-orientation"><span>29—30 JANUARY 2027</span><i/><span>13°04′ N · 80°16′ E</span></div>
      <div className="world-hero-index" aria-hidden="true">01 <span>— 27</span></div>
      <a className="world-scroll" href="#conference"><span className="world-scroll-line"/> ENTER THE CONFERENCE</a>
    </section>

    {announcements.length > 0 && <section className="world-bulletin" aria-label="Secretariat announcements"><div className="world-bulletin-label"><span className="world-live-dot"/> SECRETARIAT SIGNAL</div><div className="world-bulletin-items">{announcements.slice(0, 2).map((item, index) => <Link href={item.external_url || "/events"} key={item.id}><span>0{index + 1}</span><strong>{item.title}</strong><i>↗</i></Link>)}</div></section>}

    <section className="world-introduction" id="conference">
      <div className="world-intro-atmosphere" aria-hidden="true"/>
      <div className="world-intro-grid">
        <Reveal className="world-intro-copy"><p className="world-section-index">01 <span>/ THE GATHERING</span></p><p className="world-eyebrow">A forum for the next generation</p><h2>Many voices.<br/><i>One shared future.</i></h2><p className="world-intro-description">Stella Maris Model United Nations brings students together for two days of diplomacy, dialogue and ideas that move beyond borders.</p><Link href="/about" className="world-text-link">The story of Stella Maris MUN <span>↗</span></Link></Reveal>
        <Reveal className="world-intro-scene" delay={0.12}><div className="world-assembly-image"><Artwork name="assembly" ratio="1 / 1.05" sizes="(max-width: 760px) 88vw, 48vw" className="world-assembly-art"/><div className="world-glass-caption"><span>AN OPEN CHAMBER</span><b>Every perspective has a place.</b></div></div><div className="world-image-orbit" aria-hidden="true">DIALOGUE <i>·</i> RESEARCH <i>·</i> RESOLUTION</div></Reveal>
      </div>
      <div className="world-data-ribbon"><div><span>CONVENED</span><b>29—30 <i>January</i> 2027</b></div><div><span>HOSTED AT</span><b>Stella Maris <i>College</i></b></div><div><span>IN THE CITY OF</span><b>Chennai, <i>India</i></b></div></div>
    </section>

    {committees.length > 0 && <section className="world-committees" id="committees">
      <div className="world-committee-heading"><div><p className="world-section-index">02 <span>/ THE FORUMS</span></p><p className="world-eyebrow">Six rooms, six perspectives</p><h2>Enter the<br/><i>conversation.</i></h2></div><Link href="/committees" className="world-text-link">Discover all committees <span>↗</span></Link></div>
      <div className="world-forum-stage"><div className="world-forum-list">{committees.slice(0, 6).map((committee, index) => <Link href={`/committees/${committee.slug}`} className={`world-forum-row forum-row-${index + 1}`} key={committee.slug}><span className="world-forum-index">0{index + 1}</span><span className="world-forum-name"><small>{committee.abbreviation || committee.short}</small><strong>{committee.full_name || committee.name}</strong></span><span className="world-forum-arrow">↗</span></Link>)}</div><div className="world-forum-art"><Artwork name={committeeArtwork[committees[0].slug] || "assembly"} ratio="4 / 5" sizes="(max-width: 760px) 88vw, 38vw" className="world-forum-artwork"/><span className="world-forum-stamp">DIPLOMACY<br/>IN SESSION</span><span className="world-forum-art-caption">THE DELEGATE’S VIEW · 2027</span></div></div>
    </section>}

    <section className="world-programme">
      <div className="world-programme-art"><Artwork name="staircase" ratio="16 / 9" sizes="100vw" className="world-staircase-art" decorative/></div><div className="world-programme-shade" aria-hidden="true"/>
      <div className="world-programme-content"><p className="world-section-index">03 <span>/ THE PROGRAMME</span></p><p className="world-eyebrow">Two days of ideas in motion</p><h2>The work begins<br/><i>with a question.</i></h2><p>From opening session to final resolution, every moment brings a new perspective into focus.</p><Link href="/schedule" className="world-glass-link">Explore the programme <span>↗</span></Link></div>
      <div className="world-programme-date"><span>29—30</span><i>JANUARY</i><b>2027</b></div>
    </section>

    <section className="world-events"><div className="world-events-head"><div><p className="world-section-index">04 <span>/ AROUND THE ASSEMBLY</span></p><p className="world-eyebrow">Beyond the committee room</p><h2>The gathering<br/><i>continues.</i></h2></div><Link href="/events" className="world-text-link">All conference events <span>↗</span></Link></div><div className="world-event-lines">{events.length ? events.slice(0, 3).map((event, index) => <Link href="/events" className="world-event-line" key={event.id}><span>0{index + 1}</span><div><small>{event.status || "CONFERENCE EVENT"}</small><h3>{event.title}</h3><p>{event.description}</p></div><b>↗</b></Link>) : <div className="world-event-empty"><span>29—30 JANUARY 2027</span><p>Workshops, special sessions and delegate activities will be announced here.</p><strong>New moments await.</strong></div>}</div></section>

    <section className="world-closing"><div className="world-closing-light" aria-hidden="true"/><Artwork name="wingOrnament" ratio="1 / 1" className="world-closing-ornament" decorative/><div className="world-closing-content"><p className="world-eyebrow">Your voice belongs in the room</p><h2>Take your place<br/><i>in the world.</i></h2><p>Two days. Six forums. A world of ideas.</p><RegisterButton className="world-register"/><Link href="/delegates" className="world-closing-secondary">For delegates <span>↗</span></Link></div><span className="world-closing-coordinate">STELLA MARIS MUN <i>·</i> CHENNAI <i>·</i> MMXXVII</span></section>
  </main></Shell>;
}
