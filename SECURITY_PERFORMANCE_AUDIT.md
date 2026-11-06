# Stella Maris MUN 2027 — Phase 1 Security and Performance Audit

**Audit date:** 6 November 2026
**Scope:** Static review of the local Next.js 15 / Supabase code and migrations, unit tests, TypeScript check, production build, and a single local production HTTP request. No live deployment, Supabase project, or staging environment was accessed. No database or Storage mutations were made.

## Overall assessment

**Recommendation: NOT READY for deployment based on the evidence available.** No critical or high-severity code vulnerability was confirmed in the reviewed application paths. The app has sound server-side admin membership checks, RLS policies on the listed application tables, and a private background-guide bucket with a publication gate in both the object policy and download route. The missing security response headers were corrected in `next.config.ts`.

Deployment readiness remains unproven because database policies were not exercised with test identities, deployed authentication/cookie behavior and provider protections are unknown, the npm advisory service could not be reached, and no staging performance test was possible. This is a bounded code review, not a claim that the application is vulnerability-free.

## Results

| Test | Result | Severity | Evidence / Notes |
|---|---|---|---|
| Admin page server authorization | PASS (code review) | — | `/admin` checks `auth.getUser()` and a matching `admin_profiles` row server-side. Non-members are signed out and redirected. |
| Admin mutation authorization | PASS (code review) | — | `saveRecord`, `deleteRecord`, and `uploadAsset` all call `adminClient()`, which independently checks authenticated user and membership. |
| Public admin sign-up / first-user escalation | PASS (code review) | — | No sign-up action exists; membership writes have no client policy in the migrations. Supabase Auth's deployed sign-up setting still needs confirmation. |
| Login rate limiting | WARNING | Medium | No app-level limit is present. Supabase Auth has provider-side protections, but the project's Auth rate-limit configuration and behavior were unavailable. Confirm and monitor those limits before deployment. |
| Logout and session expiry | WARNING | Medium | Logout calls Supabase `signOut`; middleware calls `getUser`; protected page/actions validate the user. Cookie attributes, refresh behavior, invalid/expired-session behavior, and logout revocation were not exercised against Supabase. |
| Database RLS coverage | PASS (migration review) | — | RLS is enabled on all nine application tables. Public reads are limited to published/visible content except intentionally public site settings and section flags; content writes require `is_admin()`. `admin_profiles` has self-read only. |
| RLS execution with anon/non-admin/admin identities | NOT TESTED | High | No isolated Supabase project or test identities were available. Migration inspection does not prove deployed policy state or table grants. |
| `is_admin()` function | PASS (migration review) | — | Phase 1 pins `search_path=public`, revokes PUBLIC execution, grants only anon/authenticated execution, and the function returns a membership boolean. |
| Private guide access | PASS (code review) | — | Bucket is private. Storage SELECT permits published/visible guide objects or admins. Download route checks the document row's publication and visibility, then issues a 60-second signed URL. |
| Storage upload validation | WARNING | Low | Admin upload action constrains bucket names, file size, and MIME string; bucket config repeats size/MIME restrictions. MIME values can be spoofed, and PDF/image contents are not inspected. No live upload was attempted. |
| Storage path / delete scoping | PASS (code review) | — | Upload names get a UUID prefix and sanitized basename; removal uses the exact `storage_path` read from the selected document row. No production file operation was performed. |
| XSS / SQL injection / unsafe HTML | PASS (code review) | — | No `dangerouslySetInnerHTML`, `eval`, or raw SQL construction found in the searched application code. React renders supplied text as escaped text. Supabase calls use its query builder. |
| External URLs / open redirects | PASS (partial code review) | Low | Registration and announcement external URLs are validated as HTTPS before save. Download redirect target is a Supabase-generated signed URL. Other arbitrary image URLs can cause external image requests; no script execution sink was identified. |
| CSRF | PASS (framework controls, not simulated) | — | Mutations use Next.js Server Actions and no custom state-changing GET endpoint was found. Framework origin protections were not tested over a deployed origin. |
| Response security headers | PASS (local smoke) | — | Added CSP directives `base-uri 'self'; object-src 'none'; frame-ancestors 'none'`, Referrer-Policy, nosniff, X-Frame-Options, Permissions-Policy, and one-year HSTS. Local homepage returned these headers. The CSP is intentionally narrow; it does not yet constrain script or image sources. |
| Environment variable handling | PASS (local inspection) | — | `.env.local` contains only the three expected variable names: public Supabase URL, public anon key, and site URL. Values were not printed. No service-role reference found. `.env*` is ignored except `.env.example`. |
| Git history credential search | PASS (limited) | — | No `.env.local` history entry or service-role identifier was found in the reviewed history search. This is not a complete historical secret scan. |
| Dependency advisory audit | NOT TESTED | Medium | `npm audit --omit=dev` could not reach npm's audit endpoint because TLS certificate verification failed, including with network permission. Installed versions are recorded by `npm ls`; advisory status remains unknown. |
| Existing unit tests | PASS | — | `npm test`: 5 passed, 0 failed. |
| TypeScript check | PASS | — | `npx tsc --noEmit` completed successfully. |
| Production build | PASS | — | `npm run build` completed with Next.js 15.5.28. Public routes are dynamic server-rendered except `/delegates` and `/_not-found`. Shared first-load JS: 103 kB; individual public page first-load JS: about 114 kB. |
| Local production HTTP smoke | PASS (limited) | — | Local built server returned HTTP 200 for `/`; verified CSP, HSTS, and nosniff response headers. Other route probes did not yield reliable measurements and are not counted as passes. |
| Public module content and loading/error states | WARNING | — | Reviewed page/data code paths, but live Supabase content, mobile/desktop rendering, and error states were not exercised. Public pages mostly fall back or show empty states when data is absent. |
| Admin CRUD, settings, visibility, registration destination | NOT TESTED | High | Requires an isolated Supabase project and test Director membership. No test records were created. |
| Requests/sec, latency percentiles, error rates, capacity | NOT TESTED | High | No staging deployment or isolated infrastructure. No concurrent or external traffic was generated. |

