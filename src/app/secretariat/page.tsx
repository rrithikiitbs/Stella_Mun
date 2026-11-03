import Image from "next/image";
import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getPublished } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Secretariat() {
  const members = await getPublished("secretariat_members");
  return <Shell><main className="secretariat-page">
    <PageHero kicker="The people behind the conference" title="The Secretariat." artwork="wingedFigure" index="08" tone="light">A gathering is made possible by many hands and one shared purpose. Meet the team bringing Stella Maris MUN 2027 to life.</PageHero>
    <section className="secretariat-gallery"><div className="wrap secretariat-intro"><div><p className="eyebrow eyebrow-dark">The organising team</p><h2 className="display-heading">Stewards of<br/><i>the dialogue.</i></h2></div><p className="editorial-lead">Thoughtful, dedicated and ready to welcome you to the room.</p></div>
      {members.length ? <div className="wrap people-grid">{members.map((member, i) => <Reveal className={`person-persona person-${(i % 4) + 1}`} key={member.id} delay={i * 0.04}><article><div className="person-portrait">{member.photograph_url ? <Image src={member.photograph_url} alt={`Portrait of ${member.name}`} fill sizes="(max-width: 680px) 90vw, (max-width: 1000px) 44vw, 32vw" unoptimized className="person-photo"/> : <Artwork name={["portrait", "marbleEye", "wingedFigure", "hand"][i % 4] as "portrait" | "marbleEye" | "wingedFigure" | "hand"} ratio="4 / 5" sizes="(max-width: 680px) 90vw, 32vw" className="person-photo-frame"/>}<span className="person-index">0{i + 1}</span></div><div className="person-caption"><p className="eyebrow eyebrow-dark">{member.designation}</p><h3>{member.name}</h3>{member.biography && <p>{member.biography}</p>}</div></article></Reveal>)}</div> : <div className="wrap secretariat-coming"><Artwork name="wingOrnament" ratio="16 / 7" className="secretariat-coming-art" decorative/><div><p className="eyebrow eyebrow-dark">Stella Maris MUN · 2027</p><h2 className="display-heading">Names to be<br/><i>announced.</i></h2><p>The Secretariat will be introduced here as appointments are confirmed.</p></div></div>}
    </section>
  </main></Shell>;
}
