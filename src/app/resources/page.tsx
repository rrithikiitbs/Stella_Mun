import { ArrowDownToLine } from "lucide-react";
import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getPublished } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Resources() {
  const documents = await getPublished("documents");
  return <Shell><main className="resources-page">
    <PageHero kicker="Delegate library · the archive" title="Read. Research. Respond." artwork="arch" index="07" tone="light">Documents and guides to help you prepare for the conference. Only materials published by the Secretariat appear here.</PageHero>
    <section className="archive-section"><div className="wrap archive-heading"><div><p className="eyebrow eyebrow-dark">The delegate archive</p><h2 className="display-heading">Knowledge is<br/><i>your first brief.</i></h2></div><div className="archive-medallion"><Artwork name="laurel" ratio="1 / 1" decorative/><span>SM<br/>2027</span></div></div>
      {documents.length ? <div className="wrap archive-list">{documents.map((document, index) => <Reveal className="archive-entry" key={document.id} delay={index * 0.035} y={12}><div className="archive-number">{String(index + 1).padStart(2,"0")}</div><div className="archive-classification"><span>{document.category}</span><small>{document.file_type === "application/pdf" ? "PDF DOCUMENT" : "CONFERENCE RESOURCE"}</small></div><div className="archive-description"><h3>{document.title}</h3><p>{document.description}</p></div><a href={`/api/resources/${document.id}/download`} className="archive-download" aria-label={`Download ${document.title}`}><span>Download</span><ArrowDownToLine size={18}/></a></Reveal>)}</div> : <div className="wrap archive-empty"><Artwork name="hand" ratio="1 / 1" className="archive-hand" decorative/><p className="eyebrow eyebrow-dark">The library is being prepared</p><h2 className="display-heading">The first pages<br/><i>are on their way.</i></h2><p>Published guides and conference documents will be added to this archive.</p></div>}
      <div className="wrap archive-footnote"><span>PREPARED FOR THE DELEGATES OF STELLA MARIS MUN 2027</span><span>CHENNAI · INDIA</span></div>
    </section>
  </main></Shell>;
}
