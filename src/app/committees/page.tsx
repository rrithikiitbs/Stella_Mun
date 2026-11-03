import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getCommittees } from "@/lib/content";
import { committeeArtwork } from "@/lib/artwork";

export const dynamic = "force-dynamic";
export default async function Committees() {
  const committees = await getCommittees();
  return <Shell><main className="committees-page">
    <PageHero kicker="Six forums · many perspectives" title="Choose your forum." artwork="assembly" index="03">Each committee is a different lens on the questions that shape our world. Find the room where your perspective belongs.</PageHero>
    <section className="forum-gallery"><div className="wrap forum-gallery-head"><div><p className="eyebrow eyebrow-dark">The committees</p><h2 className="display-heading">Enter the <i>chamber.</i></h2></div><span className="gallery-count">{String(committees.length).padStart(2,"0")} <i>distinct forums</i></span></div>
      {committees.length ? <div className="wrap forum-grid">{committees.map((committee, i) => <Reveal key={committee.slug} className={`forum-item forum-${i + 1}`} delay={i * 0.04}><Link href={`/committees/${committee.slug}`} className="forum-link"><Artwork name={committeeArtwork[committee.slug] || "assembly"} ratio={i === 0 || i === 3 ? "4 / 3" : "5 / 4"} sizes="(max-width: 700px) 92vw, (max-width: 1050px) 45vw, 40vw" className="forum-image" imageClassName="forum-photo"/><span className="forum-number">0{i + 1}<i> / 06</i></span><span className="forum-arrow"><ArrowUpRight size={20}/></span><div className="forum-copy"><p>{committee.abbreviation || committee.short}</p><h3>{committee.full_name || committee.name}</h3><span>{committee.description}</span><b>Explore committee <ArrowUpRight size={14}/></b></div></Link></Reveal>)}</div> : <div className="wrap empty-artifact"><p className="eyebrow">The committee rooms are being prepared</p><h3 className="display-heading">Check back <i>soon.</i></h3></div>}
    </section>
  </main></Shell>;
}
