import { NextResponse } from "next/server";
import { getSettings, getSectionVisibility } from "@/lib/content";

export const dynamic = "force-dynamic";
export async function GET() {
  const [settings, sections] = await Promise.all([getSettings(), getSectionVisibility()]);
  return NextResponse.json({ registration_url: settings.registration_url, registration_enabled: settings.registration_enabled, registration_message: settings.registration_message, registration_button_text: settings.registration_button_text, sections }, { headers: { "Cache-Control": "no-store" } });
}
