import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getPublished } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Schedule() {
  const entries = await getPublished("schedule_entries");
  return <Shell><main className="schedule-page">
    <PageHero kicker="29—30 January 2027 · Asia/Kolkata" title="The programme." artwork="staircase" index="05">Two days of debate, exchange and diplomacy at Stella Maris College, Chennai.</PageHero>
    <section className="programme-section"><div className="wrap programme-heading"><div><p className="eyebrow eyebrow-dark">In session</p><h2 className="display-heading">A day in <i>dialogue.</i></h2></div><div className="timezone-mark"><span>ALL TIMES</span><strong>IST</strong><small>UTC +05:30</small></div></div>
      {entries.length ? <div className="wrap programme-list">{entries.map((entry, i) => <Reveal key={entry.id} className="programme-row" delay={Math.min(i * 0.025, 0.2)} y={12}><div className="programme-ordinal">{String(i + 1).padStart(2,"0")}</div><div className="programme-date">{new Date(`${entry.event_date}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Kolkata" })}</div><div className="programme-time">{entry.start_time ? String(entry.start_time).slice(0,5) : "TBA"}{entry.end_time ? <small>— {String(entry.end_time).slice(0,5)}</small> : null}</div><div className="programme-detail"><h3>{entry.title}</h3><p>{entry.description}</p>{entry.location && <span>{entry.location}</span>}</div><div className="programme-star">✳</div></Reveal>)}</div> : <div className="wrap programme-empty"><Artwork name="column" ratio="1 / 1" className="empty-column" decorative/><p className="eyebrow eyebrow-dark">Programme in preparation</p><h2 className="display-heading">The order of the day<br/><i>will be announced.</i></h2><p>Confirmed sessions and timings will appear here as soon as they are released.</p></div>}
    </section>
  </main></Shell>;
}
