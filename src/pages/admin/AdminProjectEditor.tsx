import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteProjectImage,
  fetchAdminProject,
  reorderProjectImages,
  saveProject,
  setProjectHero,
  uploadProjectImages,
  type AdminProjectImage,
  type ProjectInput,
} from '../../lib/projectRepository';

const categories = ['Residential', 'Commercial', 'Interior Design', 'Hospitality', 'Renovation'];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const emptyForm: ProjectInput = {
  title: '', slug: '', location: '', year: new Date().getFullYear().toString(), category: 'Residential',
  area: '', client: '', status: 'Completed', concept: '', description: '', hero: '', featured: false,
  isPublished: false, sortOrder: 99,
};

export default function AdminProjectEditor() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = routeId === 'new' || !routeId;
  const [projectId, setProjectId] = useState<string | undefined>(isNew ? undefined : routeId);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [images, setImages] = useState<AdminProjectImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hero = form.hero || '';
  const canPublish = Boolean(form.title.trim() && form.slug.trim() && hero);

  useEffect(() => {
    if (isNew || !routeId) return;
    setLoading(true);
    fetchAdminProject(routeId).then(project => {
      if (!project) throw new Error('Project not found.');
      setProjectId(project.id);
      setForm({
        id: project.id, title: project.title, slug: project.slug, location: project.location, year: project.year,
        category: project.category, area: project.area, client: project.client, status: project.status,
        concept: project.concept, description: project.description, hero: project.hero, featured: project.featured,
        isPublished: project.isPublished, sortOrder: project.sortOrder,
      });
      setImages(project.images);
    }).catch(err => setError(err instanceof Error ? err.message : 'Unable to load project.')).finally(() => setLoading(false));
  }, [isNew, routeId]);

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function titleChanged(value: string) {
    setForm(current => ({ ...current, title: value, slug: current.slug || slugify(value) }));
  }

  async function persist(options: { silent?: boolean; forceDraft?: boolean } = {}) {
    if (!form.title.trim()) throw new Error('Project title is required.');
    const normalized = { ...form, id: projectId, slug: form.slug.trim() || slugify(form.title) };
    if (!normalized.slug) throw new Error('Project slug is required.');
    if (normalized.isPublished && !normalized.hero) throw new Error('Choose a hero image before publishing.');
    if (options.forceDraft) normalized.isPublished = false;
    const savedId = await saveProject(normalized);
    setProjectId(savedId);
    setForm(current => ({ ...current, id: savedId, slug: normalized.slug, isPublished: normalized.isPublished }));
    if (!options.silent) setMessage('Project saved.');
    if (isNew) navigate(`/admin/projects/${savedId}`, { replace: true });
    return savedId;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setError(''); setMessage('');
    try { await persist(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to save project.'); }
    finally { setSaving(false); }
  }

  async function reload(id = projectId) {
    if (!id) return;
    const project = await fetchAdminProject(id);
    if (!project) return;
    setImages(project.images);
    setForm(current => ({ ...current, hero: project.hero }));
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    setUploading(true); setError(''); setMessage('');
    try {
      const id = projectId ?? await persist({ silent: true, forceDraft: true });
      const uploaded = await uploadProjectImages(id, files);
      if (!form.hero && uploaded[0]) {
        await setProjectHero(id, uploaded[0].url);
        setForm(current => ({ ...current, hero: uploaded[0].url }));
      }
      await reload(id);
      setMessage(`${uploaded.length} image${uploaded.length === 1 ? '' : 's'} uploaded.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed.'); }
    finally { setUploading(false); }
  }

  async function makeHero(image: AdminProjectImage) {
    if (!projectId) return;
    try {
      await setProjectHero(projectId, image.url);
      setForm(current => ({ ...current, hero: image.url }));
      setMessage('Hero image updated.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to set hero image.'); }
  }

  async function removeImage(image: AdminProjectImage) {
    if (!projectId || !window.confirm('Remove this image from the project?')) return;
    try {
      await deleteProjectImage(projectId, image, hero);
      await reload(projectId);
      setMessage('Image removed.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to remove image.'); }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setImages(reordered);
    try { await reorderProjectImages(reordered); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to reorder images.'); await reload(); }
  }

  const publishLabel = useMemo(() => form.isPublished ? 'Published' : 'Draft', [form.isPublished]);

  if (loading) return <div className="admin-page"><div className="admin-empty">Loading project…</div></div>;

  return <div className="admin-page admin-editor-page">
    <div className="admin-page-heading">
      <div><Link className="admin-back-link" to="/admin">← Projects</Link><p className="admin-kicker">{isNew ? 'New portfolio project' : 'Edit portfolio'}</p><h1>{form.title || 'Untitled project'}</h1></div>
      <div className="admin-editor-status"><span className={form.isPublished ? 'admin-status published' : 'admin-status draft'}>{publishLabel}</span></div>
    </div>

    {message && <div className="admin-notice success">{message}<button onClick={() => setMessage('')}>×</button></div>}
    {error && <div className="admin-notice error">{error}<button onClick={() => setError('')}>×</button></div>}

    <form className="admin-editor" onSubmit={submit}>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="admin-kicker">01</p><h2>Project information</h2></div><p>These details appear on the public portfolio and project page.</p></div>
        <div className="admin-form-grid">
          <label className="wide">Project name<input value={form.title} onChange={event => titleChanged(event.target.value)} required /></label>
          <label>URL slug<input value={form.slug} onChange={event => update('slug', slugify(event.target.value))} placeholder="modern-tropical-residence" required /></label>
          <label>Location<input value={form.location} onChange={event => update('location', event.target.value)} placeholder="Pampanga, Philippines" /></label>
          <label>Year<input value={form.year} onChange={event => update('year', event.target.value)} /></label>
          <label>Category<select value={form.category} onChange={event => update('category', event.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label>Floor area<input value={form.area} onChange={event => update('area', event.target.value)} placeholder="620 sqm" /></label>
          <label>Client<input value={form.client} onChange={event => update('client', event.target.value)} placeholder="Private Residence" /></label>
          <label>Status<input value={form.status} onChange={event => update('status', event.target.value)} placeholder="Completed" /></label>
          <label>Display order<input type="number" value={form.sortOrder ?? 0} onChange={event => update('sortOrder', Number(event.target.value))} /></label>
          <label className="wide">Design concept<textarea rows={4} value={form.concept} onChange={event => update('concept', event.target.value)} /></label>
          <label className="wide">Project description<textarea rows={7} value={form.description} onChange={event => update('description', event.target.value)} /></label>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="admin-kicker">02</p><h2>Portfolio images</h2></div><p>Upload directly here. The first upload becomes the hero if no hero has been selected yet.</p></div>
        <input ref={fileRef} className="admin-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={upload} />
        <button type="button" className="admin-upload-zone" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <strong>{uploading ? 'Uploading images…' : 'Upload portfolio photos'}</strong>
          <span>JPG, PNG, WebP or AVIF · up to 15 MB each · multiple files allowed</span>
        </button>

        {images.length > 0 && <div className="admin-image-grid">{images.map((image, index) => <article className={image.url === hero ? 'admin-image-card is-hero' : 'admin-image-card'} key={image.id}>
          <div className="admin-image-media"><img src={image.url} alt="" />{image.url === hero && <span>Hero</span>}</div>
          <div className="admin-image-actions">
            <button type="button" onClick={() => void move(index, -1)} disabled={index === 0} aria-label="Move image up">↑</button>
            <button type="button" onClick={() => void move(index, 1)} disabled={index === images.length - 1} aria-label="Move image down">↓</button>
            {image.url !== hero && <button type="button" onClick={() => void makeHero(image)}>Set hero</button>}
            <button type="button" className="danger-text" onClick={() => void removeImage(image)}>Remove</button>
          </div>
        </article>)}</div>}
      </section>

      <section className="admin-panel admin-publish-panel">
        <div><p className="admin-kicker">03</p><h2>Publishing</h2><p className="admin-muted">Draft projects stay in the dashboard but do not appear on the public website.</p></div>
        <div className="admin-publish-controls">
          <label className="admin-check"><input type="checkbox" checked={Boolean(form.featured)} onChange={event => update('featured', event.target.checked)} /><span>Featured project</span></label>
          <label className="admin-check"><input type="checkbox" checked={Boolean(form.isPublished)} onChange={event => update('isPublished', event.target.checked)} disabled={!canPublish && !form.isPublished} /><span>Publish on website</span></label>
          {!canPublish && <small>Add a project title, URL slug, and hero image before publishing.</small>}
        </div>
      </section>

      <div className="admin-save-bar"><Link className="admin-secondary" to="/admin">Cancel</Link><button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button></div>
    </form>
  </div>;
}
