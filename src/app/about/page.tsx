import Link from "next/link";
import { Shell, PageHero, RegisterButton } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function About() {
  const settings = await getSettings();
  return <Shell><main className="about-page">
    <PageHero kicker="The conference · 29—30 January 2027" title="A forum for ideas." artwork="portrait" index="02" tone="light">At Stella Maris College, Chennai, young delegates step into a conversation shaped by diplomacy, curiosity and the courage to think beyond borders.</PageHero>
    <section className="about-manifesto"><div className="wrap manifesto-grid"><Reveal className="manifesto-image"><Artwork name="marbleEye" ratio="4 / 5" sizes="(max-width: 760px) 90vw, 40vw"/><span className="image-index">FIG. 01 <i>· THE LISTENING GAZE</i></span></Reveal><Reveal className="manifesto-copy" delay={0.14}><p className="eyebrow eyebrow-dark">Our purpose</p><h2 className="display-heading">A place to think<br/><i>beyond borders.</i></h2><div className="gold-rule"/><p className="editorial-lead">{settings.about_content || "Model United Nations gives students the opportunity to engage with international affairs through research, discussion, negotiation and public speaking. Stella Maris MUN 2027 invites delegates to consider complex questions, listen to diverse perspectives and work toward thoughtful outcomes."}</p><p className="manifesto-note">A conference founded on inquiry, conviction and the belief that thoughtful dialogue can change what comes next.</p><Link href="/committees" className="editorial-link">Find your forum <span>↗</span></Link></Reveal></div></section>
    <section className="about-principles"><div className="wrap principles-head"><p className="eyebrow">Three ideas to carry forward</p><h2 className="display-heading">How we <i>gather.</i></h2></div><div className="wrap principles-grid">{[["01","Research with purpose","Enter each debate with care, context and an open mind."],["02","Speak with conviction","Make a case that is clear, considered and worthy of being heard."],["03","Build through dialogue","Look for common ground and leave room for new possibilities."]].map(([n,title,desc])=><Reveal key={n} className="principle"><span>{n}</span><h3>{title}</h3><p>{desc}</p><i className="principle-rule"/></Reveal>)}</div></section>
    <section className="about-closing"><Artwork name="staircase" ratio="21 / 9" sizes="100vw" className="closing-image" decorative/><div className="closing-copy"><p className="eyebrow">Stella Maris College · Chennai</p><h2 className="display-heading">Join the<br/><i>conversation.</i></h2><RegisterButton className="button-gold"/></div></section>
  </main></Shell>;
}
