"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateAdminRecord } from "@/lib/admin-validation.mjs";

async function adminClient() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured. Add the project URL and anon key.");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!membership) redirect("/");
  return supabase;
}

export async function login(form: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?error=setup");
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=credentials");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

const allowedTables = ["website_settings", "committees", "announcements", "events", "schedule_entries", "documents", "secretariat_members", "section_visibility"] as const;
type TableName = typeof allowedTables[number];
const revalidatePaths: Record<TableName, string[]> = {
  website_settings: ["/", "/about", "/contact", "/admin"], committees: ["/", "/committees", "/admin"],
  announcements: ["/", "/admin"], events: ["/events", "/admin"], schedule_entries: ["/schedule", "/admin"],
  documents: ["/resources", "/committees", "/admin"], secretariat_members: ["/secretariat", "/admin"], section_visibility: ["/", "/admin"],
};

export async function saveRecord(form: FormData) {
  const supabase = await adminClient();
  const table = String(form.get("table")) as TableName;
  if (!allowedTables.includes(table)) throw new Error("Unsupported content type.");
  const raw = String(form.get("record") ?? "{}");
  let record: Record<string, unknown>;
  try { record = JSON.parse(raw); } catch { throw new Error("Invalid form data."); }
  delete record.created_at; delete record.updated_at;
  const validationError = validateAdminRecord(record);
  if (validationError) throw new Error(validationError);
  const { error } = await supabase.from(table).upsert(record);
  if (error) throw new Error(error.message);
  for (const path of revalidatePaths[table]) revalidatePath(path);
  return { ok: true };
}

export async function deleteRecord(form: FormData) {
  const supabase = await adminClient();
  const table = String(form.get("table")) as TableName;
  if (!allowedTables.includes(table) || ["website_settings", "committees", "section_visibility"].includes(table)) throw new Error("This record cannot be deleted.");
  const id = String(form.get("id") ?? "");
  if (!id) throw new Error("Missing record ID.");
  let storagePath: string | null = null;
  if (table === "documents") {
    const { data } = await supabase.from("documents").select("storage_path").eq("id", id).maybeSingle();
    storagePath = data?.storage_path ?? null;
  }
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (table === "documents" && storagePath) {
    const { error: storageError } = await supabase.storage.from("background-guides").remove([storagePath]);
    if (storageError) throw new Error(`Resource deleted, but its stored file could not be removed: ${storageError.message}`);
  }
  for (const path of revalidatePaths[table]) revalidatePath(path);
  return { ok: true };
}

export async function uploadAsset(form: FormData) {
  const supabase = await adminClient();
  const bucket = String(form.get("bucket"));
  if (!["committee-images", "background-guides", "website-assets", "secretariat-images"].includes(bucket)) throw new Error("Unsupported upload destination.");
  const file = form.get("file");
  if (!(file instanceof File) || file.size > 15 * 1024 * 1024) throw new Error("Choose a file smaller than 15 MB.");
  if (bucket === "background-guides" && file.type !== "application/pdf") throw new Error("Background guides must be PDF files.");
  if (bucket === "secretariat-images" && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Use a JPEG, PNG, or WebP photograph.");
  if (bucket === "secretariat-images" && file.size > 5 * 1024 * 1024) throw new Error("Photographs must be smaller than 5 MB.");
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const publicUrl = ["committee-images", "website-assets", "secretariat-images"].includes(bucket) ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl : null;
  return { path, bucket, publicUrl };
}
