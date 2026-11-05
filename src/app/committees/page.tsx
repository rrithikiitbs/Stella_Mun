import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/site";
import { getCommittees } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Committees() {
  const committees = await getCommittees();
  return <Shell><main className="committees-page pillars-page">
    <header className="pillars-heading"><p className="eyebrow">Six forums · many perspectives</p><h1>THE COMMITTEES</h1><p>Six rooms. Six perspectives. Find the forum where your voice belongs.</p></header>
    <section className="forum-gallery pillars-gallery" aria-label="Committees">
      {committees.length ? <div className="pillars-grid">{committees.slice(0, 6).map((committee, i) => <Link key={committee.slug} href={`/committees/${committee.slug}`} className={`pillar-item pillar-${i + 1}`}><span className="pillar-cap"/><span className="pillar-shaft"><small>0{i + 1} / 06</small><b>{committee.abbreviation || committee.short}</b><strong>{committee.full_name || committee.name}</strong><i><ArrowUpRight size={17}/></i></span><span className="pillar-base"/></Link>)}</div> : <div className="wrap empty-artifact"><p className="eyebrow">The committee rooms are being prepared</p><h3 className="display-heading">Check back <i>soon.</i></h3></div>}
    </section>
  </main></Shell>;
}
