import { cache } from "react";
import { committees as fallbackCommittees, settings as fallbackSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const getSettings = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return { ...fallbackSettings, hero_title: "STELLA MARIS", hero_subtitle: fallbackSettings.tagline, registration_url: null, registration_message: "Registration details will be announced soon.", registration_button_text: "Register Now", registration_enabled: false, contact_email: null, about_content: null, contact_information: null };
  const { data } = await supabase.from("website_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? { ...fallbackSettings, hero_title: "STELLA MARIS", hero_subtitle: fallbackSettings.tagline, registration_url: null, registration_message: "Registration details will be announced soon.", registration_button_text: "Register Now", registration_enabled: false, contact_email: null, about_content: null, contact_information: null };
});

export const getCommittees = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return fallbackCommittees.map(c => ({ ...c, id: null, background_guide_document_id: null, full_name: c.name, abbreviation: c.short, theme: null, agenda_description: null, historical_context: null, scope_of_discussion: null, key_issues: null }));
  const visibility = await getSectionVisibility();
  if (visibility.committees === false) return [];
  const { data, error } = await supabase.from("committees").select("*").eq("is_published", true).eq("is_visible", true).order("display_order");
  return error ? fallbackCommittees.map(c => ({ ...c, id: null, background_guide_document_id: null, full_name: c.name, abbreviation: c.short, theme: null, agenda_description: null, historical_context: null, scope_of_discussion: null, key_issues: null })) : data ?? [];
});

export async function getPublished(table: "announcements" | "events" | "schedule_entries" | "documents" | "secretariat_members") {
  const supabase = await createClient();
  if (!supabase) return [];
  const section = table === "documents" ? "resources" : table === "schedule_entries" ? "schedule" : table === "secretariat_members" ? "secretariat" : table;
  const visibility = await getSectionVisibility();
  if (visibility[section] === false) return [];
  const query = supabase.from(table).select("*").eq("is_published", true).eq("is_visible", true);
  const ordered = table === "documents" ? query.order("uploaded_at", { ascending: false }) : table === "announcements" ? query.order("published_at", { ascending: false, nullsFirst: false }) : query.order("display_order", { ascending: true });
  const { data, error } = await ordered.limit(100);
  return error ? [] : data ?? [];
}

export const getSectionVisibility = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return {} as Record<string, boolean>;
  const { data, error } = await supabase.from("section_visibility").select("section_key,is_enabled");
  return error ? {} : Object.fromEntries((data ?? []).map(row => [row.section_key, row.is_enabled]));
});
