import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getPublished } from "@/lib/content";

export const dynamic = "force-dynamic";
const eventArtwork = ["assembly", "relief", "staircase"] as const;
export default async function Events() {
  const events = await getPublished("events");
  return <Shell><main className="events-page">
    <PageHero kicker="Beyond the committee room" title="The gathering." artwork="heroAlternative" index="06">Workshops, special sessions and delegate activities. Every event will be announced here by the Secretariat.</PageHero>
    <section className="event-exhibition"><div className="wrap event-exhibition-heading"><div><p className="eyebrow eyebrow-dark">The conference experience</p><h2 className="display-heading">Moments that<br/><i>move us.</i></h2></div><Artwork name="laurel" ratio="1 / 1" className="event-laurel" decorative/></div>
      {events.length ? <div className="wrap event-gallery">{events.map((event, i) => <Reveal className={`event-object event-object-${(i % 3) + 1}`} key={event.id} delay={i * 0.05}><article>
        <Link href={event.registration_url || "/events"} className="event-art-link" aria-label={`View ${event.title}`}>
          {event.image_url ? <Image src={event.image_url} alt="" fill sizes="(max-width: 760px) 92vw, 45vw" unoptimized className="event-photo"/> : <Artwork name={eventArtwork[i % eventArtwork.length]} ratio="4 / 3" sizes="(max-width: 760px) 92vw, 45vw" className="event-photo-frame" imageClassName="event-photo"/>}
          <span className="event-date-stamp">{event.start_date ? new Date(event.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }) : "2027"}</span><span className="event-open-icon"><ArrowUpRight size={20}/></span>
        </Link>
        <div className="event-object-copy"><p className="eyebrow eyebrow-dark">{event.status || "Stella Maris MUN · 2027"}</p><h3>{event.title}</h3><p>{event.description}</p>{event.start_date && <span className="event-datetime">{new Date(event.start_date).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" })}</span>}</div>
      </article></Reveal>)}</div> : <div className="wrap event-coming"><Artwork name="relief" ratio="16 / 7" className="coming-art" decorative/><div><p className="eyebrow">Coming into focus</p><h2 className="display-heading">New encounters<br/><i>will be announced.</i></h2><p>Special sessions and delegate activities will appear here as details are confirmed.</p></div></div>}
      <div className="wrap event-footer-note"><span>STELLA MARIS MUN · CHENNAI</span><Link href="/schedule">View the conference programme <ArrowUpRight size={15}/></Link></div>
    </section>
  </main></Shell>;
}
