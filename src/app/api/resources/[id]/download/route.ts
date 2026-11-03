import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Resources are not configured." }, { status: 503 });
  const { data: doc } = await supabase.from("documents").select("storage_path,is_published,is_visible").eq("id", id).maybeSingle();
  if (!doc?.is_published || !doc.is_visible) return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  const { data, error } = await supabase.storage.from("background-guides").createSignedUrl(doc.storage_path, 60);
  if (error || !data) return NextResponse.json({ error: "Resource is temporarily unavailable." }, { status: 503 });
  return NextResponse.redirect(data.signedUrl);
}