## Fixes made

Added global security headers in `next.config.ts`. This corrects the confirmed absence of application-configured CSP directives, clickjacking protection, MIME sniffing protection, referrer policy, HSTS, and browser capability restrictions. A full restrictive CSP was not enabled: Next.js runtime behavior and Supabase-hosted content need browser testing to establish safe script and image source allowlists.

## Performance and capacity

The production build reports a 103 kB shared JavaScript baseline and roughly 114 kB first-load JavaScript for dynamic public pages. Most public content routes perform server-side Supabase reads on each request; the code applies request-local React caching for settings/committee lookups, but there is no measured cross-request cache or CDN result in this audit. The public settings API explicitly disables caching and the navigation client caches its result only in memory for the page lifetime.

No traffic capacity number can be responsibly estimated from this checkout. Actual limits depend on the selected Vercel plan/region/function settings, Supabase plan and connection pool, query latency, cache configuration, and real content sizes. Browser image timings, database latency, storage throughput, Core Web Vitals, CPU/memory limits, and load percentiles were not measured. Do not treat the bundle size or local single-request response as a capacity result.

## Required before deployment

1. Apply and verify migrations in an isolated Supabase staging project; test anon, ordinary authenticated, and admin identities against every table and Storage bucket, including unpublished rows and guessed object paths.
2. Exercise login/logout, expired sessions, all admin mutations, deletion, upload, signed downloads, and public visibility using test-only data and credentials.
3. Confirm public sign-ups are disabled and inspect Supabase Auth rate limits and production cookie behavior.
4. Resolve npm registry TLS trust and obtain a successful dependency advisory report; review and apply updates individually if needed.
5. Deploy a staging build, verify headers and CSP behavior in a browser, then run a short progressive load test against staging with platform monitoring and explicit stop limits.
6. Inspect Vercel and Supabase plan/region/runtime settings to set realistic thresholds and capacity expectations.

No deployment was performed. Phase 1 is complete to the extent possible within the supplied local project; deployment should wait for the tests above and review of this report.
