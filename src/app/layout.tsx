import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"), title:"Stella Maris MUN 2027 | Where Ideas Become History", description:"Stella Maris Model United Nations · 29–30 January 2027 · Chennai, India", openGraph:{title:"Stella Maris MUN 2027",description:"Where Ideas Become History.",images:["/images/stell-logo.jpeg"]} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
