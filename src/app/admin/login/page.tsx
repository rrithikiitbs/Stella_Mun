import { login } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  if (supabase) { const { data: { user } } = await supabase.auth.getUser(); if (user) redirect("/admin"); }
  const { error } = await searchParams;
  return <main className="admin-login"><div className="admin-login-card"><Link href="/" className="eyebrow">← Stella Maris MUN 2027</Link><p className="eyebrow mt-12">Director access</p><h1 className="serif text-5xl mt-3">Welcome back.</h1><p className="muted mt-3">Sign in to manage the conference website.</p>{error && <p className="notice error mt-5">{error === "setup" ? "Supabase is not configured. Follow the setup guide in README." : "Sign-in failed. Check your credentials and try again."}</p>}<form action={login} className="admin-form mt-8"><label>Email<input required type="email" name="email" autoComplete="username" /></label><label>Password<input required type="password" name="password" autoComplete="current-password" /></label><button className="btn fill w-full mt-3">Sign in</button></form></div></main>;
}
