import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell, PageHero, RegisterButton } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { Reveal } from "@/components/reveal";

export default function Delegates() {
  return <Shell><main className="delegates-page">
    <PageHero kicker="A delegate's field notes" title="Your place at the table." artwork="hand" index="10">Everything you need to know about taking part in Stella Maris MUN 2027. Further guidance will be shared as conference details are confirmed.</PageHero>
    <section className="delegate-spread"><Reveal className="delegate-brief"><p className="eyebrow eyebrow-dark">Begin your preparation</p><h2 className="display-heading">Come ready<br/><i>to listen.</i></h2><p className="editorial-lead">Research, debate, negotiate and collaborate. Registration categories, fees, deadlines, eligibility and allotment information will be announced by the Secretariat.</p><RegisterButton className="button-gold"/><Link className="editorial-link" href="/resources">Visit the delegate archive <span>↗</span></Link></Reveal><Reveal className="delegate-artwork" delay={0.12}><Artwork name="wingedFigure" ratio="4 / 5" sizes="(max-width: 760px) 92vw, 42vw"/><div className="delegate-image-label"><span>THE DELEGATE</span><b>01 — A voice in the assembly</b></div></Reveal></section>
    <section className="delegate-facts"><div className="wrap delegate-facts-grid"><div><span className="eyebrow">The dates</span><strong>29—30 <i>January</i> 2027</strong></div><div><span className="eyebrow">The venue</span><strong>Stella Maris <i>College</i></strong></div><div><span className="eyebrow">The city</span><strong>Chennai, <i>India</i></strong></div><Link href="/committees" className="delegate-facts-link">Choose your forum <ArrowUpRight size={17}/></Link></div></section>
  </main></Shell>;
}
