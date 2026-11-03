-- Phase 1 additions. Kept separate so an already-applied initial migration is never rewritten.
alter table public.website_settings
  add column if not exists registration_enabled boolean not null default false,
  add column if not exists contact_information text,
  add column if not exists about_content text;

-- Membership is provisioned only by a trusted project owner through the Supabase dashboard/SQL
-- editor or a server-only service-role operation. There are deliberately no client write policies.
drop policy if exists "admins read profile" on public.admin_profiles;
create policy "admins read profile" on public.admin_profiles for select to authenticated using (id = auth.uid());

-- The function reveals only whether the caller is a member. Keep its execution context constrained.
alter function public.is_admin() set search_path = public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
