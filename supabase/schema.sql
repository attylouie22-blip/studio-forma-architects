-- Studio Forma Architects CMS
-- Run this entire file once in Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text not null default '',
  year text not null default '',
  category text not null default 'Residential',
  area text not null default '',
  client text not null default '',
  status text not null default '',
  concept text not null default '',
  description text not null default '',
  hero_url text,
  featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order integer not null default 0,
  caption text not null default '',
  created_at timestamptz not null default now(),
  unique(project_id, url)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

drop policy if exists "admins can read own membership" on public.admins;
create policy "admins can read own membership"
on public.admins for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public can read published projects" on public.projects;
create policy "public can read published projects"
on public.projects for select
to anon, authenticated
using (is_published = true or public.is_admin());

drop policy if exists "admins can insert projects" on public.projects;
create policy "admins can insert projects"
on public.projects for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can update projects" on public.projects;
create policy "admins can update projects"
on public.projects for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can delete projects" on public.projects;
create policy "admins can delete projects"
on public.projects for delete
to authenticated
using (public.is_admin());

drop policy if exists "public can read published project images" on public.project_images;
create policy "public can read published project images"
on public.project_images for select
to anon, authenticated
using (
  public.is_admin() or exists (
    select 1 from public.projects p
    where p.id = project_images.project_id and p.is_published = true
  )
);

drop policy if exists "admins can insert project images" on public.project_images;
create policy "admins can insert project images"
on public.project_images for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can update project images" on public.project_images;
create policy "admins can update project images"
on public.project_images for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can delete project images" on public.project_images;
create policy "admins can delete project images"
on public.project_images for delete
to authenticated
using (public.is_admin());

-- Public bucket: project images are meant to be displayed on the public portfolio.
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-images', 'project-images', true, 15728640)
on conflict (id) do update set public = true, file_size_limit = 15728640;

drop policy if exists "public can view project images" on storage.objects;
create policy "public can view project images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

drop policy if exists "admins can upload project images" on storage.objects;
create policy "admins can upload project images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins can update project images storage" on storage.objects;
create policy "admins can update project images storage"
on storage.objects for update
to authenticated
using (bucket_id = 'project-images' and public.is_admin())
with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admins can delete project images storage" on storage.objects;
create policy "admins can delete project images storage"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and public.is_admin());

-- Seed the six demo projects so the CMS starts with the same portfolio as the website.
insert into public.projects (title,slug,location,year,category,area,client,status,concept,description,hero_url,featured,is_published,sort_order)
values
('Casa Verde Residence','casa-verde','Pampanga, Philippines','2026','Residential','620 sqm','Private Residence','Completed','A tropical courtyard house where concrete, timber, landscape, and filtered daylight create a quiet sequence of indoor–outdoor rooms.','Casa Verde is organized around a planted courtyard that brings daylight and air into the center of the plan. Deep overhangs, warm timber screens, and exposed concrete frame long views while reducing direct heat gain.','/assets/projects/casa-verde/hero.webp',true,true,1),
('Courtyard House','courtyard-house','Tarlac, Philippines','2025','Residential','410 sqm','Private Residence','Completed','A restrained brick-and-stone home wrapped around a shaded court, designed for privacy, cross-ventilation, and changing tropical light.','The house uses a low, horizontal profile and a central garden as its spatial anchor. Textured masonry and dark metal contrast with light-filled interior rooms.','/assets/projects/courtyard-house/hero.webp',false,true,2),
('Northline Corporate Center','northline-center','Clark, Pampanga','2026','Commercial','8,400 sqm','Northline Holdings','Under Construction','A high-performance office building shaped by vertical fins, shaded terraces, and a civic ground floor that connects workplace and landscape.','Northline balances a crisp corporate identity with climate-responsive facade design. The building is organized as flexible floor plates around a daylight-rich central core.','/assets/projects/northline-center/hero.webp',false,true,3),
('Solana Resort Villas','solana-villas','Zambales, Philippines','2025','Hospitality','3.2 ha','Solana Leisure Group','Completed','A coastal retreat of low villas, shaded breezeways, and framed sea views inspired by the rhythm of dunes and native landscape.','The resort is planned as a sequence of intimate pavilions linked by shaded paths. Materials are intentionally quiet: lime plaster, timber, stone, and woven screens.','/assets/projects/solana-villas/hero.webp',false,true,4),
('Atelier House','atelier-house','Quezon City, Philippines','2026','Interior Design','285 sqm','Private Residence','Completed','A city home conceived as a gallery for art, books, and changing daylight, with sculptural stairs and softly layered interior volumes.','Atelier House uses a restrained material palette of pale oak, stone, linen, and blackened steel. Carefully aligned openings make compact rooms feel connected and generous.','/assets/projects/atelier-house/hero.webp',false,true,5),
('Heritage Residence Renovation','heritage-residence','San Fernando, Pampanga','2025','Renovation','530 sqm','Private Residence','Completed','A careful renewal that preserves the original house’s proportions while introducing contemporary light, services, and climate comfort.','New interventions are intentionally legible but quiet. Existing masonry and timber are repaired, while a new garden wing creates a relaxed counterpoint to the formal heritage rooms.','/assets/projects/heritage-residence/hero.webp',false,true,6)
on conflict (slug) do nothing;

with image_seed(slug, file_name, sort_order) as (
  values
  ('casa-verde','hero',0),('casa-verde','angle',1),('casa-verde','living',2),('casa-verde','detail',3),('casa-verde','sunset',4),('casa-verde','plan',5),
  ('courtyard-house','hero',0),('courtyard-house','angle',1),('courtyard-house','living',2),('courtyard-house','detail',3),('courtyard-house','sunset',4),('courtyard-house','plan',5),
  ('northline-center','hero',0),('northline-center','angle',1),('northline-center','lobby',2),('northline-center','detail',3),('northline-center','sunset',4),('northline-center','plan',5),
  ('solana-villas','hero',0),('solana-villas','angle',1),('solana-villas','interior',2),('solana-villas','detail',3),('solana-villas','sunset',4),('solana-villas','plan',5),
  ('atelier-house','hero',0),('atelier-house','angle',1),('atelier-house','living',2),('atelier-house','detail',3),('atelier-house','sunset',4),('atelier-house','plan',5),
  ('heritage-residence','hero',0),('heritage-residence','angle',1),('heritage-residence','interior',2),('heritage-residence','detail',3),('heritage-residence','sunset',4),('heritage-residence','plan',5)
)
insert into public.project_images (project_id,url,storage_path,sort_order,caption)
select p.id, '/assets/projects/' || s.slug || '/' || s.file_name || '.webp', null, s.sort_order, ''
from image_seed s join public.projects p on p.slug = s.slug
on conflict (project_id,url) do nothing;

-- IMPORTANT: After creating your admin user in Supabase Authentication, run this separately:
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'YOUR-ADMIN-EMAIL@example.com'
-- on conflict (user_id) do nothing;
