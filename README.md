# Studio Forma Architects — Cinematic Portfolio + CMS

A premium architecture portfolio built with React, Vite, TypeScript, GSAP, ScrollTrigger, and an optional Supabase-powered portfolio CMS.

## What is included

The public website includes cinematic hero storytelling, pinned project sequences, parallax depth, horizontal scroll-controlled project presentation, project detail pages, concept/final comparison, services, process, testimonials, responsive layouts, reduced-motion support, and local demo architectural visuals.

The CMS upgrade adds a private `/admin` dashboard where an authorized client can add/edit projects and upload portfolio photos directly from the website. Published projects automatically appear on the public site.

## Run locally / in Bolt

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## CMS setup

See **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)**.

Required environment variables:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

If Supabase is not configured or is temporarily unavailable, the public website safely falls back to the bundled six demo projects. The `/admin` page will show setup instructions until Supabase is connected.

## Admin features

Visit `/admin` after Supabase setup. The admin can create and edit project details; upload multiple portfolio images; set the hero photo; reorder and remove images; mark Featured; save Drafts; Publish/Unpublish; and delete projects. Supabase Auth + Row Level Security restrict write access to users registered in `public.admins`.

## Main customization files

- `src/data/siteConfig.ts` — firm name, taglines, address, contact, social links, about copy
- `src/data/services.ts` — service descriptions
- `src/data/testimonials.ts` — testimonials
- `src/data/projects.ts` — bundled fallback/demo projects only
- `public/assets/projects/` — bundled demo visuals
- `src/styles/global.css` — public website styling
- `src/styles/admin.css` — CMS styling
- `supabase/schema.sql` — database, storage, security policies, demo CMS seed

Once the CMS is connected, everyday portfolio changes should be made through `/admin`, not by editing `projects.ts`.

## Deployment workflow

Recommended flow:

```text
GitHub → Bolt → Supabase-connected website
```

1. Push the complete project to GitHub.
2. Import/open the repository in Bolt.
3. Add the Supabase environment variables.
4. Run `npm install`.
5. Run `npm run build`.
6. Publish from Bolt.
7. Use `/admin` for future project and photo updates.

## Image recommendations

For premium results, use landscape project photography/renders around 2000–3000 px wide. WebP or optimized JPG is recommended. The CMS accepts JPG, PNG, WebP, and AVIF files up to 15 MB each.

## Structure

```text
src/
  components/
  context/
  data/
  hooks/
  lib/
  pages/
    admin/
  sections/
  styles/
public/
  assets/projects/
supabase/
  schema.sql
```

Website by Webify PH remains secondary to the architecture brand in the public footer.
