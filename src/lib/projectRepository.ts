import type { Project } from '../data/projects';
import { supabase } from './supabase';

export type AdminProject = Project & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  images: AdminProjectImage[];
};

export type AdminProjectImage = {
  id: string;
  projectId: string;
  url: string;
  storagePath: string | null;
  sortOrder: number;
  caption: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  category: string;
  area: string;
  client: string;
  status: string;
  concept: string;
  description: string;
  hero_url: string | null;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  project_images?: ProjectImageRow[];
};

type ProjectImageRow = {
  id: string;
  project_id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  caption: string | null;
};

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase;
}

function imageFromRow(row: ProjectImageRow): AdminProjectImage {
  return {
    id: row.id,
    projectId: row.project_id,
    url: row.url,
    storagePath: row.storage_path,
    sortOrder: row.sort_order ?? 0,
    caption: row.caption ?? '',
  };
}

function projectFromRow(row: ProjectRow): AdminProject {
  const images = [...(row.project_images ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(imageFromRow);
  const hero = row.hero_url || images[0]?.url || '';
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    location: row.location ?? '',
    year: row.year ?? '',
    category: row.category ?? '',
    area: row.area ?? '',
    client: row.client ?? '',
    status: row.status ?? '',
    concept: row.concept ?? '',
    description: row.description ?? '',
    hero,
    gallery: images.filter(image => image.url !== hero).map(image => image.url),
    featured: row.featured,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images,
  };
}

const projectSelect = `
  id,title,slug,location,year,category,area,client,status,concept,description,
  hero_url,featured,is_published,sort_order,created_at,updated_at,
  project_images(id,project_id,url,storage_path,sort_order,caption)
`;

export async function fetchPublishedProjects(): Promise<Project[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('projects')
    .select(projectSelect)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ProjectRow[]).map(projectFromRow);
}

export async function fetchAdminProjects(): Promise<AdminProject[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('projects')
    .select(projectSelect)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ProjectRow[]).map(projectFromRow);
}

export async function fetchAdminProject(id: string): Promise<AdminProject | null> {
  const client = requireSupabase();
  const { data, error } = await client.from('projects').select(projectSelect).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? projectFromRow(data as unknown as ProjectRow) : null;
}

export type ProjectInput = Omit<Project, 'id' | 'hero' | 'gallery'> & {
  id?: string;
  hero?: string;
};

export async function saveProject(input: ProjectInput): Promise<string> {
  const client = requireSupabase();
  const payload = {
    title: input.title.trim(),
    slug: input.slug.trim(),
    location: input.location.trim(),
    year: input.year.trim(),
    category: input.category.trim(),
    area: input.area.trim(),
    client: input.client.trim(),
    status: input.status.trim(),
    concept: input.concept.trim(),
    description: input.description.trim(),
    hero_url: input.hero || null,
    featured: Boolean(input.featured),
    is_published: Boolean(input.isPublished),
    sort_order: Number(input.sortOrder ?? 0),
  };
  if (input.id) {
    const { error } = await client.from('projects').update(payload).eq('id', input.id);
    if (error) throw error;
    return input.id;
  }
  const { data, error } = await client.from('projects').insert(payload).select('id').single();
  if (error) throw error;
  return data.id as string;
}

export async function setProjectPublished(id: string, published: boolean) {
  const client = requireSupabase();
  const { error } = await client.from('projects').update({ is_published: published }).eq('id', id);
  if (error) throw error;
}

export async function setProjectHero(id: string, heroUrl: string) {
  const client = requireSupabase();
  const { error } = await client.from('projects').update({ hero_url: heroUrl }).eq('id', id);
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const client = requireSupabase();
  const project = await fetchAdminProject(id);
  const storagePaths = project?.images.map(image => image.storagePath).filter((x): x is string => Boolean(x)) ?? [];
  if (storagePaths.length) {
    const { error: storageError } = await client.storage.from('project-images').remove(storagePaths);
    if (storageError) throw storageError;
  }
  const { error } = await client.from('projects').delete().eq('id', id);
  if (error) throw error;
}

function safeFileName(name: string) {
  const dot = name.lastIndexOf('.');
  const extension = dot >= 0 ? name.slice(dot).toLowerCase() : '';
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'image';
  return `${base}${extension}`;
}

export async function uploadProjectImages(projectId: string, files: File[]): Promise<AdminProjectImage[]> {
  const client = requireSupabase();
  const project = await fetchAdminProject(projectId);
  let sortOrder = (project?.images.reduce((max, item) => Math.max(max, item.sortOrder), -1) ?? -1) + 1;
  const results: AdminProjectImage[] = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image file.`);
    if (file.size > 15 * 1024 * 1024) throw new Error(`${file.name} is larger than 15 MB.`);
    const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(file.name)}`;
    const { error: uploadError } = await client.storage.from('project-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data: publicData } = client.storage.from('project-images').getPublicUrl(path);
    const url = publicData.publicUrl;
    const { data, error } = await client.from('project_images').insert({
      project_id: projectId,
      url,
      storage_path: path,
      sort_order: sortOrder,
      caption: '',
    }).select('id,project_id,url,storage_path,sort_order,caption').single();
    if (error) {
      await client.storage.from('project-images').remove([path]);
      throw error;
    }
    results.push(imageFromRow(data as ProjectImageRow));
    sortOrder += 1;
  }
  return results;
}

export async function deleteProjectImage(projectId: string, image: AdminProjectImage, currentHero: string) {
  const client = requireSupabase();
  if (image.storagePath) {
    const { error: storageError } = await client.storage.from('project-images').remove([image.storagePath]);
    if (storageError) throw storageError;
  }
  const { error } = await client.from('project_images').delete().eq('id', image.id);
  if (error) throw error;
  if (currentHero === image.url) {
    const updated = await fetchAdminProject(projectId);
    await setProjectHero(projectId, updated?.images[0]?.url ?? '');
  }
}

export async function reorderProjectImages(images: AdminProjectImage[]) {
  const client = requireSupabase();
  for (let index = 0; index < images.length; index += 1) {
    const { error } = await client.from('project_images').update({ sort_order: index }).eq('id', images[index].id);
    if (error) throw error;
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('is_admin');
  if (error) throw error;
  return Boolean(data);
}
