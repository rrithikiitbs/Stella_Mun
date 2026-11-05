import { Shell } from "@/components/site";
import { getPublished } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Schedule() {
  const entries = await getPublished("schedule_entries");
  return <Shell><main className="itinerary-page"><header className="itinerary-heading"><p className="eyebrow">29—30 January 2027 · Asia/Kolkata</p><h1>ITINERARY</h1><p>Stella Maris College · Chennai, India</p></header><section className="itinerary-content" aria-label="Conference itinerary">
    {entries.length ? <div className="itinerary-table-wrap"><table className="itinerary-table"><thead><tr><th scope="col">Date</th><th scope="col">Time</th><th scope="col">Session / Activity</th><th scope="col">Details / Venue</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id}><td data-label="Date">{new Date(`${entry.event_date}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", timeZone: "Asia/Kolkata" })}</td><td data-label="Time">{entry.start_time ? String(entry.start_time).slice(0,5) : "TBA"}{entry.end_time ? ` – ${String(entry.end_time).slice(0,5)}` : ""}</td><td data-label="Session / Activity"><strong>{entry.title}</strong></td><td data-label="Details / Venue">{entry.description && <span>{entry.description}</span>}{entry.location && <small>{entry.location}</small>}</td></tr>)}</tbody></table></div> : <div className="itinerary-empty"><span>✳</span><p className="eyebrow">The programme is taking shape</p><h2>Sessions will appear here.</h2><p>Confirmed timings and venues will be published as they are released.</p></div>}
  </section></main></Shell>;
}
