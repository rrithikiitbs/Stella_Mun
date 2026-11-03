import Link from "next/link";
import { Shell, PageHero } from "@/components/site";

export default function NotFound() {
  return <Shell><main className="not-found-page"><PageHero kicker="404 · the path diverges" title="A path yet to be charted." artwork="arch" index="404">The page may have moved or is not available. Return to the home page and continue exploring.</PageHero><section className="not-found-action"><Link href="/" className="button button-gold">Return to the beginning <span>↗</span></Link></section></main></Shell>;
}
