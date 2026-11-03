import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell, PageHero } from "@/components/site";
import { Artwork } from "@/components/artwork";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Contact() {
  const settings = await getSettings();
  return <Shell><main className="contact-page">
    <PageHero kicker="Correspondence · Stella Maris MUN" title="Write to us." artwork="relief" index="09">For conference enquiries, contact the Stella Maris MUN Secretariat. We look forward to hearing from you.</PageHero>
    <section className="contact-spread"><div className="contact-art"><Artwork name="hand" ratio="4 / 5" sizes="(max-width: 760px) 90vw, 42vw"/></div><div className="contact-details"><p className="eyebrow eyebrow-dark">Find us in Chennai</p><h2 className="display-heading">Stella Maris<br/><i>College.</i></h2><p className="contact-address">Cathedral Road<br/>Chennai, India</p><div className="contact-rule"/><p className="eyebrow eyebrow-dark">Conference enquiries</p>{settings.contact_email ? <a className="contact-email" href={`mailto:${settings.contact_email}`}>{settings.contact_email}<ArrowUpRight size={18}/></a> : <p className="contact-email pending">Official contact details will be announced soon.</p>}<p className="contact-info">{settings.contact_information || "The Secretariat will share its official contact channels as conference details are confirmed."}</p><Link className="editorial-link" href="/about">About the conference <span>↗</span></Link></div></section>
    <section className="contact-baseline"><span>STELLA MARIS MODEL UNITED NATIONS 2027</span><span>29—30 JANUARY · CHENNAI</span></section>
  </main></Shell>;
}
