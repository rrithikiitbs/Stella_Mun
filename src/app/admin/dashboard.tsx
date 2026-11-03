"use client";
import { useMemo, useState, useTransition } from "react";
import { deleteRecord, logout, saveRecord, uploadAsset } from "@/app/admin/actions";

const sections = ["Overview", "Website Settings", "Section Visibility", "Committees", "Announcements", "Events", "Schedule", "Resources", "Secretariat"] as const;
const tables = { "Website Settings": "website_settings", "Section Visibility": "section_visibility", Committees: "committees", Announcements: "announcements", Events: "events", Schedule: "schedule_entries", Resources: "documents", Secretariat: "secretariat_members" } as const;
type Section = typeof sections[number];
type Row = Record<string, unknown>;

export default function Dashboard({ initial }: { initial: Record<string, Row[]> }) {
  const [section, setSection] = useState<Section>("Overview");
  const [selected, setSelected] = useState<Row | null>(null);
  const [message, setMessage] = useState("");
  const [busy, start] = useTransition();
  const table = tables[section as keyof typeof tables];
  const rows = useMemo(() => table ? initial[table] ?? [] : [], [initial, table]);
  const fields = useMemo<[string, unknown][]>(() => {
    const savedRow = selected && (selected.id || selected.section_key);
    const sample = savedRow ? selected : (section === "Website Settings" ? rows[0] : null);
    if (sample && (Object.keys(sample).length > 0 || section === "Website Settings")) return Object.entries(sample).filter(([key]) => !["created_at", "updated_at", "uploaded_at", "id"].includes(key));
    const defaults: Record<string, Row> = {
      committees: { name: "", full_name: "", slug: "", abbreviation: "", description: "", theme: "", agenda_description: "", background_guide_document_id: "", is_visible: true, is_published: false, display_order: 0 },
      announcements: { title: "", description: "", external_url: "", is_visible: true, is_published: false },
      events: { title: "", slug: "", description: "", start_date: "", end_date: "", registration_url: "", status: "scheduled", is_visible: true, is_published: false, display_order: 0 },
      schedule_entries: { title: "", description: "", event_date: "2027-01-29", start_time: "", end_time: "", location: "", is_visible: true, is_published: false, display_order: 0 },
      documents: { title: "", description: "", category: "background-guide", storage_path: "", file_type: "application/pdf", file_size: null, committee_id: "", is_visible: true, is_published: false },
      secretariat_members: { name: "", designation: "", photograph_url: "", biography: "", contact_information: "", display_order: 0, is_visible: true, is_published: false },
      section_visibility: { section_key: "", is_enabled: true },
    };
    return Object.entries(defaults[table ?? ""] ?? {}).map(([key, value]) => [key, selected?.[key] ?? value] as [string, unknown]);
  }, [rows, section, selected, table]);

  function save(form: FormData) {
    const record: Row = {};
    for (const [key, value] of fields) {
      const raw = form.get(key);
      if (typeof raw !== "string") continue;
      if (typeof value === "boolean") record[key] = raw === "true";
      else if (typeof value === "number") record[key] = Number(raw || 0);
      else if (value === null) record[key] = raw || null;
      else if (!raw && ["start_time", "end_time", "start_date", "end_date", "registration_url", "image_url", "external_url", "location", "theme", "agenda_description", "historical_context", "scope_of_discussion", "key_issues", "background_guide_document_id", "committee_id", "photograph_url", "biography", "contact_information"].includes(key)) record[key] = null;
      else if (value !== null && typeof value === "object") { try { record[key] = JSON.parse(raw); } catch { record[key] = raw; } }
      else record[key] = raw;
    }
    if (selected?.id) record.id = selected.id;
    if (section === "Website Settings") record.id = 1;
    if (section === "Section Visibility" && selected?.section_key) record.section_key = selected.section_key;
    const payload = new FormData(); payload.set("table", table!); payload.set("record", JSON.stringify(record));
    setMessage(""); start(async () => { try { await saveRecord(payload); setMessage("Saved successfully."); setSelected(null); location.reload(); } catch (e) { setMessage(e instanceof Error ? e.message : "Save failed."); } });
  }
  function remove(row: Row) {
    if (!window.confirm(`Delete “${String(row.title ?? row.name ?? row.full_name ?? "this record")}”? This cannot be undone.`)) return;
    const payload = new FormData(); payload.set("table", table!); payload.set("id", String(row.id));
    if (section === "Committees" || section === "Section Visibility") return;
    start(async () => { try { await deleteRecord(payload); location.reload(); } catch (e) { setMessage(e instanceof Error ? e.message : "Delete failed."); } });
  }
  function upload(file: File | undefined) {
    if (!file) return;
    const payload = new FormData(); payload.set("file", file); payload.set("bucket", section === "Resources" ? "background-guides" : "secretariat-images");
    start(async () => { try { const result = await uploadAsset(payload); setSelected(current => ({ ...(current ?? {}), ...(section === "Resources" ? { storage_path: result.path, file_type: file.type, file_size: file.size } : { photograph_url: result.publicUrl }) })); setMessage("Upload complete. Save the record to publish its file reference."); } catch (e) { setMessage(e instanceof Error ? e.message : "Upload failed."); } });
  }
  const count = (name: string) => initial[tables[name as keyof typeof tables]]?.length ?? 0;

  return <div className="admin-layout"><aside className="admin-sidebar"><a className="admin-brand serif" href="/">STELLA <span className="gold">MUN</span><small>DIRECTOR CONSOLE</small></a><nav>{sections.map((item, i) => <button key={item} className={section === item ? "active" : ""} onClick={() => { setSection(item); setSelected(null); }}><span className="nav-index">0{i + 1}</span>{item}</button>)}</nav><form action={logout}><button className="admin-logout">↗ Sign out</button></form></aside>
    <main className="admin-main"><header className="admin-top"><div><p className="eyebrow">Stella Maris MUN · 2027</p><h1 className="serif">{section}</h1></div><a href="/" className="btn">View website ↗</a></header>
      {section === "Overview" ? <><p className="muted">Your conference website at a glance.</p><div className="admin-stats">{Object.entries(tables).map(([name, t]) => <button key={t} className="admin-stat" onClick={() => { setSection(name as Section); setSelected(null); }}><span className="eyebrow">{name}</span><strong>{initial[t]?.length ?? 0}</strong><small>Manage →</small></button>)}</div><div className="notice mt-8"><strong>Publishing checklist</strong><p className="muted mt-2">Review your registration settings, contact details, committee agendas, and published resources before announcing the conference.</p></div></> : <div className="admin-workspace"><section className="admin-list"><div className="admin-list-head"><h2 className="serif text-3xl">{rows.length} {rows.length === 1 ? "entry" : "entries"}</h2>{section !== "Website Settings" && <button className="btn fill" onClick={() => setSelected({})}>+ New</button>}</div>{rows.map((row, i) => <article className="admin-row" key={String(row.id ?? row.section_key ?? i)}><button className="row-title" onClick={() => setSelected(row)}><strong>{String(row.title ?? row.name ?? row.full_name ?? row.section_key ?? "Website settings")}</strong><small>{String(row.slug ?? row.designation ?? row.category ?? "")}</small></button><span className={`status ${row.is_published === true || row.is_enabled === true ? "published" : "draft"}`}>{row.is_published === true || row.is_enabled === true ? "Published / enabled" : "Draft / disabled"}</span>{section !== "Website Settings" && section !== "Committees" && section !== "Section Visibility" && <button className="delete-button" onClick={() => remove(row)} aria-label="Delete">×</button>}</article>)}{!rows.length && <p className="muted py-8">No entries yet. Add one when the information is ready.</p>}</section>
        <section className="admin-editor"><p className="eyebrow">{selected ? "Edit entry" : section === "Website Settings" || section === "Section Visibility" ? "Manage site-wide content" : "Create an entry"}</p><h2 className="serif text-3xl mt-2">{selected && typeof selected.title === "string" ? selected.title : section}</h2>{(section === "Resources" || section === "Secretariat")&&<label className="upload-control mt-5">{section === "Resources"?"Upload PDF guide (max 15 MB)":"Upload member photograph"}<input type="file" accept={section === "Resources"?"application/pdf":"image/jpeg,image/png,image/webp"} onChange={e=>upload(e.target.files?.[0])}/></label>}<form action={save} className="admin-form mt-6">{fields.map(([key, value]) => <label key={key} className={typeof value === "boolean" ? "check-field" : ""}><span>{key.replaceAll("_", " ")}</span>{typeof value === "boolean" ? <select name={key} defaultValue={String(value)}><option value="true">Enabled / visible</option><option value="false">Disabled / hidden</option></select> : key === "background_guide_document_id" || key === "committee_id" ? <select name={key} defaultValue={value == null ? "" : String(value)}><option value="">No committee linked</option>{(initial.committees ?? []).map(c=><option value={String(c.id)} key={String(c.id)}>{String(c.full_name ?? c.name)}</option>)}</select> : <textarea rows={typeof value === "string" && value.length > 90 ? 4 : 2} name={key} defaultValue={value == null ? "" : String(value)} required={["title", "name", "full_name", "slug", "description", "section_key"].includes(key)} placeholder={key.replaceAll("_", " ")} />}</label>)}<button disabled={busy} className="btn fill mt-3">{busy ? "Saving…" : "Save changes"}</button>{message && <p className="notice">{message}</p>}</form></section></div>}
    </main></div>;
}
