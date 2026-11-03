# Stella Maris Model United Nations 2027

Responsive Next.js App Router site and Director-only content dashboard for the 29–30 January 2027 conference at Stella Maris College, Chennai.

## Requirements and local development

Requires Node.js 20.9+ and npm.

```powershell
npm install
Copy-Item .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
npm run dev
```

Public pages render preview fallbacks when Supabase is not configured. Admin sign-in and content management require Supabase. Public content is read from published, visible rows; empty optional content gets an explicit coming-soon state.

## Supabase project setup

1. Create a Supabase project. In Authentication settings, disable public sign-ups; the app has no registration endpoint or sign-up page.
2. Add the project URL and publishable/anon key to `.env.local`. The service-role key is not used by this app and must never be exposed in a `NEXT_PUBLIC_` variable.
3. Apply migrations in order using the Supabase SQL editor or Supabase CLI:
   - `supabase/migrations/202611020001_initial.sql`
   - `supabase/migrations/202611030001_phase1_settings_security.sql`
4. Create the Director's email/password user in **Supabase Authentication → Users**. This is a one-time trusted setup step; routine website edits happen in `/admin`.
5. Copy the new user's UUID and email and run this SQL as the project owner in the SQL editor:

   ```sql
   insert into public.admin_profiles (id, email)
   values ('DIRECTOR_AUTH_USER_UUID', 'director@example.org');
   ```

   Replace both placeholders with the Director's actual values. Never give the anon key or browser users permission to insert or update `admin_profiles`. There is no automatic first-user administrator assignment.
6. Set the same two public environment variables in the deployment provider, then redeploy once for this initial configuration. Later content edits are stored in Supabase and do not need a deployment.

The initial migration creates the schema, six committee rows, RLS policies and four Storage buckets. The Phase 1 migration adds website settings and constrains the admin membership policy/function without rewriting the initial migration. Only a trusted project owner can create admin membership records. `is_admin()` has a fixed `public` search path and only returns a membership boolean; RLS remains enabled.

## Admin dashboard

Open `/admin/login` and use the Director credentials. Admin pages and every mutation verify the current Supabase user and their `admin_profiles` membership on the server; RLS separately enforces database and Storage access.

The dashboard manages website settings, section visibility, committees, announcements, events, schedule entries, resources, and Secretariat profiles. Updates trigger Next.js path revalidation. Registration buttons read a shared public settings endpoint and use the stored URL and button text; disabling registration or leaving its URL empty displays the configured message. No admin sign-up flow is provided.

Resource guides are PDF files in the private `background-guides` bucket. A short-lived signed download URL is issued only after checking that the matching document row is published and visible. Secretariat photos are uploaded to the public `secretariat-images` bucket. Admins can delete documents; the matching stored guide is removed as part of that operation.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For live CMS/admin | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For live CMS/admin | Supabase publishable/anon key, protected by RLS |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical site origin used for metadata images; use your production domain on deploy |

No service-role credential is required by the application.

## Artwork pipeline

The original PNG artwork in `public/images/artwork/` is retained as the master source. Run `npm run optimize:artwork` to generate responsive AVIF and WebP variants at 480, 768, and 1024 pixels in `public/images/optimized/`, plus a machine-readable `optimization-report.json`. The public site uses the optimized variants through the shared `Artwork` component; the optimizer does not overwrite the source PNGs.

## Deployment

Import the repository into Vercel or another Next.js host, configure the two environment variables, apply database migrations, and create the Director membership as above. Verify Auth redirect/site URL settings for the production domain. Do not deploy until conference details and permissions are reviewed. This repository does not claim a production deployment.

## Current scope and limitations

- Public committee, announcements, event, schedule, resource, and Secretariat content is backed by Supabase when configured. Six committees are seeded by the initial migration and cannot be deleted from the dashboard.
- Optional content remains empty until the Secretariat supplies it; no official agendas, contact information, or event schedule have been invented.
- Storage upload limits are enforced by the bucket policy and dashboard: 15 MB PDF guides and 5 MB JPEG/PNG/WebP profile photos.
- The dashboard is intentionally Director-only. The browser anon key is used with authenticated cookies and RLS; no service-role operations run in browser code.
- No live Supabase project or credentials are included in this workspace. Database-backed authentication, storage, and CRUD require the manual setup above.
