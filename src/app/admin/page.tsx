import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/app/admin/dashboard";
import { logout } from "@/app/admin/actions";

const tables = ["website_settings", "committees", "announcements", "events", "schedule_entries", "documents", "secretariat_members", "section_visibility"] as const;
export default async function AdminHome() {
  const supabase = await createClient();
  if (!supabase) return <main className="admin-login"><div className="admin-login-card"><p className="eyebrow">Setup required</p><h1 className="serif text-4xl mt-3">Connect Supabase</h1><p className="muted mt-4">Configure the public Supabase URL and anon key, apply the migrations, then sign in with the Director account.</p><a className="btn mt-6" href="/admin/login">Go to sign in</a></div></main>;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: member } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!member) { await supabase.auth.signOut(); redirect("/admin/login?error=credentials"); }
  const entries = await Promise.all(tables.map(async table => {
    const { data } = await supabase.from(table).select("*").limit(100);
    return [table, data ?? []] as const;
  }));
  return <Dashboard initial={Object.fromEntries(entries)} />;
}
