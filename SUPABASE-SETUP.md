# Studio Forma CMS — Supabase Setup

The website now includes a private `/admin` dashboard for creating projects and uploading portfolio photos directly from the website. Supabase provides authentication, the project database, and image storage.

## 1. Create/open a Supabase project

In Supabase, open **SQL Editor**, create a new query, paste the complete contents of:

`supabase/schema.sql`

Run it once. It creates:

- `admins`
- `projects`
- `project_images`
- `project-images` Storage bucket
- Row Level Security policies
- the six existing demo projects

## 2. Create the admin login

In Supabase go to **Authentication → Users → Add user**. Create the email and password that the architect/admin will use.

Then run this in SQL Editor, replacing the email:

```sql
insert into public.admins (user_id)
select id from auth.users
where email = 'YOUR-ADMIN-EMAIL@example.com'
on conflict (user_id) do nothing;
```

Only users added to `public.admins` can edit projects or upload/delete images.

## 3. Add the Supabase keys to Bolt

Get these values from Supabase project settings/API:

- Project URL
- anon/public key

Add them as Bolt environment variables:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Do **not** put the Supabase service-role key in the website.

## 4. Install the new dependency

In the Bolt terminal:

```bash
npm install
npm run dev
```

Then visit:

```text
/admin
```

Sign in using the Supabase Auth user created in Step 2.

## 5. Using the CMS

From `/admin` you can:

- Add a new project
- Save it as Draft
- Upload multiple JPG, PNG, WebP, or AVIF images
- Set any uploaded image as the Hero image
- Reorder project images
- Remove images
- Edit project title, location, year, category, floor area, client, status, concept, and description
- Mark a project Featured
- Publish / Unpublish a project
- Delete a project

Published projects are loaded automatically by the public website. No edit to `projects.ts` or Bolt code is needed for normal portfolio updates.

## 6. Production check

Before publishing a new code version:

```bash
npm run build
```

If the build succeeds, publish from Bolt. Normal project/photo changes made in `/admin` do not require rebuilding or republishing the website because the portfolio data comes from Supabase.
