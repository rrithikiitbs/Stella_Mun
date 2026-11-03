import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell, PageHero, RegisterButton } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getCommittees, getPublished } from "@/lib/content";
import { committeeArtwork } from "@/lib/artwork";

export const dynamic = "force-dynamic";
export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [committees, documents] = await Promise.all([getCommittees(), getPublished("documents")]);
  const committee = committees.find(item => item.slug === slug);
  if (!committee) notFound();
  const guide = documents.find(doc => doc.id === committee.background_guide_document_id) || documents.find(doc => doc.committee_id === committee.id && doc.category === "background-guide");
  const image = committeeArtwork[committee.slug] || "assembly";
  return <Shell><main className="committee-detail-page">
    <PageHero kicker={`${committee.abbreviation || committee.short} · Committee ${String(committee.display_order || 1).padStart(2,"0")}`} title={committee.full_name || committee.name} artwork={image} index="04">{committee.description}</PageHero>
    <section className="committee-dossier"><div className="wrap dossier-grid"><Reveal className="dossier-main"><p className="eyebrow eyebrow-dark">The agenda</p><h2 className="display-heading">A question<br/><i>worth asking.</i></h2><div className="gold-rule"/><p className="dossier-theme">{committee.theme || "Committee agenda will be announced soon."}</p><p className="editorial-lead">{committee.agenda_description || committee.historical_context || "Detailed agenda, background context, scope of discussion and key issues will be published by the Secretariat when finalised."}</p>{committee.key_issues && <div className="issue-note"><span className="eyebrow eyebrow-dark">Key issues</span><p>{committee.key_issues}</p></div>}<Link href="/resources" className="editorial-link">Browse delegate resources <span>↗</span></Link></Reveal>
      <Reveal className="dossier-side" delay={0.12}><div className="dossier-guide"><span className="eyebrow">Prepare to participate</span><p className="guide-count">01 <i>/ GUIDE</i></p><h3>Background<br/>guide</h3>{guide ? <><p>{guide.title} — {guide.description}</p><a href={`/api/resources/${guide.id}/download`} className="button button-gold">Download guide <ArrowUpRight size={15}/></a></> : <p>Background guide coming soon. The Secretariat will publish it here when ready.</p>}</div><div className="dossier-scope"><span className="eyebrow eyebrow-dark">Scope of discussion</span><p>{committee.scope_of_discussion || "The scope of discussion will be announced with the committee agenda."}</p></div><div className="dossier-cta"><span className="eyebrow">Take the floor</span><RegisterButton className="button-gold"/></div></Reveal></div></section>
    <section className="committee-detail-art"><Artwork name={image} ratio="21 / 9" sizes="100vw" className="detail-banner" decorative/><div className="detail-banner-caption"><span>THE STELLA MARIS MUN 2027</span><span>{committee.abbreviation || committee.short}</span></div></section>
  </main></Shell>;
}
